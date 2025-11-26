import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateProductLinkData, ProductLink } from '@/types/productLink';
import { toast } from 'sonner';

export function useProductLinks(productId?: string) {
  const queryClient = useQueryClient();

  const { data: productLinks, isLoading } = useQuery({
    queryKey: ['product-links', productId],
    queryFn: async () => {
      let query = supabase
        .from('product_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ProductLink[];
    },
    enabled: !!productId,
  });

  const createProductLink = useMutation({
    mutationFn: async (linkData: CreateProductLinkData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Generate token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_product_link_token');

      if (tokenError) throw tokenError;

      const { data, error } = await supabase
        .from('product_links')
        .insert({
          user_id: user.id,
          product_id: linkData.product_id,
          token: tokenData,
          expires_at: linkData.expires_at,
          max_uses: linkData.max_uses,
          internal_notes: linkData.internal_notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ProductLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-links'] });
      toast.success('Link de producto creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating product link:', error);
      toast.error('Error al crear link de producto');
    },
  });

  return {
    productLinks,
    isLoading,
    createProductLink,
  };
}

export function useProductLinkByToken(token: string) {
  return useQuery({
    queryKey: ['product-link', token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_links')
        .select(`
          *,
          products (*)
        `)
        .eq('token', token)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });
}
