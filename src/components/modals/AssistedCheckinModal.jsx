import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import { X, UserCheck, Search, AlertCircle, CheckCircle } from "lucide-react";

export default function AssistedCheckinModal({ onClose }) {
  const { members, processCheckIn } = useGym();
  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [reason, setReason] = useState("Phone battery dead");
  const [staffName, setStaffName] = useState("Front-Desk Reception");
  const [statusResult, setStatusResult] = useState(null);

  const filteredMembers = members.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.phone.includes(q);
  });

  const handleCheckin = (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      alert("Please select a member first!");
      return;
    }

    const res = processCheckIn(
      selectedMemberId,
      "Front-Desk Assisted",
      `${reason} [Auth: ${staffName}]`
    );

    setStatusResult(res);

    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white m-0">
                Staff Assisted Check-in
              </h3>
              <span className="text-xs text-neutral-400">
                Audit logged manual entry for members without phone
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCheckin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Search & Select Member:
            </label>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500 mb-2"
            />

            <select
              size={4}
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white outline-none focus:border-amber-500"
            >
              {filteredMembers.map((m) => (
                <option key={m.id} value={m.id} className="py-1 px-1">
                  {m.name} — {m.phone} ({m.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Mandatory Audit Reason:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="Phone battery dead">Phone battery dead</option>
              <option value="Forgot phone at home">Forgot phone at home</option>
              <option value="Camera scanner issue">Camera scanner issue</option>
              <option value="Trial guest / VIP pass">Trial guest / VIP pass</option>
              <option value="Staff override">Staff override</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Authorizing Staff Identity:
            </label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          {statusResult && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                statusResult.success
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}
            >
              {statusResult.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{statusResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Confirm Assisted Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

