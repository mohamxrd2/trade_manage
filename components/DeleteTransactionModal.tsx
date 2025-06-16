"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/app/actions";
import { useCustomToast } from "@/lib/use-toast";

interface DeleteTransactionModalProps {
  transaction: {
    id: string;
    productName: string;
  };
  onDelete: (id: string) => void;
}

export default function DeleteTransactionModal({
  transaction,
  onDelete,
}: DeleteTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useCustomToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTransaction(transaction.id);

      if (result.success) {
        showToast("success", "Succès", "Transaction supprimée !");
        onDelete(transaction.id);
        setOpen(false);
      } else {
        showToast("error", "Erreur", result.error || "Échec de la suppression");
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
          aria-label="Supprimer la transaction"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Êtes-vous sûr de vouloir supprimer la transaction pour le produit{" "}
            <span className="font-medium text-primary">{transaction.productName}</span> ?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}