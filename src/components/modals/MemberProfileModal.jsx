import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  X,
  User,
  Phone,
  Flame,
  Calendar,
  CheckCircle,
  CreditCard,
  IndianRupee,
  FileText,
  Printer,
  Sparkles,
  Dumbbell,
  Apple,
  MessageSquare,
  Clock,
  Plus,
  Minus,
  Edit2,
  Check,
  ShoppingBag,
} from "lucide-react";
import InvoiceModal from "./InvoiceModal";

export default function MemberProfileModal({ member, onClose, onEdit }) {
  const {
    plans,
    trainers,
    dietPlans = [],
    workoutRoutines = [],
    payments = [],
    deductPtSession,
    addPtSessions,
    processCheckIn,
    theme,
    settings,
  } = useGym();

  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("purchases"); // 'purchases' | 'diet' | 'workout' | 'pt'
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  if (!member) return null;

  const plan = plans.find((p) => p.id === member.planId);
  const trainer = trainers.find((t) => t.id === member.assignedTrainerId);
  const dietPlan = dietPlans.find((d) => d.id === member.dietPlanId) || dietPlans[0];
  const workoutRoutine = workoutRoutines.find((w) => w.id === member.workoutSplitId) || workoutRoutines[0];

  // All payments / purchases associated with this specific member
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const totalLifetimeSpend = memberPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleDeductSession = () => {
    if (!member.ptBalance || member.ptBalance <= 0) {
      alert("No active PT sessions left to deduct!");
      return;
    }
    const ok = deductPtSession(member.id);
    if (ok) {
      setToastMsg(`✅ 1 PT session deducted for ${member.name}. Balance: ${member.ptBalance - 1} left.`);
      setTimeout(() => setToastMsg(""), 3500);
    }
  };

  const handleAddSessions = (count, fee) => {
    const res = addPtSessions(member.id, count, fee, "UPI (Desk)");
    if (res?.success) {
      setToastMsg(`✅ Added +${count} PT sessions for ${member.name}! Bill generated: ₹${fee}`);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  const handleQuickCheckin = () => {
    const res = processCheckIn(member.id, "Staff Assisted", "Member Profile Desk Check-in");
    if (res.success) {
      setToastMsg(`✅ Attendance marked for ${member.name}!`);
      setTimeout(() => setToastMsg(""), 3500);
    } else {
      alert(res.message);
    }
  };

  // WhatsApp Diet Share
  const handleShareDietWhatsApp = () => {
    if (!dietPlan) return;
    let msg = `🥗 *${settings.gymName} — Personalized Diet Plan for ${member.name}*\n`;
    msg += `🎯 *Goal:* ${dietPlan.name} (${dietPlan.preference})\n`;
    msg += `🔥 *Daily Targets:* ${dietPlan.calories} | Protein: ${dietPlan.protein} | Carbs: ${dietPlan.carbs} | Fats: ${dietPlan.fats}\n`;
    msg += `💧 *Hydration:* ${dietPlan.water}\n\n`;
    msg += `📋 *Daily Meal Schedule:*\n`;
    dietPlan.meals.forEach((m, idx) => {
      msg += `\n*${idx + 1}. ${m.name}* (${m.protein})\n👉 ${m.items}\n`;
    });
    msg += `\n💪 Consistency is key! For any workout or diet queries, contact coach ${trainer ? trainer.name : "Vikram"}.\n`;

    const cleanPhone = member.phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`rounded-3xl max-w-2xl w-full border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-all animate-in fade-in duration-200 ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-start justify-between gap-4 ${
          isDark ? "border-slate-800 bg-slate-950/70" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="flex items-center gap-3.5">
            <img
              src={member.avatar}
              alt={member.name}
              className={`w-14 h-14 rounded-2xl object-cover border-2 shrink-0 ${
                isDark ? "border-amber-500/40" : "border-amber-400 shadow-md"
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black m-0 leading-tight">{member.name}</h3>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1">
                <span className={`font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {member.phone}
                </span>
                <span className="text-amber-500 font-bold">•</span>
                <span className={`font-mono text-[11px] ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  ID: {member.id.toUpperCase()}
                </span>
                <span className="text-amber-500 font-bold">•</span>
                <span className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {plan?.name || "Standard Membership"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(member);
                }}
                className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  isDark ? "bg-slate-800 text-amber-400 border-slate-700 hover:text-white" : "bg-slate-100 text-amber-600 border-slate-300 hover:bg-slate-200"
                }`}
                title="Edit Details"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isDark ? "bg-slate-800 text-slate-400 hover:text-white border-slate-700" : "bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-300"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-600 dark:text-emerald-300 px-5 py-2.5 text-xs font-bold flex items-center justify-between animate-pulse">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg("")} className="underline text-[11px] cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Quick KPI Strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-3.5 border-b text-center text-xs ${
          isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-100/50 border-slate-200"
        }`}>
          <div className={`p-2 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Gym Streak
            </span>
            <span className="text-sm font-black text-amber-500 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>{member.streak || 0} Days</span>
            </span>
          </div>

          <div className={`p-2 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Total Visits
            </span>
            <span className={`text-sm font-black mt-0.5 block ${isDark ? "text-white" : "text-slate-900"}`}>
              {member.totalVisits || 0} Entries
            </span>
          </div>

          <div className={`p-2 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              PT Balance
            </span>
            <span className={`text-sm font-black mt-0.5 block ${
              (member.ptBalance || 0) > 0 ? "text-amber-500" : isDark ? "text-slate-500" : "text-slate-400"
            }`}>
              {(member.ptBalance || 0) > 0 ? `🏋️ ${member.ptBalance} Sessions` : "None"}
            </span>
          </div>

          <div className={`p-2 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Lifetime Spend
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              ₹{totalLifetimeSpend.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center gap-1.5 p-2 border-b overflow-x-auto scrollbar-none ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "purchases"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🧾 Purchases & Bills ({memberPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("diet")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "diet"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>🥗 Diet Plan</span>
          </button>

          <button
            onClick={() => setActiveTab("workout")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "workout"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>🏋️ Workout Routine</span>
          </button>

          <button
            onClick={() => setActiveTab("pt")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "pt"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⭐ PT Coaching ({member.ptBalance || 0})</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: PURCHASES & BILLING RECORDS */}
          {activeTab === "purchases" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-sm font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Member Billing & Purchase Ledger
                  </h4>
                  <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Membership plans, personal training, supplements aur diet purchases ka complete record
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Total Revenue
                  </span>
                  <span className="text-base font-black text-amber-500">
                    ₹{totalLifetimeSpend.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {memberPayments.length === 0 ? (
                <div className={`p-8 text-center text-xs rounded-2xl border ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"
                }`}>
                  No purchases or transactions recorded yet for this athlete.
                </div>
              ) : (
                <div className={`rounded-2xl border overflow-hidden ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <table className="w-full text-left text-xs">
                    <thead className={`text-[10px] uppercase tracking-wider font-bold border-b ${
                      isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Item / Service Billed</th>
                        <th className="py-2.5 px-3">Payment Mode</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                      {memberPayments.map((p) => (
                        <tr key={p.id} className={`transition ${isDark ? "hover:bg-slate-900/50" : "hover:bg-slate-50"}`}>
                          <td className={`py-3 px-3 font-mono text-[11px] whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {p.date}
                          </td>
                          <td className="py-3 px-3">
                            <div className={`font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                              {p.planName}
                            </div>
                            <span className="text-[10px] font-mono text-amber-500">
                              #{p.receiptNo}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.method.toLowerCase().includes("upi") || p.method.toLowerCase().includes("pay")
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                            }`}>
                              {p.method}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-amber-500">
                            ₹{p.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setActiveInvoice(p)}
                              className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl text-[11px] font-black inline-flex items-center gap-1 transition cursor-pointer"
                              title="View and Print GST Invoice"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Bill</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIET PLAN */}
          {activeTab === "diet" && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-emerald-50/50 border-emerald-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {dietPlan.preference}
                  </span>
                  <span className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    💧 Daily Water: {dietPlan.water}
                  </span>
                </div>
                <h4 className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"} m-0`}>
                  {dietPlan.name}
                </h4>

                {/* Macros Breakdown */}
                <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                  <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Calories</span>
                    <span className="text-xs font-black text-amber-500">{dietPlan.calories}</span>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Protein</span>
                    <span className="text-xs font-black text-emerald-500">{dietPlan.protein}</span>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Carbs</span>
                    <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>{dietPlan.carbs}</span>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Fats</span>
                    <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>{dietPlan.fats}</span>
                  </div>
                </div>
              </div>

              {/* 6 Meals Schedule */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Assigned Daily Meal Schedule ({dietPlan.meals.length} Meals)
                  </span>
                  <button
                    onClick={handleShareDietWhatsApp}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </button>
                </div>

                {dietPlan.meals.map((meal, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border space-y-1 ${
                      isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
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
                    <p className={`text-xs m-0 pl-7 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {meal.items}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WORKOUT ROUTINE */}
          {activeTab === "workout" && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-amber-50/60 border-amber-200"
              }`}>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Assigned Training Split
                </span>
                <h4 className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"} m-0 mt-2`}>
                  {workoutRoutine.name}
                </h4>
                <p className={`text-xs mt-1 m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {workoutRoutine.description}
                </p>
              </div>

              {/* Workout Days List */}
              <div className="space-y-3">
                {workoutRoutine.schedule.map((dayItem, dIdx) => (
                  <div
                    key={dIdx}
                    className={`p-3.5 rounded-2xl border space-y-2 ${
                      isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 border-slate-800/40">
                      <div>
                        <span className="text-xs font-black text-amber-500 uppercase tracking-wide">
                          {dayItem.day}
                        </span>
                        <h5 className={`text-xs font-bold m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                          🎯 {dayItem.muscle}
                        </h5>
                      </div>
                      <span className={`text-[10px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        ⏱️ {dayItem.duration}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {dayItem.exercises.map((ex, eIdx) => (
                        <div key={eIdx} className="flex items-center justify-between text-xs">
                          <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                            • {ex.name}
                          </span>
                          <span className="font-mono text-[11px] text-amber-500 font-bold">
                            {ex.sets} × {ex.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERSONAL TRAINING (PT) DESK */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div className={`p-4 rounded-3xl border-2 transition-all ${
                (member.ptBalance || 0) > 0
                  ? isDark
                    ? "bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50"
                    : "bg-gradient-to-br from-amber-50 via-orange-50/50 to-white border-amber-400 shadow-md"
                  : isDark
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    ⭐ 1-on-1 Personal Training Desk
                  </span>
                  <span className="text-xs font-black text-amber-500 bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/30 font-mono">
                    {member.ptBalance || 0} Sessions Left
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className={`text-[10px] font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Assigned Coach
                    </span>
                    <div className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                      {trainer ? trainer.name : "No Coach Assigned"}
                    </div>
                    <span className="text-xs text-amber-500 font-semibold">
                      {trainer ? trainer.specialty : "General Gym Floor"}
                    </span>
                  </div>

                  {trainer && (
                    <a
                      href={`tel:${trainer.phone}`}
                      className="px-3 py-1.5 bg-amber-500 text-black text-xs font-black rounded-xl shadow-sm"
                    >
                      Call Coach
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Session Adjustment Controls */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <h5 className={`text-xs font-black uppercase tracking-wider m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Desk PT Session Management
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleDeductSession}
                    disabled={!member.ptBalance || member.ptBalance <= 0}
                    className="p-3 rounded-xl border border-red-500/30 bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                    <span>Deduct 1 Session (Done)</span>
                  </button>

                  <button
                    onClick={() => handleAddSessions(6, 2500)}
                    className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+6 Sessions (₹2,500)</span>
                  </button>

                  <button
                    onClick={() => handleAddSessions(12, 4999)}
                    className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+12 Sessions (₹4,999)</span>
                  </button>
                </div>

                <p className={`text-[11px] m-0 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  💡 Session add karne par system automatically bill banata hai aur gym revenue me paisa add hota hai!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Quick Actions */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickCheckin}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Mark Entry (Check-in)</span>
            </button>
            <a
              href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Athlete</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
              isDark ? "bg-slate-800 text-slate-300 border-slate-700 hover:text-white" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            Close Profile
          </button>
        </div>
      </div>

      {/* Invoice Modal if viewing bill */}
      {activeInvoice && (
        <InvoiceModal
          payment={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
}
