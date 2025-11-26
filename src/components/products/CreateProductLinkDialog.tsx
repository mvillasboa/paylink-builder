import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProductLinks } from '@/hooks/useProductLinks';
import { Product } from '@/types/product';
import { Copy, Check, Link2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface CreateProductLinkDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductLinkDialog({
  product,
  open,
  onOpenChange,
}: CreateProductLinkDialogProps) {
  const { createProductLink } = useProductLinks(product.id);
  const [expiresAt, setExpiresAt] = useState('');
  const [maxUses, setMaxUses] = useState('1');
  const [internalNotes, setInternalNotes] = useState('');
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    try {
      const result = await createProductLink.mutateAsync({
        product_id: product.id,
        expires_at: expiresAt || undefined,
        max_uses: maxUses ? parseInt(maxUses) : undefined,
        internal_notes: internalNotes || undefined,
      });

      const linkUrl = `${window.location.origin}/product/${result.token}`;
      setCreatedLink(linkUrl);
    } catch (error) {
      console.error('Error creating link:', error);
    }
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setExpiresAt('');
    setMaxUses('1');
    setInternalNotes('');
    setCreatedLink(null);
    setCopied(false);
    onOpenChange(false);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      semiannual: 'Semestral',
      annual: 'Anual',
      yearly: 'Anual',
    };
    return labels[frequency] || frequency;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Crear Link de Producto
          </DialogTitle>
        </DialogHeader>

        {!createdLink ? (
          <div className="space-y-6">
            {/* Product Preview */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {product.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Precio: </span>
                  <span className="font-semibold">
                    {formatCurrency(product.base_amount)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frecuencia: </span>
                  <span>{getFrequencyLabel(product.frequency)}</span>
                </div>
              </div>
            </div>

            {/* Link Options */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="expiresAt">Fecha de expiración (opcional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maxUses">Máximo de usos</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas internas (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Notas para tu referencia..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={createProductLink.isPending}
              className="w-full"
            >
              {createProductLink.isPending ? 'Creando...' : 'Crear Link'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Link creado exitosamente:
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={createdLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
