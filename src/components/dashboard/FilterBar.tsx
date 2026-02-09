import { useState } from "react";
import { X, Filter, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { produtos } from "@/data/produtosData";

export interface Filters {
  periodo: string;
  regiao: string | null;
  estado: string | null;
  produto: string | null;
}

const PERIODOS: Record<string, string> = {
  "ultimo-mes": "Último Mês",
  "ultimos-3-meses": "Últimos 3 Meses",
  "ultimos-6-meses": "Últimos 6 Meses",
  "ultimo-ano": "Último Ano",
};

const REGIOES: Record<string, string[]> = {
  Norte: ["AM", "PA", "RO", "RR", "AC", "AP", "TO"],
  Nordeste: ["BA", "CE", "PE", "MA", "PI", "RN", "PB", "SE", "AL"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  Sudeste: ["SP", "RJ", "MG", "ES"],
  Sul: ["RS", "PR", "SC"],
};

const ESTADOS: Record<string, string> = {
  SP: "São Paulo",
  RJ: "Rio de Janeiro",
  MG: "Minas Gerais",
  BA: "Bahia",
  CE: "Ceará",
  PE: "Pernambuco",
  RS: "Rio Grande do Sul",
  PR: "Paraná",
  DF: "Distrito Federal",
  AM: "Amazonas",
};

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const update = (partial: Partial<Filters>) =>
    onFiltersChange({ ...filters, ...partial });

  const estadosDisponiveis = Object.keys(ESTADOS);

  const activeFilters: { key: keyof Filters; label: string }[] = [];
  if (filters.estado) activeFilters.push({ key: "estado", label: `Estado: ${ESTADOS[filters.estado] ?? filters.estado}` });

  const clearFilter = (key: keyof Filters) => {
    if (key === "regiao") update({ regiao: null, estado: null });
    else update({ [key]: null });
  };

  const clearAll = () =>
    onFiltersChange({ periodo: filters.periodo, regiao: null, estado: null, produto: null });

  return (
    <div className="space-y-2">
      {/* Filter selectors */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />

        {/* Período */}
        <Select value={filters.periodo} onValueChange={(v) => update({ periodo: v })}>
          <SelectTrigger className="h-8 w-[130px] sm:w-[155px] text-xs">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PERIODOS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        {/* Estado */}
        <Select
          value={filters.estado ?? ""}
          onValueChange={(v) => update({ estado: v || null })}
        >
          <SelectTrigger className="h-8 w-[130px] sm:w-[155px] text-xs">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estadosDisponiveis.map((uf) => (
              <SelectItem key={uf} value={uf}>
                {ESTADOS[uf]} ({uf})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground font-medium">Filtros ativos:</span>
          {activeFilters.map((f) => (
            <Badge
              key={f.key}
              variant="secondary"
              className="h-6 gap-1 text-[10px] font-medium pl-2 pr-1"
            >
              {f.label}
              <button
                onClick={() => clearFilter(f.key)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] text-destructive hover:text-destructive"
            onClick={clearAll}
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
}
