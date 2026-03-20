"use client"

import { useEffect, useState } from "react"
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
  calculateStats,
  getMonthlyData,
  getCategoryStats,
} from "@/lib/mock-data"
import { Transaction, TransactionRequest } from "@/springboot-api/models/transactionModel"
import { addTransaction, getTransactionByUserId } from "@/springboot-api/services/transactionService"
import { toast } from "sonner"
import { getCategory } from "@/springboot-api/services/categoryService"
import { Category } from "@/springboot-api/models/categoryModel"

export default function DashboardPage() {
  const currentUserId = 1;
  const [openForm, setOpenForm] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const response = await getCategory(currentUserId);
      if (response?.data) {
        setCategories(response.data as Category[] | []);
      } else {
        toast.error(response.message);
      }
    }
    fetchCategories();
  }, [])

  useEffect(() => {
    async function fetchTransactions() {
      const response = await getTransactionByUserId(currentUserId);
      if (response?.success === true) {
        setTransactions(response.data as Transaction[] | []);
      } else {
        toast.error(response.message);
      }
    }
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (data: TransactionRequest) => {
    const transactionId = 1;
    if (!data.categoryId) {
      toast.error("Vui lòng chọn danh mục")
      return
    }
    const requestBody = {
      transactionId,
      ...data,
      userId: currentUserId,
      description: data.description || "",
      categoryId: data.categoryId ?? 0,
    }
    const result = await addTransaction(requestBody)
    if (result?.success === true) {
      setTransactions(prev => [...prev, result.data])
      toast.success(result.message)
    }
  }

  const stats = calculateStats(transactions)
  const monthlyData = getMonthlyData(transactions)
  const categoryStats = getCategoryStats(transactions, categories)
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
            <h1 className="text-xl font-bold text-foreground lg:text-3xl">Tổng quan</h1>
            <p className="text-sm text-muted-foreground lg:text-base">
              Quản lý tài chính cá nhân
            </p>
          </div>
          <Button
            onClick={() => setOpenForm(true)}
            size="lg"
            className="gap-2 rounded-xl lg:h-11 lg:px-6"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Thêm giao dịch</span>
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

          <RecentTransactions transactions={transactions}
            categories={categories}
          />
        </div>


        {/* Transaction Form */}
        <TransactionForm
          open={openForm}
          onOpenChange={setOpenForm}
          categories={categories}
          onSubmit={handleAddTransaction} />
      </main>
    </div>
  )
}
