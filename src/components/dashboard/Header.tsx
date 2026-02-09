import { BarChart3 } from "lucide-react";

const Header = () => {
  return (
    <header className="nps-gradient-header px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold leading-tight text-primary-foreground">
              Maestro CX
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-primary-foreground/70">
              Claro NPS Dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
