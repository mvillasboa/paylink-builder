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
  Calendar as CalendarIcon,
  AlertTriangle,
  CreditCard
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
import { Subscription, ContractStatusLabels, BillingStatusLabels } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModifySubscriptionAmountDialog } from "@/components/subscriptions/ModifySubscriptionAmountDialog";
import { NewSubscriptionDialog } from "@/components/subscriptions/NewSubscriptionDialog";
import { ViewEditSubscriptionDialog } from "@/components/subscriptions/ViewEditSubscriptionDialog";
import { PaymentHistoryDialog } from "@/components/subscriptions/PaymentHistoryDialog";
import { ExportDropdown } from "@/components/ExportDropdown";
import { ExportColumn } from "@/lib/utils/export";
import { ContractStatusBadge } from "@/components/subscriptions/ContractStatusBadge";
import { BillingStatusBadge } from "@/components/subscriptions/BillingStatusBadge";
import { PaymentMethodStatusBadge } from "@/components/subscriptions/PaymentMethodStatusBadge";
import { PaymentMethodStatus } from "@/types/subscription";

// Extended subscription type with mock card data
interface SubscriptionWithCard extends Subscription {
  _mockCardLastFour?: string;
  _mockCardStatus?: PaymentMethodStatus;
}

// Mock data for demonstration - Various state combinations
const MOCK_SUBSCRIPTIONS: SubscriptionWithCard[] = [
  // 1. Activa y al día - Caso ideal
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
    _mockCardLastFour: "4532",
    _mockCardStatus: "VALID",
  },
  // 2. Activa con deuda leve (PAST_DUE) - 1 ciclo pendiente
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
    _mockCardLastFour: "8901",
    _mockCardStatus: "TEMPORARILY_INVALID",
  },
  // 3. Activa en mora grave (DELINQUENT) - Múltiples ciclos
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
    billing_status: "DELINQUENT",
    outstanding_amount: 1350000,
    outstanding_cycles: 3,
    consecutive_failed_charges: 5,
    recovery_attempts: 0,
    next_charge_date: "2025-12-15T00:00:00Z",
    first_charge_type: "immediate",
    first_payment_amount: 450000,
    created_at: "2024-03-10T00:00:00Z",
    updated_at: "2024-03-10T00:00:00Z",
    payments_completed: 6,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-09-15T00:00:00Z",
    _mockCardLastFour: "2345",
    _mockCardStatus: "TEMPORARILY_INVALID",
  },
  // 4. Activa en recuperación (RECOVERY) - Intento de recuperar deuda
  {
    id: "mock-4",
    user_id: "demo",
    client_name: "Pedro Giménez",
    client_email: "pedro.gimenez@email.com",
    phone_number: "+595984567890",
    reference: "SUB-004",
    concept: "Agua Potable",
    description: "Servicio de agua corriente",
    amount: 120000,
    type: "variable",
    frequency: "monthly",
    billing_day: 20,
    duration_type: "unlimited",
    status: "active",
    contract_status: "ACTIVE",
    billing_status: "RECOVERY",
    outstanding_amount: 360000,
    outstanding_cycles: 3,
    consecutive_failed_charges: 4,
    recovery_attempts: 2,
    recovery_started_at: "2024-11-20T00:00:00Z",
    next_charge_date: "2025-12-20T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-11-20T00:00:00Z",
    payments_completed: 8,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-08-20T00:00:00Z",
    _mockCardLastFour: "6789",
    _mockCardStatus: "VALID",
  },
  // 5. Activa pero cobro suspendido (SUSPENDED) - Tarjeta inválida
  {
    id: "mock-5",
    user_id: "demo",
    client_name: "Laura Méndez",
    client_email: "laura.mendez@email.com",
    phone_number: "+595985678901",
    reference: "SUB-005",
    concept: "Club Deportivo",
    description: "Membresía mensual club deportivo",
    amount: 550000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 1,
    duration_type: "unlimited",
    status: "active",
    contract_status: "ACTIVE",
    billing_status: "SUSPENDED",
    outstanding_amount: 1100000,
    outstanding_cycles: 2,
    consecutive_failed_charges: 6,
    recovery_attempts: 3,
    next_charge_date: "2026-01-01T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-11-15T00:00:00Z",
    payments_completed: 7,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-09-01T00:00:00Z",
    _mockCardLastFour: "1111",
    _mockCardStatus: "INVALID",
  },
  // 6. Pausada y al día - Pausa voluntaria
  {
    id: "mock-6",
    user_id: "demo",
    client_name: "Lucía Martínez",
    client_email: "lucia.martinez@email.com",
    phone_number: "+595986789012",
    reference: "SUB-006",
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
    _mockCardLastFour: "5555",
    _mockCardStatus: "VALID",
  },
  // 7. Pausada con deuda pendiente - Caso especial
  {
    id: "mock-7",
    user_id: "demo",
    client_name: "Miguel Ángel Torres",
    client_email: "miguel.torres@email.com",
    phone_number: "+595987890123",
    reference: "SUB-007",
    concept: "Seguro de Auto",
    description: "Seguro vehicular mensual",
    amount: 380000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 5,
    duration_type: "unlimited",
    status: "paused",
    contract_status: "PAUSED",
    billing_status: "PAST_DUE",
    outstanding_amount: 380000,
    outstanding_cycles: 1,
    consecutive_failed_charges: 2,
    recovery_attempts: 0,
    next_charge_date: "2026-01-05T00:00:00Z",
    first_charge_type: "immediate",
    allow_pause: true,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-11-10T00:00:00Z",
    payments_completed: 7,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    price_change_history_count: 0,
    last_charge_date: "2024-10-05T00:00:00Z",
    paused_at: "2024-11-10T00:00:00Z",
    _mockCardLastFour: "7777",
    _mockCardStatus: "TEMPORARILY_INVALID",
  },
  // 8. Cancelada al día - Cancelación voluntaria sin deuda
  {
    id: "mock-8",
    user_id: "demo",
    client_name: "Sofía López",
    client_email: "sofia.lopez@email.com",
    phone_number: "+595988901234",
    reference: "SUB-008",
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
    _mockCardLastFour: "9999",
    _mockCardStatus: "VALID",
  },
  // 9. Cancelada con deuda - Cancelación por mora
  {
    id: "mock-9",
    user_id: "demo",
    client_name: "Roberto Acosta",
    client_email: "roberto.acosta@email.com",
    phone_number: "+595989012345",
    reference: "SUB-009",
    concept: "Hosting Web",
    description: "Servicio de hosting y dominio",
    amount: 180000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 15,
    duration_type: "unlimited",
    status: "cancelled",
    contract_status: "CANCELLED",
    billing_status: "DELINQUENT",
    outstanding_amount: 540000,
    outstanding_cycles: 3,
    consecutive_failed_charges: 8,
    recovery_attempts: 4,
    next_charge_date: "2025-12-15T00:00:00Z",
    last_charge_date: "2024-08-15T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-11-20T00:00:00Z",
    payments_completed: 6,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    cancelled_at: "2024-11-20T00:00:00Z",
    cancelled_reason: "Cancelada por mora prolongada",
    _mockCardLastFour: "3333",
    _mockCardStatus: "INVALID",
  },
  // 10. En período de prueba - Trial activo
  {
    id: "mock-10",
    user_id: "demo",
    client_name: "Fernando Gómez",
    client_email: "fernando.gomez@email.com",
    phone_number: "+595980123456",
    reference: "SUB-010",
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
    next_charge_date: "2026-01-15T00:00:00Z",
    first_charge_type: "scheduled",
    first_charge_date: "2026-01-15T00:00:00Z",
    created_at: "2024-12-15T00:00:00Z",
    updated_at: "2024-12-15T00:00:00Z",
    payments_completed: 0,
    is_first_payment_completed: false,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    _mockCardLastFour: "4444",
    _mockCardStatus: "VALID",
  },
  // 11. Suscripción limitada activa - Progreso de pagos
  {
    id: "mock-11",
    user_id: "demo",
    client_name: "Diego Fernández",
    client_email: "diego.fernandez@email.com",
    phone_number: "+595981234568",
    reference: "SUB-011",
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
    next_charge_date: "2026-01-01T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-12-01T00:00:00Z",
    _mockCardLastFour: "2222",
    _mockCardStatus: "VALID",
  },
  // 12. Suscripción limitada expirada - Completó todos los pagos
  {
    id: "mock-12",
    user_id: "demo",
    client_name: "Valentina Ruiz",
    client_email: "valentina.ruiz@email.com",
    phone_number: "+595982345679",
    reference: "SUB-012",
    concept: "Curso de Marketing",
    description: "6 cuotas de capacitación profesional",
    amount: 450000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 10,
    duration_type: "limited",
    number_of_payments: 6,
    payments_completed: 6,
    status: "expired",
    contract_status: "CANCELLED",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
    next_charge_date: "2024-10-10T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-04-10T00:00:00Z",
    updated_at: "2024-10-10T00:00:00Z",
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: false,
    allow_pause: false,
    price_change_history_count: 0,
    last_charge_date: "2024-09-10T00:00:00Z",
    expired_at: "2024-10-10T00:00:00Z",
    _mockCardLastFour: "6666",
    _mockCardStatus: "VALID",
  },
  // 13. Suscripción variable activa - Monto puede variar
  {
    id: "mock-13",
    user_id: "demo",
    client_name: "Camila Paredes",
    client_email: "camila.paredes@email.com",
    phone_number: "+595983456780",
    reference: "SUB-013",
    concept: "Consumo de Luz",
    description: "Facturación variable según consumo mensual",
    amount: 320000,
    type: "variable",
    frequency: "monthly",
    billing_day: 25,
    duration_type: "unlimited",
    status: "active",
    contract_status: "ACTIVE",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
    next_charge_date: "2026-01-25T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-06-25T00:00:00Z",
    updated_at: "2024-12-25T00:00:00Z",
    payments_completed: 6,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 3,
    last_charge_date: "2024-12-25T00:00:00Z",
    last_price_change_date: "2024-12-01T00:00:00Z",
    _mockCardLastFour: "8888",
    _mockCardStatus: "VALID",
  },
  // 14. Activa con cambio de precio pendiente
  {
    id: "mock-14",
    user_id: "demo",
    client_name: "Andrés Villalba",
    client_email: "andres.villalba@email.com",
    phone_number: "+595984567891",
    reference: "SUB-014",
    concept: "Plan Celular",
    description: "Plan de telefonía móvil postpago",
    amount: 150000,
    type: "fixed",
    frequency: "monthly",
    billing_day: 8,
    duration_type: "unlimited",
    status: "active",
    contract_status: "ACTIVE",
    billing_status: "IN_GOOD_STANDING",
    outstanding_amount: 0,
    outstanding_cycles: 0,
    consecutive_failed_charges: 0,
    recovery_attempts: 0,
    next_charge_date: "2026-01-08T00:00:00Z",
    first_charge_type: "immediate",
    created_at: "2024-02-08T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
    payments_completed: 10,
    is_first_payment_completed: true,
    trial_period_days: 0,
    send_reminder_before_charge: true,
    allow_pause: false,
    price_change_history_count: 1,
    last_charge_date: "2024-12-08T00:00:00Z",
    pending_price_change_id: "price-change-001",
    _mockCardLastFour: "1234",
    _mockCardStatus: "VALID",
  },
  // 15. Suscripción única completada
  {
    id: "mock-15",
    user_id: "demo",
    client_name: "Patricia Núñez",
    client_email: "patricia.nunez@email.com",
    phone_number: "+595985678902",
    reference: "SUB-015",
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
    _mockCardLastFour: "0000",
    _mockCardStatus: "VALID",
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
    label: 'Estado Suscripción', 
    key: 'contract_status', 
    formatter: (status: string) => ContractStatusLabels[status as keyof typeof ContractStatusLabels] || status
  },
  { 
    label: 'Estado Pago', 
    key: 'billing_status', 
    formatter: (status: string) => BillingStatusLabels[status as keyof typeof BillingStatusLabels] || status
  },
  { 
    label: 'Deuda Pendiente', 
    key: 'outstanding_amount', 
    formatter: (amount: number) => amount > 0 ? formatCurrency(amount) : '-'
  },
  { 
    label: 'Próximo Cobro', 
    key: 'next_charge_date', 
    formatter: (date: string) => format(new Date(date), 'dd/MM/yyyy', { locale: es }) 
  },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithCard[]>([]);
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

    // Match contract status filter
    const matchesStatus = statusFilter === "all" || sub.contract_status === statusFilter;
    
    // Match billing status filter (uses typeFilter with billing_ prefix)
    const matchesBillingStatus = (() => {
      if (!typeFilter.startsWith("billing_")) return true;
      const billingFilter = typeFilter.replace("billing_", "");
      return sub.billing_status === billingFilter;
    })();
    
    const matchesFrequency = frequencyFilter === "all" || sub.frequency === frequencyFilter;
    
    const matchesType = (() => {
      if (typeFilter === "all" || typeFilter.startsWith("billing_")) return true;
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

    return matchesSearch && matchesStatus && matchesBillingStatus && matchesFrequency && matchesType && matchesDateRange;
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Suscripciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter(s => s.contract_status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Al Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {subscriptions.filter(s => s.contract_status === 'ACTIVE' && s.billing_status === 'IN_GOOD_STANDING').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Con Deuda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {subscriptions.filter(s => s.contract_status === 'ACTIVE' && (s.billing_status === 'PAST_DUE' || s.billing_status === 'DELINQUENT')).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(
                subscriptions
                  .filter(s => s.contract_status === 'ACTIVE' && (s.billing_status === 'PAST_DUE' || s.billing_status === 'DELINQUENT'))
                  .reduce((sum, s) => sum + (s.outstanding_amount || 0), 0)
              )} pendiente
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              MRR Activo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                subscriptions
                  .filter(s => s.contract_status === 'ACTIVE' && s.frequency === 'monthly')
                  .reduce((sum, s) => sum + s.amount, 0)
              )}
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
                <SelectValue placeholder="Estado Suscripción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="ACTIVE">Activa</SelectItem>
                <SelectItem value="PAUSED">Pausada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={typeFilter === "billing" ? "all" : (typeFilter.startsWith("billing_") ? typeFilter.replace("billing_", "") : "all")} 
              onValueChange={(value) => {
                setTypeFilter(value === "all" ? "all" : `billing_${value}`);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <CreditCard className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los pagos</SelectItem>
                <SelectItem value="IN_GOOD_STANDING">Al día</SelectItem>
                <SelectItem value="PAST_DUE">Con deuda</SelectItem>
                <SelectItem value="DELINQUENT">En mora</SelectItem>
                <SelectItem value="RECOVERY">En recuperación</SelectItem>
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
                    <TableHead>Monto</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Suscripción</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Tarjeta</TableHead>
                    <TableHead>Deuda</TableHead>
                    <TableHead>Próximo Cobro</TableHead>
                    <TableHead className="text-right" style={{ width: "150px" }}>Acciones</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscriptions.map((subscription: SubscriptionWithCard) => {
                  const hasDebt = (subscription.outstanding_amount || 0) > 0;
                  const cardStatus = subscription._mockCardStatus || "VALID";
                  
                  return (
                  <TableRow key={subscription.id} className={hasDebt ? "bg-amber-500/5" : ""}>
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
                    <TableCell className="font-semibold">
                      {formatCurrency(subscription.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {frequencyLabels[subscription.frequency]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ContractStatusBadge status={subscription.contract_status || "ACTIVE"} size="sm" />
                    </TableCell>
                    <TableCell>
                      <BillingStatusBadge status={subscription.billing_status || "IN_GOOD_STANDING"} size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-mono text-muted-foreground">
                          •••• {subscription._mockCardLastFour || "----"}
                        </p>
                        <PaymentMethodStatusBadge status={cardStatus} size="sm" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {hasDebt ? (
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                            {formatCurrency(subscription.outstanding_amount || 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subscription.outstanding_cycles || 0} ciclo(s)
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
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
                          disabled={subscription.contract_status !== 'ACTIVE'}
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
