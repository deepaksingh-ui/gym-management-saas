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
  Flame,
} from "lucide-react";

export default function NoShowRedList({ onOpenFollowUpModal }) {
  const { members, settings, theme } = useGym();
  const [filterRange, setFilterRange] = useState("all"); // 'all' | '10-14' | '15-20' | '21+'
  const [copiedId, setCopiedId] = useState(null);

  const isDark = theme === "dark";
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

  return (
    <div className="space-y-6">
      {/* Educational Banner for Gym Owners */}
      <div className={`rounded-3xl p-5 border transition-all ${
        isDark
          ? "bg-gradient-to-r from-red-950/60 via-red-900/30 to-slate-900 border-red-500/40 shadow-xl"
          : "bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-red-200 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-red-500/15 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/30 shrink-0 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Silent Churn Predictor (No-Show Dropout Red List)
                </h3>
                <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  {redListMembers.length} Athletes At Risk
                </span>
              </div>
              <p className={`text-xs mt-1 max-w-2xl m-0 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Gym members chupchaap chhodne se pehle 10–15 din gayab rehte hain.
                Is Red List se unhe <strong>membership khatam hone se pehle hi contact</strong> karke retain karein!
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-2xl border text-xs font-bold ${
            isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
          }`}>
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Threshold: <strong>{threshold}+ Days Absent</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <div className={`inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl border min-w-max ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => setFilterRange("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                filterRange === "all"
                  ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All At Risk ({redListMembers.length})
            </button>
            <button
              onClick={() => setFilterRange("10-14")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                filterRange === "10-14"
                  ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              10–14 Days ({redListMembers.filter((m) => m.absentDays >= 10 && m.absentDays <= 14).length})
            </button>
            <button
              onClick={() => setFilterRange("15-20")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                filterRange === "15-20"
                  ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              15–20 Days ({redListMembers.filter((m) => m.absentDays >= 15 && m.absentDays <= 20).length})
            </button>
            <button
              onClick={() => setFilterRange("21+")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                filterRange === "21+"
                  ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              21+ Days Critical ({redListMembers.filter((m) => m.absentDays >= 21).length})
            </button>
          </div>
        </div>

        <span className={`text-[11px] sm:text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Showing <strong>{filtered.length}</strong> inactive members
        </span>
      </div>

      {/* Red-List Member Cards */}
      {filtered.length === 0 ? (
        <div className={`rounded-3xl p-10 text-center border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
          <h4 className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>
            Great news! No athletes currently in this dropout danger zone!
          </h4>
          <p className={`text-xs mt-1 max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Your member retention follow-up is working. All members are either active or accounted for.
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
                className={`rounded-3xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between ${
                  isDark
                    ? "bg-slate-900/95 border-red-500/30 hover:border-red-500 text-white shadow-lg"
                    : "bg-white border-red-200 hover:border-red-500 text-slate-900 shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className={`w-12 h-12 rounded-2xl object-cover border ${isDark ? "border-slate-700" : "border-slate-200 shadow-sm"}`}
                      />
                      <div>
                        <h4 className={`text-sm font-black m-0 flex items-center gap-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                          {member.name}
                        </h4>
                        <span className={`text-xs font-mono font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {member.phone}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 shadow-sm">
                        {member.absentDays} Days Absent
                      </span>
                    </div>
                  </div>

                  {/* Membership Details */}
                  <div className={`mt-3.5 p-3 rounded-2xl border space-y-1.5 text-xs ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-slate-500"}>Last Check-in:</span>
                      <span className="font-bold">{member.lastCheckIn} ({member.lastCheckInTime})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-slate-500"}>Plan Expiry:</span>
                      <span className="font-bold">{member.expiryDate}</span>
                    </div>
                    {member.notes && (
                      <div className={`pt-1.5 border-t text-[11px] italic ${
                        isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
                      }`}>
                        "{member.notes}"
                      </div>
                    )}
                  </div>

                  {/* Follow-up Status Badge */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Status:</span>
                    {member.followUpOutcome ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {member.followUpOutcome}
                        {member.lastFollowUpDate && ` (${member.lastFollowUpDate})`}
                      </span>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        Pending Contact
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className={`mt-4 pt-3 border-t grid grid-cols-3 gap-2 ${
                  isDark ? "border-slate-800" : "border-slate-200"
                }`}>
                  {/* WhatsApp Action */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-2 rounded-xl text-xs transition cursor-pointer shadow-md shadow-emerald-600/20"
                    title="Send WhatsApp recovery message"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Direct Phone Call */}
                  <a
                    href={`tel:${member.phone}`}
                    className={`flex items-center justify-center gap-1.5 font-bold py-2.5 px-2 rounded-xl text-xs border transition cursor-pointer ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm"
                    }`}
                    title="Call athlete"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    <span>Call</span>
                  </a>

                  {/* Mark Outcome Modal */}
                  <button
                    onClick={() => onOpenFollowUpModal(member)}
                    className="flex items-center justify-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-black py-2.5 px-2 rounded-xl text-xs border border-amber-500/40 transition cursor-pointer"
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
