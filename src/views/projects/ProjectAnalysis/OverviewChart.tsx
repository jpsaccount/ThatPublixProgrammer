import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Project } from "@/sdk/entities/project/Project";
import React, { DOMAttributes } from "react";

export interface MonthlyData {
  name: string;
  total: number;
}
interface Props {
  data: MonthlyData[];
  totalValueGetter: (value: number) => string;
  className?: string;
  height?: string | number;
  width?: string | number;
  aspect?: number;
}

export function OverviewChart({
  data,
  totalValueGetter,
  height = "100%",
  width = "100%",
  aspect = undefined,
  ...props
}: Props) {
  return (
    <ResponsiveContainer width={width} height={height} aspect={aspect}>
      <BarChart data={data} {...props}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${totalValueGetter ? totalValueGetter(value) : value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
