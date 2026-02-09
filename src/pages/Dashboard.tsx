import { useState } from "react";
import { metricasGlobais, clientes } from "@/data/mockData";
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
import type { Cliente } from "@/data/mockData";

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

  const handleSelectCidade = (cidade: string | null, estado: string | null) => {
    setSelectedCidade(cidade);
    setSelectedEstado(estado);
  };

  const handleDrillDown = (type: DrillDownType, data?: any) => {
    setDrillDown({ type, data });
  };

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-[1440px] space-y-4 p-4 md:p-5">
        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Row 1: Metric cards */}
        <MetricsCards metricas={metricasGlobais} onDrillDown={handleDrillDown} />

        {/* Row 2: Products list + Map */}
        <div className="flex gap-3 items-stretch">
          <aside className="w-[180px] shrink-0">
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
        <TabelaClientes clientes={clientes} onViewPerfil={setPerfilCliente} />
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
