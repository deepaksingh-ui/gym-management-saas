import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import confetti from "canvas-confetti";
import {
  Flame,
  QrCode,
  Calendar,
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Dumbbell,
  Tag,
  IndianRupee,
  RefreshCw,
  Zap,
  Droplets,
  Apple,
  MessageSquare,
  Utensils,
  Phone,
} from "lucide-react";
import UpiPaymentModal from "../modals/UpiPaymentModal";

export default function MemberPortal() {
  const {
    currentMember,
    members,
    setSelectedMemberId,
    plans,
    addOns,
    trainers,
    dietPlans = [],
    workoutRoutines = [],
    processCheckIn,
    renewMembership,
    orderAddOn,
    settings,
    checkIns,
    theme,
  } = useGym();

  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'plan' | 'shop' | 'renew' | 'history'
  const [planSubTab, setPlanSubTab] = useState("diet"); // 'diet' | 'routine'
  const [selectedRoutineDay, setSelectedRoutineDay] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("plan-3m");
  const [couponCode, setCouponCode] = useState("FIT10");
  const [couponApplied, setCouponApplied] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const isDark = theme === "dark";
  const member = currentMember;

  if (!member) {
    return (
      <div className={`p-8 text-center space-y-3 rounded-3xl border ${
        isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-600 shadow-sm"
      }`}>
        <p className="text-sm font-bold">Athlete record not found or session expired.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs bg-amber-500 text-black px-4 py-2 rounded-xl font-black shadow-md cursor-pointer"
        >
          Reload Portal
        </button>
      </div>
    );
  }

  const currentPlan = plans.find((p) => p.id === member.planId) || plans[0] || { name: "Active Plan", price: 0 };
  const trainer = trainers.find((t) => t.id === member.assignedTrainerId);
  const memberDiet = dietPlans.find((d) => d.id === member.dietPlanId) || (member.dietPlanId && member.dietPlanId !== "none" ? dietPlans[0] : null);
  const memberRoutine = workoutRoutines.find((w) => w.id === member.workoutSplitId) || workoutRoutines[0];

  // Trigger QR Check-in simulation
  const handleQRScan = () => {
    setIsScanning(true);
    setScanMessage(null);

    setTimeout(() => {
      setIsScanning(false);
      const res = processCheckIn(member.id, "Member QR Scan");

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#10b981", "#ef4444"],
        });
        setScanMessage({
          type: "success",
          text: `Attendance Verified! 🔥 Current Streak: ${member.streak + 1} Days`,
        });
      } else {
        setScanMessage({
          type: res.isDuplicate ? "warning" : "error",
          text: res.message,
        });
      }

      setTimeout(() => setScanMessage(null), 5000);
    }, 1200);
  };

  const handleBuyAddOn = (item) => {
    const res = orderAddOn(member.id, item.id, "UPI (Member App)");
    if (res.success) {
      alert(`🎉 ${item.name} order placed! Counter invoice generated.`);
    }
  };

  const memberCheckins = checkIns.filter((c) => c.memberId === member.id);
  const today = new Date();
  const expiry = new Date(member.expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-md mx-auto">
      {/* Mobile Frame Container */}
      <div className={`rounded-3xl border shadow-2xl overflow-hidden min-h-[720px] flex flex-col justify-between transition-all ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-xl"
      }`}>
        {/* Mobile Header */}
        <div className={`p-4 border-b transition-colors ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500 shadow-md shadow-amber-500/20"
              />
              <div>
                <h3 className={`text-base font-black m-0 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  {member.name}
                </h3>
                <span className={`text-[11px] font-mono font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {member.phone}
                </span>
              </div>
            </div>

            {/* Member Status Badge */}
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  member.status === "active"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : member.status === "expiring"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    : "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                }`}
              >
                {member.status}
              </span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className={`mt-4 grid grid-cols-5 gap-1 p-1 rounded-2xl border text-xs font-black ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <button
              onClick={() => setActiveTab("home")}
              className={`py-2 rounded-xl transition cursor-pointer text-center text-[10px] sm:text-xs ${
                activeTab === "home"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pass
            </button>
            <button
              onClick={() => setActiveTab("plan")}
              className={`py-2 rounded-xl transition cursor-pointer text-center text-[10px] sm:text-xs ${
                activeTab === "plan"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Diet/Split
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className={`py-2 rounded-xl transition cursor-pointer text-center text-[10px] sm:text-xs ${
                activeTab === "shop"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Store
            </button>
            <button
              onClick={() => setActiveTab("renew")}
              className={`py-2 rounded-xl transition cursor-pointer text-center text-[10px] sm:text-xs relative ${
                activeTab === "renew"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Renew
              {daysLeft <= 7 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 rounded-xl transition cursor-pointer text-center text-[10px] sm:text-xs ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: PASS & CHECK-IN */}
          {activeTab === "home" && (
            <div className="space-y-4">
              {/* Luxury Gold/Carbon Membership Card */}
              <div className="vip-card-shimmer rounded-3xl p-5 text-white shadow-2xl border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-amber-400">
                      VIP ATHLETE PASS
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-300">
                    {currentPlan.name}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-400 font-bold block uppercase tracking-wider">
                      Athlete Name
                    </span>
                    <div className="text-xl font-black tracking-tight text-white">{member.name}</div>
                    <span className="text-[10px] text-amber-400/90 font-mono">ID: {member.id.toUpperCase()}</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black shadow-md">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-neutral-700/60 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-bold">Valid Till</span>
                    <span className="font-mono text-white">{member.expiryDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block font-bold">Countdown</span>
                    <span className="font-black text-amber-400">
                      {daysLeft > 0 ? `${daysLeft} Days Left` : "Expired"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-on-1 Personal Training Active Badge Card */}
              {member.ptBalance && member.ptBalance > 0 ? (
                <div className={`p-4 rounded-3xl border-2 transition-all shadow-md ${
                  isDark
                    ? "bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50"
                    : "bg-gradient-to-br from-amber-50 via-orange-50/50 to-white border-amber-400"
                }`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        ⭐ 1-on-1 Personal Training Active
                      </span>
                    </div>
                    <span className="text-xs font-black text-amber-500 bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/30">
                      {member.ptBalance} Sessions Left
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg font-black text-black shadow-md shrink-0">
                        🏋️
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Assigned Personal Coach
                        </span>
                        <div className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                          {trainer ? trainer.name : "Vikram Chauhan"}
                        </div>
                        <span className="text-[10px] text-amber-500 font-semibold">
                          {trainer ? trainer.specialty : "Hypertrophy & Strength"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`https://wa.me/91${trainer ? trainer.phone.replace(/[^0-9]/g, "").slice(-10) : "9893011223"}?text=${encodeURIComponent(
                          `Hi Coach ${trainer ? trainer.name : "Vikram"}, I am ${member.name} (Member ID: ${member.id}). I want to schedule my next PT session (${member.ptBalance} sessions remaining). Please confirm tomorrow's slot.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition"
                        title="Book Session on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Book Slot</span>
                      </a>
                      <a
                        href={`tel:${trainer ? trainer.phone : "+919893011223"}`}
                        className={`p-2 rounded-xl border text-xs font-bold transition ${
                          isDark ? "bg-slate-800 text-slate-300 border-slate-700 hover:text-white" : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                        }`}
                        title="Call Coach"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Visual Sessions Progress Bar */}
                  <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                      Coaching Progress:
                    </span>
                    <span className="font-bold text-amber-500">
                      {Math.max(0, 12 - member.ptBalance)} / 12 completed ({member.ptBalance} remaining)
                    </span>
                  </div>
                </div>
              ) : (
                /* If member doesn't have PT, show an invite pill */
                <div
                  onClick={() => setActiveTab("shop")}
                  className={`p-3 rounded-2xl border border-dashed flex items-center justify-between text-xs cursor-pointer transition ${
                    isDark ? "bg-slate-900/50 border-slate-800 hover:border-amber-500/40" : "bg-amber-50/40 border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏋️</span>
                    <div>
                      <span className={`font-bold block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Want faster results? 1-on-1 Personal Training
                      </span>
                      <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        Form correction, customized workouts & dedicated coach
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-amber-500 text-black px-2.5 py-1 rounded-xl shrink-0">
                    View PT Plans
                  </span>
                </div>
              )}

              {/* Renewal Expiry Warning Banner if <= 7 days */}
              {daysLeft <= 7 && (
                <div
                  onClick={() => setActiveTab("renew")}
                  className="bg-red-500/15 border-2 border-red-500/40 rounded-2xl p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-red-500/20 transition shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <span className="font-black text-red-600 dark:text-red-400 block">
                        Membership Expiring in {daysLeft} Days!
                      </span>
                      <p className={`text-[11px] m-0 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        Renew today with UPI to keep your streak & get 10% OFF
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-red-500 shrink-0" />
                </div>
              )}

              {/* Workout Target & Motivational Fuel */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
                      <Zap className="w-4 h-4 fill-amber-500" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Today's Workout Target
                      </span>
                      <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                        Strength & Core Hypertrophy
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    45 MINS
                  </span>
                </div>
              </div>

              {/* Fair Streak & Weekly Goal Widget */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/15 text-amber-500 rounded-2xl shadow-sm">
                      <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Active Streak
                      </div>
                      <div className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                        {member.streak} Days on Fire 🔥
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className={`block font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Weekly Target</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                      {Math.min(member.weeklyGoalDays || 4, (member.streak % 7) + 2)} / {member.weeklyGoalDays || 4} Days
                    </span>
                  </div>
                </div>

                <p className={`text-[10px] mt-2.5 m-0 border-t pt-2 font-medium ${
                  isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
                }`}>
                  ✓ Protected: Rest days or authorized leaves do not break your streak.
                </p>
              </div>

              {/* QR Check-in Action Box */}
              <div className={`p-5 rounded-3xl border text-center space-y-3 transition-all ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <h4 className={`text-xs font-black uppercase tracking-wider m-0 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Front-Desk Attendance Check-in
                </h4>

                <button
                  onClick={handleQRScan}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{isScanning ? "Verifying with Gym Counter..." : "Tap to Scan Gym Counter QR"}</span>
                </button>

                {scanMessage && (
                  <div
                    className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-left shadow-sm ${
                      scanMessage.type === "success"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40"
                        : scanMessage.type === "warning"
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                        : "bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40"
                    }`}
                  >
                    {scanMessage.type === "success" ? (
                      <CheckCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{scanMessage.text}</span>
                  </div>
                )}

                <p className={`text-[11px] m-0 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Point phone at counter QR screen to mark attendance instantly
                </p>
              </div>

              {/* Assigned Trainer Contact */}
              {trainer && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-base">
                      🏋️
                    </div>
                    <div>
                      <div className={`font-black ${isDark ? "text-white" : "text-slate-900"}`}>{trainer.name}</div>
                      <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{trainer.specialty}</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${trainer.phone}`}
                    className="bg-amber-500 text-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm"
                  >
                    Coach Call
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIET & WORKOUT ROUTINE */}
          {activeTab === "plan" && (
            <div className="space-y-4">
              {/* Header Title & Sub-toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-sm font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Nutrition & Training Split
                  </h4>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Assigned by {trainer ? trainer.name : "FitZone Head Coach"}
                  </p>
                </div>
                {member.ptBalance > 0 && (
                  <span className="text-[10px] font-black bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span>⭐ PT Active</span>
                    <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-black text-[9px]">{member.ptBalance} left</span>
                  </span>
                )}
              </div>

              {/* Sub-Switch: Diet Plan vs Workout Routine */}
              <div className={`grid grid-cols-2 gap-1 p-1 rounded-2xl border text-xs font-black ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
              }`}>
                <button
                  onClick={() => setPlanSubTab("diet")}
                  className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    planSubTab === "diet"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Apple className="w-3.5 h-3.5" />
                  <span>🥗 Diet Plan</span>
                </button>
                <button
                  onClick={() => setPlanSubTab("routine")}
                  className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    planSubTab === "routine"
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>🏋️‍♂️ Workout Split</span>
                </button>
              </div>

              {/* SUB-VIEW 1: DIET PLAN */}
              {planSubTab === "diet" && (
                <div className="space-y-3">
                  {memberDiet ? (
                    <>
                      {/* Diet Plan Summary Card */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        isDark ? "bg-slate-950 border-slate-800" : "bg-emerald-50/60 border-emerald-200"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            {memberDiet.preference}
                          </span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            💧 {memberDiet.water}
                          </span>
                        </div>
                        <h4 className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"} m-0`}>
                          {memberDiet.name}
                        </h4>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                          <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Calories</span>
                            <span className="text-xs font-black text-amber-500">{memberDiet.calories}</span>
                          </div>
                          <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Protein</span>
                            <span className="text-xs font-black text-emerald-500">{memberDiet.protein}</span>
                          </div>
                          <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Carbs</span>
                            <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>{memberDiet.carbs}</span>
                          </div>
                          <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Fats</span>
                            <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>{memberDiet.fats}</span>
                          </div>
                        </div>
                      </div>

                      {/* Meals Timeline */}
                      <div className="space-y-2.5">
                        <span className={`text-xs font-black uppercase tracking-wider block ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Daily Meal Schedule ({memberDiet.meals.length} Meals)
                        </span>

                        {memberDiet.meals.map((meal, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center text-[10px] font-black">
                                  {idx + 1}
                                </span>
                                <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                  {meal.name}
                                </span>
                              </div>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono">
                                {meal.protein}
                              </span>
                            </div>
                            <p className={`text-xs m-0 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {meal.items}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Coach WhatsApp Support Card */}
                      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <span className={`text-xs font-black block ${isDark ? "text-white" : "text-slate-900"}`}>
                              Have a diet question?
                            </span>
                            <span className={`text-[10px] block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              Ask coach {trainer ? trainer.name : "Vikram"} on WhatsApp
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/91${trainer ? trainer.phone.replace(/[^0-9]/g, "").slice(-10) : "9893011223"}?text=${encodeURIComponent(
                            `Hi Coach, I am ${member.name} (Member ID: ${member.id}). I have a question regarding my FitZone diet plan.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                        >
                          <span>Chat</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </>
                  ) : (
                    /* If no diet plan assigned */
                    <div className={`p-6 rounded-3xl border text-center space-y-4 ${
                      isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-md"
                    }`}>
                      <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                        <Apple className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"} m-0`}>
                          No Active Diet Plan Assigned
                        </h4>
                        <p className={`text-xs mt-1 m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Get a tailored Indian macro & calorie meal plan designed by certified trainers for your body goals.
                        </p>
                      </div>
                      <button
                        onClick={() => handleBuyAddOn({ id: "addon-diet-plan", name: "Customized Macro & Calorie Diet Plan", price: 999 })}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Order Custom Diet Plan — ₹999</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 2: WORKOUT ROUTINE */}
              {planSubTab === "routine" && (
                <div className="space-y-3">
                  {(() => {
                    const routine = memberRoutine || workoutRoutines[0];
                    if (!routine) return null;
                    const currentDayItem = routine.schedule[selectedRoutineDay] || routine.schedule[0];

                    return (
                      <>
                        <div className={`p-4 rounded-2xl border ${
                          isDark ? "bg-slate-950 border-slate-800" : "bg-amber-50/60 border-amber-200"
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                              Assigned Split
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              ⏱️ {currentDayItem.duration}
                            </span>
                          </div>
                          <h4 className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"} m-0`}>
                            {routine.name}
                          </h4>
                          <p className={`text-[11px] m-0 mt-1 line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {routine.description}
                          </p>
                        </div>

                        {/* Day Selector Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {routine.schedule.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedRoutineDay(idx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition cursor-pointer ${
                                selectedRoutineDay === idx
                                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                                  : isDark
                                  ? "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                              }`}
                            >
                              {item.day.split(" ")[0]}
                            </button>
                          ))}
                        </div>

                        {/* Day Muscle Focus */}
                        <div className="flex items-center justify-between px-1">
                          <span className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                            🎯 {currentDayItem.muscle}
                          </span>
                          <span className={`text-[10px] font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            {currentDayItem.exercises.length} Exercises
                          </span>
                        </div>

                        {/* Exercise Cards */}
                        <div className="space-y-2">
                          {currentDayItem.exercises.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className={`p-3.5 rounded-2xl border space-y-1.5 transition-all ${
                                isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center text-[10px] font-black">
                                    {exIdx + 1}
                                  </span>
                                  <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {ex.name}
                                  </span>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono">
                                  {ex.sets} × {ex.reps}
                                </span>
                              </div>
                              {ex.tip && (
                                <p className={`text-[11px] m-0 pl-7 leading-relaxed font-medium ${
                                  isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                  💡 <span className="italic">{ex.tip}</span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RENEWAL CHECKOUT */}
          {activeTab === "renew" && (
            <div className="space-y-4">
              <div>
                <h4 className={`text-sm font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Choose Membership Renewal
                </h4>
                <p className={`text-xs mt-0.5 m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Lock in discount before your plan expires
                </p>
              </div>

              {/* Plans selector */}
              <div className="space-y-2.5">
                {plans.map((p) => {
                  const isSelected = selectedPlanId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10"
                          : isDark
                          ? "bg-slate-950 border-slate-800 hover:border-slate-700"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          checked={isSelected}
                          onChange={() => setSelectedPlanId(p.id)}
                          className="accent-amber-500 w-4 h-4"
                        />
                        <div>
                          <div className={`text-xs font-black flex items-center gap-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                            <span>{p.name}</span>
                            {p.discountBadge && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                {p.discountBadge}
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {p.durationMonths} Months Access
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-amber-500">
                          {settings.currency}{p.price.toLocaleString("en-IN")}
                        </div>
                        <span className={`text-[10px] line-through ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          ₹{p.mrp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon Code"
                    className={`bg-transparent font-mono uppercase font-black outline-none w-24 text-xs ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  />
                </div>
                <button
                  onClick={() => setCouponApplied(couponCode.toUpperCase() === "FIT10")}
                  className="text-amber-500 font-black text-xs cursor-pointer"
                >
                  {couponApplied ? "✓ Applied (10% OFF)" : "Apply"}
                </button>
              </div>

              {/* Bill Breakdown */}
              {(() => {
                const plan = plans.find((p) => p.id === selectedPlanId) || plans[0];
                const discount = couponApplied ? Math.round(plan.price * 0.1) : 0;
                const finalAmount = plan.price - discount;

                return (
                  <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className={`flex justify-between ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      <span>Base Plan Price:</span>
                      <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>₹{plan.price}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Coupon "FIT10" (10%):</span>
                        <span>- ₹{discount}</span>
                      </div>
                    )}
                    <div className={`flex justify-between ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      <span>GST (Included):</span>
                      <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>18% Included</span>
                    </div>
                    <div className={`pt-2 border-t flex justify-between font-black text-sm ${
                      isDark ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
                    }`}>
                      <span>Total Payable:</span>
                      <span className="text-amber-500 font-black text-base">₹{finalAmount}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Pay Now Button */}
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay via UPI / GPay / PhonePe / Counter</span>
              </button>

              {paymentSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 rounded-2xl text-xs font-bold text-center">
                  Payment Verified! Receipt #{paymentSuccess.receiptNo}. Extended till {paymentSuccess.newExpiryDate}!
                </div>
              )}
            </div>
          )}

          {/* UPI Payment Modal */}
          <UpiPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            plan={plans.find((p) => p.id === selectedPlanId) || plans[0]}
            discount={couponApplied ? Math.round((plans.find((p) => p.id === selectedPlanId)?.price || 0) * 0.1) : 0}
            finalAmount={
              (plans.find((p) => p.id === selectedPlanId)?.price || 0) -
              (couponApplied ? Math.round((plans.find((p) => p.id === selectedPlanId)?.price || 0) * 0.1) : 0)
            }
            member={member}
            onSuccess={(res) => {
              setPaymentSuccess(res);
              setTimeout(() => {
                setPaymentSuccess(null);
                setActiveTab("home");
              }, 3000);
            }}
          />

          {/* TAB 3: STORE / ADD-ONS */}
          {activeTab === "shop" && (
            <div className="space-y-3">
              <h4 className={`text-sm font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                Add-On Fuel & Marketplace
              </h4>
              <p className={`text-xs m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Personal coaching, nutrition diet plans & supplements
              </p>

              <div className="space-y-2.5 mt-2">
                {addOns.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 border flex items-center justify-between gap-3 transition-all ${
                      isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                        {item.name}
                      </div>
                      <p className={`text-[10px] m-0 mt-0.5 line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {item.description}
                      </p>
                      <div className="text-xs font-black text-amber-500 mt-1">
                        ₹{item.price}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyAddOn(item)}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-black px-3.5 py-2 rounded-xl text-xs whitespace-nowrap cursor-pointer transition shadow-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <h4 className={`text-sm font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                Attendance Turnstile History
              </h4>
              <p className={`text-xs m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                All verified visits to {settings.gymName}
              </p>

              <div className="space-y-2 mt-2">
                {memberCheckins.length === 0 ? (
                  <div className={`py-8 text-center text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    No check-in entries logged yet. Tap "Tap to Scan Gym Counter QR" to mark attendance!
                  </div>
                ) : (
                  memberCheckins.map((chk) => (
                    <div
                      key={chk.id}
                      className={`rounded-2xl p-3.5 border flex items-center justify-between text-xs ${
                        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                          ✓
                        </div>
                        <div>
                          <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{chk.date}</div>
                          <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{chk.method}</div>
                        </div>
                      </div>
                      <span className={`font-mono font-bold text-[11px] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {chk.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Footer branding */}
        <div className={`p-3 text-center border-t text-[10px] font-bold ${
          isDark ? "bg-slate-950 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"
        }`}>
          ⚡ Powered by {settings.gymName} Athlete Suite
        </div>
      </div>
    </div>
  );
}
