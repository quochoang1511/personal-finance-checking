export type TransactionType = "INCOME" | "EXPENSE"

export interface User {
  id: number
  email: string
  fullName: string
  password?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  defaultType: TransactionType
}

export interface Transaction {
  id: number
  amount: number
  description?: string
  transactionDate: string
  type: TransactionType
  userId: number
  categoryId?: number
  category?: Category
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
}
