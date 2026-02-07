import { useState, useMemo, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import MapaBrasil from "@/components/dashboard/MapaBrasil";
import ComparativoChart from "@/components/dashboard/ComparativoChart";
import EvolucaoChart from "@/components/dashboard/EvolucaoChart";
import TabelaClientes from "@/components/dashboard/TabelaClientes";
import PerfilModal from "@/components/dashboard/PerfilModal";
import ChatButton from "@/components/dashboard/ChatButton";
import { SortableContainer } from "@/components/dashboard/SortableContainer";
import { SortableSection } from "@/components/dashboard/SortableSection";
import { useSortableSections } from "@/hooks/useSortableSections";
import {
  clientes,
  regioes,
  metricasGlobais,
  evolucaoData,
  type Cliente,
} from "@/data/mockData";

const SECTION_IDS = ["metrics", "map", "charts", "table"];

const Index = () => {
  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [perfilCliente, setPerfilCliente] = useState<Cliente | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const { sectionOrder, handleDragEnd } = useSortableSections(SECTION_IDS);

  const handleSelectCidade = (cidade: string | null, estado: string | null) => {
    setSelectedCidade(cidade);
    setSelectedEstado(estado);
  };

  const filteredClientes = useMemo(() => {
    if (!selectedCidade) return clientes;
    return clientes.filter((c) => c.regiao.includes(selectedCidade));
  }, [selectedCidade]);

  const sectionsMap: Record<string, ReactNode> = {
    metrics: <MetricsCards metricas={metricasGlobais} />,
    map: (
      <MapaBrasil
        regioes={regioes}
        selectedCidade={selectedCidade}
        onSelectCidade={handleSelectCidade}
      />
    ),
    charts: (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ComparativoChart metricas={metricasGlobais} />
        <EvolucaoChart data={evolucaoData} />
      </div>
    ),
    table: (
      <TabelaClientes
        clientes={filteredClientes}
        onViewPerfil={setPerfilCliente}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1440px] space-y-4 px-4 py-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            onClick={() => handleSelectCidade(null, null)}
            className={`transition-colors hover:text-foreground ${!selectedCidade ? "font-semibold text-foreground" : ""}`}
          >
            Brasil
          </button>
          {selectedEstado && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground">
                {selectedEstado}
              </span>
            </>
          )}
          {selectedCidade && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-primary">
                {selectedCidade}
              </span>
            </>
          )}
        </nav>

        {/* Sortable Sections */}
        <SortableContainer items={sectionOrder} onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {sectionOrder.map((id) => (
              <SortableSection key={id} id={id}>
                {sectionsMap[id]}
              </SortableSection>
            ))}
          </div>
        </SortableContainer>
      </main>

      {/* Profile Modal */}
      <PerfilModal
        cliente={perfilCliente}
        open={!!perfilCliente}
        onClose={() => setPerfilCliente(null)}
      />

      {/* Chat */}
      <ChatButton open={chatOpen} onToggle={() => setChatOpen((o) => !o)} />
    </div>
  );
};

export default Index;
