import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  internal_code: z.string().optional(),
  type: z.enum(["fixed", "variable"]),
  base_amount: z.string().min(1, "El monto es requerido"),
  frequency: z.enum(["weekly", "biweekly", "monthly", "bimonthly", "quarterly", "semiannual", "annual"]),
  duration_type: z.enum(["unlimited", "limited"]),
  number_of_payments: z.string().optional(),
  first_charge_type: z.enum(["immediate", "scheduled"]),
  trial_period_days: z.string(),
  allow_price_modification: z.boolean(),
  auto_apply_price_changes: z.boolean(),
  send_reminder_before_charge: z.boolean(),
  allow_pause: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface NewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewProductDialog({ open, onOpenChange, onSuccess }: NewProductDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      internal_code: "",
      type: "fixed",
      base_amount: "",
      frequency: "monthly",
      duration_type: "unlimited",
      number_of_payments: "",
      first_charge_type: "immediate",
      trial_period_days: "0",
      allow_price_modification: true,
      auto_apply_price_changes: false,
      send_reminder_before_charge: true,
      allow_pause: false,
    },
  });

  const durationType = form.watch("duration_type");
  const subscriptionType = form.watch("type");

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Debes iniciar sesión para crear productos");
        return;
      }

      const productData = {
        user_id: user.id,
        name: data.name,
        description: data.description || null,
        internal_code: data.internal_code || null,
        type: data.type,
        base_amount: parseInt(data.base_amount),
        frequency: data.frequency,
        duration_type: data.duration_type,
        number_of_payments: data.duration_type === "limited" && data.number_of_payments 
          ? parseInt(data.number_of_payments) 
          : null,
        first_charge_type: data.first_charge_type,
        trial_period_days: parseInt(data.trial_period_days),
        allow_price_modification: data.allow_price_modification,
        auto_apply_price_changes: data.auto_apply_price_changes,
        send_reminder_before_charge: data.send_reminder_before_charge,
        allow_pause: data.allow_pause,
        is_active: true,
      };

      const { error } = await supabase
        .from("products")
        .insert([productData]);

      if (error) throw error;

      toast.success("Producto creado exitosamente");
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Producto</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Plan de Salud Familiar Gold" {...field} />
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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción del producto..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="internal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Interno</FormLabel>
                    <FormControl>
                      <Input placeholder="PLAN-SALUD-GOLD" {...field} />
                    </FormControl>
                    <FormDescription>
                      Código opcional para identificación interna
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subscription Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuración de Suscripción</h3>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Monto *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed">Monto Fijo</SelectItem>
                        <SelectItem value="variable">Monto Variable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="base_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Base (₲) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia de Cobro *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="biweekly">Quincenal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="bimonthly">Bimestral</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                        <SelectItem value="semiannual">Semestral</SelectItem>
                        <SelectItem value="annual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              {durationType === "limited" && (
                <FormField
                  control={form.control}
                  name="number_of_payments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Pagos *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="trial_period_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Prueba (días)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Opciones del Producto</h3>
              
              <FormField
                control={form.control}
                name="allow_price_modification"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Permitir Modificación de Precio</FormLabel>
                      <FormDescription>
                        Habilita cambios de precio para este producto
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {subscriptionType === "variable" && (
                <FormField
                  control={form.control}
                  name="auto_apply_price_changes"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Aplicar Cambios Automáticamente</FormLabel>
                        <FormDescription>
                          Los cambios de precio se aplicarán automáticamente sin aprobación del cliente (solo para montos variables)
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="send_reminder_before_charge"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enviar Recordatorio Antes del Cobro</FormLabel>
                      <FormDescription>
                        Notificar al cliente antes de realizar el cobro
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allow_pause"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Permitir Pausar Suscripción</FormLabel>
                      <FormDescription>
                        Los clientes pueden pausar temporalmente su suscripción
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Producto
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
