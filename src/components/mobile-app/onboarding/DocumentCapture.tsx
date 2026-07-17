import { Camera, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentCaptureProps {
  label: string;
  captured: boolean;
  onCapture: () => void;
}

export function DocumentCapture({ label, captured, onCapture }: DocumentCaptureProps) {
  return (
    <button
      type="button"
      onClick={onCapture}
      className={cn(
        "w-full rounded-2xl border-2 border-dashed p-5 flex items-center gap-4 transition-colors",
        captured
          ? "border-[hsl(var(--mint))] bg-[hsl(var(--mint)/0.08)]"
          : "border-border bg-muted/40 hover:border-primary"
      )}
    >
      <div
        className={cn(
          "w-16 h-12 rounded-lg flex items-center justify-center shrink-0",
          captured ? "bg-[hsl(var(--mint))] text-white" : "bg-background text-muted-foreground"
        )}
      >
        {captured ? <CheckCircle2 className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {captured ? "Foto capturada" : "Tocá para capturar"}
        </p>
      </div>
    </button>
  );
}
