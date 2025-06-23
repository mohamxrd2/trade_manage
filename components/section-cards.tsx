'use client';

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Product } from "@/type";


import {
  getProducts,
  getNetRevenue,
  getLowStockCount,
  getTotalRemainingQuantity,
} from "@/app/actions";
import { SkeletonCardList } from "./SkeletonCardList";

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type SectionCardProps = {
  user?: User;
};

export function SectionCards({user}: SectionCardProps) {

  const [products, setProducts] = useState<Product[]>([]);
  const [netRevenue, setNetRevenue] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [totalRemainingQuantity, setTotalRemainingQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async () => {
    const email = user?.email;
    if (email) {
      setLoading(true);
      try {
        const [userProducts, revenue, lowStock, totalRemaining] =
          await Promise.all([
            getProducts(email),
            getNetRevenue(email),
            getLowStockCount(email),
            getTotalRemainingQuantity(email),
          ]);

        setProducts(userProducts || []);
        setNetRevenue(revenue || 0);
        setLowStockCount(lowStock.count || 0);
        setTotalRemainingQuantity(totalRemaining || 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setProducts([]);
        setNetRevenue(0);
        setLowStockCount(0);
        setTotalRemainingQuantity(0);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.email]);

  return (
    <>
      {loading ? (
        <SkeletonCardList count={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {/* Revenu total */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Revenu total</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                }).format(netRevenue)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  +12.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>

          {/* Nombre de produits */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Nombre de produits</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {products.length}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingDown />
                  -20%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Down 20% this period <IconTrendingDown className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Acquisition needs attention
              </div>
            </CardFooter>
          </Card>

          {/* Quantité restante */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Quantité restante</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {new Intl.NumberFormat("fr-FR").format(totalRemainingQuantity)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  +12.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Strong user retention <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Engagement exceed targets
              </div>
            </CardFooter>
          </Card>

          {/* Stock faibles */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Stock faibles</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {lowStockCount}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  +4.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Steady performance increase <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">Meets growth projections</div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
