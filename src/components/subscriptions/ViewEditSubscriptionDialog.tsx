import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Edit3,
  Save,
  X,
  Pause,
  Play,
  Ban,
  History,
  CreditCard,
} from "lucide-react";
import { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/lib/utils/currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface ViewEditSubscriptionDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ViewEditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
  onSuccess,
}: ViewEditSubscriptionDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Subscription>>({});

  if (!subscription) return null;

  const handleEdit = () => {
    setFormData({
      client_name: subscription.client_name,
      client_email: subscription.client_email,
      phone_number: subscription.phone_number,
      concept: subscription.concept,
      description: subscription.description,
      amount: subscription.amount,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Aquí iría la lógica para actualizar en Supabase
      toast.success("Suscripción actualizada correctamente");
      setIsEditing(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Error al actualizar la suscripción");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handlePauseResume = async () => {
    const newStatus = subscription.status === "paused" ? "active" : "paused";
    try {
      // Aquí iría la lógica para actualizar en Supabase
      toast.success(
        `Suscripción ${newStatus === "paused" ? "pausada" : "reactivada"} correctamente`
      );
      onSuccess?.();
    } catch (error) {
      toast.error("Error al cambiar el estado");
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta suscripción?")) {
      return;
    }
    try {
      // Aquí iría la lógica para actualizar en Supabase
      toast.success("Suscripción cancelada correctamente");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al cancelar la suscripción");
    }
  };

  const statusConfig = {
    active: { label: "Activa", className: "bg-green-500/10 text-green-700 dark:text-green-400" },
    paused: { label: "Pausada", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
    cancelled: { label: "Cancelada", className: "bg-red-500/10 text-red-700 dark:text-red-400" },
    expired: { label: "Expirada", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400" },
    trial: { label: "Prueba", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  };

  const frequencyLabels = {
    weekly: "Semanal",
    monthly: "Mensual",
    quarterly: "Trimestral",
    yearly: "Anual",
  };

  const typeLabels = {
    fixed: "Monto Fijo",
    variable: "Monto Variable",
    single: "Pago Único",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {isEditing ? "Editar Suscripción" : "Detalles de la Suscripción"}
              </DialogTitle>
              <DialogDescription>
                Referencia: <code className="text-xs bg-muted px-2 py-1 rounded">{subscription.reference}</code>
              </DialogDescription>
            </div>
            <Badge className={statusConfig[subscription.status].className} variant="secondary">
              {statusConfig[subscription.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border/50 rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Información del Cliente</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name" className="text-foreground/80">
                  Nombre del Cliente
                </Label>
                {isEditing ? (
                  <Input
                    id="client_name"
                    value={formData.client_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium">{subscription.client_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_email" className="text-foreground/80">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, client_email: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium">{subscription.client_email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-foreground/80">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Teléfono
                </Label>
                {isEditing ? (
                  <Input
                    id="phone_number"
                    value={formData.phone_number || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium">{subscription.phone_number}</p>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border/50 rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Detalles de la Suscripción</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Concepto</Label>
                {isEditing ? (
                  <Input
                    value={formData.concept || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, concept: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium">{subscription.concept}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Monto
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      type="number"
                      value={formData.amount || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: parseInt(e.target.value) })
                      }
                      disabled={subscription.type === "fixed"}
                      className={subscription.type === "fixed" ? "opacity-60 cursor-not-allowed" : ""}
                    />
                    {subscription.type === "fixed" && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        El monto no puede ser editado en suscripciones de monto fijo. 
                        Use "Modificar Precio" para cambios de precio.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-foreground font-bold text-lg text-primary">
                    {formatCurrency(subscription.amount)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Tipo de Monto</Label>
                <Badge 
                  variant="outline" 
                  className={
                    subscription.type === "fixed" 
                      ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30"
                      : subscription.type === "variable"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30"
                  }
                >
                  {typeLabels[subscription.type]}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Tipo de Plazo</Label>
                <Badge 
                  variant="outline" 
                  className={
                    subscription.duration_type === "unlimited"
                      ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  }
                >
                  {subscription.duration_type === "unlimited" ? "Plazo Ilimitado" : "Plazo Limitado"}
                </Badge>
              </div>
              {subscription.duration_type === "limited" && subscription.number_of_payments && (
                <div className="space-y-2">
                  <Label className="text-foreground/80">Número de Pagos</Label>
                  <p className="text-foreground font-medium">
                    {subscription.number_of_payments} cuotas
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-foreground/80">Frecuencia</Label>
                <p className="text-foreground font-medium">
                  {frequencyLabels[subscription.frequency]}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Día de Cobro
                </Label>
                <p className="text-foreground font-medium">Día {subscription.billing_day}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Próximo Cobro</Label>
                <p className="text-foreground font-medium">
                  {format(new Date(subscription.next_charge_date), "dd 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Tipo de Primer Cobro</Label>
                <Badge variant="secondary">
                  {subscription.first_charge_type === "immediate" ? "Inmediato" : "Programado"}
                </Badge>
              </div>
              {subscription.first_charge_date && (
                <div className="space-y-2">
                  <Label className="text-foreground/80">Fecha de Primer Cobro</Label>
                  <p className="text-foreground font-medium">
                    {format(new Date(subscription.first_charge_date), "dd/MM/yyyy", { locale: es })}
                  </p>
                </div>
              )}
              {subscription.first_payment_amount && (
                <div className="space-y-2">
                  <Label className="text-foreground/80">Monto de Primer Pago</Label>
                  <p className="text-foreground font-medium">
                    {formatCurrency(subscription.first_payment_amount)}
                  </p>
                </div>
              )}
              {subscription.first_payment_reason && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-foreground/80">Razón del Monto de Primer Pago</Label>
                  <p className="text-foreground/90 text-sm">
                    {subscription.first_payment_reason}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-foreground/80">Recordatorio Antes del Cobro</Label>
                <Badge variant={subscription.send_reminder_before_charge ? "default" : "secondary"}>
                  {subscription.send_reminder_before_charge ? "Activado" : "Desactivado"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Permite Pausa</Label>
                <Badge variant={subscription.allow_pause ? "default" : "secondary"}>
                  {subscription.allow_pause ? "Sí" : "No"}
                </Badge>
              </div>
              {isEditing && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-foreground/80">Descripción</Label>
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              )}
              {!isEditing && subscription.description && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-foreground/80">Descripción</Label>
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {subscription.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          {!isEditing && (
            <div className="bg-card/90 backdrop-blur-sm border-2 border-border/50 rounded-lg p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Historial de Pagos</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-foreground/80 text-sm">Pagos Completados</Label>
                  <p className="text-foreground font-bold text-2xl">
                    {subscription.payments_completed}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-foreground/80 text-sm">Primer Pago Completado</Label>
                  <Badge variant={subscription.is_first_payment_completed ? "default" : "secondary"}>
                    {subscription.is_first_payment_completed ? "Sí" : "No"}
                  </Badge>
                </div>
                {subscription.last_charge_date && (
                  <div className="space-y-1">
                    <Label className="text-foreground/80 text-sm">Último Pago</Label>
                    <p className="text-foreground font-medium">
                      {format(new Date(subscription.last_charge_date), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                )}
                {subscription.duration_type === "limited" && subscription.number_of_payments && (
                  <div className="space-y-1">
                    <Label className="text-foreground/80 text-sm">Progreso</Label>
                    <p className="text-foreground font-medium">
                      {subscription.payments_completed} / {subscription.number_of_payments} cuotas
                    </p>
                  </div>
                )}
                {subscription.last_price_change_date && (
                  <div className="space-y-1">
                    <Label className="text-foreground/80 text-sm">Último Cambio de Precio</Label>
                    <p className="text-foreground font-medium">
                      {format(new Date(subscription.last_price_change_date), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                )}
                {subscription.pending_price_change_id && (
                  <div className="md:col-span-3">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                      Tiene un cambio de precio pendiente de aprobación
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {!isEditing && (
            <div className="bg-card/90 backdrop-blur-sm border-2 border-accent/40 rounded-lg p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">Información Adicional</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <Label className="text-foreground/80 text-xs">Fecha de Creación</Label>
                  <p className="text-foreground/90">
                    {format(new Date(subscription.created_at), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-foreground/80 text-xs">Última Actualización</Label>
                  <p className="text-foreground/90">
                    {format(new Date(subscription.updated_at), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
                {subscription.trial_period_days && subscription.trial_period_days > 0 && (
                  <div className="space-y-1">
                    <Label className="text-foreground/80 text-xs">Período de Prueba</Label>
                    <p className="text-foreground/90">
                      {subscription.trial_period_days} días
                    </p>
                  </div>
                )}
                {subscription.price_change_history_count > 0 && (
                  <div className="space-y-1">
                    <Label className="text-foreground/80 text-xs">Cambios de Precio</Label>
                    <p className="text-foreground/90">
                      {subscription.price_change_history_count} cambios realizados
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <Separator className="my-4" />
        <div className="flex items-center justify-between gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                {subscription.status === "active" && subscription.allow_pause && (
                  <Button variant="outline" onClick={handlePauseResume}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                )}
                {subscription.status === "paused" && (
                  <Button variant="outline" onClick={handlePauseResume}>
                    <Play className="h-4 w-4 mr-2" />
                    Reactivar
                  </Button>
                )}
                {(subscription.status === "active" || subscription.status === "paused") && (
                  <Button variant="destructive" onClick={handleCancelSubscription}>
                    <Ban className="h-4 w-4 mr-2" />
                    Cancelar Suscripción
                  </Button>
                )}
              </div>
              <Button onClick={handleEdit} className="bg-gradient-primary">
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
