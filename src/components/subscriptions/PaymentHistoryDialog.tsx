import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Clock, Calendar, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { Subscription } from "@/types/subscription";

type PaymentStatus = "completed" | "pending" | "failed";

type Payment = {
  id: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
};

interface PaymentHistoryDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Función para generar historial mock basado en la suscripción
const generateMockPayments = (subscription: Subscription | null): Payment[] => {
  if (!subscription) return [];

  const payments: Payment[] = [];
  const paymentsCompleted = subscription.payments_completed || 0;
  const startDate = new Date(subscription.created_at);
  
  // Generar pagos completados
  for (let i = 0; i < paymentsCompleted; i++) {
    const paymentDate = new Date(startDate);
    
    // Calcular fecha según frecuencia
    switch (subscription.frequency) {
      case "weekly":
        paymentDate.setDate(startDate.getDate() + (i * 7));
        break;
      case "monthly":
        paymentDate.setMonth(startDate.getMonth() + i);
        break;
      case "quarterly":
        paymentDate.setMonth(startDate.getMonth() + (i * 3));
        break;
      case "yearly":
        paymentDate.setFullYear(startDate.getFullYear() + i);
        break;
    }

    payments.push({
      id: `pay-${subscription.id}-${i + 1}`,
      date: paymentDate.toISOString(),
      amount: subscription.amount,
      status: "completed",
      paymentMethod: "Tarjeta de Débito •••• 4567",
      transactionId: `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    });
  }

  // Agregar un pago pendiente si la suscripción está activa
  if (subscription.status === "active" && subscription.next_charge_date) {
    payments.push({
      id: `pay-${subscription.id}-pending`,
      date: subscription.next_charge_date,
      amount: subscription.amount,
      status: "pending",
      paymentMethod: "Tarjeta de Débito •••• 4567",
    });
  }

  return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export function PaymentHistoryDialog({
  subscription,
  open,
  onOpenChange,
}: PaymentHistoryDialogProps) {
  const payments = generateMockPayments(subscription);

  const statusConfig = {
    completed: {
      label: "Completado",
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      icon: CheckCircle2,
    },
    pending: {
      label: "Pendiente",
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      icon: Clock,
    },
    failed: {
      label: "Fallido",
      color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
      icon: XCircle,
    },
  };

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de Pagos</DialogTitle>
          <DialogDescription>
            Detalles de todos los pagos para la suscripción de {subscription.client_name}
          </DialogDescription>
        </DialogHeader>

        {/* Subscription Summary */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Concepto</p>
                <p className="font-semibold text-foreground">{subscription.concept}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                <p className="font-semibold text-foreground">{subscription.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Referencia</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {subscription.reference}
                </code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Frecuencia</p>
                <p className="font-semibold text-foreground capitalize">
                  {subscription.frequency === "weekly" && "Semanal"}
                  {subscription.frequency === "monthly" && "Mensual"}
                  {subscription.frequency === "quarterly" && "Trimestral"}
                  {subscription.frequency === "yearly" && "Anual"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-foreground">Total Pagado</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalPaid)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter((p) => p.status === "completed").length} pagos completados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <p className="text-sm font-medium text-foreground">Pendiente</p>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(totalPending)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter((p) => p.status === "pending").length} pagos pendientes
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Próximo Cobro</p>
              </div>
              <p className="text-lg font-bold text-foreground">
                {subscription.next_charge_date
                  ? new Date(subscription.next_charge_date).toLocaleDateString("es-PY")
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(subscription.amount)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Payment History Table */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Historial Detallado ({payments.length} {payments.length === 1 ? "pago" : "pagos"})
          </h3>
          
          {payments.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-8 text-center text-muted-foreground">
                No hay pagos registrados para esta suscripción
              </CardContent>
            </Card>
          ) : (
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead className="text-right">ID Transacción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const StatusIcon = statusConfig[payment.status].icon;
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {new Date(payment.date).toLocaleDateString("es-PY", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(payment.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusConfig[payment.status].color}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[payment.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{payment.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.transactionId ? (
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {payment.transactionId}
                            </code>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
