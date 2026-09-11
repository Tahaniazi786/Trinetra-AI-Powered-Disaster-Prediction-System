import { Link } from "react-router";
import { Cloud, Activity, Map, Shield, Bell, ArrowRight, Zap, Target } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { motion } from "framer-motion";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        <motion.div
          className="max-w-6xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/30 p-5 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-300">
                <Cloud className="h-20 w-20 text-cyan-400" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            Next-Gen AI Prediction Engine
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-400 tracking-tight">
            TRINETRA
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Anticipate the unforeseeable. An advanced, real-time AI ecosystem protecting lives by accurately forecasting floods, cyclones, and environmental anomalies.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/prediction">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] group">
                Initialize Prediction <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-500/50 text-blue-400 hover:bg-blue-950/50 hover:text-white px-10 h-14 text-lg rounded-xl transition-all hover:scale-105 backdrop-blur-sm">
                Open Command Center
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-slate-950/50 border-y border-slate-800/50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Core Capabilities</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Engineered to process millions of data points across global topologies to deliver instantaneous threat assessments.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Real-Time Telemetry", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]" },
              { title: "Global Threat Mapping", icon: Map, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]" },
              { title: "Critical Alert Delivery", icon: Bell, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="h-full"
              >
                <Card className={`h-full bg-slate-900/60 backdrop-blur-xl ${feature.border} p-8 hover:border-slate-600 transition-all duration-500 group relative overflow-hidden ${feature.glow}`}>
                  <div className={`absolute -right-10 -top-10 w-32 h-32 ${feature.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`${feature.bg} p-4 rounded-2xl inline-block mb-6 relative z-10 border border-white/5`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white relative z-10">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed relative z-10">
                    Proprietary ML models execute high-frequency analysis upon vast atmospheric datasets, enabling pinpoint disaster identification before physical manifestation.
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disaster Vectors */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-gray-300 text-sm font-bold uppercase mb-6">
                <Target className="h-4 w-4 text-cyan-400" /> Monitored Vectors
             </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Threat Detection Spectrum</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Flood Zones", icon: "🌊", stat: "+85%", desc: "Water saturation models" },
              { name: "Seismic Activity", icon: "🏚️", stat: "24/7", desc: "Tectonic shift radar" },
              { name: "Landslide Risk", icon: "⛰️", stat: "98%", desc: "Terrain degradation" },
              { name: "Cyclone Physics", icon: "🌀", stat: "Mach 2", desc: "Atmospheric pressure" },
            ].map((disaster, i) => (
              <motion.div
                key={disaster.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-blue-500/20 p-6 sm:p-8 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-5xl sm:text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{disaster.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{disaster.name}</h3>
                  <div className="flex flex-col gap-1 items-center justify-center">
                     <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{disaster.desc}</span>
                     <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full mt-2 border border-slate-700">{disaster.stat} Confidence</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent"></div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center relative z-10 bg-slate-900/80 backdrop-blur-2xl border border-blue-500/30 p-12 md:p-20 rounded-[3rem] shadow-[0_0_50px_rgba(37,99,235,0.2)]"
        >
          <Shield className="h-20 w-20 text-cyan-400 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">
            Protection Meets Precision
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Deploy Trinetra architecture across your grid to anticipate disastrous environmental contingencies with zero-day latency.
          </p>
          <Link to="/prediction">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-12 h-16 text-xl rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 font-bold">
              Initialize Operations <Zap className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}