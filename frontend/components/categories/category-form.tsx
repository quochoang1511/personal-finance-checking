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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Category } from "@/springboot-api/models/categoryModel"
import { addCategory } from "@/springboot-api/services/categoryService"

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  onSubmit: (data: Pick<Category,"categoryId" | "name" | "description" | "type">) => void
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryFormProps) {
  const isMobile = useIsMobile()
  const [categoryId, setCategoryId] = useState(1);
  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")
  const [type, setType] = useState(
    category?.type || "EXPENSE"
  )
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({categoryId, name, description, type })
    onOpenChange(false)
  }
  
  useEffect(() => {
    if (category) {
      setName(category.name)
      setCategoryId(1)
      setDescription(category.description || "")
      setType(category.type)
    } else {
      setName("")
      setDescription("")
      setType("EXPENSE")
    }
  }, [category, open])

 

  const FormContent =  (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="space-y-2">
        <Label>Loai danh muc</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
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
            onClick={() => setType("INCOME")}
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

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Ten danh muc</Label>
        <Input
          id="name"
          placeholder="Nhap ten danh muc..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Mo ta (tuy chon)</Label>
        <Textarea
          id="description"
          placeholder="Nhap mo ta danh muc..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {isMobile ? (
        <DrawerFooter className="px-0 pb-0">
          <Button type="submit" className="h-12">
            {category ? "Cap nhat" : "Them danh muc"}
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
            {category ? "Cap nhat" : "Them danh muc"}
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
              {category ? "Chinh sua danh muc" : "Them danh muc moi"}
            </DrawerTitle>
          </DrawerHeader>
          {FormContent}
          </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Chinh sua danh muc" : "Them danh muc moi"}
          </DialogTitle>
        </DialogHeader>
        {FormContent}
        </DialogContent>
    </Dialog>
  )
}
