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
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const { settings, loginAdmin, loginMember, setCurrentView } = useGym();
  const [activeTab, setActiveTab] = useState("member"); // 'member' | 'admin'
  const [mobileNumber, setMobileNumber] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6 pt-6 sm:pt-12">
        {/* Brand Logo & Name */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl mx-auto flex items-center justify-center text-black font-black shadow-2xl shadow-amber-500/20">
            <Dumbbell className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-white m-0 tracking-tight">
            {settings.gymName}
          </h1>
          <p className="text-xs text-neutral-400 m-0 truncate">
            {settings.address || "Official Gym Management Portal"}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab("member");
                setErrorMsg("");
              }}
              className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "member"
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
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
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Owner / Staff</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form 1: Member Phone Login */}
          {activeTab === "member" && (
            <form onSubmit={handleMemberLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Enter Registered Mobile Number:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98260 XXXXX"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-white font-mono placeholder-neutral-500 outline-none focus:border-amber-500 tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 m-0">
                  Admission ke time diya hua phone number enter karein.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <span>{loading ? "Verifying Member..." : "Open My Gym Pass"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 2: Owner / Staff PIN Login */}
          {activeTab === "admin" && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Enter 4-Digit Owner Security PIN:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="Enter PIN (Default: 1234)"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl py-3 pl-11 pr-4 text-sm text-white font-mono tracking-widest placeholder-neutral-500 outline-none focus:border-amber-500 text-center font-black"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 m-0 text-center">
                  Default Security PIN: <strong className="text-amber-400">1234</strong> (Settings mein badal sakte hain)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? "Unlocking Dashboard..." : "Unlock Owner Dashboard"}</span>
              </button>
            </form>
          )}
        </div>

        {/* Counter Tablet Shortcut */}
        <div className="text-center pt-1">
          <button
            onClick={() => {
              setCurrentView("kiosk");
              // Allow kiosk direct view
            }}
            className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1.5 font-semibold bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>Open Counter Reception QR Screen</span>
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className="text-center text-[10px] text-neutral-600 py-3 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Rate-Limited & Encrypted Session • {settings.gymName}</span>
      </div>
    </div>
  );
}

