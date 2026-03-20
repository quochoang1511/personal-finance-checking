"use client"

import { TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

function formatCompactCurrency(amount: number) {
  if (Math.abs(amount) >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B`
  }
  if (Math.abs(amount) >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toLocaleString("vi-VN")
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Thu nhập",
      value: stats.totalIncome,
      icon: TrendingUp,
      color: "text-income",
      bgColor: "bg-income/10",
      borderColor: "border-income/20",
    },
    {
      title: "Chi tiêu",
      value: stats.totalExpense,
      icon: TrendingDown,
      color: "text-expense",
      bgColor: "bg-expense/10",
      borderColor: "border-expense/20",
    },
    {
      title: "Số dư",
      value: stats.balance,
      icon: Wallet,
      color: stats.balance >= 0 ? "text-income" : "text-expense",
      bgColor: stats.balance >= 0 ? "bg-income/10" : "bg-expense/10",
      borderColor: stats.balance >= 0 ? "border-income/20" : "border-expense/20",
    },
    {
      title: "Giao dịch",
      value: stats.transactionCount,
      icon: Receipt,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      isCount: true,
    },
  ]

  return (
    <>
      {/* Mobile: 2x2 Grid with compact design */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {cards.map((card) => (
          <Card 
            key={card.title} 
            className={`overflow-hidden border-l-4 ${card.borderColor}`}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className={`mt-1 text-lg font-bold tracking-tight ${card.color}`}>
                    {card.isCount ? card.value : formatCompactCurrency(card.value)}
                  </p>
                  {!card.isCount && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground truncate">
                      {formatCurrency(card.value)}
                    </p>
                  )}
                </div>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.isCount ? card.value : formatCurrency(card.value)}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
