import { SmilePlus, Meh, Frown, TrendingUp, TrendingDown, Award } from "lucide-react";
import type { MetricasGlobais } from "@/data/mockData";

interface MetricsCardsProps {
  metricas: MetricasGlobais;
}

const MetricsCards = ({ metricas }: MetricsCardsProps) => {
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
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isUp = card.trend > 0;
        const TrendIcon = isUp ? TrendingUp : TrendingDown;

        return (
          <div
            key={card.label}
            className={`card-shine animate-fade-in-up stagger-${i + 1} rounded-xl border ${card.borderClass} ${card.bgClass} p-4 shadow-sm transition-shadow hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
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
              <span className="text-xs text-muted-foreground">vs período anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;
