"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/productSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
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

  export async function getSalePercentage(productId: string) {
    try {
      // 1. Récupérer le produit
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!product) {
        throw new Error("Produit non trouvé.");
      }
  
      // 2. Récupérer les transactions de type SALE
      const sales = await prisma.transaction.findMany({
        where: {
          productId,
          type: "SALE",
        },
      });
  
      // 3. Calculer la somme des quantités vendues
      const totalSoldQuantity = sales.reduce((sum, t) => sum + t.quantity, 0);
  
      // 4. Calculer le pourcentage
      const percentage = product.quantity > 0
        ? (totalSoldQuantity * 100) / product.quantity
        : 0;
  
      return {
        success: true,
        percentage: Math.min(100, Math.round(percentage)), // jamais plus de 100%, arrondi
        totalSoldQuantity,
      };
    } catch (error) {
      console.error("Erreur dans getSalePercentage:", error);
      return {
        success: false,
        error: "Impossible de calculer le pourcentage de vente.",
      };
    }
  }
  export async function getLowStockCount(userEmail: string) {
    try {
      // 1. Récupérer tous les produits de l'utilisateur
      const products = await prisma.product.findMany({
        where: {
          user: {
            email: userEmail,
          },
        },
      });
  
      let lowStockCount = 0;
  
      // 2. Vérifier chaque produit
      for (const product of products) {
        const sales = await prisma.transaction.findMany({
          where: {
            productId: product.id,
            type: "SALE",
          },
        });
  
        const totalSoldQuantity = sales.reduce((sum, t) => sum + t.quantity, 0);
  
        const percentage = product.quantity > 0
          ? (totalSoldQuantity * 100) / product.quantity
          : 0;
  
        if (percentage >= 90) {
          lowStockCount++;
        }
      }
  
      return {
        success: true,
        count: lowStockCount,
      };
    } catch (error) {
      console.error("Erreur dans getLowStockCount:", error);
      return {
        success: false,
        count: 0,
        error: "Impossible de récupérer les stocks faibles.",
      };
    }
  }

  export async function getTotalRemainingQuantity(email: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) return 0;
  
      const products = await prisma.product.findMany({
        where: { userId: user.id },
      });
  
      if (products.length === 0) return 0;
  
      const salesGrouped = await prisma.transaction.groupBy({
        by: ["productId"],
        where: {
          productId: { in: products.map((p) => p.id) },
          type: "SALE",
        },
        _sum: { quantity: true },
      });
  
      const salesMap = new Map(
        salesGrouped.map((sale) => [sale.productId, sale._sum.quantity || 0])
      );
  
      const totalRemaining = products.reduce((total, product) => {
        const soldQty = salesMap.get(product.id) || 0;
        const remaining = product.quantity - soldQty;
        return total + Math.max(0, remaining);
      }, 0);
  
      return totalRemaining;
    } catch (error) {
      console.error("Erreur lors du calcul de la quantité totale restante :", error);
      return 0;
    }
  }
  
  


  
  
  