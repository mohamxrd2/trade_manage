"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon, Edit2 } from "lucide-react";
import { editProductAction } from "@/app/actions";
import { ProductFormError } from "@/type";
import { useCustomToast } from "@/lib/use-toast";

// Importe ton type personnalisé pour les erreurs


interface EditProductModalProps {
  product: {
    id: string;
    name: string;
    quantity: number;
    purchasePrice: number;
  };
  onEditSuccess: () => void;
}

export function EditProductModal({ product, onEditSuccess }: EditProductModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ProductFormError | null>(null);
  const [open, setOpen] = useState(false); // Contrôle d'ouverture
  const { showToast } = useCustomToast(); 

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const res = await editProductAction(formData);
      if (!res.success) {
        setError(res.error ? parseError(res.error) : null);
        showToast("error", "Erreur", "Impossible de modifier le produit");
      } else {
        setError(null);
        setOpen(false); // Ferme la modale
        onEditSuccess(); // Rafraîchit la liste
        showToast("success", "Succès", "Produit mis à jour !");
      }
    });
  };

  // Fonction pour parser l’erreur en respectant le type ProductFormError
  const parseError = (err: unknown): ProductFormError => {
    if (typeof err === "string") {
      return { general: [err] };
    } else if (err instanceof Error) {
      return { general: [err.message] };
    } else {
      return { general: ["Une erreur inconnue est survenue."] };
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors"
        >
          <Edit2 className="w-4 h-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations du produit.
            </DialogDescription>
          </DialogHeader>

          {/* Champ ID caché */}
          <Input type="hidden" name="id" value={product.id} />

          {/* Nom */}
          <div className="grid gap-2 py-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input id="name" name="name" defaultValue={product.name} />
            {error?.name && <p className="text-red-500 text-sm">{error.name[0]}</p>}
          </div>

          {/* Quantité */}
          <div className="grid gap-2 py-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input id="quantity" name="quantity" type="number" defaultValue={product.quantity} />
            {error?.quantity && <p className="text-red-500 text-sm">{error.quantity[0]}</p>}
          </div>

          {/* Prix d'achat */}
          <div className="grid gap-2 py-2">
            <Label htmlFor="purchasePrice">Prix d&apos;achat</Label>
            <Input id="purchasePrice" name="purchasePrice" type="number" defaultValue={product.purchasePrice} />
            {error?.purchasePrice && <p className="text-red-500 text-sm">{error.purchasePrice[0]}</p>}
          </div>

          {/* Affichage d'une erreur générale (optionnel) */}
          {error?.general && (
            <div className="text-red-500 text-sm mt-2">
              {error.general[0]}
            </div>
          )}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <>Mise à jour... <Loader2Icon className="animate-spin" /></> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}