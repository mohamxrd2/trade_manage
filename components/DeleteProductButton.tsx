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
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/app/actions";
import { useCustomToast } from "@/lib/use-toast";

// ✅ Ajout de la prop onSuccess
export function DeleteProductButton({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess: () => void; // Fonction appelée après suppression
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const { showToast } = useCustomToast(); //

  const handleDelete = () => {
    startTransition(async () => {
        const res = await deleteProductAction(productId);
        if (!res.success) {
          showToast("error", "Erreur", "Impossible de supprimer le produit");
        } else {
          showToast("success", "Succès", "Produit supprimé !");
          setOpen(false);
          onSuccess();
        }
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Êtes-vous sûr ?</DialogTitle>
          <DialogDescription>
            Cette action supprimera définitivement le produit. Vous ne pourrez pas revenir en arrière.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}