import { Camera, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelfieCaptureProps {
  captured: boolean;
  onCapture: () => void;
}

export function SelfieCapture({ captured, onCapture }: SelfieCaptureProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-56 h-56 rounded-full border-4 border-dashed flex items-center justify-center mb-6 transition-colors",
          captured
            ? "border-[hsl(var(--mint))] bg-[hsl(var(--mint)/0.08)]"
            : "border-primary/40 bg-muted/40"
        )}
      >
        {captured ? (
          <CheckCircle2 className="h-20 w-20 text-[hsl(var(--mint))]" />
        ) : (
          <User className="h-24 w-24 text-muted-foreground" strokeWidth={1.2} />
        )}
      </div>
      <button
        type="button"
        onClick={onCapture}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
      >
        <Camera className="h-4 w-4" />
        {captured ? "Volver a capturar" : "Capturar selfie"}
      </button>
    </div>
  );
}
