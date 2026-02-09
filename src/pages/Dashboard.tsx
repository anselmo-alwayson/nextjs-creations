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
import type { Cliente } from "@/data/mockData";

export default function Dashboard() {
  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedProdutoId, setSelectedProdutoId] = useState(produtos[0].id);
  const [perfilCliente, setPerfilCliente] = useState<Cliente | null>(null);

  const metricas = getMetricasProduto(selectedProdutoId);

  const handleSelectCidade = (cidade: string | null, estado: string | null) => {
    setSelectedCidade(cidade);
    setSelectedEstado(estado);
  };

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-[1440px] space-y-4 p-4 md:p-5">
        {/* Row 1: Metric cards */}
        <MetricsCards metricas={metricasGlobais} />

        {/* Row 2: Products list + Map (products list spans into gauges row) */}
        <div className="flex gap-3 items-stretch">
          {/* Product list sidebar - height matches map */}
          <aside className="w-[180px] shrink-0">
            <ProdutoList
              produtos={produtos}
              selectedId={selectedProdutoId}
              onSelect={setSelectedProdutoId}
            />
          </aside>

          {/* Map */}
          <div className="flex-1 min-w-0">
            <MapaBrasil
              regioes={regioes}
              selectedCidade={selectedCidade}
              onSelectCidade={handleSelectCidade}
            />
          </div>
        </div>

        {/* Row 3: Gauges (CSAT, NPS, CES) */}
        <GaugesRow metricas={metricas} />

        {/* Row 4: Charts (Satisfação, Tempo Médio, Evolução CSAT) */}
        <ChartsRow metricas={metricas} />

        {/* Row 5: Comparativo NPS Respondido vs Calculado */}
        <ComparativoRow metricas={metricas} />

        {/* Row 6: Clients table */}
        <TabelaClientes clientes={clientes} onViewPerfil={setPerfilCliente} />
      </div>

      {/* Profile modal */}
      <PerfilModal
        cliente={perfilCliente}
        open={!!perfilCliente}
        onClose={() => setPerfilCliente(null)}
      />
    </main>
  );
}
