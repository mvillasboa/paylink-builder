import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Copy,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Receipt,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { mockPaymentLinks } from "@/data/mockDashboard";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  amount: z.string().min(1, "El monto es requerido"),
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  clientEmail: z.string().email("Email inválido"),
  phoneNumber: z.string().min(1, "El teléfono es requerido"),
  concept: z.string().min(1, "El concepto es requerido"),
  description: z.string().optional(),
});

const statusConfig = {
  active: { label: 'Activo', className: 'bg-accent/10 text-accent border-accent/20' },
  sent: { label: 'Enviado', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  viewed: { label: 'Visto', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  not_viewed: { label: 'No visto', className: 'bg-muted text-muted-foreground border-border' },
};

export default function PaymentLinks() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLinkTypeDialogOpen, setIsLinkTypeDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      clientName: "",
      clientEmail: "",
      phoneNumber: "",
      concept: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Link de pago único creado exitosamente");
    setIsCreateDialogOpen(false);
    form.reset();
  };

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

        {/* Diálogo de selección de tipo de link */}
        <Dialog open={isLinkTypeDialogOpen} onOpenChange={setIsLinkTypeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Crear Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>¿Qué tipo de link deseas crear?</DialogTitle>
              <DialogDescription>
                Selecciona el tipo de link de pago según tu necesidad
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              {/* Opción 1: Pago Único */}
              <Card 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
                onClick={() => {
                  setIsLinkTypeDialogOpen(false);
                  setIsCreateDialogOpen(true);
                }}
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Pago Único</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Crea un link para un pago único sin suscripción asociada. Ideal para cobros ocasionales o servicios puntuales.
                    </p>
                    <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Crear pago único
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opción 2: Link de Suscripción */}
              <Card 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
                onClick={() => {
                  setIsLinkTypeDialogOpen(false);
                  navigate('/dashboard/subscriptions');
                }}
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Link de Suscripción</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Genera un link de pago para una suscripción existente o crea una nueva. Útil cuando una tarjeta vence o necesitas registrar una nueva.
                    </p>
                    <div className="flex items-center text-sm text-accent font-medium group-hover:gap-2 transition-all">
                      Ir a suscripciones
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Diálogo de creación de pago único */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Link de Pago Único</DialogTitle>
              <DialogDescription>
                Configura el pago único y genera el link personalizado
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                {/* Monto - Campo Principal */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Monto (₲ PYG)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="0" 
                          className="text-2xl h-14 font-semibold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Información del Cliente */}
                <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-muted/20">
                  <h3 className="font-semibold text-foreground">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Juan Pérez" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+595 XXX XXX XXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="cliente@email.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Concepto y Descripción */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="concept"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concepto</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ej: Consultoría profesional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Detalles adicionales del pago..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-primary">
                    Crear Link de Pago Único
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
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
