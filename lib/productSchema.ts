import { z } from "zod";

export const productSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z
    .string()
    .min(1, "Le nom est requis")
    .trim()
    .refine((val) => val.length > 0, "Le nom ne peut pas être vide"),

  quantity: z.coerce
    .number({ invalid_type_error: "Quantité doit être un nombre" })
    .int()
    .nonnegative()
    .positive("La quantité doit être supérieure à zéro"),

  purchasePrice: z.coerce
    .number({ invalid_type_error: "Prix d'achat doit être un nombre" })
    .nonnegative()
    .positive("Le prix doit être supérieur à zéro"),

  imageUrl: z.string().url("L'URL de l'image est invalide").optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;