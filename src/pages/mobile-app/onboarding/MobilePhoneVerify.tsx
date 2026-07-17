import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import { OnboardingLayout } from "@/components/mobile-app/onboarding/OnboardingLayout";
import { OtpInput } from "@/components/mobile-app/onboarding/OtpInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/hooks/useOnboarding";
import { MOCK_OTP, OTP_RESEND_SECONDS } from "@/data/mockOnboarding";

export default function MobilePhoneVerify() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const [phone, setPhone] = useState(state.phone.replace(/^\+595/, ""));
  const [stage, setStage] = useState<"input" | "otp">("input");
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(OTP_RESEND_SECONDS);

  useEffect(() => {
    if (stage !== "otp" || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, seconds]);

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 9) {
      toast.error("Ingresá un número válido");
      return;
    }
    update({ phone: `+595${clean}` });
    toast.success("Código SMS enviado");
    setStage("otp");
    setSeconds(OTP_RESEND_SECONDS);
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== MOCK_OTP) {
      toast.error("Código incorrecto. Usá 123456 para la demo.");
      return;
    }
    update({ phoneVerified: true });
    toast.success("Teléfono verificado");
    navigate("/app/onboarding/document");
  };

  if (stage === "input") {
    return (
      <OnboardingLayout
        step={4}
        title="Verificá tu teléfono"
        subtitle="Te enviaremos un código por SMS"
      >
        <form onSubmit={sendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs">Número de celular</Label>
            <div className="flex gap-2">
              <div className="h-12 px-3 rounded-xl border border-border bg-muted flex items-center text-sm font-medium">
                +595
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="981 234 567"
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold">
            Enviar código
          </Button>
        </form>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      step={4}
      title="Ingresá el código"
      subtitle={`Enviamos un SMS a ${state.phone}`}
      onBack={() => setStage("input")}
    >
      <form onSubmit={verify} className="space-y-6 pt-2">
        <OtpInput value={code} onChange={setCode} />
        <div className="text-center text-xs text-muted-foreground">
          {seconds > 0 ? (
            <>Reenviar en <span className="font-semibold text-foreground">{seconds}s</span></>
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
