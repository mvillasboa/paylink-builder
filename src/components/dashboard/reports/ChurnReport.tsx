import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { UserX, TrendingDown, AlertCircle, DollarSign } from "lucide-react";
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

// Churn rate evolution
const churnData = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000);
  return {
    month: month.toLocaleDateString('es-MX', { month: 'short' }),
    churnRate: 3.5 + (Math.random() * 2.5 - 1.25),
    canceledSubs: Math.floor(4 + Math.random() * 3),
    totalSubs: Math.floor(85 + Math.random() * 20),
  };
});

// Churn reasons
const churnReasons = [
  { reason: 'Precio elevado', count: 12, percentage: 35, color: 'hsl(var(--destructive))' },
  { reason: 'Cambio de proveedor', count: 8, percentage: 23, color: 'hsl(38, 92%, 50%)' },
  { reason: 'Ya no necesita servicio', count: 7, percentage: 20, color: 'hsl(217, 91%, 60%)' },
  { reason: 'Problemas de calidad', count: 5, percentage: 15, color: 'hsl(271, 76%, 53%)' },
  { reason: 'Otros', count: 3, percentage: 7, color: 'hsl(var(--muted-foreground))' },
];

// Churn by subscription type
const churnByType = [
  { name: 'Limitada-Fijo', churned: 3, total: 28, rate: 10.7, color: 'hsl(217, 91%, 60%)' },
  { name: 'Ilimitada-Fijo', churned: 2, total: 35, rate: 5.7, color: 'hsl(271, 76%, 53%)' },
  { name: 'Ilimitada-Variable', churned: 1, total: 18, rate: 5.6, color: 'hsl(142, 76%, 36%)' },
  { name: 'Limitada-Variable', churned: 1, total: 8, rate: 12.5, color: 'hsl(38, 92%, 50%)' },
];

// At-risk customers
const atRiskCustomers = [
  { name: 'Juan Pérez', type: 'Limitada-Fijo', riskScore: 85, reason: 'Sin actividad 30 días', amount: 2500000 },
  { name: 'María González', type: 'Ilimitada-Variable', riskScore: 72, reason: 'Pagos atrasados', amount: 1800000 },
  { name: 'Carlos López', type: 'Limitada-Variable', riskScore: 68, reason: 'Soporte frecuente', amount: 3200000 },
  { name: 'Ana Martínez', type: 'Ilimitada-Fijo', riskScore: 61, reason: 'Reducción de uso', amount: 950000 },
];

export function ChurnReport() {
  const currentChurnRate = 3.8;
  const previousChurnRate = 4.2;
  const churnChange = ((currentChurnRate - previousChurnRate) / previousChurnRate) * 100;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasa de Cancelación"
          value={currentChurnRate}
          change={churnChange}
          icon={TrendingDown}
          format="percentage"
        />
        <StatCard
          title="Clientes Cancelados (mes)"
          value={7}
          change={-12.5}
          icon={UserX}
          format="number"
        />
        <StatCard
          title="MRR Perdido"
          value={2800000}
          change={-8.3}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Clientes en Riesgo"
          value={4}
          change={25.0}
          icon={AlertCircle}
          format="number"
        />
      </div>

      {/* Churn Rate Trend */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Evolución de la Tasa de Cancelación</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={churnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
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
                  if (name === 'churnRate') return `${value.toFixed(1)}%`;
                  return value;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="churnRate"
                stroke="hsl(var(--destructive))"
                strokeWidth={3}
                name="Tasa de Churn (%)"
                dot={{ fill: 'hsl(var(--destructive))', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="canceledSubs"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Cancelaciones"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Churn Reasons */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Motivos de Cancelación</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={churnReasons}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {churnReasons.map((entry, index) => (
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
              {churnReasons.map((reason) => (
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

        {/* Churn by Type */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Cancelaciones por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={churnByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  angle={-15}
                  textAnchor="end"
                  height={80}
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
                <Bar dataKey="rate" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} name="Tasa de Churn (%)">
                  {churnByType.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {churnByType.map((type) => (
                <div key={type.name} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">{type.name}</p>
                  <p className="text-lg font-bold">{type.churned}/{type.total}</p>
                  <p className="text-xs text-destructive font-medium">{type.rate.toFixed(1)}% churn</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Customers */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Clientes en Riesgo de Cancelación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {atRiskCustomers.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{customer.name}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {customer.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{customer.reason}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Riesgo:</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      customer.riskScore > 75 ? 'bg-destructive/20 text-destructive' :
                      customer.riskScore > 60 ? 'bg-amber-500/20 text-amber-600' :
                      'bg-accent/20 text-accent'
                    }`}>
                      {customer.riskScore}%
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    ₲ {customer.amount.toLocaleString('es-PY')}/mes
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">
                  Acción Recomendada
                </p>
                <p className="text-xs text-muted-foreground">
                  Contacta a estos clientes proactivamente para entender sus necesidades y 
                  ofrecer soluciones antes de que cancelen. El valor mensual en riesgo es de 
                  ₲ {atRiskCustomers.reduce((sum, c) => sum + c.amount, 0).toLocaleString('es-PY')}.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Insights Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent mb-1">Mejora del Mes</p>
              <p className="text-2xl font-bold">{Math.abs(churnChange).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reducción en tasa de churn
              </p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-1">Principal Motivo</p>
              <p className="text-lg font-bold">Precio Alto</p>
              <p className="text-xs text-muted-foreground mt-1">
                35% de las cancelaciones
              </p>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm font-medium text-amber-600 mb-1">Mayor Riesgo</p>
              <p className="text-lg font-bold">Limitada-Variable</p>
              <p className="text-xs text-muted-foreground mt-1">
                12.5% de tasa de churn
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
