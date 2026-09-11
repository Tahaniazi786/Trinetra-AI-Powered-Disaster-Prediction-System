import { useEffect, useState, useCallback } from "react";
import { Card } from "../components/ui/card";
import { AlertTriangle, Cloud, Droplets, ThermometerSun, Wind, RefreshCw, Activity } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  mockLocations,
  disasterHistory,
  rainfallData,
  riskTrendData,
  temperatureData,
} from "../data/mockData";
import { motion } from "framer-motion";

const REFRESH_INTERVAL_MS = 60000; // 1 minute

const getRiskBadge = (score: number) => {
  if (score >= 80) return "bg-red-950 text-red-400 border border-red-500/40";
  if (score >= 60) return "bg-orange-950 text-orange-400 border border-orange-500/40";
  if (score >= 40) return "bg-yellow-950 text-yellow-400 border border-yellow-500/40";
  return "bg-green-950 text-green-400 border border-green-500/40";
};

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [history, setHistory] = useState<any>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [statsRes, chartsRes, historyRes, locsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/stats`).catch(() => null),
        fetch(`${API_BASE_URL}/dashboard/charts`).catch(() => null),
        fetch(`${API_BASE_URL}/history`).catch(() => null),
        fetch(`${API_BASE_URL}/locations`).catch(() => null),
      ]);

      if (statsRes && statsRes.ok) setStats(await statsRes.json());
      if (chartsRes && chartsRes.ok) setCharts(await chartsRes.json());
      if (historyRes && historyRes.ok) setHistory(await historyRes.json());
      if (locsRes && locsRes.ok) setLocations(await locsRes.json());

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Fallbacks
  const highRiskLocations = locations.length > 0
    ? locations.filter((loc) => loc.riskScore >= 60)
    : mockLocations.filter((loc) => loc.riskScore >= 60);

  const displayStats = stats || {
    monitoredLocations: mockLocations.length,
    highRiskZones: highRiskLocations.length,
    averageRiskScore: mockLocations.reduce((sum, loc) => sum + loc.riskScore, 0) / mockLocations.length,
    activeAlerts: disasterHistory.length,
    disasterDistribution: {
      Flood: mockLocations.filter((l) => l.disasterType === "Flood").length,
      Cyclone: mockLocations.filter((l) => l.disasterType === "Cyclone").length,
      Landslide: mockLocations.filter((l) => l.disasterType === "Landslide").length,
      Earthquake: mockLocations.filter((l) => l.disasterType === "Earthquake").length,
      Drought: mockLocations.filter((l) => l.disasterType === "Drought").length,
    },
  };

  const displayCharts = charts || { rainfall: rainfallData, temperature: temperatureData, riskTrends: riskTrendData };
  const displayHistory = history.length > 0 ? history : disasterHistory;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
            <Activity className="absolute inset-0 m-auto h-7 w-7 text-blue-400" />
          </div>
          <p className="text-slate-400 text-lg">Loading Dashboard...</p>
          <p className="text-slate-600 text-sm mt-1">Fetching live data from backend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Live Monitoring Active
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-gray-400 text-lg">Real-time disaster risk analysis across India</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="text-slate-500 text-sm">
                Updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white text-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Monitored Locations", value: displayStats.monitoredLocations, icon: Cloud, color: "blue", gradient: "from-blue-900/50 to-blue-800/30", border: "border-blue-500/30", iconColor: "text-blue-400" },
            { label: "High Risk Zones", value: displayStats.highRiskZones, icon: AlertTriangle, color: "red", gradient: "from-red-900/50 to-red-800/30", border: "border-red-500/30", iconColor: "text-red-400" },
            { label: "Avg Risk Score", value: `${Number(displayStats.averageRiskScore).toFixed(0)}%`, icon: AlertTriangle, color: "orange", gradient: "from-orange-900/50 to-orange-800/30", border: "border-orange-500/30", iconColor: "text-orange-400" },
            { label: "Active Alerts", value: displayStats.activeAlerts, icon: AlertTriangle, color: "cyan", gradient: "from-cyan-900/50 to-cyan-800/30", border: "border-cyan-500/30", iconColor: "text-cyan-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className={`bg-gradient-to-br ${stat.gradient} ${stat.border} p-5 h-full`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-white/5`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Disaster Type Distribution */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {[
            { icon: "🌊", label: "Floods", key: "Flood", color: "text-blue-400" },
            { icon: "🌀", label: "Cyclones", key: "Cyclone", color: "text-cyan-400" },
            { icon: "⛰️", label: "Landslides", key: "Landslide", color: "text-amber-400" },
            { icon: "🏚️", label: "Earthquakes", key: "Earthquake", color: "text-red-400" },
            { icon: "🏜️", label: "Drought", key: "Drought", color: "text-orange-400" },
          ].map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 p-4 text-center hover:border-blue-500/40 transition-colors">
                <div className="text-3xl mb-2">{d.icon}</div>
                <p className="text-gray-400 text-xs mb-1">{d.label}</p>
                <p className={`text-2xl font-bold ${d.color}`}>
                  {displayStats.disasterDistribution[d.key] ?? 0}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Rainfall Trends */}
          <Card className="bg-slate-800/50 border-blue-500/20 p-6">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              Rainfall Trends (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={displayCharts.rainfall}>
                <defs>
                  <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #3b82f6", borderRadius: "10px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" fill="url(#rainfallGradient)" strokeWidth={2} name="Rainfall (mm)" />
                <Line type="monotone" dataKey="avgRainfall" stroke="#22d3ee" strokeDasharray="5 5" strokeWidth={1.5} name="Average" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Temperature Trends */}
          <Card className="bg-slate-800/50 border-blue-500/20 p-6">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-orange-400" />
              Temperature Trends (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={displayCharts.temperature}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #f97316", borderRadius: "10px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: "#f97316" }} name="Temperature (°C)" />
                <Line type="monotone" dataKey="avgTemp" stroke="#fb923c" strokeDasharray="5 5" strokeWidth={1.5} name="Average" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Risk Trends Chart */}
        <Card className="bg-slate-800/50 border-blue-500/20 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Disaster Risk Trends by Type
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={displayCharts.riskTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #3b82f6", borderRadius: "10px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="flood" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Flood Risk" />
              <Line type="monotone" dataKey="cyclone" stroke="#22d3ee" strokeWidth={2.5} dot={false} name="Cyclone Risk" />
              <Line type="monotone" dataKey="landslide" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Landslide Risk" />
              <Line type="monotone" dataKey="drought" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Drought Risk" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bottom Section: High Risk Locations + Recent Events */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live High Risk Locations (Real-Time Sensor Alerts) */}
          <Card className="bg-slate-800/50 border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Live Monitored Threat Alerts
              </h3>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded">
                Current Sensor Telemetry
              </span>
            </div>
            {highRiskLocations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No high-risk zones currently detected across monitored cities</p>
              </div>
            ) : (
              <div className="space-y-3">
                {highRiskLocations.map((location: any, i: number) => (
                  <motion.div
                    key={location.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-semibold">{location.name}</p>
                        <p className="text-xs text-gray-400">{location.state}, India</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRiskBadge(location.riskScore)}`}>
                        {location.riskScore}% Vulnerability
                      </span>
                    </div>

                    {location.condition && (
                      <p className="text-xs text-cyan-300 font-semibold mb-2">
                        {location.condition}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Droplets className="h-3 w-3 text-blue-400" />
                        {location.rainfall} mm rain
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Wind className="h-3 w-3 text-cyan-400" />
                        {location.windSpeed} km/h wind
                      </div>
                      <div className="text-blue-400 font-medium text-right">{location.disasterType}</div>
                    </div>
                    {/* Risk bar */}
                    <div className="mt-2.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${location.riskScore}%`,
                          backgroundColor: location.riskScore >= 80 ? "#ef4444" : "#f97316",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Actual Verified Historical Disaster Events */}
          <Card className="bg-slate-800/50 border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Verified Disaster History
              </h3>
              <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-semibold">
                Actual Occurrence Dates
              </span>
            </div>
            <div className="space-y-3">
              {displayHistory.map((event: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{event.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded">
                          📅 {event.displayDate || event.date}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                          {event.source || "NDMA Verified"}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${getRiskBadge(event.riskScore)}`}>
                      {event.riskScore}% Severity
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 mt-1 border-t border-slate-800/80">
                    <span className="text-blue-400 font-medium">{event.eventTitle || event.disasterType}</span>
                    <span className="text-slate-300 font-mono">
                      ~{event.affected?.toLocaleString() || 0} affected{event.fatalities ? ` · ${event.fatalities.toLocaleString()} deaths` : ""}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}