"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Loader2Icon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Transaction } from "@/type";
import { updateTransaction } from "@/app/actions";
import { useCustomToast } from "@/lib/use-toast";

interface FormError {
  general?: string[];
  quantity?: string[];
  amount?: string[];
}

interface EditTransactionModalProps {
  transaction: Transaction;
  onSave: (updated: { id: string; quantity: number; amount: number }) => void;
}

export default function EditTransactionModal({
  transaction,
  onSave,
}: EditTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(transaction.amount);
  const [quantity, setQuantity] = useState<number>(
    typeof transaction.quantity === "number" ? transaction.quantity : 1
  );
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FormError>({});
  const { showToast } = useCustomToast();

  // Met à jour les champs si transaction change (sécurité)
  useEffect(() => {
    setAmount(transaction.amount);
    setQuantity(
      typeof transaction.quantity === "number" ? transaction.quantity : 1
    );
  }, [transaction]);

  const handleSave = () => {
    const newErrors: FormError = {};

    if (quantity <= 0) newErrors.quantity = ["La quantité doit être supérieure à zéro."];
    if (amount <= 0) newErrors.amount = ["Le montant doit être supérieur à zéro."];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        const result = await updateTransaction(transaction.id, {
          quantity,
          amount,
        });

        if (!result.success) {
          throw new Error(result.error || "Erreur inconnue");
        }

        showToast("success", "Succès", "Transaction mise à jour !");
        onSave({ id: transaction.id, quantity, amount });
        setOpen(false);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour cette transaction.";
        showToast("error", "Erreur", errorMessage);
        setErrors({ general: [errorMessage] });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors"
          aria-label="Modifier la transaction"
        >
          <Edit2 className="w-4 h-4 text-blue-600" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
         
          <DialogTitle>Modifier la transaction</DialogTitle>
            <DialogDescription>
            Modifier la transaction pour{" "}
            <span className="text-primary font-medium">
              {transaction.productName}
            </span>
            </DialogDescription>
        </DialogHeader>

        {/* Erreur générale */}
        {errors.general && (
          <p className="text-sm text-red-500 mt-2">{errors.general[0]}</p>
        )}

        <div className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Montant (XOF)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setAmount(isNaN(val) ? 0 : val);
                if (val > 0) {
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                }
              }}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              step={1}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuantity(isNaN(val) ? 0 : val);
                if (val >= 1) {
                  setErrors((prev) => ({ ...prev, quantity: undefined }));
                }
              }}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity[0]}</p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Annuler
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                Enregistrement...
                <Loader2Icon className="animate-spin ml-2 w-4 h-4" />
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
