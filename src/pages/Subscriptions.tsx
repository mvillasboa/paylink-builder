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
import { Search, Edit3, Eye, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { Subscription } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModifySubscriptionAmountDialog } from "@/components/subscriptions/ModifySubscriptionAmountDialog";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión");
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubscriptions(data || []);
    } catch (error: any) {
      console.error("Error loading subscriptions:", error);
      toast.error("Error al cargar suscripciones");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.concept.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleModifyPrice = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setModifyDialogOpen(true);
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
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Suscripción
        </Button>
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
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, referencia o concepto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No se encontraron suscripciones" : "No hay suscripciones aún"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Frecuencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Próximo Cobro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModifyPrice(subscription)}
                          disabled={subscription.status !== 'active'}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
}
