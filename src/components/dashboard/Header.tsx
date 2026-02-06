import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, BarChart3 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  periodo: string;
  setPeriodo: (v: string) => void;
  regiao: string;
  setRegiao: (v: string) => void;
  produto: string;
  setProduto: (v: string) => void;
  onOpenChat: () => void;
}

const Header = ({ periodo, setPeriodo, regiao, setRegiao, produto, setProduto, onOpenChat }: HeaderProps) => {
  return (
    <header className="nps-gradient-header px-4 py-3 md:px-6 md:py-4">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9" />
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-primary-foreground">
              Maestro CX
            </h1>
            <p className="text-xs font-medium text-primary-foreground/70">
              Claro NPS Dashboard
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="h-8 w-[130px] border-primary-foreground/30 bg-primary-foreground/10 text-xs text-primary-foreground">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimo-mes">Último Mês</SelectItem>
              <SelectItem value="ultimos-3-meses">Últimos 3 Meses</SelectItem>
              <SelectItem value="ultimos-6-meses">Últimos 6 Meses</SelectItem>
              <SelectItem value="ultimo-ano">Último Ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={regiao} onValueChange={setRegiao}>
            <SelectTrigger className="h-8 w-[130px] border-primary-foreground/30 bg-primary-foreground/10 text-xs text-primary-foreground">
              <SelectValue placeholder="Região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Regiões</SelectItem>
              <SelectItem value="sudeste">Sudeste</SelectItem>
              <SelectItem value="sul">Sul</SelectItem>
              <SelectItem value="nordeste">Nordeste</SelectItem>
              <SelectItem value="norte">Norte</SelectItem>
              <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
            </SelectContent>
          </Select>

          <Select value={produto} onValueChange={setProduto}>
            <SelectTrigger className="h-8 w-[130px] border-primary-foreground/30 bg-primary-foreground/10 text-xs text-primary-foreground">
              <SelectValue placeholder="Produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Produtos</SelectItem>
              <SelectItem value="movel">Claro Móvel</SelectItem>
              <SelectItem value="fixo">Claro Fixo</SelectItem>
              <SelectItem value="internet">Internet</SelectItem>
              <SelectItem value="tv">Claro TV</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={onOpenChat}
            className="flex h-8 items-center gap-1.5 rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Chat Maestro
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
