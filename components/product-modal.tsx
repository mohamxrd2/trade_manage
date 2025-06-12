"use client";

import { useUser } from "@clerk/nextjs";
import { useRef, useState, useTransition } from "react";
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
import { Loader2Icon, Plus } from "lucide-react";
import { addProductAction } from "@/app/actions";
import { ProductFormError } from "@/type";
import { useCustomToast } from "@/lib/use-toast";

export function DialogDemo({ onAddSuccess }: { onAddSuccess: () => void }) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const [error, setError] = useState<ProductFormError | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false); // Contrôle d'ouverture du dialog

  const { showToast } = useCustomToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("email", email || "");

    startTransition(async () => {
      const res = await addProductAction(formData);
      if (!res.error) {
        setError(null);
        formRef.current?.reset(); // Réinitialise les champs
        setOpen(false); // ✅ Fermer la modale
        onAddSuccess(); // Rafraîchir la liste des produits
        showToast("success", "Succès", "Produit ajouté !");
      } else {
        setError(res.error);
        showToast("error", "Erreur", "Impossible d'ajouter le produit");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-700 rounded-xl shadow-md transition-transform hover:scale-105 hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Nouveau produit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
            <DialogDescription>
              Ajouter un produit pour gérer les inventaires.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input type="hidden" name="email" value={email || ""} />

            {/* Champ Nom du produit */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                name="name"
                className={
                  error?.name ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {error?.name && (
                <p className="text-red-500 text-sm">{error.name[0]}</p>
              )}
            </div>

            {/* Champ Quantité */}
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                className={
                  error?.quantity ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {error?.quantity && (
                <p className="text-red-500 text-sm">{error.quantity[0]}</p>
              )}
            </div>

            {/* Champ Prix d'achat */}
            <div className="grid gap-2">
              <Label htmlFor="purchasePrice">Prix d&apos;achat</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                className={
                  error?.purchasePrice
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {error?.purchasePrice && (
                <p className="text-red-500 text-sm">{error.purchasePrice[0]}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  Ajout... <Loader2Icon className="animate-spin" />
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
