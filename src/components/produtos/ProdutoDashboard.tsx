import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingDown, TrendingUp, Users, SmilePlus, Meh, Frown } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ProdutoMetricas } from "@/data/produtosData";

interface ProdutoDashboardProps {
  metricas: ProdutoMetricas;
  produtoNome: string;
}

function ScoreGauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
          <path
            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${pct}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

function TimeDiff({ current, previous }: { current: string; previous: string }) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const diff = toMinutes(current) - toMinutes(previous);
  const isPositive = diff > 0;
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / 60);
  const mins = absDiff % 60;
  const formatted = hours > 0 ? `${hours}:${String(mins).padStart(2, "0")}` : `${mins}min`;

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-destructive" : "text-[hsl(var(--nps-promoter))]"}`}>
      {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      <span>{isPositive ? "+" : "-"}{formatted}</span>
    </div>
  );
}

export function ProdutoDashboard({ metricas, produtoNome }: ProdutoDashboardProps) {
  const npsColor = metricas.nps_score >= 50
    ? "hsl(var(--nps-promoter))"
    : metricas.nps_score >= 0
    ? "hsl(var(--nps-neutral))"
    : "hsl(var(--nps-detractor))";

  const csatColor = metricas.csat_score >= 70
    ? "hsl(var(--nps-promoter))"
    : metricas.csat_score >= 50
    ? "hsl(var(--nps-neutral))"
    : "hsl(var(--nps-detractor))";

  return (
    <div className="space-y-4">
      {/* Top metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Tempo Médio de Resposta */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Tempo Médio de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{metricas.tempo_medio_resposta}</p>
                <p className="text-[10px] text-muted-foreground">horas · mês atual</p>
              </div>
              <div className="text-right">
                <TimeDiff current={metricas.tempo_medio_resposta} previous={metricas.tempo_mes_anterior} />
                <p className="text-[10px] text-muted-foreground mt-0.5">vs mês anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSAT */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium">
              Satisfação (CSAT)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ScoreGauge value={metricas.csat_score} max={100} label="Score" color={csatColor} />
          </CardContent>
        </Card>

        {/* NPS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium">
              Net Promoter Score (NPS)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ScoreGauge value={metricas.nps_score} max={100} label="Score" color={npsColor} />
          </CardContent>
        </Card>

        {/* Total de clientes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {metricas.total_clientes.toLocaleString("pt-BR")}
            </p>
            <p className="text-[10px] text-muted-foreground">clientes ativos neste produto</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--nps-promoter))" }}>
          <CardContent className="pt-4 flex items-center gap-3">
            <SmilePlus className="h-8 w-8 shrink-0" style={{ color: "hsl(var(--nps-promoter))" }} />
            <div>
              <p className="text-2xl font-bold text-foreground">{metricas.promotores.percentual}%</p>
              <p className="text-xs text-muted-foreground">Promotores</p>
              <p className="text-[10px] text-muted-foreground">{metricas.promotores.quantidade.toLocaleString("pt-BR")} clientes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--nps-neutral))" }}>
          <CardContent className="pt-4 flex items-center gap-3">
            <Meh className="h-8 w-8 shrink-0" style={{ color: "hsl(var(--nps-neutral))" }} />
            <div>
              <p className="text-2xl font-bold text-foreground">{metricas.neutros.percentual}%</p>
              <p className="text-xs text-muted-foreground">Neutros</p>
              <p className="text-[10px] text-muted-foreground">{metricas.neutros.quantidade.toLocaleString("pt-BR")} clientes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--nps-detractor))" }}>
          <CardContent className="pt-4 flex items-center gap-3">
            <Frown className="h-8 w-8 shrink-0" style={{ color: "hsl(var(--nps-detractor))" }} />
            <div>
              <p className="text-2xl font-bold text-foreground">{metricas.detratores.percentual}%</p>
              <p className="text-xs text-muted-foreground">Detratores</p>
              <p className="text-[10px] text-muted-foreground">{metricas.detratores.quantidade.toLocaleString("pt-BR")} clientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Evolução CSAT · Últimos 6 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={metricas.evolucao_mensal}>
                <defs>
                  <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-line-responded)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-line-responded)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="csat"
                  stroke="var(--chart-line-responded)"
                  fill="url(#csatGrad)"
                  strokeWidth={2}
                  name="CSAT"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Evolução NPS · Últimos 6 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={metricas.evolucao_mensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="nps"
                  stroke="var(--chart-line-calculated)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="NPS"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
