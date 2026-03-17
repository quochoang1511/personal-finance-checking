"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { Button } from "@/components/ui/button"
import {
  mockTransactions,
  mockCategories,
  calculateStats,
  getMonthlyData,
  getCategoryStats,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const [openForm, setOpenForm] = useState(false)
  const stats = calculateStats(mockTransactions)
  const monthlyData = getMonthlyData(mockTransactions)
  const categoryStats = getCategoryStats(mockTransactions)

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <MobileHeader />
      <main className="min-h-screen pb-6 pt-2 lg:ml-64 lg:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between px-4 lg:mb-8 lg:px-0">
          <div>
            <h1 className="text-xl font-bold text-foreground lg:text-3xl">Tong quan</h1>
            <p className="text-sm text-muted-foreground lg:text-base">
              Quan ly tai chinh ca nhan
            </p>
          </div>
          <Button
            onClick={() => setOpenForm(true)}
            size="lg"
            className="gap-2 rounded-xl lg:h-11 lg:px-6"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Them giao dich</span>
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-4 lg:space-y-6 lg:px-0">
          <StatsCards stats={stats} />

          {/* Charts Grid */}
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            <OverviewChart data={monthlyData} />
            <CategoryChart data={categoryStats} />
          </div>

          <RecentTransactions transactions={mockTransactions} />
        </div>

        {/* Transaction Form */}
        <TransactionForm
          open={openForm}
          onOpenChange={setOpenForm}
          categories={mockCategories}
          onSubmit={(data) => {
            console.log("New transaction:", data)
            // API call se duoc them sau
          }}
        />
      </main>
    </div>
  )
}
