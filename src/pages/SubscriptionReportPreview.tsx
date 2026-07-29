import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionSummaryDocument } from "@/components/reports/SubscriptionSummaryDocument";
import { mockSubscriptionReport } from "@/data/mockSubscriptionReport";

export default function SubscriptionReportPreview() {
  return (
    <div className="min-h-screen bg-muted/40 py-8 print:bg-background print:py-0">
      <div className="mx-auto w-full max-w-[794px] px-4 mb-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Resumen de suscripción — vista previa
            </h1>
            <p className="text-sm text-muted-foreground">
              Diseño del PDF que Atención al Cliente puede enviar al titular. Datos de ejemplo.
            </p>
          </div>
          <Button onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <SubscriptionSummaryDocument data={mockSubscriptionReport} />
    </div>
  );
}
