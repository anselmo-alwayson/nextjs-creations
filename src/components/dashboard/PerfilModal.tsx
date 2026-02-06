import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Tv, Wifi, Phone, Calendar, MapPin, User } from "lucide-react";
import type { Cliente } from "@/data/mockData";
import { maskCpf } from "@/data/mockData";

interface PerfilModalProps {
  cliente: Cliente | null;
  open: boolean;
  onClose: () => void;
}

const productIcons: Record<string, typeof Smartphone> = {
  "Claro Móvel": Smartphone,
  "Claro TV": Tv,
  "Internet": Wifi,
  "Claro Fixo": Phone,
};

function getProductIcon(product: string) {
  for (const [key, Icon] of Object.entries(productIcons)) {
    if (product.toLowerCase().includes(key.toLowerCase())) return Icon;
  }
  return Smartphone;
}

const npsBadgeClass = (cat: string) => {
  const map: Record<string, string> = {
    Promotor: "bg-nps-promoter text-white",
    Neutro: "bg-nps-neutral text-foreground",
    Detrator: "bg-nps-detractor text-white",
  };
  return map[cat] || "";
};

const fakeInteracoes = [
  { data: "2025-12-15", canal: "Telefone", assunto: "Dúvida sobre fatura" },
  { data: "2025-11-28", canal: "Chat Online", assunto: "Upgrade de plano" },
  { data: "2025-10-10", canal: "Loja Física", assunto: "Troca de aparelho" },
];

const PerfilModal = ({ cliente, open, onClose }: PerfilModalProps) => {
  if (!cliente) return null;

  const tempoCliente = () => {
    const start = new Date(cliente.data_cadastro);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    return totalMonths >= 12
      ? `${Math.floor(totalMonths / 12)} ano${Math.floor(totalMonths / 12) > 1 ? "s" : ""} e ${totalMonths % 12} mes${totalMonths % 12 !== 1 ? "es" : ""}`
      : `${totalMonths} mes${totalMonths !== 1 ? "es" : ""}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" />
            {cliente.nome}
          </DialogTitle>
        </DialogHeader>

        {/* NPS Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`px-3 py-1 text-sm font-bold ${npsBadgeClass(cliente.categoria)}`}>
            NPS {cliente.nps_score} — {cliente.categoria.toUpperCase()}
          </Badge>
          <Badge
            variant="outline"
            className={
              cliente.tipo === "Respondido"
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-orange-300 bg-orange-50 text-orange-700"
            }
          >
            {cliente.tipo}
          </Badge>
        </div>

        <Separator />

        {/* Dados Cadastrais */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dados Cadastrais</h4>
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">CPF:</span>{" "}
              <span className="font-medium">{maskCpf(cliente.cpf)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Telefone:</span>{" "}
              <span className="font-medium">{cliente.telefone}</span>
            </div>
            <div className="flex items-start gap-1 sm:col-span-2">
              <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground" />
              <span className="font-medium">{cliente.endereco || cliente.regiao}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Cliente desde</span>{" "}
              <span className="font-medium">
                {new Date(cliente.data_cadastro).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Tempo:</span>{" "}
              <span className="font-medium">{tempoCliente()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Produtos */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Produtos Contratados</h4>
          <div className="flex flex-wrap gap-2">
            {cliente.produtos.map((p) => {
              const Icon = getProductIcon(p);
              return (
                <div key={p} className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {p}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Histórico */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Últimas Interações</h4>
          <div className="space-y-2">
            {fakeInteracoes.map((int, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md bg-secondary px-3 py-2 text-xs">
                <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{int.assunto}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {int.canal} • {new Date(int.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerfilModal;
