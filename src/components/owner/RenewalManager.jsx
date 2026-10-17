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
} from "lucide-react";

export default function RenewalManager() {
  const { members, plans, renewMembership, settings } = useGym();
  const [filterPeriod, setFilterPeriod] = useState("7"); // '3' | '7' | '14' | 'expired'
  const [search, setSearch] = useState("");
  const [renewingId, setRenewingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

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
      // Exclude paused
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
        <div className="bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Expected Renewal Pipeline</span>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center">
              <IndianRupee className="w-5 h-5" />
              <span>{totalPipelineRevenue.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Based on members due for renewal in selected range
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <CalendarClock className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Members Due For Renewal</span>
            <div className="text-2xl font-black text-white mt-1">
              {renewalMembers.length} <span className="text-sm font-normal text-neutral-400">members</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Automated reminders prevent lapse
            </p>
          </div>
          <div className="p-3 bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-700">
            <RefreshCw className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Auto-Discount Incentive</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              "FIT10" (10% OFF)
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Embedded in WhatsApp reminder link
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle className="w-7 h-7" />
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800 overflow-x-auto">
          <button
            onClick={() => setFilterPeriod("3")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "3" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Due in 3 Days (Urgent)
          </button>
          <button
            onClick={() => setFilterPeriod("7")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "7" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Due in 7 Days
          </button>
          <button
            onClick={() => setFilterPeriod("14")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "14" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Due in 14 Days
          </button>
          <button
            onClick={() => setFilterPeriod("expired")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterPeriod === "expired" ? "bg-red-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Already Expired
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Renewal Table / List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Member</th>
                <th className="py-3.5 px-4 font-semibold">Current Plan</th>
                <th className="py-3.5 px-4 font-semibold">Expiry Date</th>
                <th className="py-3.5 px-4 font-semibold">Days Left</th>
                <th className="py-3.5 px-4 font-semibold">Renewal Value</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {renewalMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-neutral-500">
                    No members match this renewal window.
                  </td>
                </tr>
              ) : (
                renewalMembers.map((member) => {
                  const isOverdue = member.daysLeft < 0;
                  const isUrgent = member.daysLeft <= 3 && member.daysLeft >= 0;

                  return (
                    <tr key={member.id} className="hover:bg-neutral-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-xl object-cover border border-neutral-700"
                          />
                          <div>
                            <div className="font-bold text-white">{member.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">{member.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-neutral-200">
                        {member.plan?.name || "Standard Plan"}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-neutral-300">
                        {member.expiryDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isOverdue
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : isUrgent
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-neutral-800 text-neutral-300"
                          }`}
                        >
                          {isOverdue ? `${Math.abs(member.daysLeft)}d Expired` : `${member.daysLeft} days left`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-amber-400">
                        {settings.currency}{member.plan?.price.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* WhatsApp Reminder */}
                          <a
                            href={getRenewalWaLink(member)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Send WhatsApp renewal message"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Quick Renew at Counter */}
                          <button
                            onClick={() => handleQuickRenew(member, member.planId)}
                            disabled={renewingId === member.id}
                            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
                            title="Collect payment & extend membership"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Renew</span>
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

