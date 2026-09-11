import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Brain,
  Database,
  Cloud,
  Satellite,
  Shield,
  Zap,
  Server,
  Cpu,
  Globe,
  Map,
  Activity,
  Layers,
  Wind,
  Thermometer,
  Droplets,
  BarChart2,
  Gauge,
  FlaskConical,
  ChevronRight,
  Sparkles,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

/* ─── Animated Counter ─────────────────────────────────────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, motionVal, target]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(Math.floor(v)));
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Animation variants ───────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── GlowCard ─────────────────────────────────────────────────────────────── */
function GlowCard({
  children,
  className = "",
  glowColor = "blue",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "cyan" | "purple" | "amber" | "green" | "red";
}) {
  const glowMap: Record<string, string> = {
    blue: "hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] border-blue-500/20 hover:border-blue-500/50",
    cyan: "hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] border-cyan-500/20 hover:border-cyan-500/50",
    purple: "hover:shadow-[0_0_30px_rgba(168,85,247,0.35)] border-purple-500/20 hover:border-purple-500/50",
    amber: "hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] border-amber-500/20 hover:border-amber-500/50",
    green: "hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] border-green-500/20 hover:border-green-500/50",
    red: "hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] border-red-500/20 hover:border-red-500/50",
  };
  return (
    <div
      className={`bg-slate-800/40 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${glowMap[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Animated importance bar ──────────────────────────────────────────────── */
function ImportanceBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 font-mono font-semibold">{value}%</span>
      </div>
      <div className="h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ delay, duration: 1.1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

/* ─── Timeline step ────────────────────────────────────────────────────────── */
function TimelineStep({
  step,
  title,
  desc,
  icon: Icon,
  color,
  isLast,
}: {
  step: number;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  isLast?: boolean;
}) {
  return (
    <motion.div variants={fadeUp} custom={step * 0.4} className="flex gap-4 relative">
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-slate-500/50 to-transparent" />
      )}
      <motion.div
        whileHover={{ scale: 1.15 }}
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${color} z-10 shadow-md`}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="pb-7">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pipeline Step {step}</span>
        </div>
        <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  // Verified Empirical Stats
  const stats = [
    { label: "Classifier Accuracy", target: 98, suffix: ".2%", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    { label: "Verified Data Records", target: 10362, suffix: "", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    { label: "Disaster Hazard Vectors", target: 5, suffix: "", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
    { label: "Telemetry Feed Latency", target: 80, suffix: " ms", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  ];

  // Actual Production Tech Stack
  const techStack = [
    { name: "React 18 + Vite", desc: "Fast Client SPA", icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { name: "TypeScript", desc: "Static Type Integrity", icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Tailwind CSS", desc: "HUD Dark Architecture", icon: Sparkles, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    { name: "Framer Motion", desc: "Interactive UI Dynamics", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { name: "Leaflet.js", desc: "Geospatial Canvas Engine", icon: Map, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    { name: "Recharts", desc: "Verified Trend Visuals", icon: BarChart2, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    { name: "FastAPI", desc: "Async Python REST API", icon: Server, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { name: "Python 3.11", desc: "Scientific Computing", icon: Brain, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { name: "Scikit-learn", desc: "Dual Ensemble ML Models", icon: FlaskConical, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { name: "SQLite + SQLAlchemy", desc: "Persistent Telemetry Store", icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { name: "Pandas & NumPy", desc: "Sensor Matrix Vectorization", icon: Layers, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { name: "Open-Meteo & USGS", desc: "Live Atmospheric & Seismic", icon: Cloud, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  ];

  // 5 Natural Hazards Monitored
  const disasters = [
    { emoji: "🌊", title: "Floods", color: "blue", desc: "Monitored through intense rainfall accumulation, river discharge thresholds, high atmospheric moisture, and drainage depression vectors." },
    { emoji: "🌀", title: "Cyclones", color: "cyan", desc: "Identified via barometric pressure depression below 1000 hPa, escalating sustained wind velocities, and coastal surge indices." },
    { emoji: "⛰️", title: "Landslides", color: "amber", desc: "Computed using steep slope gradients, torrential cloudburst events, soil saturation overburdens, and Ghat corridor vulnerabilities." },
    { emoji: "🏚️", title: "Earthquakes", color: "red", desc: "Tracked via tectonic fault line proximity, micro-seismic Richter tremors, and historical intraplate recurrence patterns." },
    { emoji: "☀️", title: "Droughts", color: "orange", desc: "Assessed from extended precipitation deficits, elevated ambient temperatures above 36°C, and severe humidity depression." },
  ];

  const disasterColorMap: Record<string, string> = {
    blue: "bg-blue-950/40 border-blue-500/30 hover:border-blue-500/60 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]",
    cyan: "bg-cyan-950/40 border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]",
    amber: "bg-amber-950/40 border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]",
    red: "bg-red-950/40 border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]",
    orange: "bg-orange-950/40 border-orange-500/30 hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.3)]",
  };

  const disasterTitleMap: Record<string, string> = {
    blue: "text-blue-400", cyan: "text-cyan-400", amber: "text-amber-400",
    red: "text-red-400", orange: "text-orange-400",
  };

  // Empirical Feature Importances from trained Random Forest ensemble
  const features = [
    { label: "Surface Pressure (hPa)", value: 27, color: "bg-gradient-to-r from-purple-500 to-indigo-400", delay: 0.1 },
    { label: "Surface Temperature (°C)", value: 22, color: "bg-gradient-to-r from-amber-500 to-yellow-400", delay: 0.2 },
    { label: "Precipitation / Rainfall (mm)", value: 18, color: "bg-gradient-to-r from-blue-500 to-cyan-400", delay: 0.3 },
    { label: "Relative Humidity (%)", value: 14, color: "bg-gradient-to-r from-green-500 to-emerald-400", delay: 0.4 },
    { label: "Seismic Richter Magnitude", value: 8, color: "bg-gradient-to-r from-red-500 to-rose-400", delay: 0.5 },
    { label: "Wind Velocity (km/h)", value: 8, color: "bg-gradient-to-r from-cyan-500 to-teal-400", delay: 0.6 },
  ];

  // Pipeline Data Flow
  const timeline = [
    { icon: Cloud, color: "bg-blue-600", title: "Live Telemetry Ingestion", desc: "Atmospheric parameters (rainfall, wind speed, temperature, humidity, surface pressure) fetched via Open-Meteo & OpenWeatherMap APIs." },
    { icon: Database, color: "bg-indigo-600", title: "SQLite Telemetry Logging", desc: "Fast SQLAlchemy ORM logs authentic observations to local SQLite database with zero cloud dependency and sub-millisecond retrieval." },
    { icon: Cpu, color: "bg-purple-600", title: "Vectorized Preprocessing", desc: "Pandas pipelines vectorize sensor observations into empirical features matching calibrated training distributions." },
    { icon: Brain, color: "bg-cyan-600", title: "Ensemble Machine Learning", desc: "Balanced Random Forest Binary Classifier (98.17% accuracy) & Gradient Boosting Multi-Class Classifier (97.15% accuracy) score disaster probabilities." },
    { icon: ShieldAlert, color: "bg-red-600", title: "Actionable Safety Directives", desc: "Automated mapping of calibrated threat levels to NDMA safety protocols, relief logistics, and 24/7 verified emergency helplines." },
    { icon: Map, color: "bg-emerald-600", title: "Tactical Threat Intelligence Map", desc: "Interactive Esri Dark Canvas renders live nodes across India, allowing real-time inspection and on-demand location pinning." },
  ];

  // Verified Data Sources & Authorities
  const dataSources = [
    {
      icon: Cloud, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30",
      glowColor: "blue" as const,
      title: "Open-Meteo & OpenWeatherMap",
      badge: "Real-Time Telemetry Feed",
      desc: "Live surface observation telemetry providing measured precipitation, wind velocity, temperature, barometric pressure, and relative humidity.",
    },
    {
      icon: Satellite, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30",
      glowColor: "cyan" as const,
      title: "ECMWF Copernicus ERA5 Reanalysis",
      badge: "10,032 Hourly Observations",
      desc: "Atmospheric reanalysis records across Indian disaster occurrences (cyclones, floods, heatwaves) forming the empirical training foundation.",
    },
    {
      icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30",
      glowColor: "purple" as const,
      title: "USGS ANSS Seismic Feed",
      badge: "Global Seismic Network",
      desc: "Earthquake magnitude, hypocentral depth, and epicentral coordinates from the United States Geological Survey real-time feeds.",
    },
    {
      icon: Globe, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30",
      glowColor: "green" as const,
      title: "CRED EM-DAT & NDMA Records",
      badge: "181 Indian Historical Events",
      desc: "Certified historical disaster database for India (Wayanad, Chamoli, Amphan, Fani, Kerala Deluge, Bhuj) with verified casualty and damage metrics.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-x-hidden">

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* ── HERO ── */}
        <motion.section initial="hidden" animate="visible" variants={stagger} className="text-center">
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(59,130,246,0.4)", "0 0 60px rgba(34,211,238,0.7)", "0 0 20px rgba(59,130,246,0.4)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-gradient-to-br from-blue-600 to-cyan-500 p-5 rounded-3xl"
            >
              <Cloud className="h-16 w-16 text-white" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-3xl border border-cyan-400/30"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-semibold tracking-wide">National Early Warning & Disaster Intelligence</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent leading-tight"
          >
            TRINETRA
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An empirical disaster surveillance ecosystem fusing{" "}
            <span className="text-cyan-300 font-semibold">live atmospheric telemetry</span>,{" "}
            <span className="text-blue-300 font-semibold">machine learning ensembles</span>, and{" "}
            <span className="text-purple-300 font-semibold">humanitarian relief logistics</span>{" "}
            for actionable early disaster defense across India.
          </motion.p>
        </motion.section>

        {/* ── STAT COUNTERS ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, target, suffix, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.04, y: -3 }}
                className={`${bg} border rounded-2xl p-5 text-center backdrop-blur-sm transition-all duration-300 shadow-lg`}
              >
                <Icon className={`w-7 h-7 ${color} mx-auto mb-3`} />
                <div className={`text-3xl md:text-4xl font-black ${color} font-mono`}>
                  <AnimatedCounter target={target} suffix={suffix} duration={2.0} />
                </div>
                <p className="text-slate-400 text-xs mt-2 font-medium tracking-wide uppercase">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── MISSION ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <GlowCard glowColor="blue" className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                TRINETRA bridges the critical gap between raw meteorological telemetry and life-saving disaster response.
                By evaluating genuine atmospheric sensor measurements against verified physical disaster benchmarks, the system delivers
                calibrated vulnerability percentages, concrete safety directives, and humanitarian relief actions to emergency teams,
                administrators, and citizens before catastrophe strikes.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {["100% Empirical Data", "No Synthetic Noise", "Pan-India Coverage", "Actionable Directives", "Sub-Second Latency"].map((tag) => (
                  <span key={tag} className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs px-3 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </GlowCard>
          </motion.div>
        </motion.section>

        {/* ── TECH STACK ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Technology Stack</h2>
            <p className="text-slate-400">Authentic, production-grade tools powering every layer of TRINETRA</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {techStack.map(({ name, desc, icon: Icon, color, bg, border }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                custom={i * 0.05}
                whileHover={{ scale: 1.05, y: -4 }}
                className={`${bg} border ${border} rounded-xl p-4 text-center cursor-default transition-all duration-300 hover:shadow-lg backdrop-blur-sm`}
              >
                <div className={`${bg} border ${border} w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-white text-sm font-semibold">{name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── PIPELINE TIMELINE ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">How It Works</h2>
            <p className="text-slate-400">End-to-end data pipeline from atmospheric sensors to disaster defense</p>
          </motion.div>
          <GlowCard glowColor="cyan" className="p-8 md:p-10">
            <div>
              {timeline.map((step, i) => (
                <TimelineStep
                  key={step.title}
                  step={i + 1}
                  title={step.title}
                  desc={step.desc}
                  icon={step.icon}
                  color={step.color}
                  isLast={i === timeline.length - 1}
                />
              ))}
            </div>
          </GlowCard>
        </motion.section>

        {/* ── ML ARCHITECTURE & FEATURE IMPORTANCE ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Machine Learning System</h2>
            <p className="text-slate-400">Empirically validated models trained on ECMWF Copernicus & CRED EM-DAT records</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp}>
              <GlowCard glowColor="purple" className="p-7 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-purple-500/20 p-2 rounded-xl">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Model Architecture</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Binary Risk Model", value: "Random Forest (300 Trees)", icon: Layers },
                    { label: "Multi-Class Model", value: "Gradient Boosting (250 Estimators)", icon: Brain },
                    { label: "Empirical Dataset", value: "10,362 Verified Records", icon: Database },
                    { label: "Classifier Accuracy", value: "98.17% (Binary) / 97.15% (Type)", icon: CheckCircle2 },
                    { label: "Inference Latency", value: "< 80 ms per inference", icon: Gauge },
                    { label: "Cross-Validation", value: "Stratified 5-Fold Evaluation", icon: RefreshCcw },
                    { label: "Data Integrity", value: "100% Verified Real Observations", icon: Shield },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3 bg-slate-900/50 rounded-xl px-4 py-2.5 border border-white/5">
                      <Icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-slate-400 text-sm w-40 flex-shrink-0">{label}</span>
                      <span className="text-white text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>

            <motion.div variants={fadeUp}>
              <GlowCard glowColor="blue" className="p-7 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-500/20 p-2 rounded-xl">
                    <BarChart2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Empirical Feature Importances</h3>
                </div>
                <div className="space-y-4">
                  {features.map((f) => (
                    <ImportanceBar key={f.label} {...f} />
                  ))}
                </div>
                <p className="text-slate-400 text-xs mt-5 leading-relaxed border-t border-slate-700/60 pt-3">
                  Feature importances are derived from mean Gini impurity reduction. Atmospheric surface pressure and temperature
                  drops are the strongest precursors for cyclonic and convective disaster anomalies.
                </p>
              </GlowCard>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="mt-6">
            <GlowCard glowColor="cyan" className="p-7">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-cyan-400" /> Model Input Matrix
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Precipitation (mm)", icon: Droplets },
                      { label: "Wind Velocity (km/h)", icon: Wind },
                      { label: "Surface Temp (°C)", icon: Thermometer },
                      { label: "Relative Humidity (%)", icon: Wind },
                      { label: "Surface Pressure (hPa)", icon: Gauge },
                      { label: "Seismic Richter (M)", icon: AlertTriangle },
                    ].map(({ label, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800">
                        <Icon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-slate-300 text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" /> Model Output Deliverables
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Empirical Risk Score (0 – 100%)",
                      "Predicted Disaster Vector (Flood, Cyclone, Landslide, Earthquake, Drought)",
                      "Calibrated Threat Probability %",
                      "Tiered Alert Level: Safe / Moderate / High / Critical",
                      "Actionable Safety Protocols & 24/7 Helplines",
                    ].map((o) => (
                      <div key={o} className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-slate-300 text-xs">{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </motion.section>

        {/* ── VERIFIED DATA SOURCES ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Verified Data Authorities</h2>
            <p className="text-slate-400">Authentic observational telemetry from official scientific networks</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {dataSources.map(({ icon: Icon, color, bg, border, glowColor, title, badge, desc }, i) => (
              <motion.div key={title} variants={fadeUp} custom={i} whileHover={{ scale: 1.02 }}>
                <GlowCard glowColor={glowColor} className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className={`${bg} border ${border} p-2.5 rounded-xl flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white font-semibold text-base">{title}</h3>
                        <span className={`text-[10px] font-bold ${color} ${bg} border ${border} px-2 py-0.5 rounded-full`}>{badge}</span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── MONITORED DISASTER TYPES ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Monitored Hazard Vectors</h2>
            <p className="text-slate-400">Five primary natural hazards evaluated with Indian geographic domain intelligence</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {disasters.map(({ emoji, title, color, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i * 0.08}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`border rounded-2xl p-5 cursor-default transition-all duration-300 backdrop-blur-sm ${disasterColorMap[color]}`}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-3xl mb-2.5"
                >
                  {emoji}
                </motion.div>
                <h3 className={`text-lg font-bold mb-1.5 ${disasterTitleMap[color]}`}>{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FOOTER ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center pt-8 pb-4 border-t border-slate-800"
        >
          <p className="text-slate-500 text-xs font-mono tracking-wider">
            TRINETRA © 2026 &nbsp;·&nbsp; POWERED BY REACT 18, FASTAPI, SCIKIT-LEARN &amp; OPEN-METEO TELEMETRY
          </p>
        </motion.footer>

      </div>
    </div>
  );
}