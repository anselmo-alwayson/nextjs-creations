import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export type DrillDownType =
  | "promotores"
  | "neutros"
  | "detratores"
  | "nps_score"
  | "nps_respondido"
  | "nps_calculado"
  | "pesquisas"
  | "csat"
  | "nps_gauge"
  | "ces"
  | "satisfacao_categoria"
  | "tempo_medio"
  | "evolucao_csat"
  | "comp_respondido"
  | "comp_calculado"
  | "evolucao_nps";

interface DrillDownModalProps {
  open: boolean;
  onClose: () => void;
  type: DrillDownType | null;
  data?: any;
}

const TITLES: Record<DrillDownType, string> = {
  promotores: "Detalhamento — Promotores (9-10)",
  neutros: "Detalhamento — Neutros (7-8)",
  detratores: "Detalhamento — Detratores (0-6)",
  nps_score: "Detalhamento — NPS Score",
  nps_respondido: "Detalhamento — NPS Respondido",
  nps_calculado: "Detalhamento — NPS Calculado (IA)",
  pesquisas: "Detalhamento — Pesquisas Realizadas",
  csat: "Detalhamento — CSAT",
  nps_gauge: "Detalhamento — NPS (Gauge)",
  ces: "Detalhamento — CES",
  satisfacao_categoria: "Detalhamento — Satisfação por Categoria",
  tempo_medio: "Detalhamento — Tempo Médio de Resposta",
  evolucao_csat: "Detalhamento — Evolução CSAT",
  comp_respondido: "Detalhamento — NPS Respondido",
  comp_calculado: "Detalhamento — NPS Calculado (IA)",
  evolucao_nps: "Detalhamento — Evolução NPS",
};

function FormulaBlock({ formula, explanation }: { formula: string; explanation: string }) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground">Fórmula de Cálculo</p>
      <code className="block text-sm font-mono text-foreground bg-background rounded px-3 py-2 border">
        {formula}
      </code>
      <p className="text-xs text-muted-foreground">{explanation}</p>
    </div>
  );
}

function SampleTable({
  rows,
}: {
  rows: { nome: string; score: number; tipo: string; regiao: string }[];
}) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Cliente</TableHead>
            <TableHead className="text-xs text-center">Score</TableHead>
            <TableHead className="text-xs">Tipo</TableHead>
            <TableHead className="text-xs">Região</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              <TableCell className="text-xs font-medium">{r.nome}</TableCell>
              <TableCell className="text-xs text-center">{r.score}</TableCell>
              <TableCell className="text-xs">
                <Badge
                  variant={r.tipo === "Respondido" ? "default" : "outline"}
                  className="text-[9px]"
                >
                  {r.tipo}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">{r.regiao}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MetricSummary({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border p-3 text-center">
          <p className="text-lg font-bold text-foreground" style={item.color ? { color: item.color } : {}}>
            {item.value}
          </p>
          <p className="text-[10px] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function MonthlyTable({
  data,
  columns,
}: {
  data: { mes: string; [key: string]: any }[];
  columns: { key: string; label: string }[];
}) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Mês</TableHead>
            {columns.map((c) => (
              <TableHead key={c.key} className="text-xs text-center">
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="text-xs font-medium">{row.mes}</TableCell>
              {columns.map((c) => (
                <TableCell key={c.key} className="text-xs text-center">
                  {typeof row[c.key] === "number" ? row[c.key].toFixed(1) : row[c.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Sample clients for demonstration
const sampleClients = [
  { nome: "Maria Silva", score: 9, tipo: "Respondido", regiao: "São Paulo - SP" },
  { nome: "Ana Costa", score: 10, tipo: "Respondido", regiao: "São Paulo - SP" },
  { nome: "Carla Mendes", score: 9, tipo: "Respondido", regiao: "Belo Horizonte - MG" },
  { nome: "Juliana Almeida", score: 10, tipo: "Calculado", regiao: "Curitiba - PR" },
  { nome: "Fernanda Rocha", score: 9, tipo: "Respondido", regiao: "Fortaleza - CE" },
  { nome: "Diego Martins", score: 10, tipo: "Respondido", regiao: "Rio de Janeiro - RJ" },
  { nome: "Thiago Barbosa", score: 9, tipo: "Calculado", regiao: "Brasília - DF" },
  { nome: "Roberto Nascimento", score: 10, tipo: "Calculado", regiao: "Salvador - BA" },
  { nome: "Marcelo Pereira", score: 9, tipo: "Respondido", regiao: "Curitiba - PR" },
  { nome: "Felipe Duarte", score: 10, tipo: "Respondido", regiao: "Porto Alegre - RS" },
];

function getContentForType(type: DrillDownType, data: any) {
  switch (type) {
    case "promotores":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "Total Promotores", value: data?.quantidade?.toLocaleString("pt-BR") ?? "61.000" },
              { label: "Percentual", value: `${data?.percentual ?? 67.76}%`, color: "hsl(145 100% 39%)" },
              { label: "Score 9-10", value: "Faixa NPS" },
            ]}
          />
          <FormulaBlock
            formula="Promotores (%) = (Clientes com score 9-10 / Total de Clientes) × 100"
            explanation="Promotores são clientes altamente satisfeitos que recomendam ativamente a marca."
          />
          <p className="text-xs font-semibold text-muted-foreground">Amostra de Registros</p>
          <SampleTable rows={sampleClients.filter((c) => c.score >= 9)} />
        </div>
      );
    case "neutros":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "Total Neutros", value: data?.quantidade?.toLocaleString("pt-BR") ?? "18.387" },
              { label: "Percentual", value: `${data?.percentual ?? 20.43}%`, color: "hsl(48 100% 50%)" },
              { label: "Score 7-8", value: "Faixa NPS" },
            ]}
          />
          <FormulaBlock
            formula="Neutros (%) = (Clientes com score 7-8 / Total de Clientes) × 100"
            explanation="Neutros são clientes satisfeitos mas não entusiasmados. Podem migrar para promotores ou detratores."
          />
          <p className="text-xs font-semibold text-muted-foreground">Amostra de Registros</p>
          <SampleTable
            rows={[
              { nome: "Pedro Oliveira", score: 7, tipo: "Calculado", regiao: "Brasília - DF" },
              { nome: "Rafael Lima", score: 8, tipo: "Respondido", regiao: "Salvador - BA" },
              { nome: "Patrícia Souza", score: 7, tipo: "Calculado", regiao: "São Paulo - SP" },
              { nome: "Amanda Torres", score: 8, tipo: "Respondido", regiao: "Belo Horizonte - MG" },
              { nome: "Larissa Castro", score: 7, tipo: "Calculado", regiao: "Fortaleza - CE" },
            ]}
          />
        </div>
      );
    case "detratores":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "Total Detratores", value: data?.quantidade?.toLocaleString("pt-BR") ?? "10.629" },
              { label: "Percentual", value: `${data?.percentual ?? 11.81}%`, color: "hsl(356 97% 46%)" },
              { label: "Score 0-6", value: "Faixa NPS" },
            ]}
          />
          <FormulaBlock
            formula="Detratores (%) = (Clientes com score 0-6 / Total de Clientes) × 100"
            explanation="Detratores são clientes insatisfeitos que podem prejudicar a marca com feedback negativo."
          />
          <p className="text-xs font-semibold text-muted-foreground">Amostra de Registros</p>
          <SampleTable
            rows={[
              { nome: "João Santos", score: 4, tipo: "Calculado", regiao: "Rio de Janeiro - RJ" },
              { nome: "Lucas Ferreira", score: 3, tipo: "Calculado", regiao: "Porto Alegre - RS" },
              { nome: "Bruno Cardoso", score: 5, tipo: "Calculado", regiao: "Recife - PE" },
              { nome: "Camila Ribeiro", score: 2, tipo: "Respondido", regiao: "Manaus - AM" },
              { nome: "Isabela Gomes", score: 6, tipo: "Calculado", regiao: "São Paulo - SP" },
            ]}
          />
        </div>
      );
    case "nps_score":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "NPS Score", value: data?.nps_score?.toFixed(1) ?? "55.9" },
              { label: "Total Clientes", value: data?.total_clientes?.toLocaleString("pt-BR") ?? "90.000" },
              { label: "Zona", value: data?.nps_score >= 50 ? "Excelência" : data?.nps_score >= 0 ? "Aperfeiçoamento" : "Crítica" },
            ]}
          />
          <FormulaBlock
            formula="NPS = % Promotores − % Detratores"
            explanation="O Net Promoter Score varia de -100 a +100. Valores acima de 50 são considerados excelentes, entre 0 e 50 são bons, e negativos indicam necessidade de melhorias urgentes."
          />
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Composição do Score</p>
            <div className="flex items-center gap-2 h-6 rounded-full overflow-hidden">
              <div
                className="h-full bg-nps-promoter rounded-l-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ width: `${data?.promotores?.percentual ?? 67.76}%` }}
              >
                {(data?.promotores?.percentual ?? 67.76).toFixed(1)}%
              </div>
              <div
                className="h-full bg-nps-neutral flex items-center justify-center text-[9px] font-bold"
                style={{ width: `${data?.neutros?.percentual ?? 20.43}%` }}
              >
                {(data?.neutros?.percentual ?? 20.43).toFixed(1)}%
              </div>
              <div
                className="h-full bg-nps-detractor rounded-r-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ width: `${data?.detratores?.percentual ?? 11.81}%` }}
              >
                {(data?.detratores?.percentual ?? 11.81).toFixed(1)}%
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Promotores</span>
              <span>Neutros</span>
              <span>Detratores</span>
            </div>
          </div>
        </div>
      );
    case "nps_respondido":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "NPS Respondido", value: "72.4", color: "hsl(210 79% 46%)" },
              { label: "Total Respostas", value: data?.total_respondidos?.toLocaleString("pt-BR") ?? "5.000" },
              { label: "Taxa Resposta", value: "5.6%" },
            ]}
          />
          <FormulaBlock
            formula="NPS Respondido = % Promotores(respondidos) − % Detratores(respondidos)"
            explanation="Calculado exclusivamente com base nos clientes que efetivamente responderam à pesquisa de NPS."
          />
          <p className="text-xs font-semibold text-muted-foreground">Amostra — Respondidos</p>
          <SampleTable rows={sampleClients.filter((c) => c.tipo === "Respondido").slice(0, 6)} />
        </div>
      );
    case "nps_calculado":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "NPS Calculado", value: "68.1", color: "hsl(36 100% 50%)" },
              { label: "Total Predições", value: data?.total_calculados?.toLocaleString("pt-BR") ?? "85.000" },
              { label: "Acurácia IA", value: "92.3%" },
            ]}
          />
          <FormulaBlock
            formula="NPS Calculado = Modelo IA (features: histórico, ticket, uso, churn risk)"
            explanation="Utiliza modelos de machine learning para predizer o score NPS de clientes que não responderam à pesquisa, com base em dados comportamentais e transacionais."
          />
          <p className="text-xs font-semibold text-muted-foreground">Amostra — Calculados (IA)</p>
          <SampleTable rows={sampleClients.filter((c) => c.tipo === "Calculado").slice(0, 6)} />
        </div>
      );
    case "pesquisas":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "Pesquisas Realizadas", value: "14.832" },
              { label: "Taxa de Conclusão", value: "33.7%" },
              { label: "Período", value: "Últimos 30 dias" },
            ]}
          />
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Distribuição por Canal</p>
            <div className="space-y-2">
              {[
                { canal: "SMS", qtd: 6230, pct: 42 },
                { canal: "E-mail", qtd: 4450, pct: 30 },
                { canal: "App", qtd: 2670, pct: 18 },
                { canal: "WhatsApp", qtd: 1482, pct: 10 },
              ].map((c) => (
                <div key={c.canal} className="flex items-center gap-3">
                  <span className="text-xs w-16">{c.canal}</span>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-20 text-right">
                    {c.qtd.toLocaleString("pt-BR")} ({c.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "csat":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "CSAT Score", value: `${data?.csat_score ?? 73}%` },
              { label: "Mês Anterior", value: `${data?.csat_mes_anterior ?? 70}%` },
              { label: "Variação", value: `+${((data?.csat_score ?? 73) - (data?.csat_mes_anterior ?? 70)).toFixed(1)}%`, color: "hsl(145 100% 39%)" },
            ]}
          />
          <FormulaBlock
            formula="CSAT = (Respostas Positivas / Total de Respostas) × 100"
            explanation="O Customer Satisfaction Score mede a satisfação direta do cliente com um produto ou serviço. Respostas 'Satisfeito' e 'Muito Satisfeito' são consideradas positivas."
          />
        </div>
      );
    case "nps_gauge":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "NPS Score", value: String(data?.nps_score ?? 62) },
              { label: "Promotores", value: `${data?.promotores?.percentual ?? 67.8}%`, color: "hsl(145 100% 39%)" },
              { label: "Detratores", value: `${data?.detratores?.percentual ?? 11.8}%`, color: "hsl(356 97% 46%)" },
            ]}
          />
          <FormulaBlock
            formula="NPS = % Promotores − % Detratores"
            explanation="Escala de -100 a +100. Zona de Excelência (75-100), Qualidade (50-74), Aperfeiçoamento (0-49), Crítica (<0)."
          />
        </div>
      );
    case "ces":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "CES Score", value: `${data?.ces_score ?? 75.9}%` },
              { label: "Esforço Baixo", value: "68%", color: "hsl(145 100% 39%)" },
              { label: "Esforço Alto", value: "12%", color: "hsl(356 97% 46%)" },
            ]}
          />
          <FormulaBlock
            formula="CES = (Soma das respostas / Número de respostas) × (100 / escala_max)"
            explanation="O Customer Effort Score mede o esforço que o cliente precisa fazer para resolver um problema. Valores altos indicam baixo esforço (positivo)."
          />
        </div>
      );
    case "satisfacao_categoria":
      return (
        <div className="space-y-4">
          <FormulaBlock
            formula="Satisfação (%) = (Respostas por nível / Total de respostas da categoria) × 100"
            explanation="Distribuição percentual de satisfação por categoria de serviço, segmentada em 5 níveis."
          />
          {data?.satisfacao_breakdown && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Categoria</TableHead>
                    <TableHead className="text-xs text-center">Muito Satisfeito</TableHead>
                    <TableHead className="text-xs text-center">Satisfeito</TableHead>
                    <TableHead className="text-xs text-center">Neutro</TableHead>
                    <TableHead className="text-xs text-center">Insatisfeito</TableHead>
                    <TableHead className="text-xs text-center">Muito Insatisfeito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.satisfacao_breakdown.map((row: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs font-medium">{row.categoria}</TableCell>
                      <TableCell className="text-xs text-center">{row.muitoSatisfeito}%</TableCell>
                      <TableCell className="text-xs text-center">{row.satisfeito}%</TableCell>
                      <TableCell className="text-xs text-center">{row.neutro}%</TableCell>
                      <TableCell className="text-xs text-center">{row.insatisfeito}%</TableCell>
                      <TableCell className="text-xs text-center">{row.muitoInsatisfeito}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      );
    case "tempo_medio":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "Tempo Atual", value: data?.tempo_medio_resposta ?? "8:45" },
              { label: "Mês Anterior", value: data?.tempo_mes_anterior ?? "10:12" },
              { label: "Tendência", value: "↓ Reduzindo", color: "hsl(145 100% 39%)" },
            ]}
          />
          <FormulaBlock
            formula="Tempo Médio = Σ(tempo de resposta) / Número de respostas"
            explanation="Tempo médio em horas entre o envio da pesquisa e a resposta do cliente. Tempos menores indicam maior engajamento."
          />
          {data?.tempo_resposta_mensal && (
            <MonthlyTable
              data={data.tempo_resposta_mensal}
              columns={[{ key: "tempo", label: "Tempo (hr)" }]}
            />
          )}
        </div>
      );
    case "evolucao_csat":
      return (
        <div className="space-y-4">
          <FormulaBlock
            formula="CSAT mensal = (Respostas positivas no mês / Total de respostas no mês) × 100"
            explanation="Evolução mensal do índice de satisfação dos clientes nos últimos 6 meses."
          />
          {data?.evolucao_mensal && (
            <MonthlyTable
              data={data.evolucao_mensal}
              columns={[
                { key: "csat", label: "CSAT (%)" },
                { key: "nps", label: "NPS" },
              ]}
            />
          )}
        </div>
      );
    case "comp_respondido":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "NPS Respondido", value: String(data?.score ?? 62), color: "hsl(210 79% 46%)" },
              { label: "Total Clientes", value: data?.total_clientes?.toLocaleString("pt-BR") ?? "8.400" },
              { label: "Promotores", value: `${data?.promotores?.percentual ?? 67.8}%`, color: "hsl(145 100% 39%)" },
            ]}
          />
          <FormulaBlock
            formula="NPS Respondido = % Promotores(respondidos) − % Detratores(respondidos)"
            explanation="Score baseado exclusivamente em respostas diretas de clientes à pesquisa NPS."
          />
        </div>
      );
    case "comp_calculado":
      return (
        <div className="space-y-4">
          <MetricSummary
            items={[
              { label: "NPS Calculado", value: String(data?.score ?? 62), color: "hsl(36 100% 50%)" },
              { label: "Total Clientes", value: data?.total_clientes?.toLocaleString("pt-BR") ?? "95.000" },
              { label: "Acurácia", value: "92.3%" },
            ]}
          />
          <FormulaBlock
            formula="NPS Calculado = f(histórico_interações, tickets, uso_produto, risco_churn)"
            explanation="Predição via modelo de IA treinado com dados comportamentais dos clientes que não responderam."
          />
        </div>
      );
    case "evolucao_nps":
      return (
        <div className="space-y-4">
          <FormulaBlock
            formula="NPS mensal = % Promotores(mês) − % Detratores(mês)"
            explanation="Comparação da evolução do NPS Respondido vs Calculado (IA) ao longo dos últimos 6 meses."
          />
          {data?.evolucao_nps && (
            <MonthlyTable
              data={data.evolucao_nps}
              columns={[
                { key: "respondido", label: "NPS Respondido" },
                { key: "calculado", label: "NPS Calculado" },
              ]}
            />
          )}
        </div>
      );
    default:
      return <p className="text-sm text-muted-foreground">Dados não disponíveis.</p>;
  }
}

export default function DrillDownModal({ open, onClose, type, data }: DrillDownModalProps) {
  if (!type) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-base">{TITLES[type]}</DialogTitle>
          <DialogDescription className="text-xs">
            Clique fora ou no X para fechar
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-2">
          {getContentForType(type, data)}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
