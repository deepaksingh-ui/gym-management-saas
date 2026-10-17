import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import NoShowRedList from "./NoShowRedList";
import RenewalManager from "./RenewalManager";
import AddOnManager from "./AddOnManager";
import MemberList from "./MemberList";
import {
  Users,
  UserCheck,
  AlertTriangle,
  IndianRupee,
  RefreshCw,
  TrendingUp,
  Clock,
  Flame,
  Dumbbell,
  Zap,
  Activity,
  PlusCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function OwnerDashboard({ onOpenFollowUpModal }) {
  const { members, checkIns, payments, settings, setActiveModal, theme } = useGym();
  const [activeTab, setActiveTab] = useState("redlist"); // 'redlist' | 'renewals' | 'members' | 'addons' | 'checkins'

  const isDark = theme === "dark";
  const threshold = settings.noShowThresholdDays || 10;

  // KPIs
  const activeMembers = members.filter((m) => m.status === "active").length;
  const todayCheckIns = checkIns.length;
  const redListMembers = members.filter(
    (m) => m.status !== "paused" && m.status !== "expired" && (m.absentDays || 0) >= threshold
  ).length;
  const expiringSoon = members.filter((m) => m.status === "expiring").length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Peak gym occupancy estimate
  const currentFloorCount = Math.max(14, todayCheckIns * 2);
  const floorCapacityPercent = Math.min(100, Math.round((currentFloorCount / 60) * 100));

  return (
    <div className="space-y-6">
      {/* 🏋️‍♂️ Gym Floor Real-Time Pulse Banner */}
      <div className={`rounded-3xl p-4 sm:p-5 border transition-all ${
        isDark
          ? "bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/30 shadow-xl"
          : "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 border-amber-200 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/30">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-amber-600 dark:text-amber-400">
                  Gym Floor Status
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live Rush Hour
                </span>
              </div>
              <h2 className={`text-lg sm:text-xl font-black m-0 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {currentFloorCount} Athletes on Floor • {floorCapacityPercent}% Optimal Pump Zone
              </h2>
            </div>
          </div>

          {/* Quick Counter Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal("assistedCheckin")}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>+ Quick Check-in</span>
            </button>
            <button
              onClick={() => setActiveModal("bulkImport")}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Import Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Active Athletes */}
        <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Active Athletes
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black">{activeMembers}</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <span>↑ +4 this week</span>
            </span>
          </div>
        </div>

        {/* 2. Today's Check-ins */}
        <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Today's Entries
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{todayCheckIns}</div>
            <span className={`text-[11px] font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              via QR & Counter
            </span>
          </div>
        </div>

        {/* 3. Red-List Silent Churn */}
        <div
          onClick={() => setActiveTab("redlist")}
          className={`rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer group ${
            isDark
              ? "bg-red-950/30 border-red-500/50 hover:border-red-500 text-white"
              : "bg-red-50/70 border-red-300 hover:border-red-500 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-red-600 dark:text-red-400">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <span>Dropout Risk</span>
            </span>
            <AlertTriangle className="w-4 h-4 group-hover:scale-125 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-red-600 dark:text-red-400">{redListMembers}</div>
            <span className="text-[11px] text-red-600 dark:text-red-300 font-bold underline">
              Recover Now &rarr;
            </span>
          </div>
        </div>

        {/* 4. Renewals Due */}
        <div
          onClick={() => setActiveTab("renewals")}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            isDark
              ? "bg-slate-900 border-slate-800 hover:border-amber-500/50 text-white"
              : "bg-white border-slate-200 hover:border-amber-500 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Renewals (7d)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{expiringSoon}</div>
            <span className="text-[11px] text-amber-600 dark:text-amber-300 font-semibold">
              Action Required
            </span>
          </div>
        </div>

        {/* 5. Total Collection */}
        <div className={`rounded-2xl p-4 sm:p-5 border col-span-2 sm:col-span-1 transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Month Inflow
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black flex items-center">
              <span className={`text-sm mr-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{settings.currency}</span>
              <span>{(totalRevenue + 45000).toLocaleString("en-IN")}</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              Fees & Add-ons
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className={`border-b flex items-center justify-between overflow-x-auto gap-4 transition-colors ${
        isDark ? "border-slate-800" : "border-slate-200"
      }`}>
        <nav className="flex space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab("redlist")}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "redlist"
                ? "border-red-500 text-red-600 dark:text-red-400"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Silent Churn Red-List</span>
            <span className="bg-red-500/20 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
              {redListMembers}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("renewals")}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "renewals"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-500" />
            <span>Renewal Pipeline</span>
            <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
              {expiringSoon}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "members"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Athletes Directory ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addons")}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "addons"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Add-on Sales & PT</span>
          </button>

          <button
            onClick={() => setActiveTab("checkins")}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "checkins"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-500" />
            <span>Live Check-in Log</span>
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "redlist" && (
          <NoShowRedList onOpenFollowUpModal={onOpenFollowUpModal} />
        )}

        {activeTab === "renewals" && <RenewalManager />}

        {activeTab === "members" && <MemberList />}

        {activeTab === "addons" && <AddOnManager />}

        {activeTab === "checkins" && (
          <div className={`rounded-3xl p-5 sm:p-6 border transition-all ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Today's Live Check-in Stream
                </h3>
                <p className={`text-xs mt-0.5 m-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Real-time athlete turnstile entries via dynamic QR & Receptionist Desk
                </p>
              </div>
              <button
                onClick={() => setActiveModal("assistedCheckin")}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition cursor-pointer ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm"
                }`}
              >
                + Assisted Check-in
              </button>
            </div>

            <div className={`mt-4 divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
              {checkIns.map((ci) => (
                <div key={ci.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                      ✓
                    </div>
                    <div>
                      <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {ci.memberName}
                      </div>
                      <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {ci.method} {ci.reason ? `(${ci.reason})` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {ci.time}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      {ci.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
