// components/TransactionList.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  BanknoteArrowUp,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchFilter from "./ui/SearchFilter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";
import { Transaction } from "@/type";


interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onUpdateTransaction: (updated: {
    id: string;
    quantity: number;
    amount: number;
  }) => void;
  onDeleteTransaction: (id: string) => void;
}

type BadgeVariant =
  | "default"
  | "destructive"
  | "secondary"
  | "outline"
  | "success";

export default function TransactionList({
  transactions: initialTransactions,
  loading,
  onUpdateTransaction,
  onDeleteTransaction,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(value);

  const getTypeVariant = (type: string): BadgeVariant => {
    switch (type) {
      case "SALE":
        return "success";
      case "EXPENSE":
        return "destructive";
      default:
        return "default";
    }
  };

  // 🔐 Sécurité ici : on s'assure que productName existe
  const filteredTransactions = transactions.filter((transaction) => {
    const name = transaction.productName?.toLowerCase() || "inconnu";
    const search = searchTerm.toLowerCase();
    return name.includes(search);
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdateTransaction = (updated: {
    id: string;
    quantity: number;
    amount: number;
  }) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === updated.id
          ? { ...t, quantity: updated.quantity, amount: updated.amount }
          : t
      )
    );

    onUpdateTransaction(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    onDeleteTransaction(id);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="animate-spin w-6 h-6 text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!transactions.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BanknoteArrowUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Aucune transaction</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Commencez par enregistrer votre première vente ou dépense.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <CardTitle>Transactions récentes</CardTitle>
            <CardDescription>Liste des ventes et dépenses effectuées</CardDescription>
          </div>
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du produit</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => {
              const variant = getTypeVariant(transaction.type);
              const quantity =
                typeof transaction.quantity === "number"
                  ? transaction.quantity
                  : Number(transaction.quantity) || 1;

              return (
                <TableRow key={transaction.id} className="group">
                  <TableCell className="font-medium">
                    {transaction.productName || "Inconnu"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>
                      {transaction.type === "SALE" ? "Vente" : "Dépense"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className={
                        transaction.type === "SALE"
                          ? "text-green-600 dark:text-green-400 font-semibold"
                          : "text-red-600 dark:text-red-400 font-semibold"
                      }
                    >
                      {transaction.type === "SALE" ? "+" : "-"}
                      {formatCurrency(quantity * transaction.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {quantity} × {formatCurrency(transaction.amount)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditTransactionModal
                        transaction={transaction}
                        onSave={handleUpdateTransaction}
                      />
                      <DeleteTransactionModal
                        transaction={transaction}
                        onDelete={handleDeleteTransaction}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2 text-sm">
            <span>Lignes par page :</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent className="flex items-center gap-4">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm">
                  Page {currentPage} sur {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}