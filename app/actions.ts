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


  
export async function getTransactions(email: string) {
    try {
      // Étape 1 : Récupérer l'utilisateur avec ses produits
      const user = await prisma.user.findUnique({
        where: { email },
        include: { products: true },
      });
  
      if (!user) {
        throw new Error("Utilisateur non trouvé.");
      }
  
      const productIds = user.products.map((p) => p.id);
  
      // Étape 2 : Récupérer toutes les transactions de ces produits
      const transactions = await prisma.transaction.findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
        include: {
          product: true, // pour avoir product.name
        },
        orderBy: {
          createdAt: "desc",
        },
      });
     
  
      // Étape 3 : Formatage
      return transactions.map((t) => ({
        id: t.id,
        name: t.name,
        amount: Number(t.amount),
        quantity: Number(t.quantity),
        type: t.type,
        productId: t.productId,
        userId: t.userId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        productName: t.product?.name ?? "Produit inconnu",
       
      }));
    
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
      throw new Error("Impossible de charger les transactions");
    }
  }

  export async function updateTransaction(id: string, data: { quantity: number; amount: number }) {
    try {
      const updated = await prisma.transaction.update({
        where: { id },
        data: {
          quantity: data.quantity,
          amount: data.amount,
        },
      });
  
      // Facultatif : revalider une page statique si nécessaire
      // revalidatePath("/transactions");
  
      return { success: true, transaction: updated };
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      return { success: false, error: "Échec de la mise à jour de la transaction." };
    }
  }

  export async function getNetRevenue(email: string): Promise<number> {
    try {
      // 1. Récupérer l'utilisateur avec ses produits
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          products: true,
        },
      });
  
      if (!user) {
        throw new Error("Utilisateur non trouvé.");
      }
  
      const productIds = user.products.map((p) => p.id);
  
      // 2. Récupérer les transactions liées à ses produits
      const transactions = await prisma.transaction.findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
      });
  
      // 3. Calcul des revenus
      const totalSales = transactions
        .filter((t) => t.type === "SALE")
        .reduce((sum, t) => sum + Number(t.amount) * Number(t.quantity), 0);
  
      const totalExpenses = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount) * Number(t.quantity), 0);
  
      return totalSales - totalExpenses;
  
    } catch (error) {
      console.error("Erreur lors du calcul du revenu net :", error);
      throw new Error("Échec du calcul du revenu net.");
    }
  }
  
  export async function deleteTransaction(id: string) {
    try {
      await prisma.transaction.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      return { success: false, error: "Impossible de supprimer cette transaction" };
    }
  }

  // ../actions.ts

// app/actions.ts

export async function createTransaction({
    email,
    productId,
    quantity,
    amount,
    name,
    type,
  }: {
    email: string;
    productId: string | null;
    quantity: number;
    amount: number;
    name: string;
    type: "SALE" | "EXPENSE";
  }) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) throw new Error("Utilisateur non trouvé");
  
      const transaction = await prisma.transaction.create({
        data: {
          name,
          type,
          quantity,
          amount,
          userId: user.id,
          productId: productId ?? undefined,
        },
      });
  
      return {
        success: true,
        transaction,
      };
    } catch (error) {
      console.error("Erreur lors de la création de la transaction:", error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'ajout de la transaction.",
      };
    }
  }

  export async function getRemainingQuantity(productId: string) {
    try {
      // 1. Récupère le produit
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!product) {
        throw new Error("Produit non trouvé.");
      }
  
      // 2. Récupère toutes les transactions de type SALE liées à ce produit
      const sales = await prisma.transaction.findMany({
        where: {
          productId,
          type: "SALE",
        },
      });
  
      // 3. Calcule la somme des quantités vendues
      const totalSoldQuantity = sales.reduce((sum, t) => sum + t.quantity, 0);
  
      // 4. Calcule la quantité restante
      const remainingQuantity = product.quantity - totalSoldQuantity;
  
      return {
        success: true,
        productId,
        remainingQuantity: Math.max(0, remainingQuantity), // jamais négatif
      };
    } catch (error) {
      console.error("Erreur lors du calcul de la quantité restante :", error);
      return {
        success: false,
        error: "Impossible de calculer la quantité restante.",
      };
    }
  }
  
  
  