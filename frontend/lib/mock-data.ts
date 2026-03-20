import { Transaction } from "@/springboot-api/models/transactionModel"
import type { User } from "./types"
import { useEffect, useState } from "react";
import { getCategory } from "@/springboot-api/services/categoryService";
import { Category } from "@/springboot-api/models/categoryModel";

export const mockUser: User = {
  id: 1,
  email: "user@example.com",
  fullName: "Nguyen Van A",
}



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
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
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

export function getCategoryStats(transactions: Transaction[],
  categories: Category[],
) {

  const currentUserId = 1

  const categoryNameById = new Map(
    categories.map((c) => [c.categoryId, c.name] as const)
  )
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Khác"
    return categoryNameById.get(categoryId) ?? "Khác"
  }
  const categoryMap = new Map<string, number>()

  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const categoryName = getCategoryName(t.categoryId) || "Khác"
      const current = categoryMap.get(categoryName) || 0
      categoryMap.set(categoryName, current + t.amount)
    })

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
  }))
}
