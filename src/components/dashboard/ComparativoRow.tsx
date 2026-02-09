import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { ProdutoMetricas } from "@/data/produtosData";
import type { DrillDownType } from "./DrillDownModal";

/* ── NPS Donut ── */
function NpsDonut({ score, color }: { score: number; color: string }) {
  const circumference = 2 * Math.PI * 40;
  const pct = ((score + 100) / 200) * 100;
  const filled = (pct / 100) * circumference;

  return (
    <div className="relative w-[120px] h-[120px]">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-[9px] text-muted-foreground">NPS</span>
      </div>
    </div>
  );
}

interface ComparativoRowProps {
  metricas: ProdutoMetricas;
  onDrillDown?: (type: DrillDownType, data?: any) => void;
}

export function ComparativoRow({ metricas, onDrillDown }: ComparativoRowProps) {
  const { comparativo } = metricas;
  const clickable = "cursor-pointer group hover:shadow-md transition-shadow";

  const renderBreakdown = (section: typeof comparativo.nps_respondido) => (
    <div className="mt-3 space-y-1 w-full px-4">
      {[
        { label: "Promotores", color: "hsl(var(--nps-promoter))", ...section.promotores },
        { label: "Neutros", color: "hsl(var(--nps-neutral))", ...section.neutros },
        { label: "Detratores", color: "hsl(var(--nps-detractor))", ...section.detratores },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-[10px]">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
          <span className="text-muted-foreground">{item.label}</span>
          <span className="ml-auto font-semibold text-foreground">
            {item.percentual.toFixed(2)}% ({item.quantidade.toLocaleString()})
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* NPS Respondido */}
      <Card className={clickable} onClick={() => onDrillDown?.("comp_respondido", comparativo.nps_respondido)}>
        <CardHeader className="pb-1 pt-4 relative">
          <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <CardTitle className="text-[12px] font-semibold text-foreground text-center">
            NPS Respondido
          </CardTitle>
          <p className="text-[10px] text-muted-foreground text-center">
            {comparativo.nps_respondido.total_clientes.toLocaleString()} clientes
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-4">
          <NpsDonut score={comparativo.nps_respondido.score} color="hsl(var(--nps-promoter))" />
          {renderBreakdown(comparativo.nps_respondido)}
        </CardContent>
      </Card>

      {/* NPS Calculado (IA) */}
      <Card className={clickable} onClick={() => onDrillDown?.("comp_calculado", comparativo.nps_calculado)}>
        <CardHeader className="pb-1 pt-4 relative">
          <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <CardTitle className="text-[12px] font-semibold text-foreground text-center flex items-center justify-center gap-2">
            NPS Calculado (IA)
            <Badge variant="destructive" className="text-[8px] px-1.5 py-0 h-4 uppercase tracking-wider">
              Calculado
            </Badge>
          </CardTitle>
          <p className="text-[10px] text-muted-foreground text-center">
            {comparativo.nps_calculado.total_clientes.toLocaleString()} clientes
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-4">
          <NpsDonut score={comparativo.nps_calculado.score} color="hsl(var(--nps-promoter))" />
          {renderBreakdown(comparativo.nps_calculado)}
        </CardContent>
      </Card>

      {/* Evolução do NPS */}
      <Card className={clickable} onClick={() => onDrillDown?.("evolucao_nps", comparativo)}>
        <CardHeader className="pb-2 pt-4 relative">
          <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <CardTitle className="text-[12px] font-semibold text-foreground">
            Evolução do NPS — Últimos 6 meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={comparativo.evolucao_nps} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 11,
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
                wrapperStyle={{ fontSize: 10 }}
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
        </CardContent>
      </Card>
    </div>
  );
}
