import { useState } from "react";
import { produtos, getMetricasProduto } from "@/data/produtosData";
import { ProdutoList } from "@/components/produtos/ProdutoList";
import { ProdutoDashboard } from "@/components/produtos/ProdutoDashboard";

export default function Produtos() {
  const [selectedId, setSelectedId] = useState(produtos[0].id);
  const metricas = getMetricasProduto(selectedId);
  const produtoNome = produtos.find((p) => p.id === selectedId)?.nome ?? "";

  return (
    <main className="flex-1 p-4 md:p-5 overflow-auto">
      <div className="mb-3">
        <h1 className="text-base font-bold text-foreground">Produtos</h1>
        <p className="text-[11px] text-muted-foreground">
          Selecione um produto para visualizar seus indicadores de NPS e satisfação
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {/* Product list sidebar - reduced width (40% of original 1/4) */}
        <aside className="w-full lg:w-[10%] lg:min-w-[140px] shrink-0">
          <ProdutoList
            produtos={produtos}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        {/* Dashboard - 3/4 width */}
        <section className="w-full lg:w-3/4 min-w-0">
          <ProdutoDashboard metricas={metricas} produtoNome={produtoNome} />
        </section>
      </div>
    </main>
  );
}
