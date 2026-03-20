"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  LayoutDashboard,
  Receipt,
  Tags,
  Wallet,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockUser } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Tổng quan", href: "/", icon: LayoutDashboard, description: "Xem tổng quan tài chính" },
  { name: "Giao dịch", href: "/transactions", icon: Receipt, description: "Quản lý thu chi" },
  { name: "Danh mục", href: "/categories", icon: Tags, description: "Phân loại giao dịch" },
]

export function MobileHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
          <Wallet className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold tracking-tight">Finance App</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] p-0 sm:w-[340px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            {/* User Profile Section */}
            <div className="border-b border-border/50 bg-muted/30 p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                    {mockUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {mockUser.fullName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {mockUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all active:scale-[0.98]",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted active:bg-muted"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary-foreground/20" 
                          : "bg-muted group-hover:bg-background"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className={cn(
                          "text-xs truncate",
                          isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isActive ? "text-primary-foreground/50" : "text-muted-foreground/50"
                      )} />
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-border/50 p-3">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/80 active:scale-[0.98]">
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 active:scale-[0.98]">
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
