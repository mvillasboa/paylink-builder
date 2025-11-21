import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data - MRR evolution over 12 months
const mrrData = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000);
  return {
    month: month.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }),
    mrr: 45000000 + Math.floor(Math.random() * 15000000),
    newMRR: 8000000 + Math.floor(Math.random() * 5000000),
    churnedMRR: 2000000 + Math.floor(Math.random() * 2000000),
  };
});

// MRR by subscription type
const mrrByType = [
  { name: 'Limitada-Fijo', value: 18500000, percentage: 35, color: 'hsl(217, 91%, 60%)' },
  { name: 'Ilimitada-Fijo', value: 21200000, percentage: 40, color: 'hsl(271, 76%, 53%)' },
  { name: 'Ilimitada-Variable', value: 10600000, percentage: 20, color: 'hsl(142, 76%, 36%)' },
  { name: 'Limitada-Variable', value: 2650000, percentage: 5, color: 'hsl(38, 92%, 50%)' },
];

// MRR growth by cohort
const cohortData = [
  { cohort: 'Ene 25', month1: 12000000, month2: 11500000, month3: 11000000, retention: 91.7 },
  { cohort: 'Feb 25', month1: 15000000, month2: 14200000, month3: 13800000, retention: 92.0 },
  { cohort: 'Mar 25', month1: 18000000, month2: 17500000, month3: 0, retention: 97.2 },
  { cohort: 'Abr 25', month1: 20000000, month2: 0, month3: 0, retention: 100 },
];

export function MRRReport() {
  const currentMRR = 53000000;
  const previousMRR = 48500000;
  const mrrGrowth = ((currentMRR - previousMRR) / previousMRR) * 100;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="MRR Actual"
          value={currentMRR}
          change={mrrGrowth}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Nuevo MRR"
          value={12500000}
          change={18.5}
          icon={TrendingUp}
          format="currency"
        />
        <StatCard
          title="MRR Perdido (Churn)"
          value={2800000}
          change={-12.3}
          icon={Users}
          format="currency"
        />
        <StatCard
          title="MRR Promedio por Cliente"
          value={595505}
          change={8.2}
          icon={Calendar}
          format="currency"
        />
      </div>

      {/* MRR Evolution Chart */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Evolución del MRR - Últimos 12 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mrrData}>
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
                dataKey="mrr"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="MRR Total"
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="newMRR"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                name="Nuevo MRR"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="churnedMRR"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="MRR Perdido"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* MRR by Type */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>MRR por Tipo de Suscripción</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mrrByType}>
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
                  formatter={(value: number) => `₲ ${value.toLocaleString('es-PY')}`}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
                  {mrrByType.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {mrrByType.map((type) => (
                <div key={type.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm font-medium">{type.name}</span>
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">
                    {type.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cohort Analysis */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Retención de MRR por Cohorte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cohortData.map((cohort) => (
                <div key={cohort.cohort} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cohort.cohort}</span>
                    <span className="text-sm font-bold text-accent">
                      {cohort.retention}% retención
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {cohort.month1 > 0 && (
                      <div className="p-2 rounded bg-primary/10 text-center">
                        <p className="text-xs text-muted-foreground">Mes 1</p>
                        <p className="text-sm font-bold">
                          ₲ {(cohort.month1 / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    )}
                    {cohort.month2 > 0 && (
                      <div className="p-2 rounded bg-primary/10 text-center">
                        <p className="text-xs text-muted-foreground">Mes 2</p>
                        <p className="text-sm font-bold">
                          ₲ {(cohort.month2 / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    )}
                    {cohort.month3 > 0 && (
                      <div className="p-2 rounded bg-primary/10 text-center">
                        <p className="text-xs text-muted-foreground">Mes 3</p>
                        <p className="text-sm font-bold">
                          ₲ {(cohort.month3 / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-1">Tasa de Retención Promedio</p>
              <p className="text-2xl font-bold text-accent">95.2%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Excelente retención de ingresos recurrentes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Insights Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent mb-1">Crecimiento Mensual</p>
              <p className="text-2xl font-bold">+{mrrGrowth.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Crecimiento saludable del MRR
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary mb-1">Tipo Más Rentable</p>
              <p className="text-lg font-bold">Ilimitada-Fijo</p>
              <p className="text-xs text-muted-foreground mt-1">
                40% del MRR total
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm font-medium text-secondary mb-1">Mejor Cohorte</p>
              <p className="text-lg font-bold">Abril 2025</p>
              <p className="text-xs text-muted-foreground mt-1">
                100% de retención hasta ahora
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
