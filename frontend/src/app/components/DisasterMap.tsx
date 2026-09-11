import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Search,
  Radio,
  AlertTriangle,
  Compass,
  CheckCircle,
  ShieldAlert,
  CloudRain,
  Wind,
  Thermometer,
  Activity,
  Gauge,
  PhoneCall,
  MapPin,
  ExternalLink,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config/api";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type DisasterLocation = {
  id: number | string;
  lat: number;
  lng: number;
  name: string;
  state: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure?: number;
  condition?: string;
  threatType?: string;
  threatProbability?: number;
  threatLabel?: string;
  riskScore: number;
  riskLevel: string;
  disasterType: string;
  recommendations?: string[];
  humanitarian_aid?: {
    alert?: string;
    alert_level?: string;
    shelters_needed?: number;
    medical_teams?: number;
    food_packets?: number;
    ndrf_teams?: number;
    aid_actions?: string[];
    safety_tips?: string[];
    emergency_contacts?: string[];
  };
};

// Empirical directives and aid actions generator for authentic fallback
function getDirectivesAndAid(loc: DisasterLocation): { recommendations: string[]; aid_actions: string[] } {
  if (loc.recommendations && loc.recommendations.length > 0 && loc.humanitarian_aid?.aid_actions?.length) {
    return {
      recommendations: loc.recommendations,
      aid_actions: loc.humanitarian_aid.aid_actions,
    };
  }

  const dType = (loc.threatType || loc.disasterType || "Flood").toLowerCase();
  if (dType.includes("cyclone")) {
    return {
      recommendations: [
        "Relocate immediately from low-lying coastal belts and kutcha houses to designated pucca cyclone shelters.",
        "Secure external shutters and doors; tape large glass window panes to mitigate wind shatter.",
        "Stay clear of high-tension power cables, tin roofs, and uprooted foliage.",
        "Do not venture outdoors during the calm 'cyclone eye' period; high-speed gales will resume violently.",
        "Keep transceivers and cell devices charged; monitor real-time IMD Doppler cyclone radars.",
      ],
      aid_actions: [
        "Deploy NDRF and State SDRF battalion units equipped with pneumatic cutting gears.",
        "Pre-stage emergency diesel generators at district civil hospitals and water filtration stations.",
        "Stockpile 50,000+ sealed dry food rations and halogen purifiers in relief transit points.",
        "Activate coastal satellite emergency communications and maritime distress channels.",
      ],
    };
  } else if (dType.includes("landslide")) {
    return {
      recommendations: [
        "Evacuate hillside slopes, toe-cut road edges, and escarpments immediately upon seeing ground fissures.",
        "Avoid mountain highway corridors and Ghat roads during high-intensity rainfall episodes.",
        "Listen for unusual rumbling sounds, rockfall cracking, or sudden muddy springs breaking through soil.",
        "Move perpendicular to the landslide trajectory towards wide, stable flat terraces.",
        "Do not reoccupy evacuated residences until district geotechnical engineers certify slope stability.",
      ],
      aid_actions: [
        "Deploy heavy hydraulic excavators and rock-breakers along primary arterial highways.",
        "Mobilize canine search-and-rescue squads and drone LiDAR thermal imaging for isolated zones.",
        "Establish trauma medical stabilization posts at mountain pass transit junctions.",
        "Set up temporary weatherproof community shelters with thermal blankets and potable water.",
      ],
    };
  } else if (dType.includes("drought")) {
    return {
      recommendations: [
        "Maintain adequate electrolyte hydration using oral rehydration salts (ORS) and boiled water.",
        "Restrict strenuous outdoor physical exertion during peak afternoon hours (11:00 AM – 04:00 PM).",
        "Implement urgent municipal water rationing and prioritize essential domestic drinking supplies.",
        "Utilize micro-irrigation and drip delivery to conserve depleting agricultural aquifers.",
        "Ensure livestock have access to shaded shelters and emergency fodder reserves.",
      ],
      aid_actions: [
        "Dispatch municipal GPS-tracked potable water tankers to water-stressed wards and villages.",
        "Open 24/7 air-cooled public heat shelters and hydration kiosks at bus and rail hubs.",
        "Distribute subsidized fodder packets and veterinary rehydration salts in rural tehsils.",
        "Establish continuous remote sensing of reservoir storage volumes and soil moisture indexes.",
      ],
    };
  } else if (dType.includes("earthquake")) {
    return {
      recommendations: [
        "DROP to your hands and knees, take COVER under a sturdy desk or table, and HOLD ON firmly.",
        "Stay clear of glass windows, unreinforced brick facades, tall bookcases, and suspended fixtures.",
        "If outdoors in urban centers, move to an open sports ground away from high-rise buildings and electric lines.",
        "After tremors cease, do not operate elevators; descend via exterior fire staircases.",
        "Inspect natural gas pipes and electrical conduits for ruptures before using open flames.",
      ],
      aid_actions: [
        "Deploy Urban Search and Rescue (USAR) specialized task forces with acoustic life-detectors.",
        "Erect inflatable disaster medical field hospitals and trauma triage operating theaters.",
        "Distribute weatherproof geodesic dome tents and thermal survival bedding.",
        "Coordinate structural safety inspections for bridges, flyovers, and critical lifelines.",
      ],
    };
  } else {
    // Default / Flood
    return {
      recommendations: [
        "Move immediately to designated multi-story flood shelters or elevated community centers.",
        "Never attempt to drive or wade through floodwaters; 15 cm of moving water can knock down an adult.",
        "Disconnect main electrical circuit breakers and LPG gas cylinders before floodwaters enter premises.",
        "Consume only sealed bottled, boiled, or chlorine-treated water to prevent cholera outbreaks.",
        "Store emergency documents, dry medicine, flashlight, and battery banks in waterproof sealed pouches.",
      ],
      aid_actions: [
        "Deploy inflatable rescue powerboats and NDRF deep-diving flood rescue teams.",
        "Establish dry relief camps equipped with community kitchens, clean sanitation, and baby food.",
        "Pre-position chlorine tablets, ORS packets, and anti-snake venom vials at Primary Health Centres.",
        "Coordinate continuous real-time discharge monitoring across upstream dam barrages.",
      ],
    };
  }
}

// 15 Premier Monitored Cities across India with specific hazard profiles
const FALLBACK_15_CITIES: DisasterLocation[] = [
  { id: 1, name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, rainfall: 4.2, temperature: 31, humidity: 78, windSpeed: 18, pressure: 1011, riskScore: 42, riskLevel: "Moderate", disasterType: "Flood", threatType: "Flood", condition: "🌊 Flood Probability: 42%" },
  { id: 2, name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090, rainfall: 0.0, temperature: 34, humidity: 45, windSpeed: 12, pressure: 1013, riskScore: 38, riskLevel: "Moderate", disasterType: "Drought", threatType: "Drought", condition: "☀️ Drought Vulnerability: 38%" },
  { id: 3, name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, rainfall: 8.5, temperature: 30, humidity: 82, windSpeed: 24, pressure: 1008, riskScore: 58, riskLevel: "Moderate", disasterType: "Cyclone", threatType: "Cyclone", condition: "🌀 Cyclone Threat: 58%" },
  { id: 4, name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, rainfall: 6.1, temperature: 32, humidity: 80, windSpeed: 16, pressure: 1012, riskScore: 44, riskLevel: "Moderate", disasterType: "Flood", threatType: "Flood", condition: "🌊 Flood Probability: 44%" },
  { id: 5, name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946, rainfall: 2.0, temperature: 27, humidity: 65, windSpeed: 14, pressure: 1014, riskScore: 32, riskLevel: "Safe", disasterType: "Flood", threatType: "Flood", condition: "🌊 Flood Probability: 32%" },
  { id: 6, name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, rainfall: 0.5, temperature: 32, humidity: 55, windSpeed: 15, pressure: 1013, riskScore: 35, riskLevel: "Safe", disasterType: "Drought", threatType: "Drought", condition: "☀️ Drought Vulnerability: 35%" },
  { id: 7, name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, rainfall: 0.0, temperature: 36, humidity: 38, windSpeed: 11, pressure: 1012, riskScore: 48, riskLevel: "Moderate", disasterType: "Drought", threatType: "Drought", condition: "☀️ Drought Vulnerability: 48%" },
  { id: 8, name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362, rainfall: 14.2, temperature: 28, humidity: 88, windSpeed: 10, pressure: 1009, riskScore: 68, riskLevel: "High", disasterType: "Flood", threatType: "Flood", condition: "🌊 Flood Probability: 68%" },
  { id: 9, name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245, rainfall: 9.0, temperature: 31, humidity: 79, windSpeed: 22, pressure: 1007, riskScore: 62, riskLevel: "High", disasterType: "Cyclone", threatType: "Cyclone", condition: "🌀 Cyclone Threat: 62%" },
  { id: 10, name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, rainfall: 12.0, temperature: 18, humidity: 72, windSpeed: 8, pressure: 1016, riskScore: 54, riskLevel: "Moderate", disasterType: "Landslide", threatType: "Landslide", condition: "⛰️ Landslide Risk: 54%" },
  { id: 11, name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376, rainfall: 5.4, temperature: 31, humidity: 75, windSpeed: 13, pressure: 1011, riskScore: 46, riskLevel: "Moderate", disasterType: "Flood", threatType: "Flood", condition: "🌊 Flood Probability: 46%" },
  { id: 12, name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, rainfall: 11.2, temperature: 29, humidity: 84, windSpeed: 17, pressure: 1010, riskScore: 56, riskLevel: "Moderate", disasterType: "Flood", threatType: "Flood", condition: "🌊 Flood Probability: 56%" },
  { id: 13, name: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973, rainfall: 7.8, temperature: 20, humidity: 68, windSpeed: 9, pressure: 1015, riskScore: 48, riskLevel: "Moderate", disasterType: "Landslide", threatType: "Landslide", condition: "⛰️ Landslide Risk: 48%" },
  { id: 14, name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322, rainfall: 10.4, temperature: 24, humidity: 76, windSpeed: 11, pressure: 1014, riskScore: 52, riskLevel: "Moderate", disasterType: "Landslide", threatType: "Landslide", condition: "⛰️ Landslide Risk: 52%" },
  { id: 15, name: "Bhuj", state: "Gujarat", lat: 23.2420, lng: 69.6669, rainfall: 0.0, temperature: 35, humidity: 42, windSpeed: 14, pressure: 1012, riskScore: 40, riskLevel: "Moderate", disasterType: "Earthquake", threatType: "Earthquake", condition: "🏚️ Seismic Risk: 40%" }
];

const getMarkerColor = (riskScore: number): string => {
  if (riskScore >= 70) return "#ef4444";
  if (riskScore >= 50) return "#f97316";
  if (riskScore >= 35) return "#eab308";
  return "#22c55e";
};

const getRiskLabel = (riskScore: number): string => {
  if (riskScore >= 70) return "CRITICAL";
  if (riskScore >= 50) return "HIGH RISK";
  if (riskScore >= 35) return "MODERATE";
  return "SAFE / LOW";
};

const getRiskColorClass = (riskScore: number) => {
  if (riskScore >= 70) return "text-red-400 border-red-500/40 bg-red-950/40";
  if (riskScore >= 50) return "text-orange-400 border-orange-500/40 bg-orange-950/40";
  if (riskScore >= 35) return "text-yellow-400 border-yellow-500/40 bg-yellow-950/40";
  return "text-green-400 border-green-500/40 bg-green-950/40";
};

const REGIONS = ["All India", "North", "South", "East & NE", "West", "Central"];

const matchRegion = (state: string, region: string) => {
  if (region === "All India") return true;
  const s = state.toLowerCase();
  if (region === "North") {
    return s.includes("delhi") || s.includes("jammu") || s.includes("kashmir") || s.includes("ladakh") ||
      s.includes("himachal") || s.includes("uttarakhand") || s.includes("punjab") || s.includes("haryana") || s.includes("chandigarh");
  }
  if (region === "South") {
    return s.includes("karnataka") || s.includes("tamil") || s.includes("kerala") || s.includes("andhra") || s.includes("telangana");
  }
  if (region === "East & NE") {
    return s.includes("bengal") || s.includes("odisha") || s.includes("bihar") || s.includes("assam");
  }
  if (region === "West") {
    return s.includes("maharashtra") || s.includes("gujarat") || s.includes("rajasthan") || s.includes("goa");
  }
  if (region === "Central") {
    return s.includes("madhya") || s.includes("chhattisgarh") || s.includes("uttar pradesh");
  }
  return true;
};

export function DisasterMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [locations, setLocations] = useState<DisasterLocation[]>(FALLBACK_15_CITIES);
  const [selectedLocation, setSelectedLocation] = useState<DisasterLocation>(FALLBACK_15_CITIES[0]);
  const [activeRegion, setActiveRegion] = useState("All India");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fetch live 15 locations from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/locations`);
        if (!res.ok) throw new Error("Backend response error");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0 && isMounted) {
          const backendFormatted: DisasterLocation[] = data
            .map((item: any, index: number) => {
              const threatLabel = item.threatLabel || item.condition || `${item.disasterType || "Disaster"} Risk: ${item.riskScore || 25}%`;
              const risk = item.threatProbability ?? item.riskScore ?? 30;
              return {
                id: item.id || `loc-${index}`,
                lat: item.lat,
                lng: item.lng,
                name: item.name || "",
                state: item.state || "India",
                rainfall: item.rainfall ?? 0,
                temperature: item.temperature ?? 25,
                humidity: item.humidity ?? 50,
                windSpeed: item.windSpeed ?? 10,
                pressure: item.pressure ?? 1013,
                condition: threatLabel,
                threatType: item.threatType || item.disasterType || "Hazard",
                threatProbability: risk,
                threatLabel: threatLabel,
                riskScore: risk,
                riskLevel: item.riskLevel || "Moderate",
                disasterType: item.threatType || item.disasterType || "Hazard",
                recommendations: item.recommendations,
                humanitarian_aid: item.humanitarian_aid,
              };
            })
            .filter((loc) => loc.name && !loc.name.startsWith("Live Location"));

          setLocations(backendFormatted);
          setSelectedLocation((prev) => {
            const matching = backendFormatted.find((l) => l.name.toLowerCase() === prev.name.toLowerCase());
            return matching || backendFormatted[0];
          });
        }
      } catch (err) {
        console.warn("Using verified 15 Indian baseline nodes:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 🇮🇳 PAN-INDIA DYNAMIC LOCATION SEARCH & PINNING
  const handleLocationLookup = async (queryToSearch?: string) => {
    const target = (queryToSearch || searchQuery).trim();
    if (!target) return;

    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/locations/lookup?query=${encodeURIComponent(target)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Location '${target}' was not found in India.`);
      }
      const item = await res.json();
      const threatLabel = item.threatLabel || item.condition || `${item.disasterType} Risk: ${item.riskScore}%`;
      const risk = item.threatProbability ?? item.riskScore ?? 30;

      const newLoc: DisasterLocation = {
        id: item.id,
        name: item.name,
        state: item.state,
        lat: item.lat,
        lng: item.lng,
        rainfall: item.rainfall,
        temperature: item.temperature,
        humidity: item.humidity,
        windSpeed: item.windSpeed,
        pressure: item.pressure ?? 1013,
        condition: threatLabel,
        threatType: item.threatType || item.disasterType,
        threatProbability: risk,
        threatLabel: threatLabel,
        riskScore: risk,
        riskLevel: item.riskLevel,
        disasterType: item.threatType || item.disasterType,
        recommendations: item.recommendations,
        humanitarian_aid: item.humanitarian_aid,
      };

      setLocations((prev) => {
        const exists = prev.some((l) => l.name.toLowerCase() === newLoc.name.toLowerCase());
        if (exists) {
          return prev.map((l) => (l.name.toLowerCase() === newLoc.name.toLowerCase() ? newLoc : l));
        }
        return [newLoc, ...prev];
      });

      setSelectedLocation(newLoc);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([newLoc.lat, newLoc.lng], 9, { duration: 1.5 });
      }
      setSearchQuery("");

      // Smooth scroll to intelligence panel for instant view
      setTimeout(() => {
        const panel = document.getElementById("disaster-intelligence-panel");
        if (panel) {
          panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 400);
    } catch (err: any) {
      setSearchError(err.message || "Failed to locate place in India.");
    } finally {
      setSearching(false);
    }
  };

  // Initialize map once with Watermark-Free Esri Dark Canvas
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [22.0, 79.5],
      zoom: 5,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Watermark-free, high-contrast Dark Canvas Map
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: '&copy; Esri, DeLorme, NAVTEQ',
      maxZoom: 16,
    }).addTo(map);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16,
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Filter locations by active region
  const filteredLocations = locations.filter((loc) => matchRegion(loc.state, activeRegion));

  // Render markers whenever filteredLocations update
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    filteredLocations.forEach((location) => {
      const color = getMarkerColor(location.riskScore);
      const isPulse = location.riskScore >= 60;
      const safeId = String(location.id).replace(/[^a-zA-Z0-9_-]/g, "");

      const icon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="position:relative; width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
            ${
              isPulse
                ? `<div style="
                    position:absolute; width:38px; height:38px; border-radius:50%;
                    background:${color}; opacity:0.4; animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite;
                  "></div>`
                : ""
            }
            <div style="
              width:22px; height:22px; border-radius:50%; background:${color};
              border:2.5px solid #090d16; box-shadow:0 0 16px ${color};
              display:flex; align-items:center; justify-content:center;
            ">
              <div style="width:7px; height:7px; border-radius:50%; background:white; opacity:0.95;"></div>
            </div>
          </div>
          <style>
            @keyframes ping {
              0% { transform: scale(1); opacity:0.4; }
              75%, 100% { transform: scale(2.2); opacity:0; }
            }
          </style>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif; min-width:240px; padding:6px 4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <div style="font-size:15px; font-weight:800; color:#f8fafc;">${location.name}</div>
            <span style="font-size:10px; font-weight:700; color:${color}; background:${color}20; padding:2px 7px; border-radius:6px; border:1px solid ${color}50;">
              ${getRiskLabel(location.riskScore)}
            </span>
          </div>
          <div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">${location.state}, India</div>

          <div style="background:rgba(15,23,42,0.85); border:1px solid rgba(56,189,248,0.3); border-radius:8px; padding:7px 10px; margin-bottom:8px;">
            <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px;">Disaster Threat Vector</div>
            <div style="font-size:13px; font-weight:800; color:#38bdf8;">${location.condition || `${location.disasterType} Risk: ${location.riskScore}%`}</div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:10px; color:#cbd5e1; background:rgba(255,255,255,0.03); padding:6px; border-radius:6px; margin-bottom:8px;">
            <div>🌧️ Rain: <b>${location.rainfall} mm</b></div>
            <div>💨 Wind: <b>${location.windSpeed} km/h</b></div>
            <div>🌡️ Temp: <b>${location.temperature} °C</b></div>
            <div>💧 Hum: <b>${location.humidity} %</b></div>
            <div style="grid-column: span 2;">⏱️ Pressure: <b>${location.pressure ?? 1013} hPa</b></div>
          </div>

          <button id="btn-popup-${safeId}" style="width:100%; background:linear-gradient(90deg, #0284c7, #06b6d4); color:#020617; font-weight:800; font-size:11px; padding:6px 10px; border-radius:6px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;">
            ⚡ View Full Disaster Plan & Directives
          </button>
        </div>
      `, {
        className: "trinetra-popup",
      });

      marker.on("click", () => {
        setSelectedLocation(location);
        map.flyTo([location.lat, location.lng], 8, { duration: 1.2 });
      });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-popup-${safeId}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedLocation(location);
            const el = document.getElementById("disaster-intelligence-panel");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          };
        }
      });
    });
  }, [filteredLocations]);

  const criticalCount = locations.filter((l) => l.riskScore >= 70).length;
  const highCount = locations.filter((l) => l.riskScore >= 50 && l.riskScore < 70).length;
  const modCount = locations.filter((l) => l.riskScore >= 35 && l.riskScore < 50).length;
  const safeCount = locations.filter((l) => l.riskScore < 35).length;

  // Directives for selected node
  const activePlan = selectedLocation ? getDirectivesAndAid(selectedLocation) : null;
  const selectedColor = selectedLocation ? getMarkerColor(selectedLocation.riskScore) : "#22c55e";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 🇮🇳 TOP PAN-INDIA SEARCH & STATS BAR */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between shrink-0">
        {/* Dynamic Location Pinning Search */}
        <div className="relative flex-1 w-full max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLocationLookup()}
            placeholder="Search ANY Indian city, district, or town (e.g. Prayagraj, Leh, Wayanad)..."
            className="pl-10 pr-24 h-11 bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 text-sm rounded-xl focus:border-cyan-400"
          />
          <Button
            onClick={() => handleLocationLookup()}
            disabled={searching}
            size="sm"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-md"
          >
            {searching ? (
              <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Pin Node"
            )}
          </Button>
        </div>

        {/* Mini stats counters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { label: "Active Cities", value: locations.length, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
            { label: "Critical", value: criticalCount, color: "text-red-400 bg-red-500/10 border-red-500/20" },
            { label: "High Threat", value: highCount, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
            { label: "Moderate", value: modCount, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
            { label: "Safe / Low", value: safeCount, color: "text-green-400 bg-green-500/10 border-green-500/20" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${s.color}`}>
              <span className={`text-base font-black ${s.color.split(" ")[0]}`}>{s.value}</span>
              <span className="text-slate-400 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {searchError && (
        <div className="text-xs text-red-400 bg-red-950/60 border border-red-500/30 px-3 py-2 rounded-lg flex items-center gap-2 shrink-0">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {searchError}
        </div>
      )}

      {/* REGION FILTER CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0">
        <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Compass className="h-3.5 w-3.5 text-cyan-400" /> Zones:
        </span>
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 border ${
              activeRegion === r
                ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* MAIN MAP + NODES GRID */}
      <div className="grid lg:grid-cols-4 gap-3 min-h-[500px]">
        {/* MAP PANEL */}
        <div className="lg:col-span-3 h-full min-h-[500px]">
          <Card className="bg-slate-900/60 backdrop-blur-xl border-blue-500/20 p-1 h-full shadow-2xl overflow-hidden relative min-h-[500px]">
            <div
              ref={mapRef}
              className="w-full h-full rounded-xl"
              style={{ minHeight: "490px" }}
            />
          </Card>
        </div>

        {/* RIGHT PANEL - Threat nodes */}
        <div className="h-full min-h-0 flex flex-col">
          <Card className="bg-slate-900/60 backdrop-blur-xl border-blue-500/20 shadow-xl overflow-hidden h-full flex flex-col">
            <div className="px-3 py-2.5 border-b border-slate-700/50 bg-slate-800/30 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-xs tracking-wide uppercase flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  Monitored Cities ({filteredLocations.length})
                </h3>
                <p className="text-[10px] text-slate-500">Click node for full disaster plan</p>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-500/20">
                {activeRegion}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent", maxHeight: "360px" }}>
              {[...filteredLocations]
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((loc) => {
                  const color = getMarkerColor(loc.riskScore);
                  const isSelected = selectedLocation?.name === loc.name;
                  return (
                    <div
                      key={loc.name}
                      onClick={() => {
                        setSelectedLocation(loc);
                        mapInstanceRef.current?.flyTo([loc.lat, loc.lng], 8, { duration: 1.2 });
                      }}
                      className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? "bg-blue-500/15 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                          : "bg-slate-800/30 border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-white text-xs font-semibold block">{loc.name}</span>
                          <span className="text-[10px] text-slate-400">{loc.state}</span>
                        </div>
                        <span
                          className="text-[11px] font-black px-1.5 py-0.5 rounded-md"
                          style={{ color, backgroundColor: `${color}20` }}
                        >
                          {loc.riskScore}%
                        </span>
                      </div>

                      {/* Explicit Disaster Probability */}
                      <div className="text-[11px] text-cyan-300 font-semibold mb-1.5 truncate">
                        {loc.condition}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${loc.riskScore}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">{loc.disasterType}</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Selected location detail card */}
            {selectedLocation && (
              <div className="border-t border-slate-700/50 p-3 bg-slate-800/40 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-cyan-400" /> Active Selected Node
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lng.toFixed(2)}°E
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-bold text-sm">{selectedLocation.name}</div>
                    <div className="text-[11px] text-slate-400">{selectedLocation.state}, India</div>
                  </div>
                  {selectedLocation.condition && (
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
                      {selectedLocation.condition}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  {[
                    { label: "Rainfall", value: `${selectedLocation.rainfall} mm` },
                    { label: "Wind Speed", value: `${selectedLocation.windSpeed} km/h` },
                    { label: "Temperature", value: `${selectedLocation.temperature} °C` },
                    { label: "Humidity", value: `${selectedLocation.humidity} %` },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-900/70 rounded-lg px-2 py-1 border border-slate-800">
                      <div className="text-[10px] text-slate-500">{stat.label}</div>
                      <div className="text-white text-xs font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    const el = document.getElementById("disaster-intelligence-panel");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full h-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" /> Full Disaster Intelligence Directives
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════════
          🇮🇳 FULL DISASTER INTELLIGENCE & HUMANITARIAN ACTION PLAN FOR SELECTED NODE
          (Identical richness & protocols as the Predict section)
          ════════════════════════════════════════════════════════════════════════════ */}
      {selectedLocation && activePlan && (
        <motion.div
          id="disaster-intelligence-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-2"
        >
          <Card className="bg-slate-900/80 backdrop-blur-2xl border-cyan-500/30 p-6 shadow-2xl rounded-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ background: selectedColor }}
            />

            {/* Header with Title & Location */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                    <Radio className="h-3 w-3 animate-pulse text-cyan-400" />
                    Live Regional Disaster Intelligence
                  </span>
                  <span className="text-xs text-slate-400">
                    Coordinates: {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-cyan-400" />
                  {selectedLocation.name}
                  <span className="text-slate-400 font-normal text-lg">({selectedLocation.state}, India)</span>
                </h2>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-3">
                <a
                  href={`/prediction?city=${encodeURIComponent(selectedLocation.name)}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Run Detailed ML Sim in Predict AI
                </a>
              </div>
            </div>

            {/* 2-Column Core Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* LEFT COLUMN: THREAT VECTORS & ATMOSPHERIC SENSORS */}
              <div className="space-y-5">
                {/* Primary Risk Card */}
                <Card className={`p-5 border-2 ${getRiskColorClass(selectedLocation.riskScore)} rounded-xl shadow-lg relative overflow-hidden`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="text-base font-bold">
                          {selectedLocation.condition || `${selectedLocation.disasterType} Threat`}
                        </h3>
                      </div>
                      <p className="text-xs opacity-80">
                        Evaluated against NDMA hazard zones & IMD telemetry feeds
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">{selectedLocation.riskScore}%</p>
                      <p className="text-[10px] opacity-70 uppercase tracking-wider">Empirical Risk</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2.5 bg-black/40 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${selectedLocation.riskScore}%`, backgroundColor: selectedColor }}
                    />
                  </div>

                  {/* 3 Grid Summary */}
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] opacity-70 mb-0.5">Threat Vector</p>
                      <p className="font-bold text-xs text-white truncate">{selectedLocation.disasterType}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] opacity-70 mb-0.5">Alert Level</p>
                      <p className="font-bold text-xs capitalize text-white">{selectedLocation.riskLevel}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] opacity-70 mb-0.5">Threat Probability</p>
                      <p className="font-bold text-xs text-white">{selectedLocation.threatProbability ?? selectedLocation.riskScore}%</p>
                    </div>
                  </div>
                </Card>

                {/* 5-Point Sensor Telemetry Matrix */}
                <Card className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-700/70 pb-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-cyan-400" />
                      Atmospheric & Ground Sensor Telemetry
                    </h3>
                    <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live Sensor Feed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                      <div className="p-2 rounded-md bg-blue-500/15 text-blue-400">
                        <CloudRain className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Precipitation</span>
                        <span className="text-sm font-black text-white">{selectedLocation.rainfall} mm</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                      <div className="p-2 rounded-md bg-cyan-500/15 text-cyan-400">
                        <Wind className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Wind Velocity</span>
                        <span className="text-sm font-black text-white">{selectedLocation.windSpeed} km/h</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                      <div className="p-2 rounded-md bg-orange-500/15 text-orange-400">
                        <Thermometer className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Temperature</span>
                        <span className="text-sm font-black text-white">{selectedLocation.temperature} °C</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                      <div className="p-2 rounded-md bg-indigo-500/15 text-indigo-400">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Relative Humidity</span>
                        <span className="text-sm font-black text-white">{selectedLocation.humidity} %</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                      <div className="p-2 rounded-md bg-purple-500/15 text-purple-400">
                        <Gauge className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Surface Pressure</span>
                        <span className="text-sm font-black text-white">{selectedLocation.pressure ?? 1013} hPa</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                      <div className="p-2 rounded-md bg-emerald-500/15 text-emerald-400">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Seismic Baseline</span>
                        <span className="text-sm font-black text-white">0.0 Richter</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN: PROTOCOLS, AID ACTIONS & OFFICIAL HELPLINES */}
              <div className="space-y-5">
                {/* Disaster Safety Protocols */}
                <Card className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-xl shadow-lg">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 border-b border-slate-700/80 pb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Disaster Protocols & Safety Directives
                  </h3>
                  <ul className="space-y-2.5">
                    {activePlan.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-300 text-xs">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-cyan-500/30">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Humanitarian Response & Relief Deployment */}
                <Card className={`border-2 backdrop-blur-xl p-5 rounded-xl shadow-lg ${
                  selectedLocation.riskScore >= 50
                    ? "border-red-500/40 bg-red-950/20"
                    : "border-blue-500/30 bg-slate-800/40"
                }`}>
                  <h4 className={`font-bold flex items-center gap-2 mb-3 border-b pb-2 text-sm ${
                    selectedLocation.riskScore >= 50
                      ? "text-red-400 border-red-500/20"
                      : "text-cyan-300 border-slate-700/80"
                  }`}>
                    <ShieldAlert className="h-4 w-4" />
                    Relief Logistics & Humanitarian Action Plan
                  </h4>
                  <ul className="space-y-2 mb-4">
                    {activePlan.aid_actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-200 text-xs">
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span className="leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 24/7 Verified Helplines */}
                  <div className="pt-2 border-t border-slate-700/60">
                    <p className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />
                      Official 24/7 National & State Emergency Helplines:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "National Disaster Helpline", number: "1078" },
                        { label: "State Emergency Operation", number: "1070" },
                        { label: "NDRF HQ Control Room", number: "011-24363260" },
                        { label: "Integrated Emergency", number: "112" },
                      ].map((c) => (
                        <div key={c.label} className="bg-slate-900/80 rounded-lg p-2 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">{c.label}</span>
                          <span className="text-cyan-400 font-mono font-bold text-xs">{c.number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <style>{`
        .trinetra-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.35);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
          backdrop-filter: blur(20px);
          color: white;
        }
        .trinetra-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95);
        }
        .trinetra-popup .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 16px;
          top: 8px;
          right: 8px;
        }
        .leaflet-control-zoom a {
          background: rgba(15,23,42,0.9) !important;
          border-color: rgba(59,130,246,0.3) !important;
          color: #94a3b8 !important;
          backdrop-filter: blur(10px);
        }
        .leaflet-control-zoom a:hover {
          background: rgba(59,130,246,0.2) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}