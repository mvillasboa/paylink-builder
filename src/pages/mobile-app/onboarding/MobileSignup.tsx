import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { OnboardingLayout } from "@/components/mobile-app/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboarding } from "@/hooks/useOnboarding";

const schema = z
  .object({
    email: z.string().trim().email("Email inválido").max(255),
    password: z.string().min(8, "Mínimo 8 caracteres").max(100),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "Aceptá los Términos" }) }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

export default function MobileSignup() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState(state.password);
  const [confirm, setConfirm] = useState(state.password);
  const [terms, setTerms] = useState(state.termsAccepted);
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email, password, confirm, terms });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    update({ email, password, termsAccepted: terms });
    toast.success("Te enviamos un código a tu email");
    navigate("/app/onboarding/verify-email");
  };

  return (
    <OnboardingLayout
      step={1}
      title="Creá tu cuenta"
      subtitle="Empezá con tu email y una contraseña segura"
      onBack={() => navigate("/app/login")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="pl-10 h-12 rounded-xl"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="pl-10 pr-10 h-12 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label="Mostrar contraseña"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-xs">Confirmar contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí tu contraseña"
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 pt-2 text-xs text-muted-foreground cursor-pointer">
          <Checkbox
            checked={terms}
            onCheckedChange={(v) => setTerms(Boolean(v))}
            className="mt-0.5"
          />
          <span>
            Acepto los <span className="text-primary font-medium">Términos y Condiciones</span> y la{" "}
            <span className="text-primary font-medium">Política de Privacidad</span> de Walpay.
          </span>
        </label>

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold mt-4">
          Continuar
        </Button>
      </form>
    </OnboardingLayout>
  );
}
