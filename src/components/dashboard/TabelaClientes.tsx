import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Cliente } from "@/data/mockData";
import { maskCpf } from "@/data/mockData";

interface TabelaClientesProps {
  clientes: Cliente[];
  onViewPerfil: (cliente: Cliente) => void;
}

const ITEMS_PER_PAGE = 8;

type SortField = "nome" | "nps_score" | "regiao" | "tipo";
type SortDir = "asc" | "desc";

const TabelaClientes = ({ clientes, onViewPerfil }: TabelaClientesProps) => {
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let result = [...clientes];
    if (filtroCategoria !== "todos") {
      result = result.filter((c) => c.categoria === filtroCategoria);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((c) =>
        c.nome.toLowerCase().includes(q) ||
        c.cpf.includes(q) ||
        maskCpf(c.cpf).includes(q) ||
        c.tipo.toLowerCase().includes(q) ||
        String(c.nps_score).includes(q) ||
        c.categoria.toLowerCase().includes(q) ||
        c.regiao.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const cmp = typeof valA === "number" ? valA - (valB as number) : String(valA).localeCompare(String(valB));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [clientes, filtroCategoria, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const categoriaBadge = (cat: string) => {
    const styles: Record<string, string> = {
      Promotor: "bg-nps-promoter-bg text-nps-promoter border-nps-promoter/20",
      Neutro: "bg-nps-neutral-bg text-nps-neutral border-nps-neutral/30",
      Detrator: "bg-nps-detractor-bg text-nps-detractor border-nps-detractor/20",
    };
    return styles[cat] || "";
  };

  const tipoBadge = (tipo: string) =>
    tipo === "Respondido"
      ? "bg-blue-50 text-blue-600 border-blue-200"
      : "bg-orange-50 text-orange-600 border-orange-200";

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-foreground">Clientes</h3>
        <div className="flex items-center gap-2 mr-10">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Buscar nome, CPF, tipo, NPS, região..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              className="h-7 w-[220px] pl-7 text-xs"
            />
          </div>
          <Select value={filtroCategoria} onValueChange={(v) => { setFiltroCategoria(v); setPage(0); }}>
            <SelectTrigger className="h-7 w-[160px] text-xs">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as categorias</SelectItem>
              <SelectItem value="Promotor">Promotores</SelectItem>
              <SelectItem value="Neutro">Neutros</SelectItem>
              <SelectItem value="Detrator">Detratores</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="cursor-pointer text-xs" onClick={() => toggleSort("nome")}>
                <span className="flex items-center gap-1">Nome <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="text-xs">CPF</TableHead>
              <TableHead className="cursor-pointer text-xs" onClick={() => toggleSort("nps_score")}>
                <span className="flex items-center gap-1">NPS <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="cursor-pointer text-xs" onClick={() => toggleSort("tipo")}>
                <span className="flex items-center gap-1">Tipo <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="cursor-pointer text-xs" onClick={() => toggleSort("regiao")}>
                <span className="flex items-center gap-1">Região <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="text-xs">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((c) => (
              <TableRow key={c.id} className="text-xs">
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell className="text-muted-foreground">{maskCpf(c.cpf)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${categoriaBadge(c.categoria)}`}>
                    {c.nps_score} — {c.categoria}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${tipoBadge(c.tipo)}`}>
                    {c.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.regiao}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => onViewPerfil(c)}>
                    <Eye className="mr-1 h-3 w-3" /> Ver Perfil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-2 p-3 sm:hidden">
        {paginated.map((c) => (
          <div key={c.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">{c.nome}</p>
              <Badge variant="outline" className={`text-[10px] ${categoriaBadge(c.categoria)}`}>
                {c.nps_score}
              </Badge>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">{c.regiao}</p>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="outline" className={`text-[10px] ${tipoBadge(c.tipo)}`}>{c.tipo}</Badge>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => onViewPerfil(c)}>
                <Eye className="mr-1 h-3 w-3" /> Perfil
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <p className="text-[10px] text-muted-foreground">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] text-muted-foreground">
            {page + 1} / {Math.max(totalPages, 1)}
          </span>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TabelaClientes;
