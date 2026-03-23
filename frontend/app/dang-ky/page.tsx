"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowRight, Lock, Mail, User } from "lucide-react"
import AuthLayout from "@/app/authentication/layout/page"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Toast } from "@radix-ui/react-toast"
import { toast, Toaster } from "sonner"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.warning("Mật khẩu xác nhận không khớp.")
      return
    }

    if (!agreeTerms) {
      toast.warning("Bạn cần đồng ý điều khoản để tiếp tục.")
      return
    }
    setError("")
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <AuthLayout title="Tạo tài khoản mới" subtitle="Bắt đầu quản lý tài chính thông minh hơn">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Họ và tên
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyen Van A"
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="agreeTerms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(Boolean(checked))}
          />
          <label htmlFor="agreeTerms" className="text-sm text-muted-foreground cursor-pointer">
            Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
          </label>
        </div>

        {error ? (
          <p className="text-sm text-destructive border border-destructive/20 rounded-md p-3">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={isLoading} className="w-full h-12">
          {isLoading ? (
            "Đang tạo tài khoản..."
          ) : (
            <span className="flex items-center gap-2">
              Tạo tài khoản
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/authentication/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
