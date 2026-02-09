import { SmilePlus, Meh, Frown, TrendingUp, TrendingDown, Award, MessageSquareText, Brain, ClipboardList } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import type { MetricasGlobais } from "@/data/mockData";

interface MetricsCardsProps {
  metricas: MetricasGlobais;
}

const MetricsCards = ({ metricas }: MetricsCardsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  }, [isDragging, startX, scrollLeft]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  const npsRespondido = 72.4;
  const npsCalculado = 68.1;
  const totalPesquisas = 14832;

  const cards = [
    {
      label: "Promotores",
      value: `${metricas.promotores.percentual}%`,
      count: metricas.promotores.quantidade.toLocaleString("pt-BR"),
      icon: SmilePlus,
      bgClass: "bg-nps-promoter-bg",
      iconColor: "text-nps-promoter",
      borderClass: "border-nps-promoter/20",
      trend: 2.3,
    },
    {
      label: "Neutros",
      value: `${metricas.neutros.percentual}%`,
      count: metricas.neutros.quantidade.toLocaleString("pt-BR"),
      icon: Meh,
      bgClass: "bg-nps-neutral-bg",
      iconColor: "text-nps-neutral",
      borderClass: "border-nps-neutral/30",
      trend: -0.8,
    },
    {
      label: "Detratores",
      value: `${metricas.detratores.percentual}%`,
      count: metricas.detratores.quantidade.toLocaleString("pt-BR"),
      icon: Frown,
      bgClass: "bg-nps-detractor-bg",
      iconColor: "text-nps-detractor",
      borderClass: "border-nps-detractor/20",
      trend: -1.5,
    },
    {
      label: "NPS Score",
      value: metricas.nps_score.toFixed(1),
      count: `${metricas.total_clientes.toLocaleString("pt-BR")} clientes`,
      icon: Award,
      bgClass: "bg-card",
      iconColor: "text-primary",
      borderClass: "border-primary/20",
      trend: 3.1,
    },
    {
      label: "NPS Respondido",
      value: npsRespondido.toFixed(1),
      count: `${metricas.total_respondidos.toLocaleString("pt-BR")} respostas`,
      icon: MessageSquareText,
      bgClass: "bg-blue-50",
      iconColor: "text-blue-600",
      borderClass: "border-blue-200",
      trend: 1.8,
    },
    {
      label: "NPS Calculado",
      value: npsCalculado.toFixed(1),
      count: `${metricas.total_calculados.toLocaleString("pt-BR")} predições`,
      icon: Brain,
      bgClass: "bg-orange-50",
      iconColor: "text-orange-500",
      borderClass: "border-orange-200",
      trend: 4.2,
    },
    {
      label: "Pesquisas Realizadas",
      value: totalPesquisas.toLocaleString("pt-BR"),
      count: "últimos 30 dias",
      icon: ClipboardList,
      bgClass: "bg-card",
      iconColor: "text-primary",
      borderClass: "border-primary/20",
      trend: 5.6,
    },
  ];

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto pb-1 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
      style={{ WebkitOverflowScrolling: "touch" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isUp = card.trend > 0;
        const TrendIcon = isUp ? TrendingUp : TrendingDown;

        return (
          <div
            key={card.label}
            className={`animate-fade-in-up stagger-${i + 1} min-w-[180px] flex-shrink-0 rounded-xl border ${card.borderClass} ${card.bgClass} p-4 shadow-sm transition-shadow hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{card.count}</p>
              </div>
              <div className={`rounded-lg p-2 ${card.bgClass}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendIcon className={`h-3.5 w-3.5 ${isUp ? "text-nps-promoter" : "text-nps-detractor"}`} />
              <span className={`text-xs font-semibold ${isUp ? "text-nps-promoter" : "text-nps-detractor"}`}>
                {isUp ? "+" : ""}{card.trend}%
              </span>
              <span className="text-xs text-muted-foreground">vs anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;
