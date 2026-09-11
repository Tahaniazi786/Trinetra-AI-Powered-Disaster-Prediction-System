import { Outlet, Link, useLocation } from "react-router";
import { Cloud, AlertTriangle, Map, BarChart3, Info, Menu, X, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

export function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Check backend health
  useEffect(() => {
    const check = () => {
      fetch(`${API_BASE_URL}/health`)
        .then((res) => res.ok && setBackendOnline(true))
        .catch(() => setBackendOnline(false));
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home", exact: true },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/prediction", label: "Predict", icon: AlertTriangle },
    { path: "/map", label: "Map", icon: Map },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-300">TRINETRA</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const active = link.exact
                  ? location.pathname === "/"
                  : isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${
                      active
                        ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                );
              })}

              {/* Backend Status Indicator */}
              <div className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 text-xs font-medium">
                <Radio className="h-3 w-3" />
                {backendOnline === null ? (
                  <span className="text-slate-500">Connecting...</span>
                ) : backendOnline ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-green-400">API Live</span></>
                ) : (
                  <><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span className="text-red-400">API Offline</span></>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => {
              const active = link.exact
                ? location.pathname === "/"
                : isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500">
              <Radio className="h-3 w-3" />
              {backendOnline ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-green-400">Backend Online</span></>
              ) : (
                <><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span className="text-red-400">Backend Offline</span></>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      {location.pathname !== "/map" && (
        <footer className="bg-slate-950 border-t border-white/5 py-12 mt-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-1.5 rounded-lg opacity-80">
                <Cloud className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-300 tracking-wider">TRINETRA</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 TRINETRA - AI Risk Engineering</p>
            <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest font-medium">
              Next-Gen Disaster Prediction Ecosystem
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
