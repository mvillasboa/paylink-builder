import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/mobile-app/PhoneFrame";
import { ONBOARDING_STEPS } from "@/data/mockOnboarding";

interface OnboardingLayoutProps {
  step: number; // 1-based within ONBOARDING_STEPS
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
}

export function OnboardingLayout({ step, title, subtitle, children, onBack }: OnboardingLayoutProps) {
  const navigate = useNavigate();
  const total = ONBOARDING_STEPS.length;
  const progress = Math.min(100, Math.round((step / total) * 100));

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full bg-background">
        <header className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => (onBack ? onBack() : navigate(-1))}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground"
              aria-label="Volver"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-muted-foreground">
              Paso {step} de {total}
            </span>
            <span className="w-9" />
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-foreground leading-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
          </div>
        </header>
        <div className="flex-1 px-5 pb-8">{children}</div>
      </div>
    </PhoneFrame>
  );
}
