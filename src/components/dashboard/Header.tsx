import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

const Header = () => {
  const [periodo, setPeriodo] = useState("ultimos-6-meses");

  return (
    <header className="nps-gradient-header px-4 py-3 md:px-6 md:py-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
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

        {/* Period selector */}
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="h-8 w-[160px] border-primary-foreground/30 bg-primary-foreground/10 text-xs text-primary-foreground">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ultimo-mes">Último Mês</SelectItem>
            <SelectItem value="ultimos-3-meses">Últimos 3 Meses</SelectItem>
            <SelectItem value="ultimos-6-meses">Últimos 6 Meses</SelectItem>
            <SelectItem value="ultimo-ano">Último Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default Header;
