import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { EvolucaoData } from "@/data/mockData";

interface EvolucaoChartProps {
  data: EvolucaoData;
}

const EvolucaoChart = ({ data }: EvolucaoChartProps) => {
  const chartData = data.meses.map((mes, i) => ({
    mes,
    respondido: data.nps_respondido[i],
    calculado: data.nps_calculado[i],
  }));

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Evolução do NPS — Últimos 6 meses</h3>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
              axisLine={{ stroke: "hsl(220 13% 91%)" }}
            />
            <YAxis
              domain={[40, 65]}
              tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
              axisLine={{ stroke: "hsl(220 13% 91%)" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220 13% 91%)",
                fontSize: "12px",
                backgroundColor: "hsl(0 0% 100%)",
              }}
              formatter={(value: number, name: string) => [
                value,
                name === "respondido" ? "NPS Respondido" : "NPS Calculado (IA)",
              ]}
            />
            <Legend
              formatter={(value: string) =>
                value === "respondido" ? "NPS Respondido" : "NPS Calculado (IA)"
              }
              wrapperStyle={{ fontSize: "11px" }}
            />
            <Line
              type="monotone"
              dataKey="respondido"
              stroke="var(--chart-line-responded)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--chart-line-responded)" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="calculado"
              stroke="var(--chart-line-calculated)"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={{ r: 4, fill: "var(--chart-line-calculated)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EvolucaoChart;
