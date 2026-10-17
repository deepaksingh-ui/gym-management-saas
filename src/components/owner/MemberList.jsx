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
} from "lucide-react";
import EditMemberModal from "../modals/EditMemberModal";

export default function MemberList() {
  const { members, plans, processCheckIn, togglePauseMember, setActiveModal, setActiveInvoice, payments } = useGym();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMsg, setActionMsg] = useState("");
  const [editingMember, setEditingMember] = useState(null);

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
      const reason = window.prompt(promptMsg, "Personal travel");
      if (reason !== null) {
        togglePauseMember(member.id, reason);
        setActionMsg(`Membership paused for ${member.name}! (Excluded from Red List)`);
        setTimeout(() => setActionMsg(""), 3500);
      }
    }
  };

  return (
    <div className="space-y-6">
      {actionMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold">
          {actionMsg}
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, mobile number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setActiveModal("bulkImport")}
            className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            title="Import Client Members from Excel or CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Import Members</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800 overflow-x-auto">
          {["all", "active", "expiring", "paused", "expired"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? "bg-amber-500 text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {st} ({members.filter((m) => (st === "all" ? true : m.status === st)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Member Details</th>
                <th className="py-3.5 px-4 font-semibold">Plan</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Streak & Visits</th>
                <th className="py-3.5 px-4 font-semibold">Expiry Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-neutral-500">
                    No members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const plan = plans.find((p) => p.id === member.planId);

                  return (
                    <tr key={member.id} className="hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{member.name}</span>
                              {member.absentDays >= 10 && member.status === "active" && (
                                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-semibold">
                                  Absent {member.absentDays}d
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              {member.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{plan?.name || "Standard Plan"}</div>
                        <div className="text-[11px] text-neutral-500">
                          {member.ptBalance ? `🏋️ ${member.ptBalance} PT sessions left` : "General Gym"}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            member.status === "active"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : member.status === "expiring"
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : member.status === "paused"
                              ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {member.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Flame className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{member.streak || 0}d</span>
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {member.totalVisits || 0} total
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-300">
                        {member.expiryDate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Member Details */}
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-amber-400 transition cursor-pointer"
                            title="Edit Member, Trainer & Plan"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Quick Check-in */}
                          <button
                            onClick={() => handleQuickCheckin(member)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                            title="Quick Check-in today"
                          >
                            <UserCheck className="w-4 h-4 text-emerald-400" />
                          </button>

                          {/* Pause / Resume */}
                          <button
                            onClick={() => handleTogglePause(member)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                            title={member.status === "paused" ? "Resume Membership" : "Pause Membership"}
                          >
                            {member.status === "paused" ? (
                              <PlayCircle className="w-4 h-4 text-blue-400" />
                            ) : (
                              <PauseCircle className="w-4 h-4 text-neutral-400" />
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

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}
    </div>
  );
}

