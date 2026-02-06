import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingDown, TrendingUp, SmilePlus, Meh, Frown } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
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

/* ── Speedometer Gauge (semicircular with needle) ── */
function SpeedometerGauge({
  value,
  min = 0,
  max = 100,
  label,
  icon,
}: {
  value: number;
  min?: number;
  max?: number;
  label: string;
  icon?: React.ReactNode;
}) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const pct = (clampedValue - min) / (max - min);

  // Arc from 180° to 0° (left to right, semicircle)
  const startAngle = Math.PI;
  const endAngle = 0;
  const needleAngle = startAngle - pct * (startAngle - endAngle);

  const cx = 60;
  const cy = 55;
  const r = 42;

  // Needle endpoint
  const nx = cx + (r - 8) * Math.cos(needleAngle);
  const ny = cy - (r - 8) * Math.sin(needleAngle);

  // Arc segments for gradient: red → yellow → green
  const arcPath = (startPct: number, endPct: number) => {
    const a1 = startAngle - startPct * (startAngle - endAngle);
    const a2 = startAngle - endPct * (startAngle - endAngle);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy - r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy - r * Math.sin(a2);
    const largeArc = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-full max-w-[160px]">
        {/* Background track */}
        <path d={arcPath(0, 1)} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" />
        {/* Red segment (0-33%) */}
        <path d={arcPath(0, 0.33)} fill="none" stroke="hsl(var(--nps-detractor))" strokeWidth="8" strokeLinecap="round" />
        {/* Yellow segment (33-66%) */}
        <path d={arcPath(0.33, 0.66)} fill="none" stroke="hsl(var(--nps-neutral))" strokeWidth="8" strokeLinecap="round" />
        {/* Green segment (66-100%) */}
        <path d={arcPath(0.66, 1)} fill="none" stroke="hsl(var(--nps-promoter))" strokeWidth="8" strokeLinecap="round" />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="hsl(var(--muted-foreground))" />
        {/* Icon in center */}
        {icon && (
          <foreignObject x={cx - 8} y={cy - 22} width="16" height="16">
            {icon}
          </foreignObject>
        )}
        {/* Min/Max labels */}
        <text x="12" y="68" textAnchor="middle" className="fill-muted-foreground text-[7px]">{min}</text>
        <text x="108" y="68" textAnchor="middle" className="fill-muted-foreground text-[7px]">{max}</text>
      </svg>
      <p className="text-xl font-bold text-foreground -mt-1">{value}%</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

/* ── Donut Gauge (CSAT) ── */
function DonutGauge({
  satisfied,
  unsatisfied,
}: {
  satisfied: number;
  unsatisfied: number;
}) {
  const total = satisfied + unsatisfied;
  const satPct = (satisfied / total) * 100;
  const unsatPct = (unsatisfied / total) * 100;
  const circumference = 2 * Math.PI * 40;
  const satOffset = (satPct / 100) * circumference;
  const unsatOffset = (unsatPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[120px]">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Unsatisfied arc */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          {/* Satisfied arc (primary color) */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="hsl(var(--nps-promoter))"
            strokeWidth="12"
            strokeDasharray={`${satOffset} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Unsatisfied arc */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="hsl(var(--nps-detractor))"
            strokeWidth="12"
            strokeDasharray={`${unsatOffset} ${circumference}`}
            strokeDashoffset={`-${satOffset}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <SmilePlus className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-1">
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{satPct.toFixed(0)}%</p>
          <p className="text-[9px] text-muted-foreground">Satisfeitos</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{unsatPct.toFixed(0)}%</p>
          <p className="text-[9px] text-muted-foreground">Insatisfeitos</p>
        </div>
      </div>
    </div>
  );
}

/* ── Time Diff Component ── */
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
    <div className={`flex items-center gap-1 px-3 py-2 rounded-md ${isPositive ? "bg-[hsl(var(--nps-detractor-bg))]" : "bg-[hsl(var(--nps-promoter-bg))]"}`}>
      {isPositive ? (
        <TrendingUp className="h-4 w-4 text-destructive" />
      ) : (
        <TrendingDown className="h-4 w-4" style={{ color: "hsl(var(--nps-promoter))" }} />
      )}
      <span className={`text-lg font-bold ${isPositive ? "text-destructive" : "text-[hsl(var(--nps-promoter))]"}`}>
        {isPositive ? "+" : "-"}{formatted}
      </span>
      <span className="text-[10px] text-muted-foreground ml-0.5">hr</span>
    </div>
  );
}

/* ── Main Dashboard ── */
export function ProdutoDashboard({ metricas, produtoNome }: ProdutoDashboardProps) {
  const csatSatisfied = metricas.promotores.percentual + (metricas.neutros.percentual * 0.5);
  const csatUnsatisfied = 100 - csatSatisfied;

  return (
    <div className="space-y-3">
      {/* ═══ ROW 1: Product Name + Tempo + CSAT Score + NPS Distribution ═══ */}
      <div className="grid grid-cols-4 gap-3">
        {/* Product Name */}
        <Card>
          <CardContent className="pt-5 flex flex-col items-center justify-center h-full">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Produto</p>
            <p className="text-base font-bold text-foreground text-center mt-1">{produtoNome}</p>
          </CardContent>
        </Card>

        {/* Average Response Time */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Tempo Médio de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Mês anterior</p>
                <p className="text-lg font-bold text-foreground">{metricas.tempo_mes_anterior} <span className="text-[10px] font-normal text-muted-foreground">hr</span></p>
                <p className="text-[10px] text-muted-foreground mt-1">Mês atual</p>
                <p className="text-lg font-bold text-foreground">{metricas.tempo_medio_resposta} <span className="text-[10px] font-normal text-muted-foreground">hr</span></p>
              </div>
              <TimeDiff current={metricas.tempo_medio_resposta} previous={metricas.tempo_mes_anterior} />
            </div>
          </CardContent>
        </Card>

        {/* CSAT Score */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-[11px] text-muted-foreground font-medium">
              Customer Satisfaction Score (CSAT)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Mês anterior</p>
                <p className="text-lg font-bold text-foreground">{metricas.csat_mes_anterior}%</p>
                <p className="text-[10px] text-muted-foreground mt-1">Mês atual</p>
              </div>
              <div className="flex items-center justify-center rounded-md border-2 border-primary px-4 py-2">
                <span className="text-2xl font-bold text-foreground">{metricas.csat_score}</span>
                <span className="text-sm text-muted-foreground ml-0.5">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NPS Distribution - spans 2 rows */}
        <div className="row-span-2 flex flex-col gap-2">
          <Card className="flex-1 border-l-4" style={{ borderLeftColor: "hsl(var(--nps-promoter))" }}>
            <CardContent className="pt-3 pb-3 flex items-center gap-2">
              <SmilePlus className="h-7 w-7 shrink-0" style={{ color: "hsl(var(--nps-promoter))" }} />
              <div>
                <p className="text-xl font-bold text-foreground">{metricas.promotores.percentual}<span className="text-sm">%</span></p>
                <p className="text-[10px] text-muted-foreground">Promotores</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 border-l-4" style={{ borderLeftColor: "hsl(var(--nps-neutral))" }}>
            <CardContent className="pt-3 pb-3 flex items-center gap-2">
              <Meh className="h-7 w-7 shrink-0" style={{ color: "hsl(var(--nps-neutral))" }} />
              <div>
                <p className="text-xl font-bold text-foreground">{metricas.neutros.percentual}<span className="text-sm">%</span></p>
                <p className="text-[10px] text-muted-foreground">Neutros</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 border-l-4" style={{ borderLeftColor: "hsl(var(--nps-detractor))" }}>
            <CardContent className="pt-3 pb-3 flex items-center gap-2">
              <Frown className="h-7 w-7 shrink-0" style={{ color: "hsl(var(--nps-detractor))" }} />
              <div>
                <p className="text-xl font-bold text-foreground">{metricas.detratores.percentual}<span className="text-sm">%</span></p>
                <p className="text-[10px] text-muted-foreground">Detratores</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ═══ ROW 2: CSAT Donut + CES Gauge + NPS Gauge ═══ */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-[11px] text-muted-foreground font-medium text-center">
              Customer Satisfaction Score (CSAT)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-2">
            <DonutGauge satisfied={csatSatisfied} unsatisfied={csatUnsatisfied} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-[11px] text-muted-foreground font-medium text-center">
              Customer Effort Score (CES)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-2">
            <SpeedometerGauge value={metricas.ces_score} min={0} max={100} label="CES Score" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-[11px] text-muted-foreground font-medium text-center">
              Net Promoter Score (NPS)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-2">
            <SpeedometerGauge value={metricas.nps_score} min={-100} max={100} label="NPS Score" />
          </CardContent>
        </Card>

        {/* Empty — row-span from above occupies this cell */}
      </div>

      {/* ═══ ROW 3: Breakdown + Response Time Over Month + CSAT Over Month ═══ */}
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

        {/* Average Response Time Over Month (Line) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium text-muted-foreground">
              Tempo Médio de Resposta · Mensal
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

        {/* CSAT Over Month (Area) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium text-muted-foreground">
              Evolução CSAT · Últimos 6 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={metricas.evolucao_mensal}>
                <defs>
                  <linearGradient id="csatGradProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-line-responded)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-line-responded)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="csat" stroke="var(--chart-line-responded)" fill="url(#csatGradProd)" strokeWidth={2} name="CSAT" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
