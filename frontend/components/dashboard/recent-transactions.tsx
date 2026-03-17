"use client"

import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/types"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

function formatCompactCurrency(amount: number) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toLocaleString("vi-VN")
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Hom nay"
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Hom qua"
  }
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  })
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    )
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 lg:pb-4">
        <CardTitle className="text-base lg:text-lg">Giao dich gan day</CardTitle>
        <Link href="/transactions">
          <Button variant="ghost" size="sm" className="h-8 text-xs lg:text-sm">
            Xem tat ca
            <ChevronRight className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-3 pb-3 lg:px-6 lg:pb-6">
        {/* Mobile List View */}
        <div className="space-y-2 lg:hidden">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition-colors active:bg-muted"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  transaction.type === "INCOME"
                    ? "bg-income/15"
                    : "bg-expense/15"
                }`}
              >
                {transaction.type === "INCOME" ? (
                  <ArrowDownLeft className="h-5 w-5 text-income" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-expense" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {transaction.description || transaction.category?.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{transaction.category?.name}</span>
                  <span className="shrink-0">·</span>
                  <span className="shrink-0">{formatDate(transaction.transactionDate)}</span>
                </div>
              </div>
              <p
                className={`shrink-0 text-sm font-semibold tabular-nums ${
                  transaction.type === "INCOME"
                    ? "text-income"
                    : "text-expense"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatCompactCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Card View */}
        <div className="hidden space-y-3 lg:block">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${
                    transaction.type === "INCOME"
                      ? "bg-income/10"
                      : "bg-expense/10"
                  }`}
                >
                  {transaction.type === "INCOME" ? (
                    <ArrowDownLeft className="h-4 w-4 text-income" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-expense" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.description || transaction.category?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category?.name} -{" "}
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>
              <p
                className={`font-semibold ${
                  transaction.type === "INCOME"
                    ? "text-income"
                    : "text-expense"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
