"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, SlidersHorizontal } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import type { TransactionType } from "@/lib/types"
import { Transaction, TransactionRequest } from "@/springboot-api/models/transactionModel"
import { addTransaction, getTransactionByUserId, updateTransaction } from "@/springboot-api/services/transactionService"
import { toast } from "sonner"
import { Category } from "@/springboot-api/models/categoryModel"
import { getCategory } from "@/springboot-api/services/categoryService"

export default function TransactionsPage() {
  const currentUserId = 1
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL")


  useEffect(() => {
    async function fetchTransactions() {
      const response = await getTransactionByUserId(currentUserId);
      if (response?.success === true) {
        setTransactions(response.data as Transaction[] | []);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
    fetchTransactions();
  }, []);



  useEffect(() => {
    async function fetchCategories() {
      const response = await getCategory(currentUserId);
      if (response?.data) {
        setCategories(response.data as Category[] | []);
        console.log(response.data)
      } else {
         toast.error(response.message);
      }
    }
    fetchCategories();
  }, [])

  const categoryNameById = new Map(
    categories.map((c) => [c.categoryId, c.name] as const)
  )
  
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Khác"
    return categoryNameById.get(categoryId) ?? "Khác"
  }
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "ALL" || t.type === typeFilter
    return matchesSearch && matchesType
  })

  const transactionId = 1;

  const handleAddTransaction = async (data: TransactionRequest) => {
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

  const handleEditTransaction = async (data: TransactionRequest) => {
    if (!editingTransaction) return
    const requestBody = {
      ...editingTransaction,
      ...data,
    }
    const result = await updateTransaction(editingTransaction.transactionId, requestBody)
    if (result?.success === true) {
      setTransactions(prev =>
        prev.map(c => c.transactionId === result.data.transactionId ? result.data : c)
      )
      toast.success(result.message)
    }
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.transactionId !== id))
  }

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingTransaction(undefined)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <MobileHeader />
      <main className="min-h-screen pb-20 pt-2 lg:ml-64 lg:p-6 lg:pb-6">
        {/* Header - Desktop */}
        <div className="mb-8 hidden items-center justify-between lg:flex">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Giao dịch</h1>
            <p className="text-muted-foreground">
             Quản lý  các giao dịch thu chi của bạn
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm giao dịch
          </Button>
        </div>

        {/* Header - Mobile */}
        <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
          <div>
            <h1 className="text-xl font-bold text-foreground">Giao dịch</h1>
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} giao dịch
            </p>
          </div>
        </div>

        {/* Filters - Desktop */}
        <div className="mb-6 hidden flex-wrap items-center gap-4 lg:flex">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as TransactionType | "ALL")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="INCOME">Thu nhập</SelectItem>
                <SelectItem value="EXPENSE">Chi tiêu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="mb-4 flex items-center gap-2 px-4 lg:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9 text-sm"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Bộ lọc</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl mr-4 ml-4">
              <SheetHeader>
                <SheetTitle>Bộ lọc</SheetTitle>
              </SheetHeader>
              <div className="">
                <div className="">
                  <p className="text-sm font-medium ml-6">Loại giao dich</p>
                  <div className="grid grid-cols-3  gap-5 p-6">
                    {[
                      { value: "ALL", label: "Tất cả" },
                      { value: "INCOME", label: "Thu nhập" },
                      { value: "EXPENSE", label: "Chi tiêu" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={typeFilter === option.value ? "default" : "outline"}
                        size="sm"
                        className="h-10"
                        onClick={() => setTypeFilter(option.value as TransactionType | "ALL")}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Transaction List */}
        <div className="px-4 lg:px-0">
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={openEditForm}
            onDelete={handleDeleteTransaction}
            getCategoryName={getCategoryName}
          />
        </div>

        {/* Floating Add Button - Mobile */}
        <div className="fixed bottom-6 right-4 lg:hidden">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Thêm giao dich</span>
          </Button>
        </div>

        {/* Transaction Form */}
        <TransactionForm
          open={isFormOpen}
          onOpenChange={closeForm}
          categories={categories}
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        />

      </main>
    </div>
  )
}
