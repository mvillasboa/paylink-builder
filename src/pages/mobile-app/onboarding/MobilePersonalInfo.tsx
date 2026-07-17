import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingLayout } from "@/components/mobile-app/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function MobilePersonalInfo() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const [firstName, setFirstName] = useState(state.firstName);
  const [lastName, setLastName] = useState(state.lastName);
  const [birthDate, setBirthDate] = useState(state.birthDate);
  const [nationality, setNationality] = useState(state.nationality || "Paraguay");
  const [gender, setGender] = useState(state.gender);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Ingresá tu nombre y apellido");
      return;
    }
    if (!birthDate) {
      toast.error("Ingresá tu fecha de nacimiento");
      return;
    }
    const age = (Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) {
      toast.error("Debés ser mayor de 18 años");
      return;
    }
    update({ firstName, lastName, birthDate, nationality, gender });
    navigate("/app/onboarding/phone");
  };

  return (
    <OnboardingLayout
      step={3}
      title="Tus datos personales"
      subtitle="Necesitamos algunos datos para tu cuenta"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-xs">Nombre</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Juan"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-xs">Apellido</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Pérez"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birth" className="text-xs">Fecha de nacimiento</Label>
          <Input
            id="birth"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Nacionalidad</Label>
          <Select value={nationality} onValueChange={setNationality}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paraguay">Paraguay</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Brasil">Brasil</SelectItem>
              <SelectItem value="Uruguay">Uruguay</SelectItem>
              <SelectItem value="Otra">Otra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Género (opcional)</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Seleccioná" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="F">Femenino</SelectItem>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="X">Prefiero no decirlo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold mt-4">
          Continuar
        </Button>
      </form>
    </OnboardingLayout>
  );
}
