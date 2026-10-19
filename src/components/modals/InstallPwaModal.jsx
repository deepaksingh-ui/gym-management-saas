import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Share2,
  MoreVertical,
  PlusSquare,
  DownloadCloud,
  CheckCircle2,
  X,
  Zap,
  ShieldCheck,
  Flame,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useGym } from "../../context/GymContext";

export default function InstallPwaModal({ onClose }) {
  const { settings, theme } = useGym();
  const isDark = theme === "dark";

  const [activeOs, setActiveOs] = useState(() => {
    // Detect OS automatically
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
      if (/android/.test(userAgent)) return "android";
    }
    return "android";
  });

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Check if already in standalone display mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        activeOs === "ios"
          ? "iPhone me install karne ke liye neeche Safari 'Share (⬆️)' button dabayein aur 'Add to Home Screen' chunein!"
          : "Chrome ke upar right side 3 dots (⋮) par tap karein aur 'Install app' ya 'Add to Home screen' chunein!"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[92vh] ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-xl shadow-md shadow-amber-500/20 shrink-0">
              📲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight m-0">
                  Add to Home Screen
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  PWA App
                </span>
              </div>
              <p className={`text-xs m-0 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Install {settings.gymName} like a native mobile app without Play Store
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* OS Switcher Tabs */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          <div className={`grid grid-cols-2 p-1 rounded-2xl border text-xs font-black ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => setActiveOs("android")}
              className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                activeOs === "android"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🤖 Android (Chrome)</span>
            </button>
            <button
              onClick={() => setActiveOs("ios")}
              className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                activeOs === "ios"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🍎 iPhone / iPad (Safari)</span>
            </button>
          </div>

          {/* Quick Install Button if supported directly */}
          {deferredPrompt && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="text-xs font-black text-amber-500 block">
                    Instant 1-Click Install Ready!
                  </span>
                  <span className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Tap below to directly add the app icon to your phone screen.
                  </span>
                </div>
              </div>
              <button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black px-4 py-2 rounded-xl shrink-0 shadow-md shadow-amber-500/20 cursor-pointer transition"
              >
                Install Now
              </button>
            </div>
          )}

          {/* Android Steps */}
          {activeOs === "android" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                <span>Android Phone par kaise lagayein (3 Aasan Steps):</span>
              </div>

              {/* Step 1 */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black text-xs shrink-0">
                  1
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    Chrome browser me 3 Dots (⋮) tap karein
                  </div>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Apne phone me Chrome ke top-right corner me 3 vertical dots <strong className="text-amber-500">⋮</strong> par click karein.
                  </p>
                </div>
                <MoreVertical className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              </div>

              {/* Step 2 */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black text-xs shrink-0">
                  2
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    "Install app" ya "Add to Home screen" select karein
                  </div>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Menu me scroll karein aur <strong>"Install app"</strong> (या होम स्क्रीन में जोड़ें) par tap karein.
                  </p>
                </div>
                <DownloadCloud className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              </div>

              {/* Step 3 */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black text-xs shrink-0">
                  3
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    "Install" button confirm karein
                  </div>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Aapke mobile ke home screen par FitZone Gym ka official icon ban jayega. Agli baar 1-tap me bina browser khole full-screen chalega!
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              </div>
            </div>
          )}

          {/* iOS Steps */}
          {activeOs === "ios" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                <span>iPhone / iPad par kaise lagayein (3 Aasan Steps):</span>
              </div>

              {/* Step 1 */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black text-xs shrink-0">
                  1
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    Link ko Safari browser me open karein
                  </div>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Apple iPhones me PWA sirf default <strong>Safari</strong> browser se install hota hai.
                  </p>
                </div>
                <Smartphone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              </div>

              {/* Step 2 */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black text-xs shrink-0">
                  2
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    Bottom bar me "Share" icon (⬆️) dabayein
                  </div>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Safari ke neeche square arrow icon <strong className="text-amber-500">⬆️ (Share)</strong> par tap karein.
                  </p>
                </div>
                <Share2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              </div>

              {/* Step 3 */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black text-xs shrink-0">
                  3
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    "Add to Home Screen" (+) select karke Add karein
                  </div>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Menu me neeche scroll karke <strong>"Add to Home Screen"</strong> par tap karein, phir top-right me <strong>Add</strong> dabayein.
                  </p>
                </div>
                <PlusSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              </div>
            </div>
          )}

          {/* Benefits Feature Box */}
          <div className={`rounded-2xl p-4 border space-y-2.5 ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-amber-50/50 border-amber-200"
          }`}>
            <div className="text-xs font-black text-amber-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Is PWA System ke Zabardast Fayde:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-black">✓</span>
                <span>0 MB storage (phone nahi bharega)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-black">✓</span>
                <span>No Play Store fees (Save ₹25,000)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-black">✓</span>
                <span>Full-screen app bina URL bar ke</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-black">✓</span>
                <span>Automatic instant updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="text-[11px] text-slate-400">
            {isInstalled ? "✅ App is already running in Standalone Mode" : "Tap anywhere outside to close"}
          </div>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs px-5 py-2 rounded-xl transition cursor-pointer shadow-md shadow-amber-500/20"
          >
            Got It! (Samajh Gaya)
          </button>
        </div>
      </div>
    </div>
  );
}
