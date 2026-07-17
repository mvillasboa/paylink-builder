import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Mail, Phone, IdCard, User, Camera } from "lucide-react";
import { OnboardingLayout } from "@/components/mobile-app/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function MobileReview() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();

  const items = [
    { icon: Mail, label: "Email verificado", value: state.email, done: state.emailVerified },
    {
      icon: User,
      label: "Datos personales",
      value: `${state.firstName} ${state.lastName}`.trim() || "—",
      done: Boolean(state.firstName && state.lastName && state.birthDate),
    },
    { icon: Phone, label: "Teléfono", value: state.phone, done: state.phoneVerified },
    {
      icon: IdCard,
      label: "Cédula de Identidad",
      value: state.documentNumber,
      done: state.documentFrontCaptured && state.documentBackCaptured,
    },
    {
      icon: Camera,
      label: "Selfie",
      value: state.selfieCaptured ? "Capturada" : "—",
      done: state.selfieCaptured,
    },
  ];

  const allDone = items.every((i) => i.done);

  const handleSubmit = () => {
    if (!allDone) {
      toast.error("Completá todos los pasos");
      return;
    }
    update({ kycStatus: "in_review" });
    toast.success("Verificación enviada");
    navigate("/app/onboarding/status");
  };

  return (
    <OnboardingLayout
      step={7}
      title="Revisá tu información"
      subtitle="Confirmá que todo esté correcto antes de enviar"
    >
      <div className="space-y-2 pt-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground truncate">{item.value || "—"}</p>
              </div>
              {item.done ? (
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--mint))] shrink-0" />
              ) : (
                <span className="text-[10px] font-semibold text-destructive uppercase shrink-0">
                  Falta
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-muted/60 p-3 mt-4 text-[11px] text-muted-foreground leading-relaxed">
        Al enviar, autorizás a Walpay a validar tu identidad conforme a la Ley de Protección de
        Datos Personales y la normativa vigente.
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full h-12 rounded-xl text-base font-semibold mt-6 bg-[hsl(var(--mint))] text-[hsl(var(--mint-foreground))] hover:bg-[hsl(var(--mint)/0.9)]"
      >
        Enviar verificación
      </Button>
    </OnboardingLayout>
  );
}
