import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterState {
  periodo: string;
  setPeriodo: (v: string) => void;
  regiao: string;
  setRegiao: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  produto: string;
  setProduto: (v: string) => void;
}

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [periodo, setPeriodo] = useState("ultimos-6-meses");
  const [regiao, setRegiao] = useState("todas");
  const [estado, setEstado] = useState("todos");
  const [produto, setProduto] = useState("todos");

  return (
    <FilterContext.Provider
      value={{ periodo, setPeriodo, regiao, setRegiao, estado, setEstado, produto, setProduto }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
