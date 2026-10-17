import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  Dumbbell,
  ShieldCheck,
  Smartphone,
  Lock,
  ArrowRight,
  AlertCircle,
  QrCode,
  KeyRound,
  Sun,
  Moon,
  Flame,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const { settings, loginAdmin, loginMember, setCurrentView, theme, toggleTheme } = useGym();
  const [activeTab, setActiveTab] = useState("member"); // 'member' | 'admin'
  const [mobileNumber, setMobileNumber] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";

  const handleMemberLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = loginMember(mobileNumber);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = loginAdmin(adminPin);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 font-sans transition-colors duration-200 ${
      isDark ? "bg-[#080c14] text-white" : "bg-slate-50 text-slate-900 bg-fitness-pattern"
    }`}>
      {/* Top Bar with Gym Badge & Theme Toggle */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-500">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>ATHLETIC OS</span>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition cursor-pointer ${
            isDark
              ? "bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm"
          }`}
          title={isDark ? "Switch to Light Daylight Mode" : "Switch to Midnight Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="max-w-md w-full mx-auto space-y-6 pt-4 sm:pt-8">
        {/* Brand Logo & Name */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl mx-auto flex items-center justify-center text-black font-black shadow-2xl shadow-amber-500/30 transform hover:scale-105 transition-transform">
            <Dumbbell className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight m-0 leading-tight">
            {settings.gymName}
          </h1>
          <p className={`text-xs font-semibold m-0 truncate max-w-xs mx-auto ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            {settings.address || "Official Athlete Portal & Management"}
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            <span>⚡ SWEAT TODAY • CONQUER TOMORROW</span>
          </div>
        </div>

        {/* Login Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 shadow-2xl"
            : "bg-white border-slate-200 shadow-xl"
        }`}>
          {/* Tabs */}
          <div className={`grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl border text-xs font-black ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => {
                setActiveTab("member");
                setErrorMsg("");
              }}
              className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "member"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Member Pass</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("admin");
                setErrorMsg("");
              }}
              className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "admin"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Owner / Staff</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-300 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form 1: Member Phone Login */}
          {activeTab === "member" && (
            <form onSubmit={handleMemberLogin} className="space-y-4 mt-5">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Enter Registered Mobile Number:
                </label>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black font-mono ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98260 XXXXX"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={`w-full rounded-2xl py-3 pl-12 pr-4 text-sm font-mono font-bold tracking-wider outline-none border transition-colors ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                    }`}
                  />
                </div>
                <p className={`text-[11px] mt-1.5 m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Admission ke time diya hua phone number enter karein.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                <span>{loading ? "Verifying Athlete..." : "Open My Gym Pass"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 2: Owner / Staff PIN Login */}
          {activeTab === "admin" && (
            <form onSubmit={handleAdminLogin} className="space-y-4 mt-5">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Enter 4-Digit Owner Security PIN:
                </label>
                <div className="relative">
                  <KeyRound className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`} />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="Enter PIN (Default: 1234)"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className={`w-full rounded-2xl py-3 pl-11 pr-4 text-sm font-mono tracking-widest outline-none border text-center font-black transition-colors ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                    }`}
                  />
                </div>
                <p className={`text-[11px] mt-1.5 m-0 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Default Security PIN: <strong className="text-amber-500 font-black">1234</strong> (Settings mein badal sakte hain)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? "Unlocking Dashboard..." : "Unlock Owner Dashboard"}</span>
              </button>
            </form>
          )}
        </div>

        {/* Counter Tablet Shortcut (Only visible to Gym Staff / Owner tab, NEVER to members) */}
        {activeTab === "admin" && (
          <div className="text-center pt-1 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setCurrentView("kiosk")}
              className={`text-xs inline-flex items-center gap-2 font-bold px-4 py-2.5 rounded-2xl border transition cursor-pointer shadow-sm ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-500" />
              <span>Launch Reception Counter Tablet Screen</span>
            </button>
          </div>
        )}
      </div>

      {/* Security Footer */}
      <div className={`text-center text-[11px] py-4 flex items-center justify-center gap-1.5 font-bold ${
        isDark ? "text-slate-500" : "text-slate-400"
      }`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Rate-Limited & Encrypted Session • {settings.gymName}</span>
      </div>
    </div>
  );
}
