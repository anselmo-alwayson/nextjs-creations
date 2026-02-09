import { SmilePlus } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProdutoMetricas } from "@/data/produtosData";
import type { DrillDownType } from "./DrillDownModal";

/* ── Speedometer Gauge (semicircular with needle) ── */
function SpeedometerGauge({
  value,
  min = 0,
  max = 100,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  label: string;
}) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const pct = (clampedValue - min) / (max - min);

  const startAngle = Math.PI;
  const endAngle = 0;
  const needleAngle = startAngle - pct * (startAngle - endAngle);

  const cx = 60;
  const cy = 55;
  const r = 42;

  const nx = cx + (r - 8) * Math.cos(needleAngle);
  const ny = cy - (r - 8) * Math.sin(needleAngle);

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
      <svg viewBox="0 0 120 70" className="w-full max-w-[180px]">
        <path d={arcPath(0, 1)} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" />
        <path d={arcPath(0, 0.33)} fill="none" stroke="hsl(var(--nps-detractor))" strokeWidth="8" strokeLinecap="round" />
        <path d={arcPath(0.33, 0.66)} fill="none" stroke="hsl(var(--nps-neutral))" strokeWidth="8" strokeLinecap="round" />
        <path d={arcPath(0.66, 1)} fill="none" stroke="hsl(var(--nps-promoter))" strokeWidth="8" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="hsl(var(--muted-foreground))" />
        <text x="12" y="68" textAnchor="middle" className="fill-muted-foreground text-[7px]">{min}</text>
        <text x="108" y="68" textAnchor="middle" className="fill-muted-foreground text-[7px]">{max}</text>
      </svg>
      <p className="text-2xl font-bold text-foreground -mt-1">{value}%</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

/* ── Donut Gauge (CSAT) ── */
function DonutGauge({ satisfied, unsatisfied }: { satisfied: number; unsatisfied: number }) {
  const total = satisfied + unsatisfied;
  const satPct = (satisfied / total) * 100;
  const unsatPct = (unsatisfied / total) * 100;
  const circumference = 2 * Math.PI * 40;
  const satOffset = (satPct / 100) * circumference;
  const unsatOffset = (unsatPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[130px] h-[130px]">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="hsl(var(--nps-promoter))"
            strokeWidth="12"
            strokeDasharray={`${satOffset} ${circumference}`}
            strokeLinecap="round"
          />
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
          <SmilePlus className="h-7 w-7 text-primary" />
        </div>
      </div>
      <div className="flex items-center gap-6 mt-2">
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

/* ── Individual Card Content Components ── */

interface CardContentProps {
  metricas: ProdutoMetricas;
  onDrillDown?: (type: DrillDownType, data?: any) => void;
}

export function CSATCardContent({ metricas, onDrillDown }: CardContentProps) {
  const csatSatisfied = metricas.promotores.percentual + metricas.neutros.percentual * 0.5;
  const csatUnsatisfied = 100 - csatSatisfied;

  return (
    <div className="cursor-pointer" onClick={() => onDrillDown?.("csat", metricas)}>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-[11px] text-muted-foreground font-medium text-center">
          Customer Satisfaction Score (CSAT)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-3">
        <DonutGauge satisfied={csatSatisfied} unsatisfied={csatUnsatisfied} />
      </CardContent>
    </div>
  );
}

export function NPSGaugeCardContent({ metricas, onDrillDown }: CardContentProps) {
  return (
    <div className="cursor-pointer" onClick={() => onDrillDown?.("nps_gauge", metricas)}>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-[11px] text-muted-foreground font-medium text-center">
          Net Promoter Score (NPS)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-3">
        <SpeedometerGauge value={metricas.nps_score} min={-100} max={100} label="NPS Score" />
      </CardContent>
    </div>
  );
}

export function CESCardContent({ metricas, onDrillDown }: CardContentProps) {
  return (
    <div className="cursor-pointer" onClick={() => onDrillDown?.("ces", metricas)}>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-[11px] text-muted-foreground font-medium text-center">
          Customer Effort Score (CES)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-3">
        <SpeedometerGauge value={metricas.ces_score} min={0} max={100} label="CES Score" />
      </CardContent>
    </div>
  );
}

/* ── Legacy Row Export (kept for backward compat) ── */
interface GaugesRowProps {
  metricas: ProdutoMetricas;
  onDrillDown?: (type: DrillDownType, data?: any) => void;
}

export function GaugesRow({ metricas, onDrillDown }: GaugesRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <CSATCardContent metricas={metricas} onDrillDown={onDrillDown} />
      <NPSGaugeCardContent metricas={metricas} onDrillDown={onDrillDown} />
      <CESCardContent metricas={metricas} onDrillDown={onDrillDown} />
    </div>
  );
}
