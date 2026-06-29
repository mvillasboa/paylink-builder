import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/mobile-app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function MobileLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Completá email y contraseña");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Bienvenido");
      navigate("/app");
    }, 600);
  };

  const handleRegister = () => {
    toast.info("Registro disponible próximamente");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full bg-background px-6 pt-12 pb-8">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-glow mb-4">
            <span className="text-primary-foreground font-bold text-2xl">W</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Walpay</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestioná tus tarjetas y suscripciones
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl border-border bg-background focus-visible:ring-ring/40"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 rounded-xl border-border bg-background focus-visible:ring-ring/40"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Mostrar contraseña"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-primary font-medium"
              onClick={() => toast.info("Te enviamos un email para recuperar tu contraseña")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-base font-semibold"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">o</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleRegister}
            className="w-full h-12 rounded-xl gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <UserPlus className="h-5 w-5" />
            Registrarse
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <button
            type="button"
            className="text-primary font-semibold"
            onClick={() => toast.info("Registro disponible próximamente")}
          >
            Registrate
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
