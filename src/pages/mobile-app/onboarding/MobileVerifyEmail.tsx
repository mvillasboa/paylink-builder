import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingLayout } from "@/components/mobile-app/onboarding/OnboardingLayout";
import { OtpInput } from "@/components/mobile-app/onboarding/OtpInput";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";
import { MOCK_OTP, OTP_RESEND_SECONDS } from "@/data/mockOnboarding";

export default function MobileVerifyEmail() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(OTP_RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Ingresá los 6 dígitos");
      return;
    }
    if (code !== MOCK_OTP) {
      toast.error("Código incorrecto. Usá 123456 para la demo.");
      return;
    }
    update({ emailVerified: true });
    toast.success("Email verificado");
    navigate("/app/onboarding/personal");
  };

  return (
    <OnboardingLayout
      step={2}
      title="Verificá tu email"
      subtitle={`Enviamos un código de 6 dígitos a ${state.email || "tu email"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <OtpInput value={code} onChange={setCode} />

        <div className="text-center text-xs text-muted-foreground">
          {seconds > 0 ? (
            <>Reenviar código en <span className="font-semibold text-foreground">{seconds}s</span></>
          ) : (
            <button
              type="button"
              className="text-primary font-semibold"
              onClick={() => {
                setSeconds(OTP_RESEND_SECONDS);
                toast.success("Código reenviado");
              }}
            >
              Reenviar código
            </button>
          )}
        </div>

        <div className="rounded-xl bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground text-center">
          Demo: el código válido es <span className="font-semibold text-foreground">123456</span>
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold">
          Verificar
        </Button>
      </form>
    </OnboardingLayout>
  );
}
