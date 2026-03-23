"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send } from "lucide-react"
import AuthLayout from "@/app/authentication/layout/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <AuthLayout
      title="Quên mật khẩu?"
      subtitle="Nhập email để nhận hướng dẫn đặt lại mật khẩu"
    >
      {isSubmitted ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
            Chúng tôi đã gửi email khôi phục mật khẩu đến <b>{email}</b>. Vui lòng
            kiểm tra hộp thư của bạn.
          </div>
          <Link href="/authentication/login" className="block">
            <Button className="w-full h-12">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-input border-border focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12">
            {isLoading ? (
              "Đang gửi..."
            ) : (
              <span className="flex items-center gap-2">
                Gửi liên kết đặt lại
                <Send className="w-4 h-4" />
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Đã nhớ mật khẩu?{" "}
            <Link
              href="/authentication/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
