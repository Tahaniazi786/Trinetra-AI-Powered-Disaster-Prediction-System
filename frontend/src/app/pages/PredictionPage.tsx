import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  AlertTriangle,
  CloudRain,
  Thermometer,
  Wind,
  Gauge,
  MapPin,
  Activity,
  Zap,
  ShieldAlert,
  CheckCircle,
  Search,
  Radio,
  Sparkles,
  CloudSun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config/api";

type PredictionResult = {
  prediction: string;
  disaster_type: string;
  risk_level: string;
  confidence: number;
  risk_score: number;
  recommendations: string[];
  humanitarian_aid: any;
};

const POPULAR_CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Shimla",
  "Kochi",
  "Guwahati",
  "Bhubaneswar",
  "Prayagraj",
  "Patna",
  "Srinagar",
  "Hyderabad",
];

const getRiskColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "critical": return "text-red-400 border-red-500 bg-red-950/60";
    case "high": return "text-orange-400 border-orange-500 bg-orange-950/60";
    case "moderate": return "text-yellow-400 border-yellow-500 bg-yellow-950/60";
    case "low": return "text-green-400 border-green-500 bg-green-950/60";
    default: return "text-gray-400 border-gray-600 bg-gray-900/60";
  }
};

const getRiskBarColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "critical": return "bg-red-500";
    case "high": return "bg-orange-500";
    case "moderate": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

export default function PredictionPage() {
  const [citySearch, setCitySearch] = useState("");
  const [formData, setFormData] = useState({
    location_name: "Mumbai",
    state: "Maharashtra",
    rainfall: "",
    humidity: "",
    temperature: "",
    windSpeed: "",
    pressure: "",
    magnitude: "",
  });

  const [liveWeather, setLiveWeather] = useState<any>(null);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🌍 LIVE CURRENT WEATHER FETCH FOR ANY CITY
  const fetchLiveWeatherForCity = async (cityToFetch?: string) => {
    const target = (cityToFetch || citySearch || formData.location_name).trim();
    if (!target) {
      setError("Please enter an Indian city, district, or town name to fetch telemetry.");
      return;
    }

    if (cityToFetch) {
      setCitySearch(cityToFetch);
    }
    setFetchingWeather(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/weather/live?city=${encodeURIComponent(target)}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Could not fetch weather for '${target}'. Please verify spelling.`);
      }
      const data = await res.json();
      setLiveWeather(data);

      // Auto-populate form with authentic measured meteorological parameters
      setFormData({
        location_name: data.city || target,
        state: data.state || data.country || "India",
        rainfall: String(data.rainfall ?? 0),
        humidity: String(data.humidity ?? 50),
        temperature: String(data.temperature ?? 25),
        windSpeed: String(data.wind_speed ?? 10),
        pressure: String(data.pressure ?? 1013),
        magnitude: "0.0",
      });

      // Directly update prediction from authentic ML inference
      if (data.prediction) {
        setPrediction({
          prediction: data.prediction.prediction_text || `${data.threatLabel || data.prediction.disaster_type} Risk`,
          disaster_type: data.prediction.disaster_type || data.threatType || "Disaster",
          risk_level: data.prediction.risk_level || "moderate",
          confidence: data.prediction.confidence || data.threatProbability || 25,
          risk_score: data.prediction.risk_score || data.threatProbability || 25,
          recommendations: data.prediction.recommendations || [],
          humanitarian_aid: data.prediction.humanitarian_aid || {},
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch live weather.");
    } finally {
      setFetchingWeather(false);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        location_name: formData.location_name || "Unknown Location",
        state: formData.state || "India",
        rainfall: parseFloat(formData.rainfall) || 0,
        humidity: parseFloat(formData.humidity) || 0,
        temperature: parseFloat(formData.temperature) || 0,
        wind_speed: parseFloat(formData.windSpeed) || 0,
        pressure: parseFloat(formData.pressure) || 1013,
        magnitude: parseFloat(formData.magnitude) || 0,
      };

      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setPrediction({
        prediction: data.prediction,
        disaster_type: data.disaster_type,
        risk_level: data.risk_level,
        confidence: data.confidence,
        risk_score: data.risk_score,
        recommendations: data.recommendations || [],
        humanitarian_aid: data.humanitarian_aid || {},
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-3">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" /> India Meteorological Ground Telemetry & ML Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Live Weather & Threat Predictor (India)</h1>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl">
            Fetch verified real-time weather observations for any city, district, or town across Indian states and union territories, and evaluate empirical disaster risk.
          </p>
        </motion.div>

        {/* 🌟 LIVE CITY WEATHER LOOKUP BAR */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-900/60 border-blue-500/30 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                <Input
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchLiveWeatherForCity()}
                  placeholder="Enter Indian city, district, or town (e.g. Mumbai, Delhi, Shimla, Patna, Kochi, Guwahati...)"
                  className="pl-10 h-12 bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 text-base rounded-xl focus:border-cyan-400"
                />
              </div>
              <Button
                onClick={() => fetchLiveWeatherForCity()}
                disabled={fetchingWeather}
                className="w-full md:w-auto h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {fetchingWeather ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Fetching Live Stations...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" /> Fetch Actual Current Weather
                  </>
                )}
              </Button>
            </div>

            {/* Quick City Chips */}
            <div className="flex items-center gap-2 mt-4 flex-wrap text-xs text-slate-400">
              <span className="font-semibold text-slate-500 uppercase tracking-wider">Quick Cities:</span>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCitySearch(c);
                    fetchLiveWeatherForCity(c);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Live Weather Card Display */}
            {liveWeather && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-xl border border-cyan-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                    <CloudSun className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-base">{liveWeather.city}</h4>
                      <span className="text-xs text-slate-400 font-mono">[{liveWeather.country}]</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {liveWeather.source}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-300 font-medium">{liveWeather.condition}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <span className="text-slate-500 block">Temp</span>
                    <span className="text-white font-bold text-sm">{liveWeather.temperature} °C</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">Humidity</span>
                    <span className="text-white font-bold text-sm">{liveWeather.humidity}%</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">Pressure</span>
                    <span className="text-white font-bold text-sm">{liveWeather.pressure} hPa</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">Wind</span>
                    <span className="text-white font-bold text-sm">{liveWeather.wind_speed} km/h</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">Rain</span>
                    <span className="text-white font-bold text-sm">{liveWeather.rainfall} mm</span>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* MAIN 2-PANEL LAYOUT */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT PANEL: PARAMETER CONTROLS */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-slate-800/50 backdrop-blur-xl border-blue-500/20 p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-400" />
                  Atmospheric & Ground Measurements
                </h2>
                {liveWeather && (
                  <span className="text-xs text-cyan-400 flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Live Telemetry Linked
                  </span>
                )}
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" /> City / Place
                  </Label>
                  <Input
                    name="location_name"
                    value={formData.location_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-purple-400" /> State / Region
                  </Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Maharashtra"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-700/60 mb-5" />

              {/* Weather Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                      <CloudRain className="h-3.5 w-3.5 text-blue-400" /> Rainfall (mm)
                    </Label>
                    <Input
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      type="number"
                      step="0.1"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                      <Activity className="h-3.5 w-3.5 text-indigo-400" /> Humidity (%)
                    </Label>
                    <Input
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      placeholder="0 – 100"
                      type="number"
                      step="0.1"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                      <Thermometer className="h-3.5 w-3.5 text-orange-400" /> Temperature (°C)
                    </Label>
                    <Input
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      placeholder="e.g. 28.5"
                      type="number"
                      step="0.1"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                      <Wind className="h-3.5 w-3.5 text-cyan-400" /> Wind Speed (km/h)
                    </Label>
                    <Input
                      name="windSpeed"
                      value={formData.windSpeed}
                      onChange={handleInputChange}
                      placeholder="e.g. 15.0"
                      type="number"
                      step="0.1"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                      <Gauge className="h-3.5 w-3.5 text-purple-400" /> Surface Pressure (hPa)
                    </Label>
                    <Input
                      name="pressure"
                      value={formData.pressure}
                      onChange={handleInputChange}
                      placeholder="e.g. 1013"
                      type="number"
                      step="0.1"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 text-gray-300 mb-1.5 text-sm">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" /> Earthquake Richter (M)
                    </Label>
                    <Input
                      name="magnitude"
                      value={formData.magnitude}
                      onChange={handleInputChange}
                      placeholder="0.0 (Optional)"
                      type="number"
                      step="0.1"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] disabled:opacity-60"
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running Verified ML Inference...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-5 w-5" /> Run Risk Assessment
                  </span>
                )}
              </Button>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 text-sm flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </Card>
          </motion.div>

          {/* RIGHT PANEL: EMPIRICAL RESULTS */}
          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {!prediction && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="bg-slate-800/30 border-slate-700/50 p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                      <ShieldAlert className="h-10 w-10 text-blue-400 opacity-60" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">Awaiting Assessment</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      Search any city above to fetch real-world weather immediately, or click "Run Risk Assessment".
                    </p>
                  </Card>
                </motion.div>
              )}

              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="bg-slate-800/50 border-blue-500/20 p-12 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
                      <Zap className="absolute inset-0 m-auto h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Analyzing Atmospheric Telemetry</h3>
                    <p className="text-slate-400 text-sm">Evaluating observations across trained multi-class ensembles...</p>
                  </Card>
                </motion.div>
              )}

              {prediction && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                  {/* Primary Result Card */}
                  <Card className={`p-6 border-2 ${getRiskColor(prediction.risk_level)} relative overflow-hidden`}>
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                      style={{ background: prediction.risk_score >= 60 ? "#ef4444" : "#22c55e" }}
                    />

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-5 w-5" />
                          <h3 className="text-lg font-bold">{prediction.prediction}</h3>
                        </div>
                        <p className="text-sm opacity-80">
                          {formData.location_name || "Location"}{formData.state ? `, ${formData.state}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-black">{prediction.risk_score}%</p>
                        <p className="text-xs opacity-60 uppercase tracking-wider">Empirical Risk</p>
                      </div>
                    </div>

                    <div className="h-2.5 bg-black/30 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className={`${getRiskBarColor(prediction.risk_level)} h-full rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.risk_score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-black/20 rounded-lg p-2.5">
                        <p className="text-xs opacity-60 mb-0.5">Predicted Vector</p>
                        <p className="font-bold text-sm">{prediction.disaster_type}</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-2.5">
                        <p className="text-xs opacity-60 mb-0.5">Alert Level</p>
                        <p className="font-bold text-sm capitalize">{prediction.risk_level}</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-2.5">
                        <p className="text-xs opacity-60 mb-0.5">Confidence</p>
                        <p className="font-bold text-sm">{prediction.confidence}%</p>
                      </div>
                    </div>
                  </Card>

                  {/* Recommendations */}
                  <Card className="bg-slate-800/50 backdrop-blur-xl border-blue-500/20 p-5 shadow-lg">
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 border-b border-slate-700/80 pb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Disaster Protocols & Safety Directives
                    </h3>
                    <ul className="space-y-2.5">
                      {prediction.recommendations && prediction.recommendations.length > 0 ? (
                        prediction.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{r}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-slate-400">Routine operations nominal. Maintain automated meteorological monitoring.</li>
                      )}
                    </ul>
                  </Card>

                  {/* Humanitarian Response & Relief Deployment */}
                  {prediction.humanitarian_aid && (
                    <Card className={`border-2 backdrop-blur-xl p-5 shadow-lg ${
                      ["high", "critical"].includes(prediction.risk_level?.toLowerCase())
                        ? "border-red-500/50 bg-red-950/30"
                        : "border-blue-500/30 bg-slate-800/50"
                    }`}>
                      <h4 className={`font-bold flex items-center gap-2 mb-3 border-b pb-2 text-sm ${
                        ["high", "critical"].includes(prediction.risk_level?.toLowerCase())
                          ? "text-red-400 border-red-500/20"
                          : "text-cyan-300 border-slate-700/80"
                      }`}>
                        <ShieldAlert className="h-4 w-4" />
                        Relief Logistics & Emergency Action Plan
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {prediction.humanitarian_aid.aid_actions?.map((action: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-slate-200 text-xs">
                            <span className="text-cyan-400 font-bold shrink-0">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="font-semibold text-slate-400 text-xs uppercase tracking-wider mb-2">
                        Official Emergency Disaster Helplines:
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
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}