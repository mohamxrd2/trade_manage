"use client";

import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/type";
import { useState, useEffect } from "react";
import { CreditCard, PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddSaleForm from "@/components/AddSaleModal";
import { getNetRevenue, getTransactions } from "@/app/actions";

type User = {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
  };
  
  type TradePageProps = {
    user: User ;
  };

export default function TradePage({ user }: TradePageProps) {
 
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [netRevenue, setNetRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [updatingRevenue, setUpdatingRevenue] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); // <-- ajout de l'état modal

  const loadData = async () => {
    const email = user?.email;
    if (!email) return;

    setLoading(true);
    try {
      const [data, revenue] = await Promise.all([
        getTransactions(email),
        getNetRevenue(email),
      ]);
      setTransactions(data);
      setNetRevenue(revenue);
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [ user?.email]);

  const handleUpdateTransaction = async (updated: {
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

    const email =  user?.email;
    if (!email) return;

    setUpdatingRevenue(true);
    try {
      const revenue = await getNetRevenue(email);
      setNetRevenue(revenue);
    } catch (error) {
      console.error("Erreur lors du recalcul du revenu", error);
    } finally {
      setUpdatingRevenue(false);
    }
  };

  

  const handleDeleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  
    const email =  user?.email;
    if (!email) return;
  
    setUpdatingRevenue(true);
    try {
      const revenue = await getNetRevenue(email);
      setNetRevenue(revenue);
    } catch (error) {
      console.error("Erreur lors du recalcul du revenu", error);
    } finally {
      setUpdatingRevenue(false);
    }
  };
  

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    loadData(); // Rechargement du revenu après ajout
  };

  return (
    <Wrapper user={user}>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Ventes</h1>

          {/* 💡 Bouton avec modale intégrée */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Nouvelle vente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle vente</DialogTitle>
              </DialogHeader>
              <AddSaleForm
                onAdd={handleAddTransaction}
                onClose={() => setShowAddForm(false)}
                user={user}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Revenus totaux */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenus totaux
            </CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold text-primary ${
                updatingRevenue ? "opacity-50 animate-pulse" : ""
              }`}
            >
              {netRevenue.toLocaleString("fr-FR")} FCFA
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mise à jour automatique
            </p>
          </CardContent>
        </Card>

        {/* Liste des transactions */}
        <div className="border rounded-xl divide-y divide-border overflow-hidden">
          <TransactionList
            transactions={transactions}
            loading={loading}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      </div>
    </Wrapper>
  );
}
