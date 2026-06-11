import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DashboardStats } from "../types";

interface FinancialChartProps {
  data: DashboardStats["chart_data"];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 capitalize">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              Rp {entry.value.toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  // Map data to ensure month format is nice (e.g., "Jan 2024")
  const formattedData = data.map((item) => {
    const [year, month] = item.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      ...item,
      displayMonth: date.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      }),
    };
  });

  return (
    <div className="flex flex-col gap-20">
      <div className="h-[300px] w-full">
        <h4 className="mb-4 text-sm font-medium text-gray-700">
          Pemasukan vs Pengeluaran
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="displayMonth"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) =>
                `Rp ${(value / 1000).toLocaleString("id-ID")}k`
              }
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            <Bar
              dataKey="income"
              name="Pemasukan"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar
              dataKey="expense"
              name="Pengeluaran"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[250px] w-full">
        <h4 className="mb-4 text-sm font-medium text-gray-700">
          Tren Saldo Sisa
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="displayMonth"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) =>
                `Rp ${(value / 1000).toLocaleString("id-ID")}k`
              }
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo Sisa"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10B981" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
