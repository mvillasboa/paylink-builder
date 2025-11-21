import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  CheckCircle2,
  CreditCard,
  Building2,
  AlertCircle,
  FileText,
  Infinity,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { toast } from "sonner";
import { parse, format } from "date-fns";
import { es } from "date-fns/locale";

// Schema de validación con zod
const cardSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .regex(/^\d{16}$/, "El número de tarjeta debe tener 16 dígitos")
    .transform((val) => val.replace(/\s/g, "")),
  cardName: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),
  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Mes inválido (01-12)"),
  expiryYear: z
    .string()
    .regex(/^\d{2}$/, "Año inválido (YY)")
    .refine((year) => {
      const currentYear = new Date().getFullYear() % 100;
      return parseInt(year) >= currentYear;
    }, "La tarjeta está vencida"),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV debe tener 3 o 4 dígitos"),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar los términos y condiciones"),
});

type CardFormData = z.infer<typeof cardSchema>;

// Mock data del link de pago - Suscripción ilimitada con monto fijo
const mockPaymentLink: {
  id: string;
  businessName: string;
  amount: number;
  concept: string;
  description: string;
  subscriptionType: "fixed" | "variable";
  durationType: "limited" | "unlimited";
  frequency: "monthly" | "biweekly" | "weekly";
  numberOfPayments?: number;
  billingDay: number;
  nextChargeDate: string;
} = {
  id: "LNK-004",
  businessName: "Asociación Profesional Nacional",
  amount: 450000,
  concept: "Membresía Anual con Reconfirmación",
  description: "Membresía profesional con renovación sujeta a confirmación previa",
  subscriptionType: "fixed",
  durationType: "unlimited",
  frequency: "monthly",
  billingDay: 5,
  nextChargeDate: "2024-04-05",
};

export default function RegisterCardUnlimitedFixed() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CardFormData, string>>>({});
  
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    acceptTerms: false,
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const handleInputChange = (field: keyof CardFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getFrequencyText = (frequency: string) => {
    const frequencies: Record<string, string> = {
      monthly: "Mensual",
      biweekly: "Quincenal",
      weekly: "Semanal",
    };
    return frequencies[frequency] || frequency;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validatedData = cardSchema.parse(formData);
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log("Tarjeta registrada exitosamente para link:", linkId);
      setIsSuccess(true);
      toast.success("¡Tarjeta registrada exitosamente!");
      
      setTimeout(() => {
        navigate("/payment-success");
      }, 3000);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CardFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof CardFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Por favor corrige los errores en el formulario");
      } else {
        toast.error("Ocurrió un error. Por favor intenta nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/50 shadow-strong animate-scale-in">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¡Tarjeta Registrada!
              </h2>
              <p className="text-muted-foreground">
                Tu tarjeta ha sido registrada exitosamente. Serás redirigido en unos momentos...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con badges de seguridad */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-accent" />
            <h1 className="text-3xl font-bold text-primary-foreground">
              Registro Seguro de Tarjeta
            </h1>
          </div>
          <p className="text-primary-foreground/80 mb-6">
            Registra tu tarjeta de forma segura para completar tu pago
          </p>
          
          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge className="bg-card/90 backdrop-blur-sm text-accent border-2 border-accent/40 px-4 py-2 shadow-soft">
              <Lock className="h-3 w-3 mr-2" />
              Conexión Segura SSL
            </Badge>
            <Badge className="bg-card/90 backdrop-blur-sm text-primary border-2 border-primary/30 px-4 py-2 shadow-soft">
              <Shield className="h-3 w-3 mr-2" />
              Certificado PCI DSS
            </Badge>
            <Badge className="bg-card/90 backdrop-blur-sm text-secondary border-2 border-secondary/30 px-4 py-2 shadow-soft">
              Encriptación 256-bit
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Details - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-border/50 bg-card/90 backdrop-blur-sm shadow-medium animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  Información del Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-semibold text-foreground">{mockPaymentLink.businessName}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Infinity className="h-3 w-3 mr-1" />
                    Ilimitada - Fijo
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {getFrequencyText(mockPaymentLink.frequency)}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground">Concepto</p>
                  <p className="font-medium text-foreground">{mockPaymentLink.concept}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="text-sm text-muted-foreground">{mockPaymentLink.description}</p>
                </div>
                
                <Separator />
                
                <div className="bg-card/90 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-4 shadow-medium">
                  <p className="text-sm text-foreground/90 mb-1 font-medium">Monto Mensual</p>
                  <p className="text-3xl font-bold text-primary">
                    ₲ {mockPaymentLink.amount.toLocaleString('es-PY')}
                    <span className="text-base font-normal text-foreground/80 ml-2">PYG</span>
                  </p>
                </div>

                <Separator />

                {/* Subscription Details */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Detalles de la Suscripción</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frecuencia:</span>
                      <span className="font-medium text-foreground">{getFrequencyText(mockPaymentLink.frequency)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Día de cobro:</span>
                      <span className="font-medium text-foreground">Día {mockPaymentLink.billingDay}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Próximo cobro:</span>
                      <span className="font-medium text-foreground">
                        {format(parse(mockPaymentLink.nextChargeDate, 'yyyy-MM-dd', new Date()), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duración:</span>
                      <span className="font-medium text-foreground">Sin límite de tiempo</span>
                    </div>

                    <Separator className="my-2" />
                    
                    {/* Información específica para suscripción ilimitada con monto fijo */}
                    <div className="bg-card/90 backdrop-blur-sm border-2 border-accent/40 rounded-lg p-3 shadow-soft">
                      <div className="flex gap-2">
                        <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-foreground">
                            Información importante:
                          </p>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            El monto de ₲ {mockPaymentLink.amount.toLocaleString('es-PY')} se cobrará automáticamente cada mes.
                          </p>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            Cualquier modificación de tarifas requerirá tu reconfirmación previa según condiciones contractuales.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card/90 backdrop-blur-sm border-2 border-accent/40 rounded-lg p-3 flex gap-3 shadow-soft">
                  <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">100% Seguro</p>
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      Tu información está protegida y encriptada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Registration Form - Right Column */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-border/50 bg-card/90 backdrop-blur-sm shadow-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Datos de tu Tarjeta
                </CardTitle>
                <CardDescription>
                  Ingresa los datos de tu tarjeta de crédito o débito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">
                      Número de Tarjeta <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(formData.cardNumber)}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\s/g, "").slice(0, 16);
                          handleInputChange("cardNumber", cleaned);
                        }}
                        className={errors.cardNumber ? "border-destructive" : ""}
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="cardName">
                      Nombre del Titular <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="Como aparece en la tarjeta"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                      className={errors.cardName ? "border-destructive" : ""}
                      maxLength={100}
                    />
                    {errors.cardName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.cardName}
                      </p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Fecha de Vencimiento <span className="text-destructive">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            placeholder="MM"
                            value={formData.expiryMonth}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                              handleInputChange("expiryMonth", value);
                            }}
                            className={errors.expiryMonth ? "border-destructive" : ""}
                            maxLength={2}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="YY"
                            value={formData.expiryYear}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                              handleInputChange("expiryYear", value);
                            }}
                            className={errors.expiryYear ? "border-destructive" : ""}
                            maxLength={2}
                          />
                        </div>
                      </div>
                      {(errors.expiryMonth || errors.expiryYear) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.expiryMonth || errors.expiryYear}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">
                        CVV <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                          handleInputChange("cvv", value);
                        }}
                        className={errors.cvv ? "border-destructive" : ""}
                        maxLength={4}
                      />
                      {errors.cvv && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-card/90 backdrop-blur-sm border-2 border-muted/30 rounded-lg p-4 space-y-4 shadow-soft">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => 
                          handleInputChange("acceptTerms", checked === true)
                        }
                        className={errors.acceptTerms ? "border-destructive" : ""}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="terms"
                          className="text-sm leading-relaxed cursor-pointer text-foreground/90"
                        >
                          Acepto los{" "}
                          <a href="#" className="text-primary hover:underline font-medium">
                            términos y condiciones
                          </a>{" "}
                          y autorizo el cargo automático a mi tarjeta según el plan de suscripción seleccionado.
                        </Label>
                      </div>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-destructive flex items-center gap-1 ml-7">
                        <AlertCircle className="h-3 w-3" />
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="bg-card/90 backdrop-blur-sm border-2 border-accent/40 rounded-lg p-4 flex gap-3 shadow-soft">
                    <Lock className="h-5 w-5 text-accent flex-shrink-0" />
                    <div className="text-xs text-foreground/90 leading-relaxed">
                      <p className="font-semibold mb-1">Tu información está protegida</p>
                      <p>
                        Todos los datos de tu tarjeta son encriptados y procesados de forma segura. 
                        Nunca almacenamos tu número de tarjeta completo ni tu CVV.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Registrar Tarjeta de Forma Segura
                      </>
                    )}
                  </Button>
                </form>

                {/* Footer Security Info */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-center gap-6 text-xs text-foreground/80">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <span className="font-semibold">PCI DSS Certificado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-accent" />
                      <span className="font-semibold">SSL 256-bit</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
