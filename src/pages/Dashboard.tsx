import { useState, useMemo } from "react";
import { clientes } from "@/data/mockData";
import { regioes } from "@/data/mockData";
import { produtos, getMetricasProduto } from "@/data/produtosData";
import MetricsCards from "@/components/dashboard/MetricsCards";
import MapaBrasil from "@/components/dashboard/MapaBrasil";
import TabelaClientes from "@/components/dashboard/TabelaClientes";
import PerfilModal from "@/components/dashboard/PerfilModal";
import { ProdutoList } from "@/components/produtos/ProdutoList";
import { GaugesRow } from "@/components/dashboard/GaugesRow";
import { ChartsRow } from "@/components/dashboard/ChartsRow";
import { ComparativoRow } from "@/components/dashboard/ComparativoRow";
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

export default function Dashboard() {
  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedProdutoId, setSelectedProdutoId] = useState(produtos[0].id);
  const [perfilCliente, setPerfilCliente] = useState<Cliente | null>(null);

  // Filters
  const [filters, setFilters] = useState<Filters>({
    periodo: "ultimos-6-meses",
    regiao: null,
    estado: null,
    produto: null,
  });

  // Drill-down modal
  const [drillDown, setDrillDown] = useState<{ type: DrillDownType; data?: any } | null>(null);

  const metricas = getMetricasProduto(selectedProdutoId);

  // Filter clients based on active filters
  const filteredClientes = useMemo(() => {
    let result = [...clientes];
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

  // Compute dynamic metrics from filtered clients
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
    // Sync estado filter with map selection
    setFilters((prev) => ({ ...prev, estado: estado }));
  };

  // When filter estado changes (from select), sync map
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    if (newFilters.estado !== filters.estado) {
      if (newFilters.estado) {
        // Find first city in that state to focus the map
        const cityInState = regioes.find((r) => r.estado === newFilters.estado);
        if (cityInState) {
          setSelectedCidade(cityInState.cidade);
          setSelectedEstado(cityInState.estado);
        }
      } else {
        // Estado cleared — reset map
        setSelectedCidade(null);
        setSelectedEstado(null);
      }
    }
  };

  const handleDrillDown = (type: DrillDownType, data?: any) => {
    setDrillDown({ type, data });
  };

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-[1440px] space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-5">
        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Row 1: Metric cards */}
        <MetricsCards metricas={filteredMetricas} onDrillDown={handleDrillDown} />

        {/* Row 2: Products list + Map */}
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

        {/* Row 3: Gauges */}
        <GaugesRow metricas={metricas} onDrillDown={handleDrillDown} />

        {/* Row 4: Charts */}
        <ChartsRow metricas={metricas} onDrillDown={handleDrillDown} />

        {/* Row 5: Comparativo */}
        <ComparativoRow metricas={metricas} onDrillDown={handleDrillDown} />

        {/* Row 6: Clients table */}
        <TabelaClientes clientes={filteredClientes} onViewPerfil={setPerfilCliente} />
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
