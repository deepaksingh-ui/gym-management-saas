import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  AlertTriangle,
  Phone,
  MessageCircle,
  Clock,
  Calendar,
  CheckCircle2,
  Copy,
  User,
  Filter,
  Sparkles,
} from "lucide-react";

export default function NoShowRedList({ onOpenFollowUpModal }) {
  const { members, settings } = useGym();
  const [filterRange, setFilterRange] = useState("all"); // 'all' | '10-14' | '15-20' | '21+'
  const [copiedId, setCopiedId] = useState(null);

  const threshold = settings.noShowThresholdDays || 10;

  // Filter members: Absent >= threshold, and NOT paused or already expired
  const redListMembers = members.filter((m) => {
    if (m.status === "paused" || m.status === "expired") return false;
    return (m.absentDays || 0) >= threshold;
  });

  const filtered = redListMembers.filter((m) => {
    if (filterRange === "10-14") return m.absentDays >= 10 && m.absentDays <= 14;
    if (filterRange === "15-20") return m.absentDays >= 15 && m.absentDays <= 20;
    if (filterRange === "21+") return m.absentDays >= 21;
    return true;
  });

  // Generate customized WhatsApp recovery message
  const getWhatsAppMessage = (member) => {
    return encodeURIComponent(
      `Hey ${member.name}! 👋\n\nMain ${settings.gymName} se bol raha hoon. Notice kiya ki aap pichhle ${member.absentDays} din se gym nahi aaye! Sab theek hai na?\n\nAapka regular workout routine break na ho, isliye contact kiya. Agar koi timing issue ya injury hai to batayein, hum workout customize kar denge.\n\nKal kis time aa rahe hain aap? 💪🔥`
    );
  };

  const copyText = (member) => {
    const text = `Hey ${member.name}! Main ${settings.gymName} se bol raha hoon. Notice kiya aap pichhle ${member.absentDays} din se gym nahi aaye! Sab theek hai na? Kal kis time aa rahe hain workout ke liye? 💪`;
    navigator.clipboard.writeText(text);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner for Gym Owners (Selling Point) */}
      <div className="bg-gradient-to-r from-red-950/60 via-red-900/30 to-neutral-900 border border-red-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white m-0">
                  Silent Churn Detector (No-Show Red List)
                </h3>
                <span className="bg-red-500 text-black text-xs font-black px-2 py-0.5 rounded-full">
                  {redListMembers.length} Members At Risk
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl m-0 leading-relaxed">
                Gym members chupchaap quit karne se pehle 10–15 din absent rehte hain.
                Is Red List ke zariye aap unhe <strong>fee miss hone se pehle hi contact</strong> karke retain kar sakte hain!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-black/40 px-3 py-2 rounded-xl border border-neutral-800 text-xs text-neutral-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Threshold: <strong>{threshold}+ Days Absent</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setFilterRange("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterRange === "all"
                ? "bg-red-500 text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            All At Risk ({redListMembers.length})
          </button>
          <button
            onClick={() => setFilterRange("10-14")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterRange === "10-14"
                ? "bg-red-500 text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            10–14 Days ({redListMembers.filter((m) => m.absentDays >= 10 && m.absentDays <= 14).length})
          </button>
          <button
            onClick={() => setFilterRange("15-20")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterRange === "15-20"
                ? "bg-red-500 text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            15–20 Days ({redListMembers.filter((m) => m.absentDays >= 15 && m.absentDays <= 20).length})
          </button>
          <button
            onClick={() => setFilterRange("21+")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterRange === "21+"
                ? "bg-red-500 text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            21+ Days Critical ({redListMembers.filter((m) => m.absentDays >= 21).length})
          </button>
        </div>

        <span className="text-xs text-neutral-400">
          Showing <strong>{filtered.length}</strong> inactive members
        </span>
      </div>

      {/* Red-List Member Cards */}
      {filtered.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No members currently in this range!</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Great job! Members are either active or currently accounted for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => {
            const cleanPhone = member.phone.replace(/[^0-9]/g, "");
            const waLink = `https://wa.me/${cleanPhone}?text=${getWhatsAppMessage(member)}`;

            return (
              <div
                key={member.id}
                className="bg-neutral-900/90 border border-neutral-800 hover:border-red-500/40 rounded-2xl p-4 transition-all duration-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-700"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white m-0 flex items-center gap-1.5">
                          {member.name}
                        </h4>
                        <span className="text-xs text-neutral-400 font-mono">
                          {member.phone}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-red-500/15 text-red-400 border border-red-500/30">
                        {member.absentDays} Days Absent
                      </span>
                    </div>
                  </div>

                  {/* Membership Details */}
                  <div className="mt-3.5 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Last Visited:</span>
                      <span className="font-medium text-white">{member.lastCheckIn} ({member.lastCheckInTime})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Plan Expiry:</span>
                      <span className="font-medium text-white">{member.expiryDate}</span>
                    </div>
                    {member.notes && (
                      <div className="pt-1 border-t border-neutral-800/60 text-[11px] text-neutral-400 italic">
                        "{member.notes}"
                      </div>
                    )}
                  </div>

                  {/* Follow-up Status Badge */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 text-[11px]">Follow-up Status:</span>
                    {member.followUpOutcome ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {member.followUpOutcome}
                        {member.lastFollowUpDate && ` (${member.lastFollowUpDate})`}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-800 text-neutral-400">
                        Pending Contact
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-3 gap-2">
                  {/* WhatsApp Action */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-emerald-950"
                    title="Send WhatsApp recovery message"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Direct Phone Call */}
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 px-2 rounded-xl text-xs transition cursor-pointer"
                    title="Call member"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Call</span>
                  </a>

                  {/* Mark Outcome Modal */}
                  <button
                    onClick={() => onOpenFollowUpModal(member)}
                    className="flex items-center justify-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-semibold py-2 px-2 rounded-xl text-xs border border-amber-500/30 transition cursor-pointer"
                    title="Update follow-up outcome"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Outcome</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

