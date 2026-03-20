"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { CategoryForm } from "@/components/categories/category-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { addCategory, deleteCategory, getCategory, updateCategory } from "@/springboot-api/services/categoryService"
import { Category } from "@/springboot-api/models/categoryModel"
import { toast } from "sonner"

export default function CategoriesPage() {
  const currentUserId = 1 // TODO: replace with actual logged-in user id
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null
  )
  useEffect(() => {
    async function fetchCategories() {
      const response = await getCategory(currentUserId);
      if (response?.data) {
        setCategories(response.data as Category[] | []);
        console.log(response.data)
      } else {
        // toast.error(response.message);
      }
    }
    fetchCategories();
  }, [])

  const incomeCategories = categories.filter((c) => c.type === "INCOME")
  const expenseCategories = categories.filter(
    (c) => c.type === "EXPENSE"
  )
  type CategoryFormData = Pick<Category, "categoryId" | "name" | "description" | "type">

  const handleAddCategory = async (data: CategoryFormData) => {
    const requestBody = {
      ...data,
      userId: currentUserId,
    }
    const result = await addCategory(requestBody)
    if (result?.success === true) {
      setCategories(prev => [...prev, result.data])
      toast.success(result.message)
    }
  }

  const handleEditCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return
    // Build request body for update: keep same userId and categoryId
    const requestBody = {
      ...editingCategory,
      ...data,
    }
    const result = await updateCategory(editingCategory.categoryId, requestBody)
    if (result?.success === true) {
      setCategories(prev =>
        prev.map(c => c.categoryId === result.data.categoryId ? result.data : c)
      )
      toast.success(result.message)
    }
  }

  const handleDeleteCategory = async () => {
    if (deletingCategoryId === null) return
    const result = await deleteCategory(deletingCategoryId)
    if (result?.success === true) {
      setCategories(prev => prev.filter(c => c.categoryId !== deletingCategoryId))
      toast.success(result.message)
    }
  }

  const openEditForm = (category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingCategory(undefined)
  }

  const CategoryCard = ({ category }: { category: Category }) => (
    <Card className="group relative overflow-hidden transition-all active:scale-[0.98] lg:hover:shadow-md">
      <CardContent className="p-3 lg:p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:h-11 lg:w-11 lg:rounded-full ${category.type === "INCOME"
              ? "bg-income/15"
              : "bg-expense/15"
              }`}
          >
            {category.type === "INCOME" ? (
              <TrendingUp className="h-5 w-5 text-income" />
            ) : (
              <TrendingDown className="h-5 w-5 text-expense" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground lg:text-base">{category.name}</h3>
            {category.description && (
              <p className="truncate text-xs text-muted-foreground lg:text-sm">
                {category.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEditForm(category)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Chinh sua</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => setDeletingCategoryId(category.categoryId)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Xoa</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CategoryList = ({ items, emptyMessage }: { items: Category[], emptyMessage: string }) => (
    <div className="space-y-2 lg:space-y-3">
      {items.map((category) => (
        <CategoryCard key={category.categoryId} category={category} />
      ))}
      {items.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  )

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
            <h1 className="text-3xl font-bold text-foreground">Danh mục </h1>
            <p>
              Quản lý danh mục thu chi của bạn
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục 
          </Button>
        </div>

        {/* Header - Mobile */}
        <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
          <div>
            <h1 className="text-xl font-bold text-foreground">Danh mục</h1>
            <p className="text-sm text-muted-foreground">
              {categories.length}Danh mục
            </p>
          </div>
        </div>

        {/* Mobile: Tabs */}
        <div className="px-4 lg:hidden">
          <Tabs defaultValue="expense" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="expense" className="gap-2">
                <TrendingDown className="h-4 w-4" />
                Chi tiêu
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {expenseCategories.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="income" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Thu nhập
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {incomeCategories.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="expense" className="mt-0">
              <CategoryList items={expenseCategories} emptyMessage="Chưa có danh mục chi tiêu nào" />
            </TabsContent>
            <TabsContent value="income" className="mt-0">
              <CategoryList items={incomeCategories} emptyMessage="Chưa có danh mục thu nhập nào" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: 2 Column Grid */}
        <div className="hidden gap-8 lg:grid lg:grid-cols-2">
          {/* Income Categories */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-income/10 p-1.5">
                <TrendingUp className="h-4 w-4 text-income" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Thu nhập
              </h2>
              <Badge variant="secondary" className="ml-auto">
                {incomeCategories.length}
              </Badge>
            </div>
            <CategoryList items={incomeCategories} emptyMessage="Chưa có danh mục thu nhập nào" />
          </div>

          {/* Expense Categories */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-expense/10 p-1.5">
                <TrendingDown className="h-4 w-4 text-expense" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Chi tiêu
              </h2>
              <Badge variant="secondary" className="ml-auto">
                {expenseCategories.length}
              </Badge>
            </div>
            <CategoryList items={expenseCategories} emptyMessage="Chưa có danh mục chi tiêu nào" />
          </div>
        </div>

        {/* Floating Add Button - Mobile */}
        <div className="fixed bottom-6 right-4 lg:hidden">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Thêm danh mục</span>
          </Button>
        </div>

        {/* Category Form */}
        <CategoryForm
          open={isFormOpen}
          onOpenChange={closeForm}
          category={editingCategory}
          onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        />

        {/* Delete Confirmation */}
        <AlertDialog
          open={deletingCategoryId !== null}
          onOpenChange={() => setDeletingCategoryId(null)}
        >
          <AlertDialogContent className="max-w-[90vw] rounded-xl sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc muốn xóa danh mục này? Hành động này không thể
                hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel>Huy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCategory}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Xoa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
