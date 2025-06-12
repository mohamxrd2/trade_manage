"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchFilter from "@/components/ui/SearchFilter";
import Wrapper from "@/components/wrapper";
import {  Package, ShoppingBag } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getProducts } from "../actions";
import { Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import ProductCard from "@/components/ProductCard";
import { DialogDemo } from "@/components/product-modal";
import { SkeletonCardList } from "@/components/SkeletonCardList";

export default function Page() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const fetchProducts = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setLoading(true);
      try {
        const userProducts = await getProducts(
          user.primaryEmailAddress.emailAddress
        );
        setProducts(userProducts || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.primaryEmailAddress?.emailAddress]);

  const handleDeleteSuccess = () => {
    startTransition(() => {
      fetchProducts(); // Recharge la liste des produits
    });
  };

  return (
    <Wrapper>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
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

            {/* Bouton d'ajout avec rafraîchissement */}
            <DialogDemo onAddSuccess={fetchProducts} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Total produits */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
              <Card className="@container/card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {products.length}
                      </CardTitle>
                      <CardDescription>Totales produits</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Valeur totale */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
              <Card className="@container/card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                        }).format(2000)}
                      </CardTitle>
                      <CardDescription>Valeur totale</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Stock faible */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
              <Card className="@container/card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        20
                      </CardTitle>
                      <CardDescription>Stock faible</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
        />

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
