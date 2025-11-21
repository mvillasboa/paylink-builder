import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Infinity, Calendar, TrendingUp, DollarSign } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const subscriptionSchema = z.object({
  client_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  client_email: z.string().email("Email inválido"),
  phone_number: z.string().min(10, "Teléfono inválido"),
  reference: z.string().min(3, "La referencia debe tener al menos 3 caracteres"),
  concept: z.string().min(3, "El concepto debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  amount: z.string().min(1, "El monto es requerido"),
  type: z.enum(["fixed", "variable", "single"]),
  frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  billing_day: z.string().min(1, "El día de facturación es requerido"),
  duration_type: z.enum(["unlimited", "limited"]),
  number_of_payments: z.string().optional(),
  first_charge_type: z.enum(["immediate", "scheduled"]),
  first_charge_date: z.string().optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface NewSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type SubscriptionTypeOption = {
  id: string;
  title: string;
  description: string;
  durationType: "unlimited" | "limited";
  amountType: "fixed" | "variable";
  icon: any;
  features: string[];
};

const subscriptionTypes: SubscriptionTypeOption[] = [
  {
    id: "unlimited-variable",
    title: "Ilimitada - Variable",
    description: "Renovación automática con montos ajustables",
    durationType: "unlimited",
    amountType: "variable",
    icon: TrendingUp,
    features: [
      "Renovación automática",
      "Monto según consumo",
      "Servicios cooperativos",
    ],
  },
  {
    id: "unlimited-fixed",
    title: "Ilimitada - Fijo",
    description: "Renovación continua con monto constante",
    durationType: "unlimited",
    amountType: "fixed",
    icon: Infinity,
    features: [
      "Renovación automática",
      "Monto fijo",
      "Reconfirmación para cambios",
    ],
  },
  {
    id: "limited-variable",
    title: "Limitada - Variable",
    description: "Duración específica con montos diferenciados",
    durationType: "limited",
    amountType: "variable",
    icon: Calendar,
    features: [
      "Pagos definidos",
      "Montos variables",
      "Descuentos iniciales",
    ],
  },
  {
    id: "limited-fixed",
    title: "Limitada - Fijo",
    description: "Duración específica con monto constante",
    durationType: "limited",
    amountType: "fixed",
    icon: DollarSign,
    features: [
      "Pagos definidos",
      "Monto fijo",
      "Cursos y programas",
    ],
  },
];

export function NewSubscriptionDialog({
  open,
  onOpenChange,
  onSuccess,
}: NewSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"selection" | "form">("selection");
  const [selectedType, setSelectedType] = useState<SubscriptionTypeOption | null>(null);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      type: "fixed",
      frequency: "monthly",
      duration_type: "unlimited",
      first_charge_type: "immediate",
      billing_day: "1",
    },
  });

  const watchType = form.watch("type");
  const watchDurationType = form.watch("duration_type");
  const watchFirstChargeType = form.watch("first_charge_type");

  const handleTypeSelection = (type: SubscriptionTypeOption) => {
    setSelectedType(type);
    form.setValue("type", type.amountType);
    form.setValue("duration_type", type.durationType);
    setStep("form");
  };

  const handleBack = () => {
    setStep("selection");
    setSelectedType(null);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep("selection");
      setSelectedType(null);
      form.reset();
    }
    onOpenChange(open);
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión");
        return;
      }

      const amount = parseInt(data.amount);
      const billing_day = parseInt(data.billing_day);
      const number_of_payments = data.number_of_payments ? parseInt(data.number_of_payments) : null;

      // Calculate next charge date
      const nextChargeDate = new Date();
      if (data.first_charge_type === "scheduled" && data.first_charge_date) {
        nextChargeDate.setTime(new Date(data.first_charge_date).getTime());
      } else {
        // Set to billing day of current month
        nextChargeDate.setDate(billing_day);
        if (nextChargeDate < new Date()) {
          nextChargeDate.setMonth(nextChargeDate.getMonth() + 1);
        }
      }

      const { error } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        client_name: data.client_name,
        client_email: data.client_email,
        phone_number: data.phone_number,
        reference: data.reference,
        concept: data.concept,
        description: data.description,
        amount,
        type: data.type,
        frequency: data.frequency,
        billing_day,
        duration_type: data.duration_type,
        number_of_payments,
        first_charge_type: data.first_charge_type,
        first_charge_date: data.first_charge_date || null,
        next_charge_date: nextChargeDate.toISOString(),
        status: "active",
      });

      if (error) throw error;

      toast.success("Suscripción creada exitosamente");
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      toast.error("Error al crear la suscripción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step === "form" && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle>
                {step === "selection" ? "Selecciona el Tipo de Suscripción" : "Nueva Suscripción"}
              </DialogTitle>
              <DialogDescription>
                {step === "selection"
                  ? "Elige el tipo de suscripción que mejor se adapte a tus necesidades"
                  : `Completa los datos para crear una suscripción ${selectedType?.title.toLowerCase()}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === "selection" ? (
          <div className="grid md:grid-cols-2 gap-3 py-4">
            {subscriptionTypes.map((type, index) => {
              const Icon = type.icon;
              const colors = [
                { bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "text-blue-600 dark:text-blue-400", hover: "hover:border-blue-500" },
                { bg: "bg-purple-500/10", border: "border-purple-500/30", icon: "text-purple-600 dark:text-purple-400", hover: "hover:border-purple-500" },
                { bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: "text-emerald-600 dark:text-emerald-400", hover: "hover:border-emerald-500" },
                { bg: "bg-amber-500/10", border: "border-amber-500/30", icon: "text-amber-600 dark:text-amber-400", hover: "hover:border-amber-500" },
              ];
              const color = colors[index];
              
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all ${color.hover} hover:shadow-lg border-2 ${color.border} group`}
                  onClick={() => handleTypeSelection(type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2.5 rounded-lg ${color.bg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-5 w-5 ${color.icon}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">{type.title}</h3>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-1 ml-1">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <div className={`w-1 h-1 rounded-full ${color.bg}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Información del Cliente</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="juan@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+595981234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subscription Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Detalles de la Suscripción</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia</FormLabel>
                      <FormControl>
                        <Input placeholder="SUB-001" {...field} />
                      </FormControl>
                      <FormDescription>Código único para identificar la suscripción</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="concept"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Concepto</FormLabel>
                      <FormControl>
                        <Input placeholder="Plan Premium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalles adicionales sobre la suscripción..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing and Type */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Facturación</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Suscripción</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed">Monto Fijo</SelectItem>
                          <SelectItem value="variable">Monto Variable</SelectItem>
                          <SelectItem value="single">Pago Único</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {watchType === "variable" ? "Monto Primera Cuota" : "Monto"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="150000" {...field} />
                      </FormControl>
                      <FormDescription>Monto en guaraníes (PYG)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frecuencia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
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
                  name="billing_day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día de Facturación</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="31" placeholder="1" {...field} />
                      </FormControl>
                      <FormDescription>Día del mes para el cobro</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Duración</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Duración</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unlimited">Ilimitada</SelectItem>
                          <SelectItem value="limited">Limitada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchDurationType === "limited" && (
                  <FormField
                    control={form.control}
                    name="number_of_payments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Pagos</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* First Charge */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Primer Cobro</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_charge_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Primer Cobro</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="immediate">Inmediato</SelectItem>
                          <SelectItem value="scheduled">Programado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchFirstChargeType === "scheduled" && (
                  <FormField
                    control={form.control}
                    name="first_charge_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha del Primer Cobro</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Crear Suscripción"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
