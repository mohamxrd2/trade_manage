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
    quantity: number;
    type: 'SALE' | 'EXPENSE';
    productId?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    productName: string; // ce champ est ajouté manuellement dans le mapping
    
  };
  
 

  export interface ProductFormError {
    name?: string[];
    quantity?: string[];
    purchasePrice?: string[];
    imageUrl?: string[];
    general?: string[]; // Erreur générale en haut du formulaire
  }
  