"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Category, Transaction, TransactionType } from "@/lib/types"

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  transaction?: Transaction
  onSubmit: (data: Omit<Transaction, "id" | "userId" | "category">) => void
}

export function TransactionForm({
  open,
  onOpenChange,
  categories,
  transaction,
  onSubmit,
}: TransactionFormProps) {
  const isMobile = useIsMobile()
  const [type, setType] = useState<TransactionType>(
    transaction?.type || "EXPENSE"
  )
  const [amount, setAmount] = useState(
    transaction?.amount.toString() || ""
  )
  const [description, setDescription] = useState(
    transaction?.description || ""
  )
  const [categoryId, setCategoryId] = useState(
    transaction?.categoryId?.toString() || ""
  )
  const [transactionDate, setTransactionDate] = useState(
    transaction?.transactionDate?.split("T")[0] ||
      new Date().toISOString().split("T")[0]
  )

  useEffect(() => {
    if (open) {
      if (transaction) {
        setType(transaction.type)
        setAmount(transaction.amount.toString())
        setDescription(transaction.description || "")
        setCategoryId(transaction.categoryId?.toString() || "")
        setTransactionDate(transaction.transactionDate?.split("T")[0] || new Date().toISOString().split("T")[0])
      } else {
        setType("EXPENSE")
        setAmount("")
        setDescription("")
        setCategoryId("")
        setTransactionDate(new Date().toISOString().split("T")[0])
      }
    }
  }, [open])

  const filteredCategories = categories.filter(
    (c) => c.defaultType === type
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      amount: parseFloat(amount),
      description,
      type,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      transactionDate: new Date(transactionDate).toISOString(),
    })
    onOpenChange(false)
  }

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="space-y-2">
        <Label>Loai giao dich</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setType("EXPENSE")
            }}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all",
              type === "EXPENSE"
                ? "border-expense bg-expense/10 text-expense"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <TrendingDown className="h-4 w-4" />
            Chi tieu
          </button>
          <button
            type="button"
            onClick={() => {
              setType("INCOME")
              setCategoryId("")
            }}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all",
              type === "INCOME"
                ? "border-income bg-income/10 text-income"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Thu nhap
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">So tien (VND)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-12 text-lg"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Danh muc</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Chon danh muc" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Ngay giao dich</Label>
        <Input
          id="date"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="h-11"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Mo ta (tuy chon)</Label>
        <Textarea
          id="description"
          placeholder="Nhap mo ta giao dich..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {isMobile ? (
        <DrawerFooter className="px-0 pb-0">
          <Button type="submit" className="h-12">
            {transaction ? "Cap nhat" : "Them giao dich"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12"
            onClick={() => onOpenChange(false)}
          >
            Huy
          </Button>
        </DrawerFooter>
      ) : (
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Huy
          </Button>
          <Button type="submit">
            {transaction ? "Cap nhat" : "Them giao dich"}
          </Button>
        </DialogFooter>
      )}
    </form>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>
              {transaction ? "Chinh sua giao dich" : "Them giao dich moi"}
            </DrawerTitle>
          </DrawerHeader>
          <FormContent />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Chinh sua giao dich" : "Them giao dich moi"}
          </DialogTitle>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  )
}
