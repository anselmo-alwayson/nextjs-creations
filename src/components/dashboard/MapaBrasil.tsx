import { useState } from "react";
import type { RegionalData } from "@/data/mockData";
import { getCategoriaColor } from "@/data/mockData";
import { MapPin } from "lucide-react";

interface MapaBrasilProps {
  regioes: RegionalData[];
  selectedCidade: string | null;
  onSelectCidade: (cidade: string | null, estado: string | null) => void;
}

const BRAZIL_PATH = `M 220,30 C 200,32 170,38 140,44 C 110,50 82,58 62,72 C 45,88 40,112 38,142 C 36,172 40,202 50,235 C 60,268 78,298 100,325 C 122,350 148,375 180,398 C 210,418 238,435 265,445 C 285,450 300,448 318,438 C 338,425 355,405 370,382 C 385,358 398,330 410,300 C 422,270 435,242 450,215 C 462,190 474,168 482,145 C 488,128 492,112 492,95 C 492,80 486,68 475,62 C 462,55 448,58 435,68 C 420,80 408,95 395,108 C 380,122 365,130 350,128 C 338,125 328,115 320,100 C 310,82 300,65 288,52 C 275,40 260,33 245,28 C 233,25 227,27 220,30 Z`;

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 74) / 39.2) * 460 + 20;
  const y = ((5.3 - lat) / 39) * 440 + 20;
  return { x, y };
}

const MapaBrasil = ({ regioes, selectedCidade, onSelectCidade }: MapaBrasilProps) => {
  const [hoveredCity, setHoveredCity] = useState<RegionalData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleCityClick = (regiao: RegionalData) => {
    if (selectedCidade === regiao.cidade) {
      onSelectCidade(null, null);
    } else {
      onSelectCidade(regiao.cidade, regiao.estado);
    }
  };

  return (
    <div className="relative rounded-xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Mapa de NPS por Região</h3>

      <div className="relative mx-auto w-full max-w-[480px]">
        <svg
          viewBox="0 0 530 480"
          className="h-auto w-full"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
        >
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(220 13% 91%)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="brazilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(356 97% 46%)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(356 97% 46%)" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <rect width="530" height="480" fill="url(#grid)" rx="8" />

          {/* Brazil outline */}
          <path
            d={BRAZIL_PATH}
            fill="url(#brazilGrad)"
            stroke="hsl(356 97% 46%)"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          {/* City markers */}
          {regioes.map((regiao) => {
            const pos = latLngToXY(regiao.lat, regiao.lng);
            const color = getCategoriaColor(regiao.categoria_cor);
            const isSelected = selectedCidade === regiao.cidade;
            const isHovered = hoveredCity?.cidade === regiao.cidade;

            return (
              <g
                key={regiao.cidade}
                className="cursor-pointer"
                onClick={() => handleCityClick(regiao)}
                onMouseEnter={() => setHoveredCity(regiao)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Pulse ring */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 16 : 12}
                    fill={color}
                    opacity={0.15}
                    className={isSelected ? "" : ""}
                  />
                )}
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={10}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 7 : isHovered ? 7 : 5.5}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  style={{ transition: "r 0.2s ease" }}
                />
                {/* City label */}
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  className="select-none fill-foreground text-[8px] font-semibold"
                  opacity={isSelected || isHovered ? 1 : 0.7}
                >
                  {regiao.cidade}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredCity && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-border bg-card px-3 py-2 shadow-lg"
            style={{
              left: `${mousePos.x + 12}px`,
              top: `${mousePos.y - 10}px`,
              transform: mousePos.x > 300 ? "translateX(-110%)" : "none",
            }}
          >
            <p className="text-xs font-bold text-foreground">{hoveredCity.cidade} - {hoveredCity.estado}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">NPS:</span>
              <span className="text-sm font-bold" style={{ color: getCategoriaColor(hoveredCity.categoria_cor) }}>
                {hoveredCity.nps_score}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {hoveredCity.total_clientes.toLocaleString("pt-BR")} clientes
            </p>
          </div>
        )}
      </div>

      {/* Region list */}
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {regioes.map((r) => (
          <button
            key={r.cidade}
            onClick={() => handleCityClick(r)}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors ${
              selectedCidade === r.cidade
                ? "bg-accent font-semibold text-accent-foreground"
                : "hover:bg-secondary"
            }`}
          >
            <MapPin className="h-3 w-3 flex-shrink-0" style={{ color: getCategoriaColor(r.categoria_cor) }} />
            <span className="truncate">{r.cidade}</span>
            <span className="ml-auto font-bold" style={{ color: getCategoriaColor(r.categoria_cor) }}>
              {r.nps_score}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapaBrasil;
