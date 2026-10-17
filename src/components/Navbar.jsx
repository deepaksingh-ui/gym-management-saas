import React from "react";
import { useGym } from "../context/GymContext";
import {
  Dumbbell,
  LayoutDashboard,
  Smartphone,
  QrCode,
  UserPlus,
  Settings,
  CreditCard,
  Users2,
  LogOut,
  Sun,
  Moon,
  Flame,
  Activity,
} from "lucide-react";

export default function Navbar() {
  const {
    settings,
    currentView,
    setCurrentView,
    setActiveModal,
    logout,
    theme,
    toggleTheme,
    checkIns,
  } = useGym();

  const isDark = theme === "dark";

  return (
    <header className={`sticky top-0 z-40 backdrop-blur transition-colors ${
      isDark ? "bg-slate-900/95 border-b border-slate-800 text-white" : "bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm"
    }`}>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/25">
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight m-0 leading-tight">
                {settings.gymName}
              </h1>
              {/* Gym Floor Pulse Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>FLOOR OPEN</span>
              </span>
            </div>
            <p className={`text-[11px] m-0 hidden sm:block truncate max-w-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {settings.address || "High-Performance Gym Management & Retention"}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className={`flex items-center p-1 rounded-2xl border transition-colors ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            onClick={() => setCurrentView("owner")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              currentView === "owner"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView("kiosk")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              currentView === "kiosk"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Counter Tablet</span>
            <span className="sm:hidden">Kiosk</span>
          </button>

          <button
            onClick={() => setCurrentView("member")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              currentView === "member"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Member App</span>
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Add Member Button */}
          <button
            onClick={() => setActiveModal("newMember")}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Add Member</span>
          </button>

          {/* Manage Plans Button */}
          <button
            onClick={() => setActiveModal("managePlans")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title="Manage Gym Plans & Rates"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-500" />
            <span>Plans</span>
          </button>

          {/* Manage Trainers Button */}
          <button
            onClick={() => setActiveModal("manageTrainers")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title="Manage Gym Trainers"
          >
            <Users2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Trainers</span>
          </button>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700"
                : "bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300 shadow-sm"
            }`}
            title={isDark ? "Switch to Bright Daylight Theme" : "Switch to Midnight Gym Theme"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setActiveModal("settings")}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title="Gym Settings & Backup"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 transition cursor-pointer"
            title="Log Out (Lock Dashboard)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
