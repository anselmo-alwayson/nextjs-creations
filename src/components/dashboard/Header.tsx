import { BarChart3 } from "lucide-react";

const Header = () => {
  return (
    <header className="nps-gradient-header px-4 py-3 md:px-6 md:py-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
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
      </div>
    </header>
  );
};

export default Header;
