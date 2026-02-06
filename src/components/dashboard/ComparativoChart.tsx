import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { MetricasGlobais } from "@/data/mockData";

interface ComparativoChartProps {
  metricas: MetricasGlobais;
}

const COLORS = ["var(--chart-promoter)", "var(--chart-neutral)", "var(--chart-detractor)"];

interface DonutProps {
  title: string;
  badge?: string;
  total: number;
  data: { name: string; value: number; pct: number }[];
}

const DonutChart = ({ title, badge, total, data }: DonutProps) => (
  <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-card p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      {badge && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
          {badge}
        </span>
      )}
    </div>
    <p className="mb-3 text-xs text-muted-foreground">
      {total.toLocaleString("pt-BR")} clientes
    </p>
    <div className="relative h-[180px] w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toLocaleString("pt-BR")} clientes`,
              name,
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(220 13% 91%)",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-foreground">
          {((data[0].value / total) * 100 - (data[2].value / total) * 100).toFixed(0)}
        </span>
        <span className="text-[10px] text-muted-foreground">NPS</span>
      </div>
    </div>
    {/* Legend */}
    <div className="mt-3 flex flex-col gap-1.5 w-full">
      {data.map((entry, idx) => (
        <div key={entry.name} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground">
            {entry.pct}% ({entry.value.toLocaleString("pt-BR")})
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ComparativoChart = ({ metricas }: ComparativoChartProps) => {
  const respondidoRatio = metricas.total_respondidos / metricas.total_clientes;
  const calculadoRatio = metricas.total_calculados / metricas.total_clientes;

  const respondidoData = [
    { name: "Promotores", value: Math.round(metricas.promotores.quantidade * respondidoRatio), pct: metricas.promotores.percentual },
    { name: "Neutros", value: Math.round(metricas.neutros.quantidade * respondidoRatio), pct: metricas.neutros.percentual },
    { name: "Detratores", value: Math.round(metricas.detratores.quantidade * respondidoRatio), pct: metricas.detratores.percentual },
  ];

  const calculadoData = [
    { name: "Promotores", value: Math.round(metricas.promotores.quantidade * calculadoRatio), pct: metricas.promotores.percentual },
    { name: "Neutros", value: Math.round(metricas.neutros.quantidade * calculadoRatio), pct: metricas.neutros.percentual },
    { name: "Detratores", value: Math.round(metricas.detratores.quantidade * calculadoRatio), pct: metricas.detratores.percentual },
  ];

  return (
    <div className="animate-fade-in-up">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Comparativo: Respondido vs Calculado</h3>
      <div className="flex flex-col gap-3 md:flex-row">
        <DonutChart
          title="NPS Respondido"
          total={metricas.total_respondidos}
          data={respondidoData}
        />
        <DonutChart
          title="NPS Calculado (IA)"
          badge="CALCULADO"
          total={metricas.total_calculados}
          data={calculadoData}
        />
      </div>
    </div>
  );
};

export default ComparativoChart;
