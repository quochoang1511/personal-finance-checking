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
import { mockTransactions, mockCategories } from "@/lib/mock-data"
import type {TransactionType } from "@/lib/types"
import { Transaction } from "@/springboot-api/models/transactionModel"
import { getTransaction } from "@/springboot-api/services/transactionService"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL")

  useEffect(() => {
    async function fetchTransactions() {
      const response = await getTransaction();
      if (response.success) {
        setTransactions(response.data as Transaction[] | []);
        console.log(response.data)
      } else {
        // toast.error(response.message);
      }
    }
    fetchTransactions();
  }, []);


  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "ALL" || t.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleAddTransaction = (
    data: Omit<Transaction, "id" | "userId" | "category">
  ) => {
    const newTransaction: Transaction = {
      ...data,
      id: Math.max(...transactions.map((t) => t.id)) + 1,
      userId: 1,
      category: mockCategories.find((c) => c.id === data.categoryId),
    }
    setTransactions([...transactions, newTransaction])
  }

  const handleEditTransaction = (
    data: Omit<Transaction, "id" | "userId" | "category">
  ) => {
    if (!editingTransaction) return
    setTransactions(
      transactions.map((t) =>
        t.id === editingTransaction.id
          ? {
              ...t,
              ...data,
              category: mockCategories.find((c) => c.id === data.categoryId),
            }
          : t
      )
    )
    setEditingTransaction(undefined)
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
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
            <h1 className="text-3xl font-bold text-foreground">Giao dich</h1>
            <p className="text-muted-foreground">
              Quan ly cac giao dich thu chi cua ban
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Them giao dich
          </Button>
        </div>

        {/* Header - Mobile */}
        <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
          <div>
            <h1 className="text-xl font-bold text-foreground">Giao dich</h1>
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} giao dich
            </p>
          </div>
        </div>

        {/* Filters - Desktop */}
        <div className="mb-6 hidden flex-wrap items-center gap-4 lg:flex">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tim kiem giao dich..."
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
                <SelectItem value="ALL">Tat ca</SelectItem>
                <SelectItem value="INCOME">Thu nhap</SelectItem>
                <SelectItem value="EXPENSE">Chi tieu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="mb-4 flex items-center gap-2 px-4 lg:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tim kiem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9 text-sm"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Bo loc</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl">
              <SheetHeader>
                <SheetTitle>Bo loc</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Loai giao dich</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "ALL", label: "Tat ca" },
                      { value: "INCOME", label: "Thu nhap" },
                      { value: "EXPENSE", label: "Chi tieu" },
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
            <span className="sr-only">Them giao dich</span>
          </Button>
        </div>

        {/* Transaction Form */}
        <TransactionForm
          open={isFormOpen}
          onOpenChange={closeForm}
          categories={mockCategories}
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        />
      </main>
    </div>
  )
}
