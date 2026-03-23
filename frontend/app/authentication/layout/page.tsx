"use client"

import { Wallet } from "lucide-react"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex  bg-gray-100/20">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground" />
            </svg>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Finance App</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight text-balance">
              Quản lý tài chính<br />thông minh hơn
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Theo dõi thu chi, lập ngân sách và đạt được mục tiêu tài chính của bạn một cách dễ dàng.
            </p>
            
            <div className="flex gap-8 pt-4">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Người dùng</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">500M+</p>
                <p className="text-sm text-muted-foreground">Giao dịch</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2026 SpendWise. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SpendWise</span>
            </Link>
          </div>
          
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
