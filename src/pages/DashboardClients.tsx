import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
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
import { formatCurrency } from "@/lib/utils/currency";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ExportDropdown } from "@/components/ExportDropdown";
import { ExportColumn } from "@/lib/utils/export";

type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired";

type ClientSubscription = {
  id: string;
  concept: string;
  amount: number;
  frequency: string;
  status: SubscriptionStatus;
  nextChargeDate?: string;
  startDate: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  subscriptions: ClientSubscription[];
};

// Mock data
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+595 981 234 567",
    joinDate: "2024-01-15",
    subscriptions: [
      {
        id: "sub-1",
        concept: "Gimnasio Premium",
        amount: 350000,
        frequency: "Mensual",
        status: "active",
        nextChargeDate: "2025-12-05",
        startDate: "2024-01-15",
      },
      {
        id: "sub-2",
        concept: "Clases de Yoga",
        amount: 180000,
        frequency: "Mensual",
        status: "active",
        nextChargeDate: "2025-12-10",
        startDate: "2024-03-01",
      },
    ],
  },
  {
    id: "2",
    name: "Carlos Benítez",
    email: "carlos.benitez@email.com",
    phone: "+595 982 345 678",
    joinDate: "2024-02-20",
    subscriptions: [
      {
        id: "sub-3",
        concept: "Plan Internet Fibra",
        amount: 280000,
        frequency: "Mensual",
        status: "active",
        nextChargeDate: "2025-12-10",
        startDate: "2024-02-20",
      },
    ],
  },
  {
    id: "3",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    phone: "+595 983 456 789",
    joinDate: "2024-03-10",
    subscriptions: [
      {
        id: "sub-4",
        concept: "Servicio Eléctrico",
        amount: 450000,
        frequency: "Mensual",
        status: "active",
        nextChargeDate: "2025-12-15",
        startDate: "2024-03-10",
      },
      {
        id: "sub-5",
        concept: "Plan Premium TV",
        amount: 120000,
        frequency: "Mensual",
        status: "paused",
        startDate: "2024-05-01",
      },
    ],
  },
  {
    id: "4",
    name: "Roberto Silva",
    email: "roberto.silva@email.com",
    phone: "+595 984 567 890",
    joinDate: "2024-01-01",
    subscriptions: [
      {
        id: "sub-6",
        concept: "Membresía Club Deportivo",
        amount: 2500000,
        frequency: "Anual",
        status: "expired",
        startDate: "2024-01-01",
      },
    ],
  },
  {
    id: "5",
    name: "Lucía Martínez",
    email: "lucia.martinez@email.com",
    phone: "+595 985 678 901",
    joinDate: "2024-04-15",
    subscriptions: [
      {
        id: "sub-7",
        concept: "Streaming Premium",
        amount: 45000,
        frequency: "Mensual",
        status: "paused",
        nextChargeDate: "2025-12-20",
        startDate: "2024-04-15",
      },
      {
        id: "sub-8",
        concept: "Cloud Storage Pro",
        amount: 75000,
        frequency: "Mensual",
        status: "cancelled",
        startDate: "2024-06-01",
      },
    ],
  },
  {
    id: "6",
    name: "Diego Fernández",
    email: "diego.fernandez@email.com",
    phone: "+595 986 789 012",
    joinDate: "2024-04-01",
    subscriptions: [
      {
        id: "sub-9",
        concept: "Clases de Inglés Online",
        amount: 600000,
        frequency: "Mensual",
        status: "active",
        nextChargeDate: "2025-12-01",
        startDate: "2024-04-01",
      },
    ],
  },
  {
    id: "7",
    name: "Sofía López",
    email: "sofia.lopez@email.com",
    phone: "+595 987 890 123",
    joinDate: "2024-01-01",
    subscriptions: [
      {
        id: "sub-10",
        concept: "Software Empresarial",
        amount: 850000,
        frequency: "Mensual",
        status: "cancelled",
        startDate: "2024-01-01",
      },
      {
        id: "sub-11",
        concept: "Consultoría Mensual",
        amount: 1200000,
        frequency: "Mensual",
        status: "active",
        nextChargeDate: "2025-12-05",
        startDate: "2024-10-01",
      },
    ],
  },
];

const ITEMS_PER_PAGE = 25;

const clientColumns: ExportColumn[] = [
  { label: 'ID Cliente', key: 'id' },
  { label: 'Nombre', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Teléfono', key: 'phone' },
  { 
    label: 'Fecha de Registro', 
    key: 'joinDate', 
    formatter: (date: string) => format(new Date(date), 'dd/MM/yyyy', { locale: es }) 
  },
  { 
    label: 'Suscripciones Activas', 
    key: 'subscriptions', 
    formatter: (subs: ClientSubscription[]) => subs.filter(s => s.status === 'active').length.toString()
  },
  { 
    label: 'Suscripciones Totales', 
    key: 'subscriptions', 
    formatter: (subs: ClientSubscription[]) => subs.length.toString()
  },
  { 
    label: 'Ingresos Mensuales', 
    key: 'subscriptions', 
    formatter: (subs: ClientSubscription[]) => {
      const mrr = subs
        .filter(s => s.status === 'active' && s.frequency === 'Mensual')
        .reduce((sum, s) => sum + s.amount, 0);
      return formatCurrency(mrr);
    }
  },
];

export default function DashboardClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filteredClients = MOCK_CLIENTS.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = (() => {
      if (statusFilter === "all") return true;
      const stats = getSubscriptionStats(client.subscriptions);
      if (statusFilter === "active") return stats.active > 0;
      if (statusFilter === "paused") return stats.paused > 0;
      if (statusFilter === "no-active") return stats.active === 0;
      return true;
    })();

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const joinDate = startOfDay(new Date(client.joinDate));
      
      if (dateFrom && dateTo) {
        return isWithinInterval(joinDate, {
          start: startOfDay(dateFrom),
          end: endOfDay(dateTo),
        });
      }
      
      if (dateFrom) {
        return joinDate >= startOfDay(dateFrom);
      }
      
      if (dateTo) {
        return joinDate <= endOfDay(dateTo);
      }
      
      return true;
    })();

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  // Reset a página 1 cuando cambian los filtros
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSubscriptionStats = (subscriptions: ClientSubscription[]) => {
    return {
      active: subscriptions.filter((s) => s.status === "active").length,
      paused: subscriptions.filter((s) => s.status === "paused").length,
      cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
      expired: subscriptions.filter((s) => s.status === "expired").length,
    };
  };

  const getTotalMonthlyRevenue = (subscriptions: ClientSubscription[]) => {
    return subscriptions
      .filter((s) => s.status === "active" && s.frequency === "Mensual")
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const statusConfig = {
    active: {
      label: "Activa",
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      icon: TrendingUp,
    },
    paused: {
      label: "Pausada",
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      icon: Clock,
    },
    cancelled: {
      label: "Cancelada",
      color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
      icon: XCircle,
    },
    expired: {
      label: "Expirada",
      color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30",
      icon: XCircle,
    },
  };

  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu base de clientes y sus suscripciones
          </p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            data={filteredClients}
            columns={clientColumns}
            filename="clientes"
            title="Reporte de Clientes"
            recordCount={filteredClients.length}
          />
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Cliente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_CLIENTS.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Suscripciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {MOCK_CLIENTS.reduce(
                (sum, client) =>
                  sum +
                  client.subscriptions.filter((s) => s.status === "active").length,
                0
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pausadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {MOCK_CLIENTS.reduce(
                (sum, client) =>
                  sum +
                  client.subscriptions.filter((s) => s.status === "paused").length,
                0
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {MOCK_CLIENTS.reduce(
                (sum, client) =>
                  sum +
                  client.subscriptions.filter(
                    (s) => s.status === "cancelled" || s.status === "expired"
                  ).length,
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>

            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[220px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado de suscripción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Con activas</SelectItem>
                <SelectItem value="paused">Con pausadas</SelectItem>
                <SelectItem value="no-active">Sin suscripciones activas</SelectItem>
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
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Registro desde"}
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
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Registro hasta"}
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

      {/* Clients List */}
      <div className="grid gap-4">
        {paginatedClients.length === 0 ? (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-12 text-center text-muted-foreground">
              No se encontraron clientes con los filtros aplicados
            </CardContent>
          </Card>
        ) : (
          paginatedClients.map((client, index) => {
          const stats = getSubscriptionStats(client.subscriptions);
          const isExpanded = expandedClient === client.id;
          const avatarColor = avatarColors[index % avatarColors.length];

          return (
            <Card
              key={client.id}
              className="border-border/50 bg-card/50 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className={`h-12 w-12 ${avatarColor}`}>
                    <AvatarFallback className="text-white font-semibold">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Client Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {client.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Cliente desde{" "}
                              {new Date(client.joinDate).toLocaleDateString("es-PY")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Ingresos Mensuales
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(getTotalMonthlyRevenue(client.subscriptions))}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Subscription Stats */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Suscripciones:
                      </span>
                      {stats.active > 0 && (
                        <Badge
                          variant="outline"
                          className={statusConfig.active.color}
                        >
                          {stats.active} Activa{stats.active > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {stats.paused > 0 && (
                        <Badge
                          variant="outline"
                          className={statusConfig.paused.color}
                        >
                          {stats.paused} Pausada{stats.paused > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {stats.cancelled > 0 && (
                        <Badge
                          variant="outline"
                          className={statusConfig.cancelled.color}
                        >
                          {stats.cancelled} Cancelada{stats.cancelled > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {stats.expired > 0 && (
                        <Badge
                          variant="outline"
                          className={statusConfig.expired.color}
                        >
                          {stats.expired} Expirada{stats.expired > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        setExpandedClient(isExpanded ? null : client.id)
                      }
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Ocultar Detalles
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Ver Detalles de Suscripciones
                        </>
                      )}
                    </Button>

                    {/* Expanded Subscription Details */}
                    {isExpanded && (
                      <div className="pt-3 space-y-2 animate-fade-in">
                        {client.subscriptions.map((subscription) => {
                          const StatusIcon = statusConfig[subscription.status].icon;
                          return (
                            <div
                              key={subscription.id}
                              className="p-3 rounded-lg border border-border/50 bg-background/50"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <StatusIcon className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="font-medium text-foreground">
                                      {subscription.concept}
                                    </h4>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <span>
                                      Frecuencia: {subscription.frequency}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      Inicio:{" "}
                                      {new Date(
                                        subscription.startDate
                                      ).toLocaleDateString("es-PY")}
                                    </span>
                                    {subscription.nextChargeDate && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          Próximo cobro:{" "}
                                          {new Date(
                                            subscription.nextChargeDate
                                          ).toLocaleDateString("es-PY")}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  <p className="text-base font-semibold text-foreground">
                                    {formatCurrency(subscription.amount)}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      statusConfig[subscription.status].color
                                    } text-xs`}
                                  >
                                    {statusConfig[subscription.status].label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} · Mostrando {paginatedClients.length} de {filteredClients.length} clientes
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
    </div>
  );
}
