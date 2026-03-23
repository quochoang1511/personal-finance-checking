import AuthLayout from "./layout/page"

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout title="Chào mừng quay lại" subtitle="Đăng nhập để tiếp tục">
      {children}
    </AuthLayout>
  )
}
