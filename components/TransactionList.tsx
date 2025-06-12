"use client";

import React from "react";
import { ShoppingCart, Calendar, BanknoteArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/type";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteSuccess?: (saleId: string) => void;
}

// ✅ Étend les types autorisés pour variant ici aussi pour éviter l'erreur TS
type BadgeVariant = "default" | "destructive" | "secondary" | "outline" | "success";

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTypeVariant = (type: Transaction["type"]): BadgeVariant => {
    switch (type) {
      case "SALE":
        return "success";
      case "EXPENSE":
        return "destructive";
      default:
        return "default";
    }
  };

  if (!transactions.length) {
    return (
      <Card className="bg-card text-card-foreground">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Aucune transaction</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Commencez par enregistrer votre première vente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Transactions récentes</CardTitle>
        <CardDescription>Liste des ventes effectuées.</CardDescription>
      </CardHeader>

      <ScrollArea className="max-h-[500px] px-6">
        <div className="space-y-4 pb-6">
          {transactions.map((transaction) => {
            const variant = getTypeVariant(transaction.type);

            return (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border bg-card hover:bg-accent transition-colors gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BanknoteArrowUp className="h-6 w-6 text-primary" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{transaction.name}</h4>
                      <Badge variant={variant}>
                        {transaction.type === "SALE" ? "Vente" : "Dépense"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(new Date(transaction.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-lg font-bold">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  {transaction.quantity && transaction.quantity > 1 && (
                    <p className="text-sm text-muted-foreground">
                      {transaction.quantity} ×{" "}
                      {formatCurrency(transaction.amount / transaction.quantity)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
