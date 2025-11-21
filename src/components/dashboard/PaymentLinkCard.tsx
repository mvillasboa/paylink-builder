import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface PaymentLink {
  id: string;
  name: string;
  client: { name: string; email: string };
  amount: number;
  status: 'active' | 'sent' | 'viewed' | 'not_viewed';
  views: number;
  createdAt: Date;
  expiresAt: Date;
}

interface PaymentLinkCardProps {
  link: PaymentLink;
}

const statusConfig = {
  active: { label: 'Activo', className: 'bg-accent/10 text-accent border-accent/20' },
  sent: { label: 'Enviado', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  viewed: { label: 'Visto', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  not_viewed: { label: 'No visto', className: 'bg-muted text-muted-foreground border-border' },
};

export function PaymentLinkCard({ link }: PaymentLinkCardProps) {
  const statusInfo = statusConfig[link.status];
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://pay.empresa.com/${link.id}`);
    toast.success('Link copiado al portapapeles');
  };

  const timeUntilExpiry = formatDistanceToNow(link.expiresAt, { locale: es });

  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{link.name}</h4>
              <p className="text-sm text-muted-foreground truncate">{link.client.name}</p>
            </div>
            <Badge className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              ${link.amount.toLocaleString('es-MX')}
            </span>
            <span className="text-sm text-muted-foreground">MXN</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span>{link.views} vistas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Expira en {timeUntilExpiry}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleCopyLink}
          >
            <Copy className="h-3 w-3 mr-2" />
            Copiar Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
