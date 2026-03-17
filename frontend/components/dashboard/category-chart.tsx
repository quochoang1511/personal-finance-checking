"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryChartProps {
  data: { name: string; value: number }[]
}

const COLORS = [
  "oklch(0.55 0.22 25)",
  "oklch(0.60 0.15 250)",
  "oklch(0.70 0.15 80)",
  "oklch(0.65 0.12 300)",
  "oklch(0.55 0.18 160)",
  "oklch(0.60 0.10 200)",
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

function formatCompact(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toString()
}

export function CategoryChart({ data }: CategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader className="pb-2 lg:pb-4">
        <CardTitle className="text-base lg:text-lg">Chi tieu theo danh muc</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 lg:px-6 lg:pb-6">
        {/* Mobile: Horizontal bar list */}
        <div className="space-y-3 lg:hidden">
          {data.slice(0, 5).map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0
            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="tabular-nums">{formatCompact(item.value)}</span>
                    <span className="text-xs">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            )
          })}
          {data.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Chua co du lieu chi tieu
            </p>
          )}
        </div>

        {/* Desktop: Pie chart with legend */}
        <div className="hidden lg:block">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Desktop Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
