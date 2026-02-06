import { useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { RegionalData } from "@/data/mockData";
import { getCategoriaColor } from "@/data/mockData";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapaBrasilProps {
  regioes: RegionalData[];
  selectedCidade: string | null;
  onSelectCidade: (cidade: string | null, estado: string | null) => void;
}

function getMarkerRadius(totalClientes: number, isSelected: boolean): number {
  const base = Math.max(6, Math.min(18, totalClientes / 2000));
  return isSelected ? base + 4 : base;
}

function cssVarToHex(cssVar: string): string {
  const map: Record<string, string> = {
    "var(--chart-promoter)": "#00C853",
    "var(--chart-neutral)": "#FFD600",
    "var(--chart-detractor)": "#E30613",
  };
  return map[cssVar] ?? "#888";
}

/** Fly to a selected city or reset to Brazil view */
function MapController({ selectedCidade, regioes }: { selectedCidade: string | null; regioes: RegionalData[] }) {
  const map = useMap();

  useMemo(() => {
    if (selectedCidade) {
      const r = regioes.find((reg) => reg.cidade === selectedCidade);
      if (r) map.flyTo([r.lat, r.lng], 8, { duration: 1 });
    } else {
      map.flyTo([-14.5, -52], 4, { duration: 1 });
    }
  }, [selectedCidade, regioes, map]);

  return null;
}

const MapaBrasil = ({ regioes, selectedCidade, onSelectCidade }: MapaBrasilProps) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const handleCityClick = (regiao: RegionalData) => {
    if (selectedCidade === regiao.cidade) {
      onSelectCidade(null, null);
    } else {
      onSelectCidade(regiao.cidade, regiao.estado);
    }
  };

  return (
    <div className="relative rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-foreground">Mapa de NPS por Região</h3>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px]">
        {/* Leaflet Map */}
        <div className="relative h-[400px] md:h-[480px]">
          <MapContainer
            center={[-14.5, -52]}
            zoom={4}
            className="h-full w-full z-0"
            scrollWheelZoom
            zoomControl
            style={{ background: "#1a1a2e" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapController selectedCidade={selectedCidade} regioes={regioes} />

            {regioes.map((regiao) => {
              const color = cssVarToHex(getCategoriaColor(regiao.categoria_cor));
              const isSelected = selectedCidade === regiao.cidade;
              const isHovered = hoveredCity === regiao.cidade;
              const radius = getMarkerRadius(regiao.total_clientes, isSelected || isHovered);

              return (
                <CircleMarker
                  key={regiao.cidade}
                  center={[regiao.lat, regiao.lng]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? "#fff" : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.9 : 0.7,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => handleCityClick(regiao),
                    mouseover: () => setHoveredCity(regiao.cidade),
                    mouseout: () => setHoveredCity(null),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -radius]} opacity={0.95}>
                    <div className="text-xs">
                      <p className="font-bold">{regiao.cidade} - {regiao.estado}</p>
                      <p>NPS: <strong style={{ color }}>{regiao.nps_score}</strong></p>
                      <p>{regiao.total_clientes.toLocaleString("pt-BR")} clientes</p>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Region list sidebar */}
        <div className="border-t lg:border-t-0 lg:border-l border-border p-3 overflow-y-auto max-h-[400px] md:max-h-[480px]">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Regiões</p>
          <div className="flex flex-row flex-wrap gap-1 lg:flex-col lg:flex-nowrap">
            {regioes.map((r) => {
              const color = cssVarToHex(getCategoriaColor(r.categoria_cor));
              return (
                <button
                  key={r.cidade}
                  onClick={() => handleCityClick(r)}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors w-full ${
                    selectedCidade === r.cidade
                      ? "bg-accent font-semibold text-accent-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  <MapPin className="h-3 w-3 flex-shrink-0" style={{ color }} />
                  <span className="truncate">{r.cidade}</span>
                  <span className="ml-auto font-bold" style={{ color }}>
                    {r.nps_score}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaBrasil;
