import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Star,
  Shield,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { mockSavedCards, cardBrandNames, cardBrandColors, SavedCard } from "@/data/mockCards";
import { toast } from "sonner";
import { z } from "zod";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const editCardSchema = z.object({
  cardholderName: z
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
});

export default function MyCards() {
  const [cards, setCards] = useState<SavedCard[]>(mockSavedCards);
  const [editingCard, setEditingCard] = useState<SavedCard | null>(null);
  const [deletingCard, setDeletingCard] = useState<SavedCard | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof editFormData, string>>>({});

  const handleEditClick = (card: SavedCard) => {
    setEditingCard(card);
    setEditFormData({
      cardholderName: card.cardholderName,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
    });
    setErrors({});
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      editCardSchema.parse(editFormData);

      // Actualizar la tarjeta
      setCards(cards.map(card => 
        card.id === editingCard?.id
          ? { ...card, ...editFormData }
          : card
      ));

      toast.success("Tarjeta actualizada exitosamente");
      setIsEditDialogOpen(false);
      setEditingCard(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof typeof editFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof editFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Por favor corrige los errores en el formulario");
      }
    }
  };

  const handleDelete = () => {
    if (!deletingCard) return;

    if (deletingCard.isDefault && cards.length > 1) {
      toast.error("No puedes eliminar tu tarjeta predeterminada. Establece otra tarjeta como predeterminada primero.");
      setDeletingCard(null);
      return;
    }

    setCards(cards.filter(card => card.id !== deletingCard.id));
    toast.success("Tarjeta eliminada exitosamente");
    setDeletingCard(null);
  };

  const handleSetDefault = (cardId: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId,
    })));
    toast.success("Tarjeta predeterminada actualizada");
  };

  const getCardIcon = (brand: string) => {
    return <CreditCard className="h-8 w-8" />;
  };

  const isExpiringSoon = (month: string, year: string) => {
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry < threeMonthsFromNow;
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <Button variant="ghost" className="mb-4" asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </a>
          </Button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-primary-foreground">
                  Mis Tarjetas
                </h1>
              </div>
              <p className="text-primary-foreground/80">
                Gestiona tus métodos de pago de forma segura
              </p>
            </div>

            <Button className="bg-gradient-primary" asChild>
              <a href="/pay/new">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Tarjeta
              </a>
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Protección de Datos
                </p>
                <p className="text-xs text-muted-foreground">
                  Toda tu información está encriptada con tecnología de última generación. 
                  Nunca almacenamos tu número completo de tarjeta ni CVV.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const expiringSoon = isExpiringSoon(card.expiryMonth, card.expiryYear);
            
            return (
              <Card
                key={card.id}
                className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${cardBrandColors[card.cardBrand]}`}>
                      {getCardIcon(card.cardBrand)}
                    </div>
                    {card.isDefault && (
                      <Badge className="bg-accent/10 text-accent border-accent/20">
                        <Star className="h-3 w-3 mr-1 fill-accent" />
                        Predeterminada
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Card Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground tracking-wider">
                        •••• {card.lastFourDigits}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {cardBrandNames[card.cardBrand]}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground truncate">
                      {card.cardholderName}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{card.expiryMonth}/{card.expiryYear}</span>
                      </div>
                      {expiringSoon && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600/20 bg-yellow-500/5">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Vence pronto
                        </Badge>
                      )}
                    </div>

                    {card.lastUsed && (
                      <p className="text-xs text-muted-foreground">
                        Último uso: {formatDistanceToNow(card.lastUsed, { addSuffix: true, locale: es })}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {!card.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetDefault(card.id)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Predeterminar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={card.isDefault ? "flex-1" : ""}
                      onClick={() => handleEditClick(card)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setDeletingCard(card)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add Card Placeholder */}
          <Card className="border-border/50 border-dashed bg-card/30 backdrop-blur hover:bg-card/50 transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: `${0.1 * (cards.length + 1)}s` }}>
            <a href="/pay/new" className="block h-full">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground mb-1">
                    Agregar Nueva Tarjeta
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Añade otro método de pago
                  </p>
                </div>
              </CardContent>
            </a>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Información Importante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Seguridad Garantizada</p>
                <p className="text-xs text-muted-foreground">
                  Tus tarjetas están protegidas con encriptación de nivel bancario
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Sin Cargos Automáticos</p>
                <p className="text-xs text-muted-foreground">
                  Solo se realizarán cargos cuando autorices un pago explícitamente
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Control Total</p>
                <p className="text-xs text-muted-foreground">
                  Puedes eliminar cualquier tarjeta en cualquier momento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarjeta</DialogTitle>
            <DialogDescription>
              Actualiza la información de tu tarjeta
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Nombre del Titular <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                value={editFormData.cardholderName}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, cardholderName: e.target.value.toUpperCase() });
                  setErrors({ ...errors, cardholderName: undefined });
                }}
                className={errors.cardholderName ? "border-destructive" : ""}
                maxLength={100}
              />
              {errors.cardholderName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.cardholderName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Fecha de Vencimiento <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    placeholder="MM"
                    value={editFormData.expiryMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setEditFormData({ ...editFormData, expiryMonth: value });
                      setErrors({ ...errors, expiryMonth: undefined });
                    }}
                    className={errors.expiryMonth ? "border-destructive" : ""}
                    maxLength={2}
                  />
                </div>
                <div>
                  <Input
                    placeholder="YY"
                    value={editFormData.expiryYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setEditFormData({ ...editFormData, expiryYear: value });
                      setErrors({ ...errors, expiryYear: undefined });
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCard} onOpenChange={() => setDeletingCard(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta tarjeta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La tarjeta terminada en {deletingCard?.lastFourDigits} será
              eliminada permanentemente de tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Tarjeta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
