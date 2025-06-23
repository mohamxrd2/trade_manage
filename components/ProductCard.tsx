import React from "react";
import { Package } from "lucide-react";
import { Product } from "@/type";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { DeleteProductButton } from "./DeleteProductButton";
import { EditProductModal } from "./EditProductModal";

interface ProductCardProps {
  product: Product;
  remainingQuantity: number;
  salePercentage: number;
  onDeleteSuccess: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  remainingQuantity,
  salePercentage,
  onDeleteSuccess,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card className="p-4 shadow-sm rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-1 @container/card bg-background">
        {/* Header */}
        <div className="flex items-start justify-between ">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground @[250px]/card:text-xl">
                {product.name}
              </h3>
              {salePercentage === 100 ? (
                <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold shadow-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30">
                  Rupture de stock
                </span>
              ) : salePercentage >= 90 ? (
                <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold shadow-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30">
                  Stock faible
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold shadow-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30">
                  En stock
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <EditProductModal
              product={product}
              onEditSuccess={onDeleteSuccess}
            />
            <DeleteProductButton
              productId={product.id}
              onSuccess={onDeleteSuccess}
            />
          </div>
        </div>

        {/* Stock et Date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="bg-muted px-2 py-1 rounded-md text-xs">
            Stock : {remainingQuantity} pièces
          </span>
          <span className="text-xs">
            Ajouté le {formatDate(product.createdAt)}
          </span>
        </div>

        {/* Progression */}
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium text-muted-foreground">
            <span>Progression</span>
            <span className="text-primary font-semibold">
              {salePercentage}%
            </span>
          </div>
          <Progress value={salePercentage} className="h-2 rounded-full" />
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;
