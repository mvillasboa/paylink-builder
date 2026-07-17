import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { PhoneFrame } from "@/components/mobile-app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";
import { KYC_REVIEW_HOURS } from "@/data/mockOnboarding";

export default function MobileKycStatus() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const approved = state.kycStatus === "approved";

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full bg-background px-6 pt-16 pb-8 text-center">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              approved
                ? "bg-[hsl(var(--mint)/0.15)] text-[hsl(var(--mint))]"
                : "bg-primary/10 text-primary"
            }`}
          >
            {approved ? (
              <CheckCircle2 className="h-14 w-14" />
            ) : (
              <Clock className="h-12 w-12" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {approved ? "¡Verificación aprobada!" : "Verificación en revisión"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
            {approved
              ? "Ya podés usar todas las funciones de Walpay: agregar tarjetas, activar suscripciones y hacer pagos."
              : `Estamos revisando tu información. El proceso demora entre ${KYC_REVIEW_HOURS}. Te avisaremos por email y notificación.`}
          </p>

          <div className="mt-8 w-full rounded-xl border border-border bg-card p-4 text-left flex gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Tus datos están cifrados y solo se usan para validar tu identidad según la
              normativa vigente.
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Button
            onClick={() => navigate("/app")}
            className="w-full h-12 rounded-xl text-base font-semibold"
          >
            Ir al inicio
          </Button>
          {!approved && (
            <Button
              variant="ghost"
              onClick={() => {
                update({ kycStatus: "approved" });
              }}
              className="w-full h-10 text-xs text-muted-foreground"
            >
              Simular aprobación (demo)
            </Button>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
