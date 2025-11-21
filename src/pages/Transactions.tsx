import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Search,
  Filter,
  Eye,
  RefreshCw,
} from "lucide-react";
import { mockTransactions } from "@/data/mockDashboard";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig = {
  completed: { label: 'Completado', className: 'bg-accent/10 text-accent border-accent/20' },
  pending: { label: 'Pendiente', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  failed: { label: 'Fallido', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

// Expandimos los datos de mock para tener más transacciones
const expandedTransactions = [
  ...mockTransactions,
  ...Array.from({ length: 20 }, (_, i) => ({
    ...mockTransactions[i % mockTransactions.length],
    id: `TRX-${String(100 + i).padStart(5, '0')}`,
    date: new Date(Date.now() - (i + 7) * 24 * 60 * 60 * 1000),
  })),
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const filteredTransactions = expandedTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesMethod = methodFilter === "all" || transaction.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = filteredTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transacciones</h1>
          <p className="text-muted-foreground mt-1">
            Historial completo de todas las transacciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button className="bg-gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Procesado</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              ₲ {totalAmount.toLocaleString('es-PY')}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Transacciones</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {filteredTransactions.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              ₲ {Math.round(totalAmount / Math.max(filteredTransactions.filter(t => t.status === "completed").length, 1)).toLocaleString('es-PY')}
            </p>
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
                placeholder="Buscar por ID, cliente o email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="failed">Fallido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los métodos</SelectItem>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="Mastercard">Mastercard</SelectItem>
                <SelectItem value="American Express">American Express</SelectItem>
                <SelectItem value="Débito">Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>
            {filteredTransactions.length} Transacciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Monto</TableHead>
                  <TableHead className="font-semibold">Método</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const statusInfo = statusConfig[transaction.status];
                  return (
                    <TableRow key={transaction.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {transaction.id}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {transaction.client.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transaction.client.email}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₲ {transaction.amount.toLocaleString('es-PY')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {transaction.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.className}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(transaction.date, { addSuffix: true, locale: es })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
