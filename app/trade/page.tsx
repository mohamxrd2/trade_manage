import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, CreditCard } from "lucide-react";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/type";

export default function Page() {
  // Simule des données (tu pourras les remplacer plus tard)
  const totalRevenue = 1285000; // en FCFA

 
  const transactions: Transaction[] = [
    {
      id: "1",
      name: "Ordinateur HP",
      amount: 100000,
      quantity: 2,
      type: "SALE",
      productId: null,
      userId: "user1",
      createdAt: new Date("2025-06-10"),
      updatedAt: new Date("2025-06-10"),
    },
    {
      id: "2",
      name: "Smartphone Infinix",
      amount: 150000,
      quantity: 1,
      type: "EXPENSE",
      productId: null,
      userId: "user2",
      createdAt: new Date("2025-06-09"),
      updatedAt: new Date("2025-06-09"),
    },
    {
      id: "3",
      name: "Casque Bluetooth",
      amount: 85000,
      quantity: 1,
      type: "EXPENSE",
      productId: null,
      userId: "user3",
      createdAt: new Date("2025-06-08"),
      updatedAt: new Date("2025-06-08"),
    },
  ];
  

  return (
    <Wrapper>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header avec bouton */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Ventes</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Nouvelle vente
          </Button>
        </div>

        {/* Carte des revenus */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalRevenue.toLocaleString("fr-FR")} FCFA
            </div>
            <p className="text-xs text-muted-foreground mt-1">Mise à jour aujourd’hui</p>
          </CardContent>
        </Card>

        {/* Liste des transactions */}
        <div className="border rounded-xl divide-y divide-border overflow-hidden">
         
         
            <TransactionList transactions={transactions} />
       
        </div>
      </div>
    </Wrapper>
  );
}
