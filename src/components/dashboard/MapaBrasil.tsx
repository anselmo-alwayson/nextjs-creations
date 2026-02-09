import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON, useMap } from "react-leaflet";
import type { RegionalData } from "@/data/mockData";
import { getCategoriaColor } from "@/data/mockData";
import { MapPin, Globe } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapaBrasilProps {
  regioes: RegionalData[];
  selectedCidade: string | null;
  selectedEstado?: string | null;
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

const BRAZIL_BOUNDS: [[number, number], [number, number]] = [
  [5.3, -73.9],
  [-33.8, -34.8],
];

/** Simple GeoJSON outline of Brazil (approximate) */
function BrazilHighlight() {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    // Fetch Brazil boundary from a public GeoJSON source
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        const brazil = data.features.find(
          (f: any) => f.properties.ADMIN === "Brazil" || f.properties.ISO_A3 === "BRA"
        );
        if (brazil) setGeoData(brazil);
      })
      .catch(() => {
        // Silently fail - map still works without the highlight
      });
  }, []);

  if (!geoData) return null;

  return (
    <GeoJSON
      data={geoData}
      style={{
        color: "#E30613",
        weight: 2,
        fillColor: "#E30613",
        fillOpacity: 0.05,
        dashArray: "4 2",
      }}
    />
  );
}

const MapaBrasil = ({ regioes, selectedCidade, selectedEstado, onSelectCidade }: MapaBrasilProps) => {
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
        <div className="relative h-[300px] sm:h-[400px] md:h-[480px]">
          <MapContainer
            center={[-14.5, -52]}
            zoom={4}
            className="h-full w-full z-0"
            scrollWheelZoom
            zoomControl
            maxBounds={BRAZIL_BOUNDS}
            minZoom={3}
            style={{ background: "#f8f9fa" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <BrazilHighlight />
            <MapController selectedCidade={selectedCidade} regioes={regioes} />

            {regioes.map((regiao) => {
              const color = cssVarToHex(getCategoriaColor(regiao.categoria_cor));
              const isSelected = selectedCidade === regiao.cidade || (!!selectedEstado && regiao.estado === selectedEstado);
              const isHovered = hoveredCity === regiao.cidade;
              const radius = getMarkerRadius(regiao.total_clientes, isSelected || isHovered);

              return (
                <CircleMarker
                  key={regiao.cidade}
                  center={[regiao.lat, regiao.lng]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? "#333" : color,
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
        <div className="border-t lg:border-t-0 lg:border-l border-border p-3 overflow-y-auto max-h-[200px] sm:max-h-[400px] md:max-h-[480px]">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Regiões</p>
          <div className="flex flex-row flex-wrap gap-1 lg:flex-col lg:flex-nowrap">
            <button
              onClick={() => onSelectCidade(null, null)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors w-full ${
                !selectedCidade
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <Globe className="h-3 w-3 flex-shrink-0 text-primary" />
              <span className="truncate">Brasil</span>
            </button>
            {regioes.map((r) => {
              const color = cssVarToHex(getCategoriaColor(r.categoria_cor));
              const isActive = selectedCidade === r.cidade || (!!selectedEstado && r.estado === selectedEstado);
              return (
                <button
                  key={r.cidade}
                  onClick={() => handleCityClick(r)}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors w-full ${
                    isActive
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
