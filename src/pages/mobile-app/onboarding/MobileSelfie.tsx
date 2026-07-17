import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingLayout } from "@/components/mobile-app/onboarding/OnboardingLayout";
import { SelfieCapture } from "@/components/mobile-app/onboarding/SelfieCapture";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function MobileSelfie() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();

  const handleCapture = () => {
    update({ selfieCaptured: true });
    toast.success("Selfie capturada");
  };

  const handleNext = () => {
    if (!state.selfieCaptured) {
      toast.error("Capturá tu selfie para continuar");
      return;
    }
    navigate("/app/onboarding/review");
  };

  return (
    <OnboardingLayout
      step={6}
      title="Verificación facial"
      subtitle="Mirá al frente, parpadeá y sonreí para la prueba de vida"
    >
      <div className="pt-4">
        <SelfieCapture captured={state.selfieCaptured} onCapture={handleCapture} />

        <ul className="mt-8 space-y-2 text-xs text-muted-foreground">
          <li>• Ubicate en un lugar bien iluminado</li>
          <li>• Sacate lentes, gorra o cualquier accesorio que tape tu cara</li>
          <li>• Encuadrá tu rostro dentro del círculo</li>
        </ul>

        <Button
          onClick={handleNext}
          className="w-full h-12 rounded-xl text-base font-semibold mt-8"
        >
          Continuar
        </Button>
      </div>
    </OnboardingLayout>
  );
}
