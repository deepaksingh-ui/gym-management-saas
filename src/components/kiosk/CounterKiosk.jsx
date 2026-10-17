import React, { useState, useEffect } from "react";
import { useGym } from "../../context/GymContext";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import {
  QrCode,
  Clock,
  ShieldCheck,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Maximize2,
  Dumbbell,
} from "lucide-react";

export default function CounterKiosk() {
  const {
    settings,
    currentKioskToken,
    checkIns,
    members,
    processCheckIn,
    setActiveModal,
    setCurrentView,
    theme,
  } = useGym();

  const isDark = theme === "dark";

  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(settings.qrRefreshSeconds || 30);
  const [lastCheckinNotification, setLastCheckinNotification] = useState(null);

  // Digital clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer for QR refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? settings.qrRefreshSeconds || 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.qrRefreshSeconds]);

  // Audio Beep generator using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Ignore if sound blocked
    }
  };

  return (
    <div className="space-y-6">
      {/* Kiosk Mode Info Banner */}
      <div className={`rounded-3xl p-4 sm:p-5 border transition-all ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Reception Turnstile Kiosk
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Live Attendance Scanner
              </span>
            </div>
            <h3 className={`text-base font-black mt-1 m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
              Front-Desk / iPad Turnstile Attendance Screen
            </h3>
            <p className={`text-xs mt-0.5 m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Is screen ko reception tablet par display karein. Athletes aate hi camera se QR scan karenge!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                soundEnabled
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30"
                  : isDark
                  ? "bg-slate-800 text-slate-400 border-slate-700"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>Sound {soundEnabled ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => setCurrentView("owner")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm"
              }`}
            >
              Exit Kiosk
            </button>
          </div>
        </div>
      </div>

      {/* Main Kiosk Display Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Big Dynamic QR Display */}
        <div className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between border-2 shadow-2xl relative overflow-hidden transition-all ${
          isDark
            ? "bg-slate-900 border-amber-500/40 text-white"
            : "bg-white border-amber-400 text-slate-900"
        }`}>
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Clock & Gym Name */}
          <div className="text-center w-full relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-black mx-auto mb-2 shadow-lg shadow-amber-500/25">
              <Dumbbell className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
              {settings.gymName}
            </h2>
            <div className="text-4xl sm:text-5xl font-mono font-black text-amber-500 mt-2 tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className={`text-xs mt-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* QR Code Card */}
          <div className="my-6 p-6 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center relative border-4 border-amber-500/30">
            <QRCodeSVG
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}/?action=scan_checkin&token=${currentKioskToken}`
                  : `https://fitzone.app/?action=scan_checkin&token=${currentKioskToken}`
              }
              size={230}
              level="H"
              includeMargin={false}
            />

            {/* In-QR Center Logo Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black p-2.5 rounded-2xl border-2 border-white shadow-xl">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          {/* Rotating Token Timer (Anti-cheat) */}
          <div className="text-center space-y-2 relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold ${
              isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Anti-screenshot dynamic token refreshes in:</span>
              <span className="font-mono font-black text-amber-500 text-sm">{secondsRemaining}s</span>
            </div>

            <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              📲 Point phone camera at QR to verify entrance instantly
            </p>
          </div>
        </div>

        {/* Right: Live Check-in Stream & Counter Desk Overview */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          {/* Desk Quick Assist Card */}
          <div className={`rounded-3xl p-5 space-y-3 border transition-all ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reception Counter Active</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-500">
                {checkIns.length} Entries Today
              </span>
            </div>
            <p className={`text-xs m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Members screen par QR scan karke entry karenge. Agar koi phone bhool jaye to yahan se Assisted Entry karein:
            </p>

            <button
              onClick={() => setActiveModal("assistedCheckin")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black p-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <span>+ Manual Assisted Entry (Without Phone)</span>
            </button>
          </div>

          {/* Today's Live Attendance Feed */}
          <div className={`rounded-3xl p-5 flex-1 flex flex-col justify-between border transition-all ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Live Check-in Turnstile Feed
                </h4>
                <span className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-black">
                  {checkIns.length} Today
                </span>
              </div>

              <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {checkIns.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                      isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                        ✓
                      </div>
                      <div>
                        <div className={`font-black ${isDark ? "text-white" : "text-slate-900"}`}>{item.memberName}</div>
                        <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.method}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.time}</span>
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-black">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t text-center text-xs font-bold ${
              isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"
            }`}>
              ⚡ Equipped with Anti-duplicate & Expired-membership filters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
