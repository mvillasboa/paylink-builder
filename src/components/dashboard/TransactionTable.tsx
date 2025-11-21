import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Transaction {
  id: string;
  client: { name: string; email: string };
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
}

interface TransactionTableProps {
  transactions: Transaction[];
  compact?: boolean;
}

const statusConfig = {
  completed: { label: 'Completado', variant: 'default' as const, className: 'bg-accent/10 text-accent border-accent/20' },
  pending: { label: 'Pendiente', variant: 'secondary' as const, className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  failed: { label: 'Fallido', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export function TransactionTable({ transactions, compact = false }: TransactionTableProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Cliente</TableHead>
            <TableHead className="font-semibold">Monto</TableHead>
            <TableHead className="font-semibold">Método</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const statusInfo = statusConfig[transaction.status];
            return (
              <TableRow key={transaction.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {transaction.id}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{transaction.client.name}</p>
                    {!compact && (
                      <p className="text-sm text-muted-foreground">{transaction.client.email}</p>
                    )}
                  </div>
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
  );
}
