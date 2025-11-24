import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Calendar, Loader2, User, Mail, Phone, FileText, Clock, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils/currency";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ApproveSubscriptionChange() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'error'>('pending');
  const [change, setChange] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadChangeDetails();
  }, [token]);

  const loadChangeDetails = async () => {
    if (!token) {
      setStatus('error');
      setLoading(false);
      return;
    }

    try {
      const { data: changeData, error: changeError } = await supabase
        .from('subscription_price_changes')
        .select(`
          *,
          subscriptions (
            id,
            reference,
            client_name,
            client_email,
            phone_number,
            concept,
            description,
            amount,
            type,
            frequency,
            billing_day,
            duration_type,
            number_of_payments,
            payments_completed,
            trial_period_days,
            first_charge_type,
            first_charge_date,
            is_first_payment_completed,
            first_payment_amount,
            first_payment_reason,
            next_charge_date,
            last_charge_date,
            status,
            created_at
          )
        `)
        .eq('approval_token', token)
        .eq('client_approval_status', 'pending')
        .single();

      if (changeError || !changeData) {
        setStatus('error');
        toast.error("Token inválido o cambio ya procesado");
        return;
      }

      setChange(changeData);
      setSubscription(changeData.subscriptions);
    } catch (error) {
      console.error("Error loading change:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!change) return;
    
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('subscription_price_changes')
        .update({
          client_approval_status: 'approved',
          client_approval_date: new Date().toISOString(),
          client_approval_method: 'web',
        })
        .eq('id', change.id);

      if (error) throw error;

      setStatus('approved');
      toast.success("Cambio aprobado exitosamente");
    } catch (error: any) {
      console.error("Error approving change:", error);
      toast.error("Error al aprobar el cambio");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!change) return;
    
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('subscription_price_changes')
        .update({
          client_approval_status: 'rejected',
          client_approval_date: new Date().toISOString(),
          client_approval_method: 'web',
          status: 'cancelled',
        })
        .eq('id', change.id);

      if (error) throw error;

      setStatus('rejected');
      toast.success("Cambio rechazado");
    } catch (error: any) {
      console.error("Error rejecting change:", error);
      toast.error("Error al rechazar el cambio");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'error' || !change || !subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Link Inválido</h2>
            <p className="text-muted-foreground">
              Este link de aprobación no es válido o ya fue procesado
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Cambio Aprobado!</h2>
            <p className="text-muted-foreground">
              El nuevo monto se aplicará según lo programado
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <XCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Cambio Rechazado</h2>
            <p className="text-muted-foreground">
              Tu suscripción continuará con el monto actual
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const frequencyLabels = {
    weekly: "Semanal",
    biweekly: "Quincenal",
    monthly: "Mensual",
    bimonthly: "Bimensual",
    quarterly: "Trimestral",
    semiannual: "Semestral",
    annual: "Anual",
    yearly: "Anual",
  };

  const typeLabels = {
    fixed: "Monto Fijo",
    variable: "Monto Variable",
    single: "Pago Único",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <CardTitle>Aprobación de Cambio de Plan</CardTitle>
          <CardDescription>
            Se propone un cambio en tu suscripción
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información del Cliente */}
          <div className="bg-card/90 border-2 border-border/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Información del Cliente</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Nombre</Label>
                <p className="font-medium">{subscription.client_name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 inline mr-1" />
                  Email
                </Label>
                <p className="font-medium">{subscription.client_email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 inline mr-1" />
                  Teléfono
                </Label>
                <p className="font-medium">{subscription.phone_number}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Referencia</Label>
                <p className="font-mono text-xs bg-muted px-2 py-1 rounded">{subscription.reference}</p>
              </div>
            </div>
          </div>

          {/* Detalles de la Suscripción */}
          <div className="bg-card/90 border-2 border-border/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Detalles de la Suscripción</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Concepto</Label>
                <p className="font-medium">{subscription.concept}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <p className="font-medium">{typeLabels[subscription.type as keyof typeof typeLabels]}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Frecuencia</Label>
                <p className="font-medium">{frequencyLabels[subscription.frequency as keyof typeof frequencyLabels]}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Día de Cobro
                </Label>
                <p className="font-medium">Día {subscription.billing_day}</p>
              </div>
              {subscription.description && (
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Descripción</Label>
                  <p className="text-muted-foreground text-xs">{subscription.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Pagos */}
          <div className="bg-card/90 border-2 border-border/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Historial de Pagos</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Pagos Completados</Label>
                <p className="font-bold text-lg">{subscription.payments_completed}</p>
              </div>
              {subscription.duration_type === 'limited' && subscription.number_of_payments && (
                <div>
                  <Label className="text-xs text-muted-foreground">Total de Cuotas</Label>
                  <p className="font-medium">{subscription.number_of_payments}</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">Próximo Cobro</Label>
                <p className="font-medium">
                  {format(new Date(subscription.next_charge_date), "dd/MM/yyyy", { locale: es })}
                </p>
              </div>
              {subscription.last_charge_date && (
                <div>
                  <Label className="text-xs text-muted-foreground">Último Cobro</Label>
                  <p className="font-medium">
                    {format(new Date(subscription.last_charge_date), "dd/MM/yyyy", { locale: es })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Comparación de montos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <Label className="text-xs text-muted-foreground">Monto Actual</Label>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(change.old_amount)}
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <Label className="text-xs text-muted-foreground">Nuevo Monto</Label>
              <p className="text-2xl font-bold text-primary mt-1">
                {formatCurrency(change.new_amount)}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Diferencia:</span>
              <span className={`font-bold ${change.difference > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {change.difference > 0 ? '+' : ''}{formatCurrency(change.difference)} ({change.percentage_change}%)
              </span>
            </div>
          </div>

          {/* Razón */}
          <div>
            <Label className="text-sm font-semibold">Razón del Cambio:</Label>
            <p className="text-muted-foreground mt-1">{change.reason}</p>
          </div>

          {/* Fecha efectiva */}
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>Cuándo se Aplicará</AlertTitle>
            <AlertDescription>
              {change.application_type === 'immediate' && "En el próximo cobro programado"}
              {change.application_type === 'next_cycle' && "En el siguiente ciclo de facturación"}
              {change.application_type === 'scheduled' && `El ${new Date(change.scheduled_date).toLocaleDateString('es-PY')}`}
            </AlertDescription>
          </Alert>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button 
              onClick={handleReject} 
              variant="outline" 
              size="lg" 
              className="flex-1"
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-5 w-5" />
              )}
              Rechazar
            </Button>
            <Button 
              onClick={handleApprove} 
              size="lg" 
              className="flex-1"
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-5 w-5" />
              )}
              Aprobar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
