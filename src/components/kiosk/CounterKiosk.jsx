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
  } = useGym();

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

  // Audio Beep generator using Web Audio API (zero audio file dependencies)
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

  // Simulate a quick scan from desk for sales demo
  const handleSimulateScan = (member) => {
    const res = processCheckIn(member.id, "Kiosk QR Scan");
    if (res.success) {
      playBeep();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      setLastCheckinNotification({
        name: member.name,
        streak: member.streak + 1,
        avatar: member.avatar,
        status: "Welcome!",
      });
      setTimeout(() => setLastCheckinNotification(null), 5000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kiosk Mode Info Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
            Front-Desk Display Mode
          </span>
          <h3 className="text-base font-bold text-white mt-1 m-0">
            Reception Counter / iPad Attendance Screen
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5 m-0">
            Is screen ko gym ke counter par tablet ya monitor par display kiya jaata hai. Members aate hi phone se scan karte hain!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              soundEnabled
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : "bg-neutral-800 text-neutral-400 border-neutral-700"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Sound {soundEnabled ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() => setCurrentView("owner")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition cursor-pointer"
          >
            Exit Kiosk
          </button>
        </div>
      </div>

      {/* Main Kiosk Display Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Big Dynamic QR Display */}
        <div className="lg:col-span-7 bg-neutral-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Clock & Gym Name */}
          <div className="text-center w-full">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight m-0">
              {settings.gymName}
            </h2>
            <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 mt-2">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">
              {currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* QR Code Card */}
          <div className="my-6 p-6 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center relative">
            <QRCodeSVG
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}/?action=scan_checkin&token=${currentKioskToken}`
                  : `https://fitzone.app/?action=scan_checkin&token=${currentKioskToken}`
              }
              size={220}
              level="H"
              includeMargin={false}
            />

            {/* In-QR Center Logo Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-amber-400 p-2 rounded-xl border-2 border-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Rotating Token Timer (Anti-cheat) */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2 rounded-xl border border-neutral-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-400">Anti-screenshot code refreshes in:</span>
              <span className="font-mono font-bold text-amber-400">{secondsRemaining}s</span>
            </div>

            <p className="text-xs text-neutral-300 font-medium">
              📲 Scan with FitZone Member App to mark attendance
            </p>
          </div>

          {/* Checkin celebration popup overlay */}
          {lastCheckinNotification && (
            <div className="absolute inset-x-6 bottom-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
              <div className="flex items-center gap-3">
                <img
                  src={lastCheckinNotification.avatar}
                  alt={lastCheckinNotification.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white"
                />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Check-in Verified!
                  </div>
                  <div className="text-base font-black">{lastCheckinNotification.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl font-black text-sm">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{lastCheckinNotification.streak} Days 🔥</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Check-in Stream & Counter Desk Overview */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          {/* Desk Quick Assist Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reception Counter Active</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400 font-semibold">
                {checkIns.length} Check-ins Today
              </span>
            </div>
            <p className="text-xs text-neutral-400 m-0">
              Members screen par QR scan karke entry karenge. Agar koi phone bhool jaye to yahan se Assisted Entry karein:
            </p>

            <button
              onClick={() => setActiveModal("assistedCheckin")}
              className="w-full bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-amber-400 font-bold p-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>+ Manual Assisted Entry (Without Phone)</span>
            </button>
          </div>

          {/* Today's Live Attendance Feed */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white m-0">Live Check-in Feed</h4>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  {checkIns.length} Today
                </span>
              </div>

              <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {checkIns.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-white">{item.memberName}</div>
                        <div className="text-[10px] text-neutral-500">{item.method}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-neutral-300 font-semibold">{item.time}</span>
                      <span className="block text-[10px] text-emerald-400">Success</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 text-center text-xs text-neutral-400">
              Equipped with Anti-duplicate & Expired-membership filters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

