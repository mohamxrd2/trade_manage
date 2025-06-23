"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchFilter from "@/components/ui/SearchFilter";
import Wrapper from "@/components/wrapper";
import { Package, ShoppingBag } from "lucide-react";

import { Product } from "@/type";

import ProductCard from "@/components/ProductCard";
import { DialogDemo } from "@/components/product-modal";
import { SkeletonCardList } from "@/components/SkeletonCardList";
import { getLowStockCount, getNetRevenue, getProducts, getRemainingQuantity, getSalePercentage } from "@/app/actions";

type ProductWithRemaining = Product & {
  remainingQuantity: number;
  salePercentage: number;
};

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type ProductPageProps = {
  user?: User ;
};

export default function ProductPage({ user }: ProductPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductWithRemaining[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  const [lowStockCount, setLowStockCount] = useState(0);
  const [netRevenue, setNetRevenue] = useState<number>(0);

  const fetchProducts = async (): Promise<void> => {
    const email = user?.email;
    if (!email) return;

    setLoading(true);
    try {
      // Typage explicite de userProducts pour éviter implicit any
      const userProducts: Product[] = await getProducts(email);

      const productsWithRemaining: ProductWithRemaining[] = await Promise.all(
        userProducts.map(async (product: Product) => {
          const remaining = await getRemainingQuantity(product.id);
          const salePercent = await getSalePercentage(product.id);

          return {
            ...product,
            remainingQuantity:
              remaining.success && remaining.remainingQuantity
                ? remaining.remainingQuantity
                : 0,
            salePercentage:
              salePercent.success && salePercent.percentage
                ? salePercent.percentage
                : 0,
          };
        })
      );

      setProducts(productsWithRemaining || []);

      const lowStock = await getLowStockCount(email);
      setLowStockCount(lowStock.count || 0);

      const revenue = await getNetRevenue(email);
      setNetRevenue(revenue || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.email]);

  const handleDeleteSuccess = (): void => {
    startTransition(() => {
      fetchProducts();
    });
  };

  return (
    <Wrapper user={user}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  Gestion des Produits
                </h1>
                <p className="text-muted-foreground">
                  Gérez votre inventaire facilement
                </p>
              </div>
            </div>
            <DialogDemo user={user} onAddSuccess={fetchProducts} />
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Total produits */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      {products.length}
                    </CardTitle>
                    <CardDescription>Totales produits</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Valeur totale */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      }).format(netRevenue)}
                    </CardTitle>
                    <CardDescription>Valeur totale</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Stock faible */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      {lowStockCount}
                    </CardTitle>
                    <CardDescription>Stock faible</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Barre de recherche */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
        />

        {/* Liste des produits */}
        <div className="mt-6">
          {loading ? (
            <SkeletonCardList count={2} />
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Aucun produit trouvé.</p>
              <p className="text-sm text-gray-400 mt-2">
                Essayez d’ajouter un nouveau produit ou ajustez votre recherche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {products
                .filter((product) =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    remainingQuantity={product.remainingQuantity}
                    salePercentage={product.salePercentage}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
