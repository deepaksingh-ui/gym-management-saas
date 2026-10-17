import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  Search,
  Filter,
  UserCheck,
  PauseCircle,
  PlayCircle,
  Flame,
  Award,
  Calendar,
  Phone,
  FileText,
  Upload,
  Edit2,
  Dumbbell,
  Eye,
} from "lucide-react";
import EditMemberModal from "../modals/EditMemberModal";
import MemberProfileModal from "../modals/MemberProfileModal";

export default function MemberList() {
  const { members, plans, processCheckIn, togglePauseMember, setActiveModal, setActiveInvoice, payments, theme } = useGym();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMsg, setActionMsg] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [selectedProfileMember, setSelectedProfileMember] = useState(null);

  const isDark = theme === "dark";

  const filteredMembers = members.filter((m) => {
    // Status filter
    if (statusFilter !== "all" && m.status !== statusFilter) return false;

    // Search filter
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.email?.toLowerCase().includes(q)
    );
  });

  const handleQuickCheckin = (member) => {
    const res = processCheckIn(member.id, "Staff Assisted", "Desk quick entry");
    if (res.success) {
      setActionMsg(`✅ ${member.name} checked in successfully!`);
      setTimeout(() => setActionMsg(""), 3500);
    } else {
      alert(res.message);
    }
  };

  const handleTogglePause = (member) => {
    const isPaused = member.status === "paused";
    const promptMsg = isPaused
      ? `Resume membership for ${member.name}?`
      : `Pause membership for ${member.name}? (Enter reason e.g. Ankle injury, College exams):`;
    
    if (isPaused) {
      if (window.confirm(promptMsg)) {
        togglePauseMember(member.id);
        setActionMsg(`Membership resumed for ${member.name}!`);
        setTimeout(() => setActionMsg(""), 3500);
      }
    } else {
      const reason = window.prompt(promptMsg, "Medical / Travel leave");
      if (reason !== null) {
        togglePauseMember(member.id, reason);
        setActionMsg(`Membership paused for ${member.name}!`);
        setTimeout(() => setActionMsg(""), 3500);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {actionMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 p-3 rounded-2xl text-xs font-black animate-pulse flex items-center justify-between shadow-lg">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg("")} className="text-xs font-bold underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder="Search by athlete name, mobile (+91), or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none border transition-colors ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm focus:border-amber-500"
              }`}
            />
          </div>

          <button
            onClick={() => setActiveModal("bulkImport")}
            className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 shadow-sm"
            title="Import Client Members from Excel or CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Import Sheet</span>
          </button>
        </div>

        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          {["all", "active", "expiring", "paused", "expired"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st} ({members.filter((m) => (st === "all" ? true : m.status === st)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="overflow-x-auto">
          <table className={`w-full text-left text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <thead className={`uppercase text-[10px] tracking-wider border-b font-black ${
              isDark ? "bg-slate-950/80 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-600 border-slate-200"
            }`}>
              <tr>
                <th className="py-3.5 px-4 font-bold">Athlete Details</th>
                <th className="py-3.5 px-4 font-bold">Membership Plan</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Streak & Visits</th>
                <th className="py-3.5 px-4 font-bold">Expiry Date</th>
                <th className="py-3.5 px-4 font-bold text-right">Desk Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`py-12 text-center text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    No athletes found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const plan = plans.find((p) => p.id === member.planId);

                  return (
                    <tr key={member.id} className={`transition ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                      <td
                        className="py-3.5 px-4 cursor-pointer group"
                        onClick={() => setSelectedProfileMember(member)}
                        title="Click to view full athlete profile, diet & purchases"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className={`w-10 h-10 rounded-2xl object-cover border transition group-hover:scale-105 ${isDark ? "border-slate-700" : "border-slate-200 shadow-sm"}`}
                          />
                          <div>
                            <div className={`font-black flex items-center gap-2 transition group-hover:text-amber-500 ${isDark ? "text-white" : "text-slate-900"}`}>
                              <span>{member.name}</span>
                              {member.absentDays >= 10 && member.status === "active" && (
                                <span className="text-[10px] bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-black">
                                  Absent {member.absentDays}d
                                </span>
                              )}
                            </div>
                            <div className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              {member.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        className="py-3.5 px-4 cursor-pointer"
                        onClick={() => setSelectedProfileMember(member)}
                      >
                        <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{plan?.name || "Standard Plan"}</div>
                        <div className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                          {member.ptBalance ? `🏋️ ${member.ptBalance} PT sessions left` : "General Gym Floor"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            member.status === "active"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : member.status === "expiring"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                              : member.status === "paused"
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                              : "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                          }`}
                        >
                          {member.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-amber-500 font-black">
                            <Flame className="w-4 h-4 fill-amber-500" />
                            <span>{member.streak || 0}d</span>
                          </div>
                          <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {member.totalVisits || 0} visits
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className={`font-mono text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {member.expiryDate}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProfileMember(member)}
                            className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 p-2 rounded-xl text-xs font-black shadow-sm transition cursor-pointer"
                            title="View Athlete 360° Profile, Diet, Workout & Purchase History"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleQuickCheckin(member)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black p-2 rounded-xl text-xs font-black shadow-sm transition cursor-pointer"
                            title="Instant Turnstile Check-in"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setEditingMember(member)}
                            className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              isDark
                                ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700"
                                : "bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-300"
                            }`}
                            title="Edit Plan, Phone, or Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleTogglePause(member)}
                            className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              member.status === "paused"
                                ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                : isDark
                                ? "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300"
                            }`}
                            title={member.status === "paused" ? "Resume Membership" : "Pause Membership"}
                          >
                            {member.status === "paused" ? (
                              <PlayCircle className="w-3.5 h-3.5" />
                            ) : (
                              <PauseCircle className="w-3.5 h-3.5" />
                            )}
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

      {/* Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}

      {/* Member 360° Profile & Billing History Modal */}
      {selectedProfileMember && (
        <MemberProfileModal
          member={selectedProfileMember}
          onClose={() => setSelectedProfileMember(null)}
          onEdit={(m) => setEditingMember(m)}
        />
      )}
    </div>
  );
}
