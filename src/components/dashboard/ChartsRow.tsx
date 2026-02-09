import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { ProdutoMetricas } from "@/data/produtosData";

interface ChartsRowProps {
  metricas: ProdutoMetricas;
}

export function ChartsRow({ metricas }: ChartsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Satisfaction Breakdown (Stacked Bar) */}
      <Card>
        <CardHeader className="pb-2">
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
      <Card>
        <CardHeader className="pb-2">
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
      <Card>
        <CardHeader className="pb-2">
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
