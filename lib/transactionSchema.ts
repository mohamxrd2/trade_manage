// schema/transactionSchema.ts
import { z } from "zod";

export function getSaleFormSchema(remainingQuantity: number) {
  return z.object({
    productName: z.string().min(1, "Le nom du produit est requis"),
    quantity: z
      .number()
      .int()
      .positive("La quantité doit être supérieure à zéro")
      .max(remainingQuantity, `La quantité ne peut pas dépasser ${remainingQuantity}`),
    amount: z.number().positive("Le montant doit être supérieur à zéro"),
  });
}