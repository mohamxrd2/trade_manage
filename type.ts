// types.ts



export type Product = {
    id: string;
    name: string;
    quantity: number;
    purchasePrice: number;
    imageUrl?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };


  
  export type Transaction = {
    id: string;
    name: string;
    amount: number;
    quantity: number; // ✅ Ajouté ici
    type: 'SALE' | 'EXPENSE';
    productId?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  


  export interface ProductFormError {
    name?: string[];
    quantity?: string[];
    purchasePrice?: string[];
    imageUrl?: string[];
    general?: string[]; // Erreur générale en haut du formulaire
  }
  