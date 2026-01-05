import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Wallet, 
  CreditCard, 
  Lightbulb,
  AlertCircle,
  TrendingDown
} from "lucide-react";
import { 
  Subscription, 
  getSubscriptionStatusSummary,
  PaymentMethodStatus,
  ChargeAttempt,
  ChargeAttemptStatusLabels,
  DeclineCategoryLabels
} from "@/types/subscription";
import { ContractStatusBadge } from "./ContractStatusBadge";
import { BillingStatusBadge } from "./BillingStatusBadge";
import { PaymentMethodStatusBadge } from "./PaymentMethodStatusBadge";
import { formatCurrency } from "@/lib/utils/currency";

interface SubscriptionStatusDisplayProps {
  subscription: Subscription;
  paymentMethodStatus?: PaymentMethodStatus;
  lastChargeAttempt?: ChargeAttempt;
  compact?: boolean;
}

export function SubscriptionStatusDisplay({ 
  subscription, 
  paymentMethodStatus = "VALID",
  lastChargeAttempt,
  compact = false
}: SubscriptionStatusDisplayProps) {
  const summary = getSubscriptionStatusSummary(
    subscription, 
    { payment_method_status: paymentMethodStatus },
    lastChargeAttempt
  );

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        <ContractStatusBadge status={subscription.contract_status || "ACTIVE"} size="sm" />
        <BillingStatusBadge status={subscription.billing_status || "IN_GOOD_STANDING"} size="sm" />
        {paymentMethodStatus !== "VALID" && (
          <PaymentMethodStatusBadge status={paymentMethodStatus} size="sm" />
        )}
      </div>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-r from-card/80 to-card">
      <CardContent className="p-4 space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            Resumen de Estado
          </h4>
          {summary.suggestedAction && (
            <Badge variant="destructive" className="text-xs">
              Requiere atención
            </Badge>
          )}
        </div>

        {/* Three Status Columns */}
        <div className="grid grid-cols-3 gap-4">
          {/* Contract Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileCheck className="h-3.5 w-3.5" />
              Suscripción
            </div>
            <ContractStatusBadge status={subscription.contract_status || "ACTIVE"} />
          </div>

          {/* Billing Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" />
              Pago
            </div>
            <BillingStatusBadge status={subscription.billing_status || "IN_GOOD_STANDING"} />
          </div>

          {/* Payment Method Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              Medio de Pago
            </div>
            <PaymentMethodStatusBadge status={paymentMethodStatus} />
          </div>
        </div>

        {/* Outstanding Amount Warning */}
        {subscription.outstanding_amount && subscription.outstanding_amount > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Deuda pendiente: {formatCurrency(subscription.outstanding_amount)}
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                {subscription.outstanding_cycles || 0} ciclo(s) pendiente(s) · 
                {subscription.consecutive_failed_charges || 0} intento(s) fallido(s)
              </p>
            </div>
          </div>
        )}

        {/* Last Charge Attempt */}
        {lastChargeAttempt && lastChargeAttempt.status !== "SUCCESS" && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Último intento de cobro</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {ChargeAttemptStatusLabels[lastChargeAttempt.status]}
              </span>
              {lastChargeAttempt.decline_category && (
                <Badge variant="outline" className="text-xs">
                  {DeclineCategoryLabels[lastChargeAttempt.decline_category]}
                </Badge>
              )}
            </div>
            {lastChargeAttempt.processor_response_message && (
              <p className="text-xs text-muted-foreground mt-1">
                {lastChargeAttempt.processor_response_message}
              </p>
            )}
          </div>
        )}

        {/* Suggested Action */}
        {summary.suggestedAction && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-primary">Acción sugerida</p>
              <p className="text-sm text-foreground/80">{summary.suggestedAction}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
