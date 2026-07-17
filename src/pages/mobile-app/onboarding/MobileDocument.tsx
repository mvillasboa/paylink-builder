import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IdCard } from "lucide-react";
import { OnboardingLayout } from "@/components/mobile-app/onboarding/OnboardingLayout";
import { DocumentCapture } from "@/components/mobile-app/onboarding/DocumentCapture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function MobileDocument() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const [documentNumber, setDocumentNumber] = useState(state.documentNumber);
  const [issueDate, setIssueDate] = useState(state.documentIssueDate);
  const [front, setFront] = useState(state.documentFrontCaptured);
  const [back, setBack] = useState(state.documentBackCaptured);

  const capture = (side: "front" | "back") => {
    toast.success(`Foto ${side === "front" ? "anverso" : "reverso"} capturada`);
    if (side === "front") setFront(true);
    else setBack(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentNumber.trim() || !issueDate) {
      toast.error("Completá los datos de tu cédula");
      return;
    }
    if (!front || !back) {
      toast.error("Capturá anverso y reverso de tu cédula");
      return;
    }
    update({
      documentNumber,
      documentIssueDate: issueDate,
      documentFrontCaptured: front,
      documentBackCaptured: back,
    });
    navigate("/app/onboarding/selfie");
  };

  return (
    <OnboardingLayout
      step={5}
      title="Documento de identidad"
      subtitle="Fotografiá tu Cédula de Identidad paraguaya"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="doc" className="text-xs">Número de CI</Label>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="doc"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="1.234.567"
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue" className="text-xs">Fecha de emisión</Label>
          <Input
            id="issue"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-3 pt-2">
          <DocumentCapture
            label="Anverso de la CI"
            captured={front}
            onCapture={() => capture("front")}
          />
          <DocumentCapture
            label="Reverso de la CI"
            captured={back}
            onCapture={() => capture("back")}
          />
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
          Asegurate de que se lean bien todos los datos y que no haya reflejos ni sombras.
        </p>

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold mt-2">
          Continuar
        </Button>
      </form>
    </OnboardingLayout>
  );
}
