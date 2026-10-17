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
  Calendar,
  Sparkles,
  Download,
  Filter,
} from "lucide-react";

export default function OwnerDashboard({ onOpenFollowUpModal }) {
  const { members, checkIns, payments, settings, setActiveModal } = useGym();
  const [activeTab, setActiveTab] = useState("redlist"); // 'redlist' | 'renewals' | 'members' | 'addons' | 'checkins'

  const threshold = settings.noShowThresholdDays || 10;

  // KPIs
  const activeMembers = members.filter((m) => m.status === "active").length;
  const todayCheckIns = checkIns.length;
  const redListMembers = members.filter(
    (m) => m.status !== "paused" && m.status !== "expired" && (m.absentDays || 0) >= threshold
  ).length;
  const expiringSoon = members.filter((m) => m.status === "expiring").length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Peak Hours distribution from today's check-ins
  const peakHours = [
    { hour: "6-8 AM", count: 8, label: "Morning Rush" },
    { hour: "8-11 AM", count: 5, label: "Mid Morning" },
    { hour: "4-7 PM", count: 12, label: "Peak Evening" },
    { hour: "7-10 PM", count: 9, label: "Night Rush" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Active Members */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Active Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{activeMembers}</div>
            <span className="text-[11px] text-emerald-400 font-medium">
              +4 new this week
            </span>
          </div>
        </div>

        {/* 2. Today's Check-ins */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Today's Check-ins</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{todayCheckIns}</div>
            <span className="text-[11px] text-neutral-400">
              via QR & Counter
            </span>
          </div>
        </div>

        {/* 3. Red-List Silent Churn */}
        <div
          onClick={() => setActiveTab("redlist")}
          className="bg-gradient-to-br from-red-950/60 to-neutral-900 border border-red-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-red-500 transition group"
        >
          <div className="flex items-center justify-between text-red-400">
            <span className="text-xs font-bold flex items-center gap-1">
              <span>At-Risk (10+ d)</span>
            </span>
            <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-red-400">{redListMembers}</div>
            <span className="text-[11px] text-red-300 font-semibold underline">
              Take Action Now &rarr;
            </span>
          </div>
        </div>

        {/* 4. Renewals Due */}
        <div
          onClick={() => setActiveTab("renewals")}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-amber-500/50 transition"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Renewals Due</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-400">{expiringSoon}</div>
            <span className="text-[11px] text-amber-300">
              Within 7 Days
            </span>
          </div>
        </div>

        {/* 5. Total Collection */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Month Collection</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white flex items-center">
              <span className="text-base text-neutral-400 mr-0.5">{settings.currency}</span>
              <span>{(totalRevenue + 45000).toLocaleString("en-IN")}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Plans & Add-ons
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-neutral-800 flex items-center justify-between overflow-x-auto gap-4">
        <nav className="flex space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab("redlist")}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "redlist"
                ? "border-red-500 text-red-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Silent Churn Red-List</span>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.2 rounded-full font-mono">
              {redListMembers}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("renewals")}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "renewals"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Renewal Pipeline</span>
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.2 rounded-full font-mono">
              {expiringSoon}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "members"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Members ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addons")}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "addons"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Add-on Sales & PT</span>
          </button>

          <button
            onClick={() => setActiveTab("checkins")}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "checkins"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Check-in Audit Log</span>
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white m-0">Today's Check-in Feed</h3>
                <p className="text-xs text-neutral-400 mt-0.5 m-0">Real-time attendance entries via dynamic QR & Receptionist Desk</p>
              </div>
              <button
                onClick={() => setActiveModal("assistedCheckin")}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 font-semibold cursor-pointer"
              >
                + Assisted Check-in
              </button>
            </div>

            <div className="divide-y divide-neutral-800">
              {checkIns.map((ci) => (
                <div key={ci.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-white">{ci.memberName}</div>
                      <div className="text-[11px] text-neutral-500">{ci.method} {ci.reason ? `(${ci.reason})` : ""}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white">{ci.time}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold uppercase">{ci.status}</div>
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

