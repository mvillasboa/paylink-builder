import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Edit3, ArrowRight, ArrowLeft, TrendingUp, TrendingDown, 
  Info, CheckCircle2, AlertCircle, Calendar as CalendarIcon,
  Loader2, ShieldCheck, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatAmount } from "@/lib/utils/currency";
import { Subscription, PriceChangeType, ApplicationType } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModifySubscriptionAmountDialogProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ModifySubscriptionAmountDialog({ 
  subscription, 
  open, 
  onOpenChange,
  onSuccess 
}: ModifySubscriptionAmountDialogProps) {
  const [step, setStep] = useState<'amount' | 'application' | 'approval' | 'confirm'>('amount');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    newAmount: subscription.amount,
    reason: '',
    changeType: 'custom' as PriceChangeType,
    applicationType: 'next_cycle' as ApplicationType,
    scheduledDate: undefined as Date | undefined,
    requiresClientApproval: false,
    internalNotes: '',
  });

  // Cálculos automáticos
  const difference = formData.newAmount - subscription.amount;
  const percentageChange = ((difference / subscription.amount) * 100).toFixed(2);
  const isIncrease = difference > 0;
  const isDifferent = formData.newAmount !== subscription.amount;

  // Sugerir tipo de cambio automáticamente
  useEffect(() => {
    if (!isDifferent) return;
    
    if (Math.abs(parseFloat(percentageChange)) <= 10) {
      setFormData(prev => ({ ...prev, changeType: 'inflation' }));
    } else if (isIncrease) {
      setFormData(prev => ({ ...prev, changeType: 'upgrade' }));
    } else {
      setFormData(prev => ({ ...prev, changeType: 'downgrade' }));
    }
  }, [formData.newAmount, isDifferent, isIncrease, percentageChange]);

  const handleConfirm = async () => {
    if (!isDifferent) {
      toast.error("El nuevo monto debe ser diferente al actual");
      return;
    }

    if (!formData.reason.trim()) {
      toast.error("Debes especificar la razón del cambio");
      return;
    }

    if (formData.applicationType === 'scheduled' && !formData.scheduledDate) {
      toast.error("Debes seleccionar una fecha para el cambio programado");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      // Generar token de aprobación si es necesario
      let approvalToken = null;
      if (formData.requiresClientApproval) {
        const { data: tokenData, error: tokenError } = await supabase.rpc('generate_approval_token');
        if (tokenError) throw tokenError;
        approvalToken = tokenData;
      }

      // Crear registro de cambio de precio
      const { error: insertError } = await supabase
        .from('subscription_price_changes')
        .insert({
          subscription_id: subscription.id,
          old_amount: subscription.amount,
          new_amount: formData.newAmount,
          reason: formData.reason,
          change_type: formData.changeType,
          application_type: formData.applicationType,
          scheduled_date: formData.scheduledDate?.toISOString(),
          requires_client_approval: formData.requiresClientApproval,
          client_approval_status: formData.requiresClientApproval ? 'pending' : 'not_required',
          approval_token: approvalToken,
          changed_by: user.id,
          status: formData.applicationType === 'scheduled' ? 'scheduled' : 'pending',
          internal_notes: formData.internalNotes,
        });

      if (insertError) throw insertError;

      toast.success("Cambio de precio registrado exitosamente");
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setStep('amount');
      setFormData({
        newAmount: subscription.amount,
        reason: '',
        changeType: 'custom',
        applicationType: 'next_cycle',
        scheduledDate: undefined,
        requiresClientApproval: false,
        internalNotes: '',
      });

    } catch (error: any) {
      console.error("Error al modificar precio:", error);
      toast.error(error.message || "Error al registrar el cambio de precio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Edit3 className="h-6 w-6" />
            Modificar Monto de Suscripción
          </DialogTitle>
          <DialogDescription>
            {subscription.reference} - {subscription.client_name}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {(['amount', 'application', 'approval', 'confirm'] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
              {i < 3 && <div className="w-12 h-0.5 bg-muted mx-2" />}
            </div>
          ))}
        </div>

        {/* STEP 1: Nuevo Monto */}
        {step === 'amount' && (
          <div className="space-y-6">
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs text-muted-foreground">Monto Actual</Label>
                    <p className="text-2xl font-bold mt-1">
                      {formatCurrency(subscription.amount)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Nuevo Monto</Label>
                    <p className="text-2xl font-bold mt-1 text-primary">
                      {formatCurrency(formData.newAmount)}
                    </p>
                  </div>
                </div>
                
                {isDifferent && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Diferencia:</span>
                      <div className="flex items-center gap-2">
                        {isIncrease ? (
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={cn(
                          "text-lg font-bold",
                          isIncrease ? "text-orange-500" : "text-green-500"
                        )}>
                          {isIncrease ? '+' : ''}{formatCurrency(difference)} ({percentageChange}%)
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="newAmount">Nuevo Monto Mensual *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₲</span>
                <Input
                  id="newAmount"
                  type="number"
                  value={formData.newAmount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    newAmount: parseInt(e.target.value) || 0 
                  }))}
                  className="pl-8 text-lg"
                  min={1000}
                  step={1000}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Label className="text-xs text-muted-foreground w-full">Ajustes rápidos:</Label>
                {[5, 10, 15, 20, 25].map(percent => (
                  <Button
                    key={percent}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      newAmount: Math.round(subscription.amount * (1 + percent / 100))
                    }))}
                  >
                    +{percent}%
                  </Button>
                ))}
                {[-10, -15, -20].map(percent => (
                  <Button
                    key={percent}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      newAmount: Math.round(subscription.amount * (1 + percent / 100))
                    }))}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Razón del Cambio *</Label>
              <Textarea
                id="reason"
                placeholder="ej: Cliente solicitó upgrade a plan premium con más beneficios"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Esta información se mostrará al cliente en la notificación
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Cambio</Label>
              <RadioGroup
                value={formData.changeType}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  changeType: value as PriceChangeType 
                }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upgrade" id="upgrade" />
                  <Label htmlFor="upgrade" className="cursor-pointer">
                    📈 Upgrade - Cliente obtiene más beneficios
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="downgrade" id="downgrade" />
                  <Label htmlFor="downgrade" className="cursor-pointer">
                    📉 Downgrade - Cliente reduce plan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inflation" id="inflation" />
                  <Label htmlFor="inflation" className="cursor-pointer">
                    💹 Ajuste por Inflación
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">
                    ⚙️ Personalizado
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalNotes">
                Notas Internas (Opcional)
                <span className="text-muted-foreground text-xs ml-2">
                  (No se muestran al cliente)
                </span>
              </Label>
              <Textarea
                id="internalNotes"
                placeholder="Anotaciones internas sobre este cambio..."
                value={formData.internalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                rows={2}
              />
            </div>

            <Button onClick={() => setStep('application')} className="w-full" disabled={!isDifferent}>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* STEP 2: Cuándo Aplicar */}
        {step === 'application' && (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>¿Cuándo debe aplicarse el cambio?</AlertTitle>
              <AlertDescription>
                Elegí el momento más apropiado según tu acuerdo con el cliente
              </AlertDescription>
            </Alert>

            <RadioGroup
              value={formData.applicationType}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                applicationType: value as ApplicationType 
              }))}
              className="space-y-4"
            >
              <Card className={cn(
                "cursor-pointer transition-all",
                formData.applicationType === 'immediate' && "ring-2 ring-primary"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="immediate" id="immediate" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="immediate" className="cursor-pointer text-base font-semibold">
                        ⚡ Inmediato
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        El cambio se aplica en el próximo cobro programado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn(
                "cursor-pointer transition-all",
                formData.applicationType === 'next_cycle' && "ring-2 ring-primary"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="next_cycle" id="next_cycle" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="next_cycle" className="cursor-pointer text-base font-semibold">
                        📅 Próximo Ciclo
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        El cambio se aplica después del próximo cobro
                      </p>
                      <Alert className="mt-3">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-xs">
                          ✅ Recomendado: Da tiempo al cliente para prepararse
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn(
                "cursor-pointer transition-all",
                formData.applicationType === 'scheduled' && "ring-2 ring-primary"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="scheduled" id="scheduled" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="scheduled" className="cursor-pointer text-base font-semibold">
                        🗓️ Fecha Específica
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Programá el cambio para una fecha específica
                      </p>
                      
                      {formData.applicationType === 'scheduled' && (
                        <div className="mt-3">
                          <Label htmlFor="scheduledDate" className="text-sm">
                            Fecha de Aplicación *
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left mt-2"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.scheduledDate 
                                  ? formData.scheduledDate.toLocaleDateString('es-PY')
                                  : "Seleccionar fecha"
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={formData.scheduledDate}
                                onSelect={(date) => setFormData(prev => ({ 
                                  ...prev, 
                                  scheduledDate: date 
                                }))}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button onClick={() => setStep('approval')} className="flex-1">
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Aprobación del Cliente */}
        {step === 'approval' && (
          <div className="space-y-6">
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Aprobación del Cliente</AlertTitle>
              <AlertDescription>
                Para aumentos de precio, es recomendable obtener la aprobación explícita del cliente
              </AlertDescription>
            </Alert>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requiresApproval" className="text-base font-semibold cursor-pointer">
                      ¿Requiere aprobación del cliente?
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isIncrease 
                        ? "Recomendado para aumentos de precio"
                        : "No necesario para reducciones de precio"
                      }
                    </p>
                  </div>
                  <Switch
                    id="requiresApproval"
                    checked={formData.requiresClientApproval}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      requiresClientApproval: checked 
                    }))}
                  />
                </div>

                {formData.requiresClientApproval && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Separator />
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Se enviará un link de aprobación al cliente por WhatsApp.
                        El cambio solo se aplicará si el cliente acepta.
                      </AlertDescription>
                    </Alert>

                    <Alert variant="default">
                      <Clock className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Si el cliente no responde en 7 días, el cambio se aplicará automáticamente
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('application')} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button onClick={() => setStep('confirm')} className="flex-1">
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmación */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Revisá los cambios antes de confirmar</AlertTitle>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen del Cambio de Precio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Suscripción</Label>
                  <p className="font-semibold">{subscription.reference}</p>
                  <p className="text-sm text-muted-foreground">{subscription.client_name}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Monto Actual</Label>
                    <p className="text-lg font-bold">{formatCurrency(subscription.amount)}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Nuevo Monto</Label>
                    <p className="text-lg font-bold text-primary">{formatCurrency(formData.newAmount)}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Diferencia:</span>
                    <div className="flex items-center gap-2">
                      {isIncrease ? (
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                      <span className={cn(
                        "font-bold",
                        isIncrease ? "text-orange-500" : "text-green-500"
                      )}>
                        {isIncrease ? '+' : ''}{formatCurrency(difference)} ({percentageChange}%)
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-muted-foreground">Razón del Cambio</Label>
                  <p className="text-sm mt-1">{formData.reason}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Tipo de Cambio</Label>
                  <Badge className="mt-1">
                    {formData.changeType === 'upgrade' && '📈 Upgrade'}
                    {formData.changeType === 'downgrade' && '📉 Downgrade'}
                    {formData.changeType === 'inflation' && '💹 Ajuste por Inflación'}
                    {formData.changeType === 'custom' && '⚙️ Personalizado'}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-muted-foreground">Cuándo se Aplica</Label>
                  <p className="text-sm font-medium mt-1">
                    {formData.applicationType === 'immediate' && '⚡ Inmediato - Próximo cobro'}
                    {formData.applicationType === 'next_cycle' && '📅 Próximo Ciclo'}
                    {formData.applicationType === 'scheduled' && `🗓️ ${formData.scheduledDate?.toLocaleDateString('es-PY')}`}
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Aprobación del Cliente</Label>
                  <p className="text-sm mt-1">
                    {formData.requiresClientApproval 
                      ? '✅ Sí - Se enviará solicitud de aprobación'
                      : '❌ No requerida'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={handleConfirm} 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmar Cambio de Precio
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => setStep('approval')} 
                className="w-full"
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
