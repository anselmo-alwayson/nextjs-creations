import { useState } from "react";
import { produtos, getMetricasProduto } from "@/data/produtosData";
import { ProdutoList } from "@/components/produtos/ProdutoList";
import { ProdutoDashboard } from "@/components/produtos/ProdutoDashboard";

export default function Produtos() {
  const [selectedId, setSelectedId] = useState(produtos[0].id);
  const metricas = getMetricasProduto(selectedId);
  const produtoNome = produtos.find((p) => p.id === selectedId)?.nome ?? "";

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-foreground">Produtos</h1>
        <p className="text-xs text-muted-foreground">
          Selecione um produto para visualizar seus indicadores de NPS e satisfação
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Product list - 1/4 width */}
        <div className="w-full lg:w-1/4 shrink-0">
          <ProdutoList
            produtos={produtos}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Dashboard - 3/4 width */}
        <div className="w-full lg:w-3/4">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-foreground">{produtoNome}</h2>
          </div>
          <ProdutoDashboard metricas={metricas} produtoNome={produtoNome} />
        </div>
      </div>
    </main>
  );
}
