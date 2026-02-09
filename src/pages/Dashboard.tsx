import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { clientes } from "@/data/mockData";
import { regioes, getPeriodCutoffDate, getPeriodMonths } from "@/data/mockData";
import { produtos, getMetricasProduto } from "@/data/produtosData";
import MetricsCards from "@/components/dashboard/MetricsCards";
import MapaBrasil from "@/components/dashboard/MapaBrasil";
import TabelaClientes from "@/components/dashboard/TabelaClientes";
import PerfilModal from "@/components/dashboard/PerfilModal";
import { ProdutoList } from "@/components/produtos/ProdutoList";
import { CSATCardContent, NPSGaugeCardContent, CESCardContent } from "@/components/dashboard/GaugesRow";
import { SatisfacaoCardContent, TempoMedioCardContent, EvolucaoCSATCardContent } from "@/components/dashboard/ChartsRow";
import { NPSRespondidoCardContent, NPSCalculadoCardContent, EvolucaoNPSCardContent } from "@/components/dashboard/ComparativoRow";
import { SortableCard } from "@/components/dashboard/SortableCard";
import { SortableWrapper } from "@/components/dashboard/SortableWrapper";
import { useSortableSections } from "@/hooks/useSortableSections";
import FilterBar, { type Filters } from "@/components/dashboard/FilterBar";
import DrillDownModal, { type DrillDownType } from "@/components/dashboard/DrillDownModal";
import type { Cliente, MetricasGlobais } from "@/data/mockData";

const REGIOES_UF: Record<string, string[]> = {
  Norte: ["AM", "PA", "RO", "RR", "AC", "AP", "TO"],
  Nordeste: ["BA", "CE", "PE", "MA", "PI", "RN", "PB", "SE", "AL"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  Sudeste: ["SP", "RJ", "MG", "ES"],
  Sul: ["RS", "PR", "SC"],
};

function extractUF(regiao: string): string {
  const match = regiao.match(/- ([A-Z]{2})$/);
  return match ? match[1] : "";
}

const DEFAULT_ORDER = [
  "map",
  "csat",
  "nps",
  "ces",
  "satisfacao",
  "tempo_medio",
  "evolucao_csat",
  "comp_respondido",
  "comp_calculado",
  "evolucao_nps",
  "clientes",
];

const FULL_WIDTH_IDS = new Set(["map", "clientes"]);

export default function Dashboard() {
  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedProdutoId, setSelectedProdutoId] = useState(produtos[0].id);
  const [perfilCliente, setPerfilCliente] = useState<Cliente | null>(null);

  const [filters, setFilters] = useState<Filters>({
    periodo: "ultimos-6-meses",
    regiao: null,
    estado: null,
    produto: null,
  });

  const [drillDown, setDrillDown] = useState<{ type: DrillDownType; data?: any } | null>(null);

  const periodMonths = getPeriodMonths(filters.periodo);
  const metricas = getMetricasProduto(selectedProdutoId, periodMonths);

  const { sectionOrder, handleDragEnd } = useSortableSections(DEFAULT_ORDER);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredClientes = useMemo(() => {
    let result = [...clientes];
    // Period filter
    const cutoff = getPeriodCutoffDate(filters.periodo);
    result = result.filter((c) => new Date(c.data_cadastro) >= cutoff);
    if (filters.regiao) {
      const ufs = REGIOES_UF[filters.regiao] ?? [];
      result = result.filter((c) => ufs.includes(extractUF(c.regiao)));
    }
    if (filters.estado) {
      result = result.filter((c) => extractUF(c.regiao) === filters.estado);
    }
    if (filters.produto) {
      const prod = produtos.find((p) => String(p.id) === filters.produto);
      if (prod) {
        result = result.filter((c) =>
          c.produtos.some((cp) => cp.toLowerCase().includes(prod.nome.toLowerCase()))
        );
      }
    }
    return result;
  }, [filters]);

  const filteredMetricas = useMemo<MetricasGlobais>(() => {
    const total = filteredClientes.length;
    if (total === 0) {
      return {
        total_clientes: 0,
        total_respondidos: 0,
        total_calculados: 0,
        nps_score: 0,
        promotores: { quantidade: 0, percentual: 0 },
        neutros: { quantidade: 0, percentual: 0 },
        detratores: { quantidade: 0, percentual: 0 },
      };
    }
    const promotores = filteredClientes.filter((c) => c.categoria === "Promotor");
    const neutros = filteredClientes.filter((c) => c.categoria === "Neutro");
    const detratores = filteredClientes.filter((c) => c.categoria === "Detrator");
    const respondidos = filteredClientes.filter((c) => c.tipo === "Respondido");
    const calculados = filteredClientes.filter((c) => c.tipo === "Calculado");
    const pctProm = (promotores.length / total) * 100;
    const pctDet = (detratores.length / total) * 100;
    return {
      total_clientes: total,
      total_respondidos: respondidos.length,
      total_calculados: calculados.length,
      nps_score: +(pctProm - pctDet).toFixed(1),
      promotores: { quantidade: promotores.length, percentual: +((promotores.length / total) * 100).toFixed(1) },
      neutros: { quantidade: neutros.length, percentual: +((neutros.length / total) * 100).toFixed(1) },
      detratores: { quantidade: detratores.length, percentual: +((detratores.length / total) * 100).toFixed(1) },
    };
  }, [filteredClientes]);

  const handleSelectCidade = (cidade: string | null, estado: string | null) => {
    setSelectedCidade(cidade);
    setSelectedEstado(estado);
    setFilters((prev) => ({ ...prev, estado: estado }));
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    if (newFilters.estado !== filters.estado) {
      if (newFilters.estado) {
        const cityInState = regioes.find((r) => r.estado === newFilters.estado);
        if (cityInState) {
          setSelectedCidade(cityInState.cidade);
          setSelectedEstado(cityInState.estado);
        }
      } else {
        setSelectedCidade(null);
        setSelectedEstado(null);
      }
    }
  };

  const handleDrillDown = (type: DrillDownType, data?: any) => {
    setDrillDown({ type, data });
  };

  const renderSection = (id: string) => {
    const fullWidth = FULL_WIDTH_IDS.has(id);
    const spanClass = fullWidth ? "col-span-1 sm:col-span-2 lg:col-span-3" : "";

    switch (id) {
      case "map":
        return (
          <SortableWrapper key={id} id={id} className={spanClass}>
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
              <aside className="w-full md:w-[180px] md:shrink-0">
                <ProdutoList
                  produtos={produtos}
                  selectedId={selectedProdutoId}
                  onSelect={setSelectedProdutoId}
                />
              </aside>
              <div className="flex-1 min-w-0">
                <MapaBrasil
                  regioes={regioes}
                  selectedCidade={selectedCidade}
                  selectedEstado={selectedEstado}
                  onSelectCidade={handleSelectCidade}
                />
              </div>
            </div>
          </SortableWrapper>
        );
      case "csat":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <CSATCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "nps":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <NPSGaugeCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "ces":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <CESCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "satisfacao":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <SatisfacaoCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "tempo_medio":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <TempoMedioCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "evolucao_csat":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <EvolucaoCSATCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "comp_respondido":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <NPSRespondidoCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "comp_calculado":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <NPSCalculadoCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "evolucao_nps":
        return (
          <SortableCard key={id} id={id} className={`hover:shadow-md transition-shadow ${spanClass}`}>
            <EvolucaoNPSCardContent metricas={metricas} onDrillDown={handleDrillDown} />
          </SortableCard>
        );
      case "clientes":
        return (
          <SortableWrapper key={id} id={id} className={spanClass}>
            <TabelaClientes clientes={filteredClientes} onViewPerfil={setPerfilCliente} />
          </SortableWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-[1440px] space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-5">
        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Row 1: Metric cards (fixed, not sortable) */}
        <MetricsCards metricas={filteredMetricas} onDrillDown={handleDrillDown} />

        {/* Sortable cards grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sectionOrder} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sectionOrder.map(renderSection)}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Profile modal */}
      <PerfilModal
        cliente={perfilCliente}
        open={!!perfilCliente}
        onClose={() => setPerfilCliente(null)}
      />

      {/* Drill-down modal */}
      <DrillDownModal
        open={!!drillDown}
        onClose={() => setDrillDown(null)}
        type={drillDown?.type ?? null}
        data={drillDown?.data}
      />
    </main>
  );
}
