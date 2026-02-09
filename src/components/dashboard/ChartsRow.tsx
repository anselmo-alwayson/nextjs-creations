import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { ProdutoMetricas } from "@/data/produtosData";
import type { DrillDownType } from "./DrillDownModal";

interface ChartsRowProps {
  metricas: ProdutoMetricas;
  onDrillDown?: (type: DrillDownType, data?: any) => void;
}

export function ChartsRow({ metricas, onDrillDown }: ChartsRowProps) {
  const clickable = "cursor-pointer group hover:shadow-md transition-shadow";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Satisfaction Breakdown (Stacked Bar) */}
      <Card className={clickable} onClick={() => onDrillDown?.("satisfacao_categoria", metricas)}>
        <CardHeader className="pb-2 relative">
          <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <CardTitle className="text-[11px] font-medium text-muted-foreground">
            Satisfação por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metricas.satisfacao_breakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="categoria" type="category" tick={{ fontSize: 9 }} width={70} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="muitoSatisfeito" stackId="a" fill="var(--chart-promoter)" name="Muito Satisfeito" />
              <Bar dataKey="satisfeito" stackId="a" fill="#66BB6A" name="Satisfeito" />
              <Bar dataKey="neutro" stackId="a" fill="var(--chart-neutral)" name="Neutro" />
              <Bar dataKey="insatisfeito" stackId="a" fill="#FF9800" name="Insatisfeito" />
              <Bar dataKey="muitoInsatisfeito" stackId="a" fill="var(--chart-detractor)" name="Muito Insatisfeito" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Response Time (Line) */}
      <Card className={clickable} onClick={() => onDrillDown?.("tempo_medio", metricas)}>
        <CardHeader className="pb-2 relative">
          <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <CardTitle className="text-[11px] font-medium text-muted-foreground">
            Tempo Médio de Resposta - Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metricas.tempo_resposta_mensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="tempo" stroke="var(--chart-line-responded)" strokeWidth={2} dot={{ r: 3 }} name="Tempo (hr)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CSAT Evolution (Area) */}
      <Card className={clickable} onClick={() => onDrillDown?.("evolucao_csat", metricas)}>
        <CardHeader className="pb-2 relative">
          <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <CardTitle className="text-[11px] font-medium text-muted-foreground">
            Evolução CSAT - Últimos 6 meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metricas.evolucao_mensal}>
              <defs>
                <linearGradient id="csatGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-line-responded)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-line-responded)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="csat" stroke="var(--chart-line-responded)" fill="url(#csatGradDash)" strokeWidth={2} name="CSAT" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
