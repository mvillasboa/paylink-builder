import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit3, Eye, Plus, Receipt, TrendingUp, Infinity, Calendar, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { Subscription } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModifySubscriptionAmountDialog } from "@/components/subscriptions/ModifySubscriptionAmountDialog";
import { NewSubscriptionDialog } from "@/components/subscriptions/NewSubscriptionDialog";
import { ViewEditSubscriptionDialog } from "@/components/subscriptions/ViewEditSubscriptionDialog";
import { PaymentHistoryDialog } from "@/components/subscriptions/PaymentHistoryDialog";

// Mock data for demonstration
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "mock-1",
    user_id: "demo",
    client_name: "María González",
    client_email: "maria.gonzalez@email.com",
    phone_number: "+595981234567",
    reference: "SUB-001",
    concept: "Gimnasio Premium",
    description: "Acceso completo a todas las instalaciones",
    amount: 350000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 5,
    duration_type: "unlimited",
    status: "active",
    next_charge_date: "2025-12-05T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    payments_completed: 10,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-11-05T00:00:00Z",
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_amount: null,
    first_payment_reason: null,
    number_of_payments: null,
  },
  {
    id: "mock-2",
    user_id: "demo",
    client_name: "Carlos Benítez",
    client_email: "carlos.benitez@email.com",
    phone_number: "+595982345678",
    reference: "SUB-002",
    concept: "Servicio de Internet",
    description: "Plan de 100 Mbps fibra óptica",
    amount: 280000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 10,
    duration_type: "unlimited",
    status: "active",
    next_charge_date: "2025-12-10T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
    payments_completed: 9,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-11-10T00:00:00Z",
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_amount: null,
    first_payment_reason: null,
    number_of_payments: null,
  },
  {
    id: "mock-3",
    user_id: "demo",
    client_name: "Ana Rodríguez",
    client_email: "ana.rodriguez@email.com",
    phone_number: "+595983456789",
    reference: "SUB-003",
    concept: "Servicio Eléctrico",
    description: "Suscripción mensual de servicio eléctrico",
    amount: 450000,
    type: "variable",
    frequency: "monthly",
    billing_day: 15,
    duration_type: "unlimited",
    status: "active",
    next_charge_date: "2025-12-15T00:00:00Z",
    first_charge_type: "immediate",
    first_payment_amount: 450000,
    created_at: "2024-03-10T00:00:00Z",
    updated_at: "2024-03-10T00:00:00Z",
    payments_completed: 8,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-11-15T00:00:00Z",
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_reason: null,
    number_of_payments: null,
  },
  {
    id: "mock-4",
    user_id: "demo",
    client_name: "Roberto Silva",
    client_email: "roberto.silva@email.com",
    phone_number: "+595984567890",
    reference: "SUB-004",
    concept: "Membresía Anual Club",
    description: "Acceso anual al club deportivo",
    amount: 2500000,
    type: "single",
    frequency: "yearly",
    billing_day: 1,
    duration_type: "limited",
    number_of_payments: 1,
    payments_completed: 1,
    status: "expired",
    next_charge_date: "2026-01-01T00:00:00Z",
    last_charge_date: "2025-01-01T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: false,
    allow_pause: false,
    price_change_history_count: 0,
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_amount: null,
    first_payment_reason: null,
  },
  {
    id: "mock-5",
    user_id: "demo",
    client_name: "Lucía Martínez",
    client_email: "lucia.martinez@email.com",
    phone_number: "+595985678901",
    reference: "SUB-005",
    concept: "Streaming Premium",
    description: "Plan familiar streaming de películas y series",
    amount: 45000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 20,
    duration_type: "unlimited",
    status: "paused",
    next_charge_date: "2025-12-20T00:00:00Z",
    first_charge_type: "immediate",
    allow_pause: true,
    created_at: "2024-04-15T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
    payments_completed: 6,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    price_change_history_count: 0,
    last_charge_date: "2024-10-20T00:00:00Z",
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_amount: null,
    first_payment_reason: null,
    number_of_payments: null,
  },
  {
    id: "mock-6",
    user_id: "demo",
    client_name: "Diego Fernández",
    client_email: "diego.fernandez@email.com",
    phone_number: "+595986789012",
    reference: "SUB-006",
    concept: "Clases de Inglés",
    description: "12 meses de clases online",
    amount: 600000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 1,
    duration_type: "limited",
    number_of_payments: 12,
    payments_completed: 8,
    status: "active",
    next_charge_date: "2025-12-01T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-11-01T00:00:00Z",
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_amount: null,
    first_payment_reason: null,
  },
  {
    id: "mock-7",
    user_id: "demo",
    client_name: "Sofía López",
    client_email: "sofia.lopez@email.com",
    phone_number: "+595987890123",
    reference: "SUB-007",
    concept: "Software Empresarial",
    description: "Licencia mensual de software de gestión",
    amount: 850000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 1,
    duration_type: "unlimited",
    status: "cancelled",
    next_charge_date: "2025-12-01T00:00:00Z",
    last_charge_date: "2024-10-01T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
    payments_completed: 9,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_amount: null,
    first_payment_reason: null,
    number_of_payments: null,
  },
  {
    id: "mock-8",
    user_id: "demo",
    client_name: "Fernando Gómez",
    client_email: "fernando.gomez@email.com",
    phone_number: "+595988901234",
    reference: "SUB-008",
    concept: "Plan de Salud",
    description: "Seguro de salud familiar con periodo de prueba",
    amount: 1200000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 1,
    duration_type: "unlimited",
    status: "trial",
    trial_period_days: 30,
    next_charge_date: "2025-12-15T00:00:00Z",
    first_charge_type: "scheduled",
    first_charge_date: "2025-12-15T00:00:00Z",
    created_at: "2024-11-15T00:00:00Z",
    updated_at: "2024-11-15T00:00:00Z",
    payments_completed: 0,
    is_first_payment_completed: false,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: null,
    pending_price_change_id: null,
    last_price_change_date: null,
    first_payment_amount: null,
    first_payment_reason: null,
    number_of_payments: null,
  },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [newSubscriptionDialogOpen, setNewSubscriptionDialogOpen] = useState(false);
  const [viewEditDialogOpen, setViewEditDialogOpen] = useState(false);
  const [paymentHistoryDialogOpen, setPaymentHistoryDialogOpen] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Si no hay usuario, usar datos mock directamente
      if (!user) {
        setSubscriptions(MOCK_SUBSCRIPTIONS);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Si no hay datos reales, usar mock data
      const finalData = data && data.length > 0 ? data : MOCK_SUBSCRIPTIONS;
      setSubscriptions(finalData);
    } catch (error: any) {
      console.error("Error loading subscriptions:", error);
      // En caso de error, mostrar datos mock
      setSubscriptions(MOCK_SUBSCRIPTIONS);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.concept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusConfig = {
    active: { label: 'Activa', className: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    paused: { label: 'Pausada', className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
    cancelled: { label: 'Cancelada', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
    expired: { label: 'Expirada', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
    trial: { label: 'Prueba', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  };

  const frequencyLabels = {
    weekly: 'Semanal',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    yearly: 'Anual',
  };

  const getSubscriptionTypeConfig = (subscription: Subscription) => {
    const isUnlimited = subscription.duration_type === 'unlimited';
    const isFixed = subscription.type === 'fixed';

    if (!isUnlimited && isFixed) {
      return {
        label: 'Limitada - Fijo',
        color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
        icon: Calendar,
      };
    }
    if (isUnlimited && isFixed) {
      return {
        label: 'Ilimitada - Fijo',
        color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        icon: Infinity,
      };
    }
    if (isUnlimited && !isFixed) {
      return {
        label: 'Ilimitada - Variable',
        color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
        icon: TrendingUp,
      };
    }
    return {
      label: 'Limitada - Variable',
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
      icon: Clock,
    };
  };

  const handleModifyPrice = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setModifyDialogOpen(true);
  };

  const handleViewEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setViewEditDialogOpen(true);
  };

  const handleViewPaymentHistory = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setPaymentHistoryDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Suscripciones</h1>
        </div>
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Cargando suscripciones...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suscripciones</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las suscripciones recurrentes de tus clientes
          </p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setNewSubscriptionDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Suscripción
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Suscripciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Mensuales Recurrentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                subscriptions
                  .filter(s => s.status === 'active' && s.frequency === 'monthly')
                  .reduce((sum, s) => sum + s.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(subscriptions.map(s => s.client_email)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, referencia o concepto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No se encontraron suscripciones" : "No hay suscripciones aún"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Próximo Cobro</TableHead>
                    <TableHead className="text-right" style={{ width: "180px" }}>Acciones</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => {
                  const typeConfig = getSubscriptionTypeConfig(subscription);
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{subscription.client_name}</p>
                        <p className="text-sm text-muted-foreground">{subscription.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {subscription.reference}
                      </code>
                    </TableCell>
                    <TableCell>{subscription.concept}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeConfig.color}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(subscription.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {frequencyLabels[subscription.frequency]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={statusConfig[subscription.status].className}
                        variant="secondary"
                      >
                        {statusConfig[subscription.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(subscription.next_charge_date).toLocaleDateString('es-PY')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPaymentHistory(subscription)}
                          title="Ver historial de pagos"
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModifyPrice(subscription)}
                          disabled={subscription.status !== 'active'}
                          title="Modificar precio"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEdit(subscription)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modify Price Dialog */}
      {selectedSubscription && (
        <ModifySubscriptionAmountDialog
          subscription={selectedSubscription}
          open={modifyDialogOpen}
          onOpenChange={setModifyDialogOpen}
          onSuccess={loadSubscriptions}
        />
      )}

      {/* New Subscription Dialog */}
      <NewSubscriptionDialog
        open={newSubscriptionDialogOpen}
        onOpenChange={setNewSubscriptionDialogOpen}
        onSuccess={loadSubscriptions}
      />

      {/* View/Edit Subscription Dialog */}
      <ViewEditSubscriptionDialog
        subscription={selectedSubscription}
        open={viewEditDialogOpen}
        onOpenChange={setViewEditDialogOpen}
        onSuccess={loadSubscriptions}
      />

      {/* Payment History Dialog */}
      <PaymentHistoryDialog
        subscription={selectedSubscription}
        open={paymentHistoryDialogOpen}
        onOpenChange={setPaymentHistoryDialogOpen}
      />
    </div>
  );
}
