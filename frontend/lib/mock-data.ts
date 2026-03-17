import type { Category, Transaction, User } from "./types"

export const mockUser: User = {
  id: 1,
  email: "user@example.com",
  fullName: "Nguyen Van A",
}

export const mockCategories: Category[] = [
  { id: 1, name: "Luong", description: "Thu nhap tu cong viec", defaultType: "INCOME" },
  { id: 2, name: "Thuong", description: "Thuong thang, thuong tet", defaultType: "INCOME" },
  { id: 3, name: "Dau tu", description: "Loi nhuan tu dau tu", defaultType: "INCOME" },
  { id: 4, name: "An uong", description: "Chi phi an uong hang ngay", defaultType: "EXPENSE" },
  { id: 5, name: "Di lai", description: "Xang xe, taxi, grab", defaultType: "EXPENSE" },
  { id: 6, name: "Mua sam", description: "Quan ao, do dung", defaultType: "EXPENSE" },
  { id: 7, name: "Giai tri", description: "Xem phim, du lich", defaultType: "EXPENSE" },
  { id: 8, name: "Hoa don", description: "Dien, nuoc, internet", defaultType: "EXPENSE" },
  { id: 9, name: "Suc khoe", description: "Kham benh, thuoc", defaultType: "EXPENSE" },
  { id: 10, name: "Khac", description: "Cac khoan khac", defaultType: "EXPENSE" },
]

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    amount: 15000000,
    description: "Luong thang 3",
    transactionDate: "2026-03-01T09:00:00",
    type: "INCOME",
    userId: 1,
    categoryId: 1,
    category: mockCategories[0],
  },
  {
    id: 2,
    amount: 2000000,
    description: "Thuong quy 1",
    transactionDate: "2026-03-05T10:30:00",
    type: "INCOME",
    userId: 1,
    categoryId: 2,
    category: mockCategories[1],
  },
  {
    id: 3,
    amount: 500000,
    description: "An nha hang cuoi tuan",
    transactionDate: "2026-03-08T19:00:00",
    type: "EXPENSE",
    userId: 1,
    categoryId: 4,
    category: mockCategories[3],
  },
  {
    id: 4,
    amount: 1200000,
    description: "Do xang xe",
    transactionDate: "2026-03-10T08:00:00",
    type: "EXPENSE",
    userId: 1,
    categoryId: 5,
    category: mockCategories[4],
  },
  {
    id: 5,
    amount: 3500000,
    description: "Mua quan ao moi",
    transactionDate: "2026-03-11T14:30:00",
    type: "EXPENSE",
    userId: 1,
    categoryId: 6,
    category: mockCategories[5],
  },
  {
    id: 6,
    amount: 800000,
    description: "Xem phim va an uong",
    transactionDate: "2026-03-12T20:00:00",
    type: "EXPENSE",
    userId: 1,
    categoryId: 7,
    category: mockCategories[6],
  },
  {
    id: 7,
    amount: 1500000,
    description: "Tien dien thang 2",
    transactionDate: "2026-03-13T10:00:00",
    type: "EXPENSE",
    userId: 1,
    categoryId: 8,
    category: mockCategories[7],
  },
  {
    id: 8,
    amount: 500000,
    description: "Loi nhuan co phieu",
    transactionDate: "2026-03-13T11:00:00",
    type: "INCOME",
    userId: 1,
    categoryId: 3,
    category: mockCategories[2],
  },
]

export function calculateStats(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  }
}

export function getMonthlyData(transactions: Transaction[]) {
  const months = [
    "Thang 1", "Thang 2", "Thang 3", "Thang 4", "Thang 5", "Thang 6",
    "Thang 7", "Thang 8", "Thang 9", "Thang 10", "Thang 11", "Thang 12"
  ]

  return months.map((month, index) => {
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.transactionDate)
      return date.getMonth() === index
    })

    const income = monthTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = monthTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)

    return { month, income, expense }
  })
}

export function getCategoryStats(transactions: Transaction[]) {
  const categoryMap = new Map<string, number>()

  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const categoryName = t.category?.name || "Khac"
      const current = categoryMap.get(categoryName) || 0
      categoryMap.set(categoryName, current + t.amount)
    })

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
  }))
}
