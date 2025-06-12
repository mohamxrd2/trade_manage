"use server";

import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/productSchema";
import { revalidatePath } from "next/cache";

export async function checkAndAddUser(email: string | undefined) {
  if (!email) return;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: { email },
      });
      console.log("Nouvel utilisateur ajouté dans la base de données");
    } else {
      console.log("Utilisateur déjà présent dans la base de données");
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur:", error);
  }
}
export async function getProducts(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        products: {
          orderBy: {
            createdAt: "desc", // Trie du plus récent au plus ancien
          },
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    return user.products;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw error;
  }
}

export async function addProductAction(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    purchasePrice: formData.get("purchasePrice"),
    imageUrl: formData.get("imageUrl") || null,
    email: formData.get("email"),
  };

  if (!rawData.email || typeof rawData.email !== "string") {
    return { error: { email: ["Email requis"] } };
  }

  const validated = productSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const userDb = await prisma.user.findUnique({
    where: { email: rawData.email },
  });

  if (!userDb) {
    return { error: { email: ["Utilisateur non trouvé"] } };
  }

  const product = await prisma.product.create({
    data: {
      name: validated.data.name,
      quantity: validated.data.quantity,
      purchasePrice: validated.data.purchasePrice,
      imageUrl: validated.data.imageUrl,
      userId: userDb.id,
    },
  });

  revalidatePath("/products");

  return { success: true, product };
}

export async function deleteProductAction(productId: string) {
  try {
    const product = await prisma.product.delete({
      where: { id: productId },
    });

    return { success: true, product };
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return { error: "Erreur lors de la suppression du produit" };
  }
}

export async function editProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const quantity = Number(formData.get("quantity"));
  const purchasePrice = Number(formData.get("purchasePrice"));

  try {
    // Exemple avec Prisma (à adapter selon ta DB)
    await prisma.product.update({
      where: { id },
      data: { name, quantity, purchasePrice },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit", error);
    return { error: "Impossible de mettre à jour ce produit." };
  }
}
