"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Product, Transaction } from "@/type";

import { createTransaction, getProducts } from "@/app/actions";
import { useCustomToast } from "@/lib/use-toast";
import { cn } from "@/lib/utils";
import { getSaleFormSchema } from "@/lib/transactionSchema";

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

interface AddSaleFormProps {
  onAdd: (transaction: Transaction) => void;
  onClose: () => void;
  user: User;
}

export default function AddSaleForm({ onAdd, onClose, user }: AddSaleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localLoading, setLocalLoading] = useState(false);

  const { showToast } = useCustomToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const email = user?.email;
      if (!email) return;

      try {
        const data = await getProducts(email);
        const validProducts = data.filter((p) => p && p.name);
        setProducts(validProducts);
      } catch (err) {
        console.error("Erreur lors de la récupération des produits:", err);
        showToast("error", "Erreur", "Impossible de charger les produits.");
      }
    };

    fetchProducts();
  }, [user?.email, showToast]);

  const handleSave = async () => {
    const email = user?.email;

    if (!email) {
      showToast("error", "Erreur", "Utilisateur non connecté");
      return;
    }

    if (!productId) {
      setErrors({ productName: "Veuillez sélectionner un produit." });
      return;
    }

    // Utilisation d'une limite haute arbitraire pour la validation locale (ex: 1 million)
    const schema = getSaleFormSchema(1000000);

    const formData = {
      productName: productName.trim(),
      quantity,
      amount,
    };

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.errors.reduce((acc, error) => {
        acc[error.path[0] as string] = error.message;
        return acc;
      }, {} as Record<string, string>);

      setErrors(fieldErrors);
      showToast("error", "Erreur", "Corrigez les erreurs dans le formulaire.");
      return;
    }

    setErrors({});
    setLocalLoading(true); // Bloque immédiatement le bouton

    startTransition(async () => {
      try {
        const result = await createTransaction({
          name: formData.productName,
          productId,
          amount: formData.amount,
          quantity: formData.quantity,
          type: "SALE",
          email,
        });

        if (result.success && result.transaction) {
          showToast("success", "Succès", "Vente ajoutée !");
          onAdd(result.transaction as Transaction);
          onClose();
        } else {
          showToast("error", "Erreur", result.error || "Échec de l'enregistrement.");
        }
      } catch (err) {
        console.error("Erreur lors de l'ajout de la vente :", err);
        showToast("error", "Erreur", "Une erreur est survenue.");
      } finally {
        setLocalLoading(false);
      }
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Ajouter une nouvelle vente</h2>

      {/* Sélection du produit */}
      <div className="space-y-2">
        <Label>Produit</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("w-full justify-between")}
            >
              {productName || "Choisir un produit..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Rechercher un produit..." />
              <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => {
                      setProductName(product.name);
                      setProductId(product.id);
                      setOpen(false);
                    }}
                    className={errors.productName ? "border-red-500 focus:border-red-500" : ""}
                  >
                    {product.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.productName && <p className="text-sm text-red-500">{errors.productName}</p>}
      </div>

      {/* Quantité */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantité vendue</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          step={1}
          value={quantity === 0 ? "" : quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setQuantity(isNaN(val) ? 0 : Math.max(1, val));
          }}
          className={errors.quantity ? "border-red-500 focus:border-red-500" : ""}
        />
        {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
      </div>

      {/* Prix unitaire */}
      <div className="space-y-2">
        <Label htmlFor="amount">Prix unitaire (FCFA)</Label>
        <Input
          id="amount"
          type="number"
          min={0.01}
          step={0.01}
          value={amount === 0 ? "" : amount}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setAmount(isNaN(val) ? 0 : Math.max(0.01, val));
          }}
          className={errors.amount ? "border-red-500 focus:border-red-500" : ""}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isPending || localLoading}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={isPending || localLoading}>
          {(isPending || localLoading) ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Enregistrement...
            </>
          ) : (
            "Ajouter"
          )}
        </Button>
      </div>
    </div>
  );
}
