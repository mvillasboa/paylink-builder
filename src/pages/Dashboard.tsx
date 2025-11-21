import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { PaymentLinkCard } from "@/components/dashboard/PaymentLinkCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  Plus,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  mockStats,
  mockRevenueData,
  mockPaymentMethods,
  mockLinkStatus,
  mockTransactions,
  mockPaymentLinks,
  mockActivity,
} from "@/data/mockDashboard";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de nuevo, aquí está tu resumen de hoy
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Crear Link de Pago
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos del Mes"
          value={mockStats.revenue.current}
          change={mockStats.revenue.change}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Transacciones"
          value={mockStats.transactions.current}
          change={mockStats.transactions.change}
          icon={CreditCard}
          format="number"
        />
        <StatCard
          title="Tasa de Conversión"
          value={mockStats.conversionRate.current}
          change={mockStats.conversionRate.change}
          icon={TrendingUp}
          format="percentage"
        />
        <StatCard
          title="Clientes Activos"
          value={mockStats.activeClients.current}
          change={mockStats.activeClients.change}
          icon={Users}
          format="number"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ingresos de los últimos 30 días</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="procesados"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Procesados"
                />
                <Line
                  type="monotone"
                  dataKey="pendientes"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Pendientes"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods & Link Status */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Transacciones por Método</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockPaymentMethods}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="transactions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Estado de Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockLinkStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockLinkStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {mockLinkStatus.map((status) => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {status.name}: {status.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transactions & Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transacciones Recientes</CardTitle>
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="completed">Completados</TabsTrigger>
                    <TabsTrigger value="pending">Pendientes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={mockTransactions} compact />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Active Links */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Links Activos</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {mockPaymentLinks.length} links
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPaymentLinks.slice(0, 3).map((link) => (
                <PaymentLinkCard key={link.id} link={link} />
              ))}
              <Button variant="outline" className="w-full">
                Ver Todos los Links
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
