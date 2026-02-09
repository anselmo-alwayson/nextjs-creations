import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Produto } from "@/data/produtosData";

interface ProdutoListProps {
  produtos: Produto[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export function ProdutoList({ produtos, selectedId, onSelect }: ProdutoListProps) {
  // Group by category
  const grouped = produtos.reduce<Record<string, Produto[]>>((acc, p) => {
    if (!acc[p.categoria]) acc[p.categoria] = [];
    acc[p.categoria].push(p);
    return acc;
  }, {});

  return (
    <Card className="h-auto md:h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-primary" />
          Produtos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-auto max-h-[200px] md:h-full md:max-h-none px-3 pb-3">
          {Object.entries(grouped).map(([categoria, items]) => (
            <div key={categoria} className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-2">
                {categoria}
              </p>
              <div className="space-y-0.5">
                {items.map((produto) => {
                  const isActive = produto.id === selectedId;
                  return (
                    <button
                      key={produto.id}
                      onClick={() => onSelect(produto.id)}
                      className={`w-full flex items-center gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors ${
                        isActive
                          ? "bg-accent font-semibold text-accent-foreground"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          isActive ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      />
                      <span className="truncate">{produto.nome}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
