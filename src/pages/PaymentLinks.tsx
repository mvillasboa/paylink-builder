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
  subscriptionType: z.enum(["fixed", "variable", "single"]),
  durationType: z.enum(["unlimited", "limited"]),
  numberOfPayments: z.string().optional(),
  frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  billingDay: z.string().min(1, "El día de cobro es requerido"),
  firstChargeType: z.enum(["immediate", "scheduled"]),
  firstChargeDate: z.string().optional(),
});

const statusConfig = {
  active: { label: 'Activo', className: 'bg-accent/10 text-accent border-accent/20' },
  sent: { label: 'Enviado', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  viewed: { label: 'Visto', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  not_viewed: { label: 'No visto', className: 'bg-muted text-muted-foreground border-border' },
};

export default function PaymentLinks() {
  const [searchQuery, setSearchQuery] = useState("");
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
      subscriptionType: "fixed",
      durationType: "unlimited",
      numberOfPayments: "",
      frequency: "monthly",
      billingDay: "1",
      firstChargeType: "immediate",
      firstChargeDate: "",
    },
  });

  const watchSubscriptionType = form.watch("subscriptionType");
  const watchDurationType = form.watch("durationType");
  const watchFirstChargeType = form.watch("firstChargeType");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Link de pago creado exitosamente");
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

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Crear Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Link de Pago</DialogTitle>
              <DialogDescription>
                Configura la suscripción y genera el link de pago personalizado
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

                {/* Concepto */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="concept"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concepto</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ej: Mensualidad Servicio Premium" />
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
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Configuración de Suscripción */}
                <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-muted/20">
                  <h3 className="font-semibold text-foreground">Configuración de Suscripción</h3>
                  
                  {/* Tipo de Suscripción */}
                  <FormField
                    control={form.control}
                    name="subscriptionType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo de Monto</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fixed" id="fixed" />
                              <Label htmlFor="fixed" className="font-normal cursor-pointer">
                                Monto Fijo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="variable" id="variable" />
                              <Label htmlFor="variable" className="font-normal cursor-pointer">
                                Monto Variable
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="single" id="single" />
                              <Label htmlFor="single" className="font-normal cursor-pointer">
                                Pago Único
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchSubscriptionType !== "single" && (
                    <>
                      {/* Duración */}
                      <FormField
                        control={form.control}
                        name="durationType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Duración</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="unlimited" id="unlimited" />
                                  <Label htmlFor="unlimited" className="font-normal cursor-pointer">
                                    Ilimitada
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="limited" id="limited" />
                                  <Label htmlFor="limited" className="font-normal cursor-pointer">
                                    Limitada
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchDurationType === "limited" && (
                        <FormField
                          control={form.control}
                          name="numberOfPayments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de Pagos</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="12" min="1" />
                              </FormControl>
                              <FormDescription>
                                Cantidad total de pagos antes de finalizar la suscripción
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Frecuencia y Día de Cobro */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="frequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frecuencia</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona frecuencia" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="weekly">Semanal</SelectItem>
                                  <SelectItem value="monthly">Mensual</SelectItem>
                                  <SelectItem value="quarterly">Trimestral</SelectItem>
                                  <SelectItem value="yearly">Anual</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="billingDay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Día de Cobro</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="1" min="1" max="31" />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Día del mes para el cobro
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Primer Cobro */}
                      <FormField
                        control={form.control}
                        name="firstChargeType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Primer Cobro</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="immediate" id="immediate" />
                                  <Label htmlFor="immediate" className="font-normal cursor-pointer">
                                    Inmediato
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="scheduled" id="scheduled" />
                                  <Label htmlFor="scheduled" className="font-normal cursor-pointer">
                                    Programado
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchFirstChargeType === "scheduled" && (
                        <FormField
                          control={form.control}
                          name="firstChargeDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha del Primer Cobro</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Botones */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-primary">
                    Crear Link de Pago
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
