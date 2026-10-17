import React from "react";
import { useGym } from "../context/GymContext";
import {
  Dumbbell,
  LayoutDashboard,
  Smartphone,
  QrCode,
  UserCheck,
  UserPlus,
  Settings,
  CreditCard,
  Users2,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const {
    settings,
    currentView,
    setCurrentView,
    setActiveModal,
    logout,
  } = useGym();

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white m-0 leading-tight">
                {settings.gymName}
              </h1>
            </div>
            <p className="text-[11px] text-neutral-400 m-0 hidden sm:block truncate max-w-xs">
              {settings.address || settings.tagline}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setCurrentView("owner")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === "owner"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView("kiosk")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === "kiosk"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Counter Tablet</span>
            <span className="sm:hidden">Kiosk</span>
          </button>

          <button
            onClick={() => setCurrentView("member")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === "member"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
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
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs border border-neutral-700 transition cursor-pointer"
            title="Manage Gym Plans & Rates"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Plans & Rates</span>
          </button>

          {/* Manage Trainers Button */}
          <button
            onClick={() => setActiveModal("manageTrainers")}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs border border-neutral-700 transition cursor-pointer"
            title="Manage Gym Trainers"
          >
            <Users2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Trainers</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setActiveModal("settings")}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer"
            title="Gym Settings & Backup"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition cursor-pointer"
            title="Log Out (Lock Dashboard)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
