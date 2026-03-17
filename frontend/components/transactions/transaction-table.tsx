"use client"

import { ArrowDownLeft, ArrowUpRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
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

interface TransactionTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: number) => void
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

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime()
  )

  return (
    <>
      {/* Mobile Card List */}
      <div className="space-y-2 lg:hidden">
        {sortedTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Chua co giao dich nao</p>
            </CardContent>
          </Card>
        ) : (
          sortedTransactions.map((transaction) => (
            <Card key={transaction.transactionId} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {transaction.description || transaction.categoryId || "Giao dich"}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {transaction.categoryId || "Khac"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {/* {formatShortDate(transaction.transactionDate)} */}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p
                          className={`shrink-0 text-sm font-semibold tabular-nums ${
                            transaction.type === "INCOME"
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
                              Chinh sua
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDelete(transaction.transactionId)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xoa
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
              <TableHead>Mo ta</TableHead>
              <TableHead>Danh muc</TableHead>
              <TableHead>Ngay</TableHead>
              <TableHead className="text-right">So tien</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <p className="text-muted-foreground">Chua co giao dich nao</p>
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {transaction.categoryId || "Khac"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {/* {formatDate(transaction.transactionDate)} */}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === "INCOME"
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
                          onClick={() => onDelete(transaction.transactionId)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xoa
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
    </>
  )
}
