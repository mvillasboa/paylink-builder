import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { XCircle, AlertTriangle, CreditCard, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Failed transactions over time
const failedTrendsData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
  return {
    date: date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
    failed: Math.floor(Math.random() * 8) + 2,
    total: Math.floor(Math.random() * 50) + 30,
    rate: 0,
  };
}).map(d => ({ ...d, rate: ((d.failed / d.total) * 100) }));

// Failure reasons
const failureReasons = [
  { reason: 'Fondos insuficientes', count: 18, percentage: 40, color: 'hsl(var(--destructive))' },
  { reason: 'Tarjeta expirada', count: 12, percentage: 27, color: 'hsl(38, 92%, 50%)' },
  { reason: 'Tarjeta rechazada', count: 8, percentage: 18, color: 'hsl(271, 76%, 53%)' },
  { reason: 'Error del banco', count: 5, percentage: 11, color: 'hsl(217, 91%, 60%)' },
  { reason: 'Otros', count: 2, percentage: 4, color: 'hsl(var(--muted-foreground))' },
];

// Failed by payment method
const failedByMethod = [
  { method: 'Visa', failed: 15, total: 142, rate: 10.6, color: 'hsl(217, 91%, 60%)' },
  { method: 'Mastercard', failed: 12, total: 89, rate: 13.5, color: 'hsl(271, 76%, 53%)' },
  { method: 'AmEx', failed: 8, total: 34, rate: 23.5, color: 'hsl(142, 76%, 36%)' },
  { method: 'Débito', failed: 10, total: 58, rate: 17.2, color: 'hsl(38, 92%, 50%)' },
];

// Recent failed transactions
const recentFailed = [
  {
    id: 'TRX-00287',
    client: { name: 'Roberto Silva', email: 'roberto.silva@email.com' },
    amount: 4500000,
    method: 'Visa',
    reason: 'Fondos insuficientes',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    attempts: 1,
  },
  {
    id: 'TRX-00283',
    client: { name: 'Laura Hernández', email: 'laura.h@email.com' },
    amount: 1200000,
    method: 'Mastercard',
    reason: 'Tarjeta expirada',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    attempts: 2,
  },
  {
    id: 'TRX-00279',
    client: { name: 'Diego Ramírez', email: 'diego.r@email.com' },
    amount: 3200000,
    method: 'American Express',
    reason: 'Tarjeta rechazada',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    attempts: 3,
  },
  {
    id: 'TRX-00275',
    client: { name: 'Carmen Flores', email: 'carmen.flores@email.com' },
    amount: 950000,
    method: 'Débito',
    reason: 'Error del banco',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    attempts: 1,
  },
  {
    id: 'TRX-00271',
    client: { name: 'Miguel Torres', email: 'miguel.t@email.com' },
    amount: 2100000,
    method: 'Visa',
    reason: 'Fondos insuficientes',
    date: new Date(Date.now() - 36 * 60 * 60 * 1000),
    attempts: 2,
  },
];

export function FailedTransactionsReport() {
  const totalFailed = 45;
  const totalTransactions = 323;
  const failureRate = (totalFailed / totalTransactions) * 100;
  const lostRevenue = 12450000;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasa de Fallo"
          value={failureRate.toFixed(1)}
          change={-8.2}
          icon={TrendingDown}
          format="percentage"
        />
        <StatCard
          title="Transacciones Fallidas"
          value={totalFailed}
          change={-12.5}
          icon={XCircle}
          format="number"
        />
        <StatCard
          title="Ingresos Perdidos"
          value={lostRevenue}
          change={-15.3}
          icon={CreditCard}
          format="currency"
        />
        <StatCard
          title="Pendientes de Reintento"
          value={18}
          change={5.9}
          icon={AlertTriangle}
          format="number"
        />
      </div>

      {/* Failed Transactions Trend */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Tendencia de Fallos - Últimos 30 Días</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={failedTrendsData}>
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
                formatter={(value: number, name: string) => {
                  if (name === 'rate') return `${value.toFixed(1)}%`;
                  return value;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="hsl(var(--destructive))"
                strokeWidth={3}
                name="Transacciones Fallidas"
                dot={{ fill: 'hsl(var(--destructive))', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(38, 92%, 50%)"
                strokeWidth={2}
                name="Tasa de Fallo (%)"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Failure Reasons */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Motivos de Fallo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={failureReasons}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {failureReasons.map((entry, index) => (
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
            <div className="space-y-2 mt-4">
              {failureReasons.map((reason) => (
                <div key={reason.reason} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: reason.color }}
                    />
                    <span className="text-sm">{reason.reason}</span>
                  </div>
                  <span className="text-sm font-bold">{reason.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Failed by Method */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Fallos por Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={failedByMethod}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="method"
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
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Bar dataKey="rate" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} name="Tasa de Fallo (%)">
                  {failedByMethod.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {failedByMethod.map((method) => (
                <div key={method.method} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">{method.method}</p>
                  <p className="text-lg font-bold">{method.failed}/{method.total}</p>
                  <p className="text-xs text-destructive font-medium">{method.rate.toFixed(1)}% fallo</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Failed Transactions */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Transacciones Fallidas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFailed.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      {transaction.id}
                    </span>
                    <Badge variant="outline" className="bg-card">
                      {transaction.method}
                    </Badge>
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                      {transaction.attempts} {transaction.attempts === 1 ? 'intento' : 'intentos'}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-1">{transaction.client.name}</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    {transaction.client.email}
                  </p>
                  <p className="text-xs text-destructive font-medium">
                    Motivo: {transaction.reason}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-lg font-bold">
                    ₲ {transaction.amount.toLocaleString('es-PY')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(transaction.date, { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Insights y Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent mb-1">Mejora del Mes</p>
              <p className="text-2xl font-bold">-8.2%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reducción en tasa de fallo
              </p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-1">Principal Causa</p>
              <p className="text-lg font-bold">Fondos Insuf.</p>
              <p className="text-xs text-muted-foreground mt-1">
                40% de los fallos
              </p>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm font-medium text-amber-600 mb-1">Mayor Tasa de Fallo</p>
              <p className="text-lg font-bold">American Express</p>
              <p className="text-xs text-muted-foreground mt-1">
                23.5% de tasa de fallo
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary mb-1">
                  Acciones Recomendadas
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Implementar sistema de reintento automático para fondos insuficientes (esperar 3-5 días)</li>
                  <li>• Enviar notificaciones proactivas cuando las tarjetas estén próximas a expirar</li>
                  <li>• Analizar mayor tasa de fallo en AmEx y considerar validaciones adicionales</li>
                  <li>• Contactar a clientes con múltiples intentos fallidos para actualizar método de pago</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
