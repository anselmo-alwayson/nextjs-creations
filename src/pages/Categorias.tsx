import { Tags } from "lucide-react";

const Categorias = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Tags className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
      <p className="text-sm text-muted-foreground">Em breve: gestão de categorias NPS.</p>
    </div>
  );
};

export default Categorias;
