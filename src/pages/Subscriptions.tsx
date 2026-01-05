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
import { 
  Search, 
  Edit3, 
  Eye, 
  Plus, 
  Receipt, 
  TrendingUp, 
  Infinity, 
  Calendar, 
  Clock, 
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { Subscription } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModifySubscriptionAmountDialog } from "@/components/subscriptions/ModifySubscriptionAmountDialog";
import { NewSubscriptionDialog } from "@/components/subscriptions/NewSubscriptionDialog";
import { ViewEditSubscriptionDialog } from "@/components/subscriptions/ViewEditSubscriptionDialog";
import { PaymentHistoryDialog } from "@/components/subscriptions/PaymentHistoryDialog";
import { ExportDropdown } from "@/components/ExportDropdown";
import { ExportColumn } from "@/lib/utils/export";

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
    contract_status: "ACTIVE",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
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
    contract_status: "ACTIVE",
    billing_status: "PAST_DUE",
    outstanding_amount: 280000,
    outstanding_cycles: 1,
    consecutive_failed_charges: 2,
    recovery_attempts: 1,
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
    contract_status: "ACTIVE",
    billing_status: "RECOVERY",
    outstanding_amount: 900000,
    outstanding_cycles: 2,
    consecutive_failed_charges: 3,
    recovery_attempts: 2,
    recovery_started_at: "2024-11-20T00:00:00Z",
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
    contract_status: "CANCELLED",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
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
    contract_status: "PAUSED",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
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
    paused_at: "2024-11-01T00:00:00Z",
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
    contract_status: "ACTIVE",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
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
    contract_status: "CANCELLED",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
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
    cancelled_at: "2024-10-15T00:00:00Z",
    cancelled_reason: "Cliente solicitó cancelación",
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
    contract_status: "ACTIVE",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
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
  },
];

const ITEMS_PER_PAGE = 25;

const subscriptionColumns: ExportColumn[] = [
  { label: 'ID Suscripción', key: 'reference' },
  { label: 'Cliente', key: 'client_name' },
  { label: 'Email', key: 'client_email' },
  { label: 'Concepto', key: 'concept' },
  { label: 'Monto', key: 'amount', formatter: (amount: number) => formatCurrency(amount) },
  { 
    label: 'Frecuencia', 
    key: 'frequency', 
    formatter: (freq: string) => {
      const labels: Record<string, string> = {
        weekly: 'Semanal',
        monthly: 'Mensual',
        quarterly: 'Trimestral',
        yearly: 'Anual',
      };
      return labels[freq] || freq;
    }
  },
  { 
    label: 'Tipo de Suscripción', 
    key: 'type', 
    formatter: (value: any, row?: any) => {
      const type = typeof value === 'string' ? value : row?.type;
      const durationType = row?.duration_type;
      const isFixed = type === 'fixed';
      const isUnlimited = durationType === 'unlimited';
      if (type === 'single') return 'Pago Único';
      if (isFixed && isUnlimited) return 'Ilimitada - Fijo';
      if (isFixed && !isUnlimited) return 'Limitada - Fijo';
      if (!isFixed && isUnlimited) return 'Ilimitada - Variable';
      return 'Limitada - Variable';
    }
  },
  { 
    label: 'Estado', 
    key: 'status', 
    formatter: (status: string) => {
      const labels: Record<string, string> = {
        active: 'Activa',
        paused: 'Pausada',
        cancelled: 'Cancelada',
        expired: 'Expirada',
        trial: 'Prueba',
      };
      return labels[status] || status;
    }
  },
  { 
    label: 'Próximo Cobro', 
    key: 'next_charge_date', 
    formatter: (date: string) => format(new Date(date), 'dd/MM/yyyy', { locale: es }) 
  },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
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

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.client_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesFrequency = frequencyFilter === "all" || sub.frequency === frequencyFilter;
    
    const matchesType = (() => {
      if (typeFilter === "all") return true;
      if (typeFilter === "fixed-unlimited") return sub.type === "fixed" && sub.duration_type === "unlimited";
      if (typeFilter === "fixed-limited") return sub.type === "fixed" && sub.duration_type === "limited";
      if (typeFilter === "variable-unlimited") return sub.type === "variable" && sub.duration_type === "unlimited";
      if (typeFilter === "variable-limited") return sub.type === "variable" && sub.duration_type === "limited";
      if (typeFilter === "single") return sub.type === "single";
      return true;
    })();

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const nextChargeDate = startOfDay(new Date(sub.next_charge_date));
      
      if (dateFrom && dateTo) {
        return isWithinInterval(nextChargeDate, {
          start: startOfDay(dateFrom),
          end: endOfDay(dateTo),
        });
      }
      
      if (dateFrom) {
        return nextChargeDate >= startOfDay(dateFrom);
      }
      
      if (dateTo) {
        return nextChargeDate <= endOfDay(dateTo);
      }
      
      return true;
    })();

    return matchesSearch && matchesStatus && matchesFrequency && matchesType && matchesDateRange;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);

  // Reset a página 1 cuando cambian los filtros
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

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
        color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
        icon: Infinity,
      };
    }
    if (isUnlimited && !isFixed) {
      return {
        label: 'Ilimitada - Variable',
        color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        icon: TrendingUp,
      };
    }
    return {
      label: 'Limitada - Variable',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
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
        <div className="flex gap-2">
          <ExportDropdown
            data={filteredSubscriptions}
            columns={subscriptionColumns}
            filename="suscripciones"
            title="Reporte de Suscripciones"
            recordCount={filteredSubscriptions.length}
          />
          <Button 
            className="bg-gradient-primary"
            onClick={() => setNewSubscriptionDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Suscripción
          </Button>
        </div>
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
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, referencia o concepto..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange();
                }}
                className="pl-9"
              />
            </div>

            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
                <SelectItem value="trial">Prueba</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={frequencyFilter} 
              onValueChange={(value) => {
                setFrequencyFilter(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las frecuencias</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={typeFilter} 
              onValueChange={(value) => {
                setTypeFilter(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="fixed-unlimited">Ilimitada - Fijo</SelectItem>
                <SelectItem value="fixed-limited">Limitada - Fijo</SelectItem>
                <SelectItem value="variable-unlimited">Ilimitada - Variable</SelectItem>
                <SelectItem value="variable-limited">Limitada - Variable</SelectItem>
                <SelectItem value="single">Único Pago</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por Fecha Desde */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Fecha desde"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => {
                    setDateFrom(date);
                    handleFilterChange();
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Filtro por Fecha Hasta */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Fecha hasta"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => {
                    setDateTo(date);
                    handleFilterChange();
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => dateFrom ? date < dateFrom : false}
                />
              </PopoverContent>
            </Popover>

            {/* Botón para limpiar filtros de fecha */}
            {(dateFrom || dateTo) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateFrom(undefined);
                  setDateTo(undefined);
                  handleFilterChange();
                }}
                className="h-10"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar fechas
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filteredSubscriptions.length} Suscripciones
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Mostrando {startIndex + 1}-{Math.min(endIndex, filteredSubscriptions.length)} de {filteredSubscriptions.length})
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery || statusFilter !== "all" || frequencyFilter !== "all" || typeFilter !== "all" || dateFrom || dateTo
                ? "No se encontraron suscripciones con los filtros aplicados"
                : "No hay suscripciones aún"}
            </div>
          ) : (
            <>
            <div className="rounded-lg border border-border/50 overflow-hidden">
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
                {paginatedSubscriptions.map((subscription) => {
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
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            </>
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
