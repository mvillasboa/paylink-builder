import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, UserX, XCircle, CreditCard } from "lucide-react";
import { MRRReport } from "@/components/dashboard/reports/MRRReport";
import { ChurnReport } from "@/components/dashboard/reports/ChurnReport";
import { FailedTransactionsReport } from "@/components/dashboard/reports/FailedTransactionsReport";
import { PaymentMethodReport } from "@/components/dashboard/reports/PaymentMethodReport";

export default function DashboardReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground mt-1">
            Análisis detallado de ingresos, cancelaciones, fallos y métodos de pago
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      <Tabs defaultValue="mrr" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="mrr" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">MRR</span>
          </TabsTrigger>
          <TabsTrigger value="churn" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            <span className="hidden sm:inline">Churn</span>
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Fallos</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Métodos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mrr" className="space-y-6">
          <MRRReport />
        </TabsContent>

        <TabsContent value="churn" className="space-y-6">
          <ChurnReport />
        </TabsContent>

        <TabsContent value="failed" className="space-y-6">
          <FailedTransactionsReport />
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <PaymentMethodReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
