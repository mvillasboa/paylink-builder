import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { CreditCard, TrendingUp, DollarSign, Percent } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

// Payment method distribution
const methodDistribution = [
  { method: 'Visa', transactions: 142, amount: 358500000, avgTicket: 2524648, color: 'hsl(217, 91%, 60%)' },
  { method: 'Mastercard', transactions: 89, amount: 189200000, avgTicket: 2125843, color: 'hsl(271, 76%, 53%)' },
  { method: 'American Express', transactions: 34, amount: 145800000, avgTicket: 4288235, color: 'hsl(142, 76%, 36%)' },
];

// Success rate by method
const successRates = [
  { method: 'Visa', successRate: 89.4, failureRate: 10.6 },
  { method: 'Mastercard', successRate: 86.5, failureRate: 13.5 },
  { method: 'American Express', successRate: 76.5, failureRate: 23.5 },
];

// Monthly trends by method
const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
  const month = new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000);
  return {
    month: month.toLocaleDateString('es-MX', { month: 'short' }),
    Visa: 120000000 + Math.floor(Math.random() * 40000000),
    Mastercard: 80000000 + Math.floor(Math.random() * 30000000),
    AmEx: 50000000 + Math.floor(Math.random() * 20000000),
  };
});

// Processing time by method
const processingTimes = [
  { method: 'Visa', avgTime: 2.3, p95Time: 4.5 },
  { method: 'Mastercard', avgTime: 2.8, p95Time: 5.2 },
  { method: 'American Express', avgTime: 3.2, p95Time: 6.1 },
];

// Customer preferences
const customerPreferences = [
  { segment: 'Empresas', Visa: 45, Mastercard: 30, AmEx: 25 },
  { segment: 'Profesionales', Visa: 50, Mastercard: 30, AmEx: 20 },
  { segment: 'Individuos', Visa: 40, Mastercard: 40, AmEx: 20 },
];

const COLORS = {
  Visa: 'hsl(217, 91%, 60%)',
  Mastercard: 'hsl(271, 76%, 53%)',
  AmEx: 'hsl(142, 76%, 36%)',
};

export function PaymentMethodReport() {
  const totalTransactions = methodDistribution.reduce((sum, m) => sum + m.transactions, 0);
  const totalAmount = methodDistribution.reduce((sum, m) => sum + m.amount, 0);
  const avgTicket = totalAmount / totalTransactions;
  const visaShare = (methodDistribution[0].transactions / totalTransactions) * 100;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Procesado"
          value={totalAmount}
          change={12.3}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Total Transacciones"
          value={totalTransactions}
          change={8.7}
          icon={CreditCard}
          format="number"
        />
        <StatCard
          title="Ticket Promedio"
          value={avgTicket}
          change={3.2}
          icon={TrendingUp}
          format="currency"
        />
        <StatCard
          title="Método Preferido"
          value={visaShare.toFixed(1)}
          change={2.5}
          icon={Percent}
          format="percentage"
        />
      </div>

      {/* Method Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Distribución por Método</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="transactions"
                  label={({ method, percent }) => `${method}: ${(percent * 100).toFixed(0)}%`}
                >
                  {methodDistribution.map((entry) => (
                    <Cell key={entry.method} fill={entry.color} />
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
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Performance por Método</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {methodDistribution.map((method) => {
                const percentage = (method.transactions / totalTransactions) * 100;
                return (
                  <div key={method.method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: method.color }}
                        />
                        <span className="text-sm font-medium">{method.method}</span>
                      </div>
                      <span className="text-sm font-bold">{method.transactions} txs</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/30 text-center">
                        <p className="text-muted-foreground">Monto</p>
                        <p className="font-bold">₲ {(method.amount / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-2 rounded bg-muted/30 text-center">
                        <p className="text-muted-foreground">Ticket</p>
                        <p className="font-bold">₲ {(method.avgTicket / 1000).toFixed(0)}k</p>
                      </div>
                      <div className="p-2 rounded bg-muted/30 text-center">
                        <p className="text-muted-foreground">Share</p>
                        <p className="font-bold">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Tendencia de Volumen por Método - Últimos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrends}>
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
                formatter={(value: number) => `₲ ${value.toLocaleString('es-PY')}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Visa"
                stroke={COLORS.Visa}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Mastercard"
                stroke={COLORS.Mastercard}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="AmEx"
                stroke={COLORS.AmEx}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Success Rates */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Tasa de Éxito por Método</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={successRates}>
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
                <Legend />
                <Bar dataKey="successRate" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Éxito (%)" />
                <Bar dataKey="failureRate" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} name="Fallo (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Processing Times */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Tiempo de Procesamiento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processingTimes}>
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
                  formatter={(value: number) => `${value.toFixed(1)}s`}
                />
                <Legend />
                <Bar dataKey="avgTime" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Promedio (s)" />
                <Bar dataKey="p95Time" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} name="P95 (s)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">
                <strong>Promedio:</strong> Tiempo típico de procesamiento. 
                <strong className="ml-2">P95:</strong> 95% de transacciones se procesan en este tiempo o menos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Preferences by Segment */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Preferencias por Segmento de Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerPreferences}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="segment"
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
                formatter={(value: number) => `${value}%`}
              />
              <Legend />
              <Bar dataKey="Visa" stackId="a" fill={COLORS.Visa} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Mastercard" stackId="a" fill={COLORS.Mastercard} radius={[0, 0, 0, 0]} />
              <Bar dataKey="AmEx" stackId="a" fill={COLORS.AmEx} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Insights Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(217, 91%, 60%, 0.1)', borderColor: 'hsl(217, 91%, 60%, 0.2)', border: '1px solid' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'hsl(217, 91%, 60%)' }}>Método Dominante</p>
              <p className="text-2xl font-bold">Visa</p>
              <p className="text-xs text-muted-foreground mt-1">
                44% de transacciones, mayor tasa de éxito
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(142, 76%, 36%, 0.1)', borderColor: 'hsl(142, 76%, 36%, 0.2)', border: '1px solid' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'hsl(142, 76%, 36%)' }}>Mayor Ticket</p>
              <p className="text-2xl font-bold">American Express</p>
              <p className="text-xs text-muted-foreground mt-1">
                ₲ 4.3M promedio por transacción
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(217, 91%, 60%, 0.1)', borderColor: 'hsl(217, 91%, 60%, 0.2)', border: '1px solid' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'hsl(217, 91%, 60%)' }}>Más Rápido</p>
              <p className="text-2xl font-bold">Visa</p>
              <p className="text-xs text-muted-foreground mt-1">
                2.3s promedio de procesamiento
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium text-primary mb-2">
              Recomendaciones Estratégicas
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Visa tiene el mejor balance entre volumen, rapidez y tasa de éxito - priorizar como método principal</li>
              <li>• AmEx tiene alto ticket pero baja tasa de éxito - mejorar validaciones para reducir fallos</li>
              <li>• Mastercard muestra estabilidad constante - promover como alternativa secundaria</li>
              <li>• Segmento Empresas prefiere Visa - enfocarse en esta combinación para B2B</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
