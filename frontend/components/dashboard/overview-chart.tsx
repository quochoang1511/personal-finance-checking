"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OverviewChartProps {
  data: { month: string; income: number; expense: number }[]
}

function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toString()
}

export function OverviewChart({ data }: OverviewChartProps) {
  const [mobileStartIndex, setMobileStartIndex] = useState(Math.max(0, data.length - 4))

  // Mobile: show 4 months at a time with navigation
  const mobileData = data.slice(mobileStartIndex, mobileStartIndex + 4)

  const handlePrevious = () => {
    setMobileStartIndex((prev) => Math.max(0, prev - 4))
  }

  const handleNext = () => {
    setMobileStartIndex((prev) => Math.min(data.length - 4, prev + 4))
  }

  const canGoPrevious = mobileStartIndex > 0
  const canGoNext = mobileStartIndex + 4 < data.length

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-2 lg:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base lg:text-lg">Thu chi theo thang</CardTitle>
          {/* Mobile Navigation */}
          <div className="flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={!canGoNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-3 lg:px-6 lg:pb-6">
        {/* Mobile Chart */}
        <div className="lg:hidden">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mobileData} margin={{ left: -15, right: 5 }}>
              <XAxis
                dataKey="month"
                stroke="currentColor"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                stroke="currentColor"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                className="text-muted-foreground"
                width={40}
              />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
              <Bar
                dataKey="income"
                name="Thu nhap"
                fill="oklch(0.55 0.18 160)"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
              <Bar
                dataKey="expense"
                name="Chi tieu"
                fill="oklch(0.55 0.22 25)"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Desktop Chart */}
        <div className="hidden lg:block">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="month"
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Thu nhap"
                fill="oklch(0.55 0.18 160)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Chi tieu"
                fill="oklch(0.55 0.22 25)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
