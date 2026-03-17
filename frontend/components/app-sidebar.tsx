"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Wallet,
  LogOut,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockUser } from "@/lib/mock-data"

const navigation = [
  { name: "Tong quan", href: "/", icon: LayoutDashboard },
  { name: "Giao dich", href: "/transactions", icon: Receipt },
  { name: "Danh muc", href: "/categories", icon: Tags },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Wallet className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">FinanceApp</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
            {mockUser.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{mockUser.fullName}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {mockUser.email}
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-xs font-medium transition-colors hover:bg-sidebar-accent/80">
            <Settings className="h-4 w-4" />
            Cai dat
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-xs font-medium transition-colors hover:bg-sidebar-accent/80">
            <LogOut className="h-4 w-4" />
            Dang xuat
          </button>
        </div>
      </div>
    </aside>
  )
}
