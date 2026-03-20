"use client"

import { ArrowDownLeft, ArrowUpRight, MoreHorizontal, Pencil, Trash2, TrendingDown, TrendingDownIcon, TrendingUp } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Transaction } from "@/springboot-api/models/transactionModel"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteTransaction } from "@/springboot-api/services/transactionService"
import { toast } from "sonner"
interface TransactionTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: number) => void
  getCategoryName: (categoryId?: number) => string
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

function formatCompact(amount: number) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toLocaleString("vi-VN")
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Hôm nay"
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Hôm qua"
  }
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  })
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  getCategoryName,
}: TransactionTableProps) {
  const [deletingTransactionId, setDeletingTransactionId] = useState<number | null>(
    null
  )
  const sortedTransactions = [...transactions].sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime()
  )
  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }
  const handleDeleteCategory = async () => {
    if (deletingTransactionId === null) return
    const result = await deleteTransaction(deletingTransactionId)
    if (result?.success === true) {
      onDelete(deletingTransactionId)
      toast.success(result.message);
      setDeletingTransactionId(null)
    }
  }
  return (
    <>
      {/* Mobile Card List */}
      <div className="space-y-2 lg:hidden">
        {sortedTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Chưa có giao dịch nào</p>
            </CardContent>
          </Card>
        ) : (
          sortedTransactions.map((transaction) => (
            <Card key={transaction.transactionId} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${transaction.type === "INCOME"
                      ? "bg-income/15"
                      : "bg-expense/15"
                      }`}
                  >
                    {transaction.type === "INCOME" ? (
                      <TrendingUp className="h-5 w-5 text-income" />
                    ) : (
                      <TrendingDownIcon className="h-5 w-5 text-expense" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {transaction.description || "Không có mô tả"}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {getCategoryName(transaction.categoryId) || "Khác"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(transaction.transactionDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p
                          className={`shrink-0 text-sm font-semibold tabular-nums ${transaction.type === "INCOME"
                            ? "text-income"
                            : "text-expense"
                            }`}
                        >
                          {transaction.type === "INCOME" ? "+" : "-"}
                          {formatCompact(transaction.amount)}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(transaction)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeletingTransactionId(transaction.transactionId)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-lg border border-border bg-card lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <p className="text-muted-foreground">Chưa có giao dịch nào</p>
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>
                    <div
                      className={`rounded-full p-2 ${transaction.type === "INCOME"
                        ? "bg-income/10"
                        : "bg-expense/10"
                        }`}
                    >
                      {transaction.type === "INCOME" ? (
                        <TrendingUp className="h-4 w-4 text-income" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-expense" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description || "Không có mô tả"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getCategoryName(transaction.categoryId) || "Khác"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(transaction.transactionDate)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${transaction.type === "INCOME"
                      ? "text-income"
                      : "text-expense"
                      }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chinh sua
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeletingTransactionId(transaction.transactionId)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deletingTransactionId !== null}
        onOpenChange={() => setDeletingTransactionId(null)}
      >
        <AlertDialogContent className="max-w-[90vw] rounded-xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa giao dịch này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xoa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
