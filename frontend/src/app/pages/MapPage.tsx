'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Satellite,
} from 'lucide-react';
import { DisasterMap } from '../components/DisasterMap';
// ─── Derived Stats ────────────────────────────────────────────────────────────
const totalLocations = 15;
const criticalCount = 2;
const highRiskCount = 4;
const safeCount = 3;

// ─── Legend Config ────────────────────────────────────────────────────────────
const LEGEND = [
  { label: 'Critical', color: '#ef4444', border: 'border-red-500/40',    bg: 'bg-red-500/10',    text: 'text-red-400'    },
  { label: 'High',     color: '#f97316', border: 'border-orange-500/40', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  { label: 'Moderate', color: '#eab308', border: 'border-yellow-500/40', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  { label: 'Safe',     color: '#22c55e', border: 'border-green-500/40',  bg: 'bg-green-500/10',  text: 'text-green-400'  },
];

// ─── Stat Card Data ───────────────────────────────────────────────────────────
const STATS = [
  {
    label: 'Monitored Locations',
    value: totalLocations,
    icon: MapPin,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'shadow-cyan-500/20',
  },
  {
    label: 'Critical Zones',
    value: criticalCount,
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    glow: 'shadow-red-500/20',
  },
  {
    label: 'High-Risk Areas',
    value: highRiskCount,
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'shadow-orange-500/20',
  },
  {
    label: 'Safe Zones',
    value: safeCount,
    icon: ShieldCheck,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    glow: 'shadow-green-500/20',
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── Pulse Dot ────────────────────────────────────────────────────────────────
function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-3 w-3">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span
        className="relative inline-flex rounded-full h-3 w-3"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  stat,
  index,
}: {
  stat: (typeof STATS)[number];
  index: number;
}) {
  const Icon = stat.icon;
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.04, y: -2 }}
      className={`relative flex items-center gap-4 px-5 py-4 rounded-xl border ${
        stat.border
      } ${stat.bg} shadow-lg ${stat.glow} backdrop-blur-sm overflow-hidden cursor-default select-none`}
    >
      {/* Glow blob */}
      <div
        className={`absolute top-0 right-0 w-12 h-12 ${stat.bg} blur-2xl rounded-full`}
      />

      <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.border} border`}>
        <Icon className={`w-5 h-5 ${stat.color}`} />
      </div>

      <div className="flex flex-col">
        <motion.span
          className={`text-2xl font-black tracking-tight ${stat.color} font-mono`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
        >
          {String(stat.value).padStart(2, '0')}
        </motion.span>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">
          {stat.label}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MapPage() {
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-slate-950 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ── Header ── */}
      <motion.header
        variants={itemVariants}
        className="relative overflow-hidden border-b border-slate-800/60"
      >
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,255,0.015) 3px, rgba(0,255,255,0.015) 4px)',
          }}
        />
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-cyan-500/5 blur-3xl rounded-full z-0" />

        <div className="relative z-10 px-6 pt-8 pb-6 max-w-screen-2xl mx-auto">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full"
            >
              <PulseDot color="#ef4444" />
              <span className="text-red-400 text-xs font-bold tracking-[0.2em] uppercase">
                Live Monitoring
              </span>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-1.5 text-xs"
              >
                <Satellite className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-mono text-cyan-400/70 tracking-widest">SAT-LINK ACTIVE</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 text-xs"
              >
                <Radio className="w-3.5 h-3.5 text-green-500" />
                <span className="font-mono text-green-400/70 tracking-widest">FEED NOMINAL</span>
              </motion.div>
            </div>
          </div>

          {/* Title Block */}
          <div className="flex items-start gap-5">
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
              className="hidden sm:flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
            >
              <Activity className="w-8 h-8 text-cyan-400" />
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-black tracking-tight"
              >
                <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  Threat Intelligence
                </span>{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Map
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                className="mt-1.5 text-sm text-slate-400 font-medium tracking-wide max-w-xl"
              >
                Real-time geospatial risk overlay — disaster zones, seismic activity &amp; flood
                corridors across monitored regions. Data refreshed every 60 seconds.
              </motion.p>
            </div>
          </div>

          {/* ── Live Stats Strip ── */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7"
          >
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </motion.div>

          {/* ── Legend Chips ── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-2 mt-5"
          >
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mr-1">
              Risk Levels:
            </span>
            {LEGEND.map((l) => (
              <motion.span
                key={l.label}
                whileHover={{ scale: 1.08 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
                  l.border
                } ${l.bg} ${l.text} cursor-default select-none`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: l.color,
                    boxShadow: `0 0 6px ${l.color}`,
                  }}
                />
                {l.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* ── Map Section ── */}
      <motion.main
        variants={itemVariants}
        className="flex-1 flex flex-col px-6 py-5 max-w-screen-2xl mx-auto w-full"
      >
        {/* HUD Map Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
          className="relative flex-1 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/60 min-h-[660px] p-4 pt-10 flex flex-col bg-slate-950/40"
        >
          {/* HUD corner decorators */}
          {[
            { cls: 'top-0 left-0',     bt: '2px solid rgba(6,182,212,0.5)', bb: 'none',                              bl: '2px solid rgba(6,182,212,0.5)', br: 'none' },
            { cls: 'top-0 right-0',    bt: '2px solid rgba(6,182,212,0.5)', bb: 'none',                              bl: 'none',                          br: '2px solid rgba(6,182,212,0.5)' },
            { cls: 'bottom-0 left-0',  bt: 'none',                          bb: '2px solid rgba(6,182,212,0.5)',     bl: '2px solid rgba(6,182,212,0.5)', br: 'none' },
            { cls: 'bottom-0 right-0', bt: 'none',                          bb: '2px solid rgba(6,182,212,0.5)',     bl: 'none',                          br: '2px solid rgba(6,182,212,0.5)' },
          ].map((c, i) => (
            <div
              key={i}
              className={`absolute ${c.cls} w-6 h-6 z-10 pointer-events-none`}
              style={{
                borderTop: c.bt,
                borderBottom: c.bb,
                borderLeft: c.bl,
                borderRight: c.br,
              }}
            />
          ))}

          {/* Top HUD bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-2 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
            <div className="flex items-center gap-2">
              <PulseDot color="#22d3ee" />
              <span className="text-cyan-400/90 text-xs font-mono tracking-widest font-semibold">
                GEOSPATIAL TELEMETRY FEED
              </span>
            </div>
            <span className="text-slate-400 text-xs font-mono tracking-widest">
              TRINETRA · 15 MONITORED VULNERABILITY ZONES
            </span>
          </div>

          {/* Actual map */}
          <div className="flex-1 w-full min-h-[580px]">
            <DisasterMap />
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-slate-600 mt-3 font-mono tracking-wider"
        >
          © TRINETRA · POWERED BY VERIFIED METEOROLOGICAL & SEISMIC TELEMETRY
        </motion.p>
      </motion.main>
    </motion.div>
  );
}
