import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  CalendarClock,
  IndianRupee,
  MessageCircle,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Search,
  Sparkles,
} from "lucide-react";

export default function RenewalManager() {
  const { members, plans, renewMembership, settings, theme } = useGym();
  const [filterPeriod, setFilterPeriod] = useState("7"); // '3' | '7' | '14' | 'expired'
  const [search, setSearch] = useState("");
  const [renewingId, setRenewingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const isDark = theme === "dark";
  const today = new Date();

  // Helper to calculate days remaining
  const getDaysLeft = (expiryDateStr) => {
    const expiry = new Date(expiryDateStr);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter members based on expiry
  const renewalMembers = members
    .map((m) => ({
      ...m,
      daysLeft: getDaysLeft(m.expiryDate),
      plan: plans.find((p) => p.id === m.planId) || plans[0],
    }))
    .filter((m) => {
      if (m.status === "paused") return false;

      if (filterPeriod === "3") return m.daysLeft >= 0 && m.daysLeft <= 3;
      if (filterPeriod === "7") return m.daysLeft >= 0 && m.daysLeft <= 7;
      if (filterPeriod === "14") return m.daysLeft >= 0 && m.daysLeft <= 14;
      if (filterPeriod === "expired") return m.daysLeft < 0;
      return true;
    })
    .filter((m) => {
      if (!search.trim()) return true;
      return (
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.includes(search)
      );
    });

  // Calculate Pipeline Expected Collection
  const totalPipelineRevenue = renewalMembers.reduce(
    (sum, m) => sum + (m.plan ? m.plan.price : 1500),
    0
  );

  // WhatsApp renewal reminder
  const getRenewalWaLink = (member) => {
    const cleanPhone = member.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Namaste ${member.name} ji! 🙏\n\n${settings.gymName} se reminder: Aapka gym membership plan ${member.daysLeft <= 0 ? "expire ho chuka hai" : `${member.daysLeft} din mein (${member.expiryDate}) expire ho raha hai`}.\n\n💥 Early Renewal Offer: Aaj hi renew karein aur payein FLAT 10% OFF code "FIT10" ke saath!\n\nUPI se pay karne ke liye humara ID: ${settings.upiId}\nAap counter par aakar bhi renew kar sakte hain. Thank you!`
    );
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  // Handle instant counter renewal
  const handleQuickRenew = (member, planId) => {
    setRenewingId(member.id);
    const res = renewMembership(member.id, planId, "Cash/Counter UPI");
    if (res.success) {
      setSuccessMsg(`Successfully renewed ${member.name}'s membership! Receipt #${res.receiptNo}`);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
    setRenewingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Pipeline Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark
            ? "bg-slate-900 border-amber-500/30 text-white"
            : "bg-white border-amber-300 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Expected Renewal Pipeline
            </span>
            <div className="text-3xl font-black text-amber-500 mt-1 flex items-center">
              <IndianRupee className="w-6 h-6" />
              <span>{totalPipelineRevenue.toLocaleString("en-IN")}</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Due for renewal in selected range
            </p>
          </div>
          <div className="p-3 bg-amber-500/15 text-amber-500 rounded-2xl border border-amber-500/30">
            <CalendarClock className="w-7 h-7" />
          </div>
        </div>

        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Athletes Due For Renewal
            </span>
            <div className="text-3xl font-black mt-1">
              {renewalMembers.length} <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>athletes</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Automated reminders prevent lapse
            </p>
          </div>
          <div className={`p-3 rounded-2xl border ${
            isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200"
          }`}>
            <RefreshCw className="w-7 h-7" />
          </div>
        </div>

        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Renewal Incentive
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              "FIT10" (10% OFF)
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Pre-filled in 1-tap WhatsApp reminder
            </p>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-2xl border border-emerald-500/30">
            <CheckCircle className="w-7 h-7" />
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            onClick={() => setFilterPeriod("3")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "3"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Due in 3 Days (Urgent)
          </button>
          <button
            onClick={() => setFilterPeriod("7")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "7"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Due in 7 Days
          </button>
          <button
            onClick={() => setFilterPeriod("14")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "14"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Due in 14 Days
          </button>
          <button
            onClick={() => setFilterPeriod("expired")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "expired"
                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Already Expired
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Search athlete name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`rounded-2xl pl-9 pr-4 py-2 text-xs font-bold outline-none border transition-colors w-full sm:w-64 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm focus:border-amber-500"
            }`}
          />
        </div>
      </div>

      {/* Renewal Table / List */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="overflow-x-auto">
          <table className={`w-full text-left text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <thead className={`uppercase text-[10px] tracking-wider border-b font-black ${
              isDark ? "bg-slate-950/80 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-600 border-slate-200"
            }`}>
              <tr>
                <th className="py-3.5 px-4 font-bold">Athlete</th>
                <th className="py-3.5 px-4 font-bold">Current Plan</th>
                <th className="py-3.5 px-4 font-bold">Expiry Date</th>
                <th className="py-3.5 px-4 font-bold">Days Left</th>
                <th className="py-3.5 px-4 font-bold">Renewal Value</th>
                <th className="py-3.5 px-4 font-bold text-right">Desk Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
              {renewalMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`py-10 text-center text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    No athletes match this renewal window.
                  </td>
                </tr>
              ) : (
                renewalMembers.map((member) => {
                  const isOverdue = member.daysLeft < 0;
                  const isUrgent = member.daysLeft <= 3 && member.daysLeft >= 0;

                  return (
                    <tr key={member.id} className={`transition ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className={`w-9 h-9 rounded-2xl object-cover border ${isDark ? "border-slate-700" : "border-slate-200 shadow-sm"}`}
                          />
                          <div>
                            <div className={`font-black ${isDark ? "text-white" : "text-slate-900"}`}>{member.name}</div>
                            <div className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>{member.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className={`py-3.5 px-4 font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        {member.plan?.name || "Standard Plan"}
                      </td>

                      <td className={`py-3.5 px-4 font-mono font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {member.expiryDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            isOverdue
                              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                              : isUrgent
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                              : isDark
                              ? "bg-slate-800 text-slate-300"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {isOverdue ? `${Math.abs(member.daysLeft)}d Expired` : `${member.daysLeft} days left`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-amber-500">
                        ₹{member.plan?.price || 1500}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={getRenewalWaLink(member)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
                            title="Send WhatsApp renewal offer with 10% OFF"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => handleQuickRenew(member, member.planId)}
                            disabled={renewingId === member.id}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-black px-3 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
                          >
                            {renewingId === member.id ? "Renewing..." : "Collect Fee"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
