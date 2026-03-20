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
import { Category } from "@/springboot-api/models/categoryModel"
import { Transaction, TransactionRequest } from "@/springboot-api/models/transactionModel"
import { toast } from "sonner"

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  transaction?: Transaction
  onSubmit: (data: TransactionRequest) => void
}

export function TransactionForm({
  open,
  onOpenChange,
  categories,
  transaction,
  onSubmit,
}: TransactionFormProps) {
  const isMobile = useIsMobile()

  const [type, setType] = useState(
    transaction?.type || "EXPENSE"
  )
  const [amount, setAmount] = useState(
    transaction?.amount.toString() || ""
  )
  const [description, setDescription] = useState(
    transaction?.description || ""
  )
  const [categoryId, setCategoryId] = useState<string>("")
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
    (c) => c.type === type
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)

    // Validate
    if (!amount || isNaN(parsedAmount)) {
      toast.warning("Số tiền không hợp lệ")
      return
    }
    if(parsedAmount < 1000){
      toast.warning("Số tiền phải lớn hơn 1000₫ và nhỏ hơn 100,000,000₫")
      return
    }

    if (parsedAmount <= 0) {
      toast.warning("Số tiền phải lớn hơn 0")
      return
    }

    if (!categoryId) {
      toast.warning("Vui lòng chọn danh mục")
      return
    }

    if (!transactionDate) {
      toast.warning("Vui lòng chọn ngày")
      return
    }
    onSubmit({
      amount: parseFloat(amount),
      description,
      type,
      categoryId: categoryId ? Number(categoryId) : undefined,
      transactionDate: new Date(transactionDate).toISOString(),
    })
    onOpenChange(false)
  }

  const getCurrentDateTimeLocal = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
};

useEffect(() => {
  if (open) {
    if (transaction) {
      setType(transaction.type)
      setAmount(transaction.amount.toString())
      setDescription(transaction.description || "")
      setCategoryId(transaction.categoryId?.toString() || "")

      // format lại từ backend → datetime-local
      const date = new Date(transaction.transactionDate)
      const formatted = date.toISOString().slice(0, 16)
      setTransactionDate(formatted)

    } else {
      setType("EXPENSE")
      setAmount("")
      setDescription("")
      setCategoryId("")
      setTransactionDate(getCurrentDateTimeLocal())
    }
  }
}, [open])
  const FormContent = (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="space-y-2">
          <Label>Loại giao dịch</Label>
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
              Chi tiêu
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
              Thu nhập
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Số tiền (VND)</Label>
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
          <Label>Danh mục</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((category) => (
                <SelectItem
                  key={category.categoryId}
                  value={category.categoryId.toString()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Ngày giao dịch</Label>
          <Input
            id="date"
            type="datetime-local"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="h-11"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả (tùy chọn)</Label>
          <Textarea
            id="description"
            placeholder="Nhập mô tả giao dịch..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        {isMobile ? (
          <DrawerFooter className="px-0 pb-0">
            <Button type="submit" className="h-12">
            {transaction ? "Cập nhật" : "Thêm giao dịch"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
          </DrawerFooter>
        ) : (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {transaction ? "Cập nhật" : "Thêm giao dịch"}
            </Button>
          </DialogFooter>
        )}
      </form>
    </>

  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>
              {transaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
            </DrawerTitle>
          </DrawerHeader>
          {FormContent}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
          {transaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
          </DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}
