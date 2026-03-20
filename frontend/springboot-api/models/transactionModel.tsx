export type Transaction = {
    transactionId: number;
    amount: number;
    description?: string;
    transactionDate: string;
    type: string;
    userId: number;
    categoryId: number;
};

export type TransactionRequest = {
    amount: number
    description?: string
    type: string
    categoryId?: number
    transactionDate: string
  }