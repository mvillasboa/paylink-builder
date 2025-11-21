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

export function NewSubscriptionDialog({
  open,
  onOpenChange,
  onSuccess,
}: NewSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Suscripción</DialogTitle>
          <DialogDescription>
            Completa los datos para crear una nueva suscripción recurrente
          </DialogDescription>
        </DialogHeader>

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
                onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  );
}
