import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Copy,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { mockPaymentLinks } from "@/data/mockDashboard";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const statusConfig = {
  active: { label: 'Activo', className: 'bg-accent/10 text-accent border-accent/20' },
  sent: { label: 'Enviado', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  viewed: { label: 'Visto', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  not_viewed: { label: 'No visto', className: 'bg-muted text-muted-foreground border-border' },
};

export default function PaymentLinks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredLinks = mockPaymentLinks.filter(
    (link) =>
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (linkId: string) => {
    const fullUrl = `${window.location.origin}/pay/${linkId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copiado al portapapeles');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Links de Pago</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y crea links de pago para tus clientes
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Crear Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Link de Pago</DialogTitle>
              <DialogDescription>
                Completa la información para generar un link de pago personalizado
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link-name">Nombre del Link</Label>
                <Input id="link-name" placeholder="ej: Pago Mensualidad Marzo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email del Cliente</Label>
                  <Input id="client-email" type="email" placeholder="cliente@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto (₲ PYG)</Label>
                  <Input id="amount" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción/Concepto</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el concepto del pago..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Fecha de Expiración</Label>
                <Input id="expiry" type="datetime-local" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-gradient-primary">
                  Crear Link de Pago
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o cliente..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              Filtrar por Estado
            </Button>
            <Button variant="outline">
              Filtrar por Fecha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Todos los Links ({filteredLinks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Monto</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Vistas</TableHead>
                  <TableHead className="font-semibold">Creado</TableHead>
                  <TableHead className="font-semibold">Expira</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => {
                  const statusInfo = statusConfig[link.status];
                  return (
                    <TableRow key={link.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <p className="font-medium text-foreground">{link.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{link.id}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{link.client.name}</p>
                        <p className="text-sm text-muted-foreground">{link.client.email}</p>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₲ {link.amount.toLocaleString('es-PY')}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.className}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span className="text-sm">{link.views}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(link.createdAt, { addSuffix: true, locale: es })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(link.expiresAt, { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(link.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
