import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductLinkByToken } from '@/hooks/useProductLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone_number: z.string().min(6, 'Teléfono inválido'),
  city: z.string().optional(),
  country: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function ProductLink() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { data: linkData, isLoading, error } = useProductLinkByToken(token || '');

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone_number: '',
    city: '',
    country: 'Paraguay',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = clientSchema.parse(formData);
      setIsSubmitting(true);

      // Call Edge Function to register client
      const { data, error: functionError } = await supabase.functions.invoke(
        'register-from-product-link',
        {
          body: {
            token,
            clientData: validatedData,
          },
        }
      );

      if (functionError) throw functionError;

      // Redirect to card registration with client_id and product_id
      const params = new URLSearchParams({
        client_id: data.client_id,
        product_id: data.product_id,
        token: data.subscription_token,
      });
      
      navigate(`/register-card?${params.toString()}`);
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ClientFormData, string>> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof ClientFormData] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error:', err);
        toast.error('Error al procesar tu información. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFrequencyText = (frequency: string) => {
    const frequencies: Record<string, string> = {
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      semiannual: 'Semestral',
      annual: 'Anual',
      yearly: 'Anual',
    };
    return frequencies[frequency] || frequency;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Link Inválido o Expirado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Este link de suscripción no es válido o ha expirado. Por favor, contacta
              al proveedor para obtener un nuevo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const product = linkData.products;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detalles de la Suscripción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">
                    {product.type === 'fixed' ? 'Fija' : 'Variable'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monto:</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(product.base_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frecuencia:</span>
                  <span className="font-medium">
                    {getFrequencyText(product.frequency)}
                  </span>
                </div>
                {product.trial_period_days > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Período de prueba:</span>
                    <span className="font-medium">
                      {product.trial_period_days} días
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tus Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Juan Pérez"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="juan@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    placeholder="+595 xxx xxx xxx"
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-destructive mt-1">{errors.phone_number}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Paraguay"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Asunción"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Continuar al Registro de Tarjeta'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
