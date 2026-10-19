import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  Users,
  Award,
  Phone,
  MessageSquare,
  Apple,
  Dumbbell,
  Sparkles,
  Eye,
  Edit2,
  CheckCircle,
  Plus,
  Flame,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import MemberProfileModal from "../modals/MemberProfileModal";
import EditMemberModal from "../modals/EditMemberModal";
import ManageTrainersModal from "../modals/ManageTrainersModal";

export default function TrainerTeamView() {
  const {
    trainers = [],
    members = [],
    dietPlans = [],
    workoutRoutines = [],
    plans = [],
    settings,
    theme,
  } = useGym();

  const isDark = theme === "dark";
  const [selectedTrainerId, setSelectedTrainerId] = useState("all");
  const [selectedProfileMember, setSelectedProfileMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [showManageTrainers, setShowManageTrainers] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState("");

  // Filter trainers
  const filteredTrainers = selectedTrainerId === "all"
    ? trainers
    : trainers.filter((t) => t.id === selectedTrainerId);

  // Quick stats
  const totalPtClients = members.filter((m) => (m.ptBalance || 0) > 0).length;
  const totalPtSessions = members.reduce((sum, m) => sum + (m.ptBalance || 0), 0);

  // Helper to get diet plan object
  const getDietPlan = (dietId) => dietPlans.find((d) => d.id === dietId) || dietPlans[0];
  // Helper to get workout routine
  const getWorkoutRoutine = (splitId) => workoutRoutines.find((w) => w.id === splitId) || workoutRoutines[0];
  // Helper to get plan
  const getPlan = (planId) => plans.find((p) => p.id === planId);

  // Send Diet on WhatsApp
  const handleSendDietWhatsApp = (member, trainer) => {
    const diet = getDietPlan(member.dietPlanId);
    if (!diet) return;

    let msg = `🥗 *${settings.gymName} — Personalized Diet Plan for ${member.name}*\n`;
    msg += `👤 *Assigned Coach:* ${trainer ? trainer.name : "FitZone Head Coach"}\n`;
    msg += `🎯 *Goal:* ${diet.name} (${diet.preference})\n`;
    msg += `🔥 *Daily Targets:* ${diet.calories} | Protein: ${diet.protein} | Carbs: ${diet.carbs} | Fats: ${diet.fats}\n`;
    msg += `💧 *Daily Hydration:* ${diet.water}\n\n`;
    msg += `📋 *Daily Meal Schedule:*\n`;
    diet.meals.forEach((m, idx) => {
      msg += `\n*${idx + 1}. ${m.name}* (${m.protein})\n👉 ${m.items}\n`;
    });
    msg += `\n💪 Consistency is key! For any workout or diet queries, contact coach ${trainer ? trainer.name : "Vikram"}.\n`;

    const cleanPhone = member.phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    setCopiedMsg(`✅ Diet plan sent to ${member.name} on WhatsApp!`);
    setTimeout(() => setCopiedMsg(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`rounded-3xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              Team & Coaches Roster
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Trainer-wise Athletes & Diet Breakdown
            </span>
          </div>
          <h2 className="text-lg font-black mt-1 m-0">
            Gym Coaches, Athletes & Diet Plans Directory
          </h2>
          <p className={`text-xs mt-0.5 m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Har trainer / coach ke paas kon se members hain, unka assigned diet plan, workout split aur PT balance yaha dekhein
          </p>
        </div>

        <button
          onClick={() => setShowManageTrainers(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-4 py-2.5 rounded-2xl text-xs font-black shadow-md shadow-amber-500/25 transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <UserCheck className="w-4 h-4" />
          <span>+ Add / Manage Coaches</span>
        </button>
      </div>

      {/* Toast Alert */}
      {copiedMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-pulse">
          <span>{copiedMsg}</span>
          <button onClick={() => setCopiedMsg("")} className="underline text-[11px] cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-3xl border flex items-center justify-between ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Certified Coaches
            </span>
            <span className="text-2xl font-black mt-1 block">
              {trainers.length} <span className="text-xs text-amber-500 font-bold">Team Members</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-4 rounded-3xl border flex items-center justify-between ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Athletes with Assigned Coach
            </span>
            <span className="text-2xl font-black mt-1 block">
              {members.filter((m) => m.assignedTrainerId && m.assignedTrainerId !== "none").length} / {members.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-4 rounded-3xl border flex items-center justify-between ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Active PT Coaching Balance
            </span>
            <span className="text-2xl font-black mt-1 text-amber-500 block">
              {totalPtSessions} <span className="text-xs font-bold text-slate-400">Sessions ({totalPtClients} Athletes)</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Trainer Filter Tabs */}
      <div className={`flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto scrollbar-none ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
      }`}>
        <button
          onClick={() => setSelectedTrainerId("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
            selectedTrainerId === "all"
              ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
              : isDark
              ? "text-slate-400 hover:text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Coaches ({trainers.length})
        </button>

        {trainers.map((t) => {
          const athleteCount = members.filter((m) => m.assignedTrainerId === t.id).length;
          const isSelected = selectedTrainerId === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setSelectedTrainerId(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{t.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isSelected ? "bg-black/25 text-black" : isDark ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"
              }`}>
                {athleteCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trainer Cards & Assigned Athletes Roster */}
      <div className="space-y-6">
        {filteredTrainers.map((trainer) => {
          const trainerAthletes = members.filter((m) => m.assignedTrainerId === trainer.id);
          const ptAthletes = trainerAthletes.filter((m) => (m.ptBalance || 0) > 0);
          const totalTrainerSessions = trainerAthletes.reduce((sum, m) => sum + (m.ptBalance || 0), 0);

          return (
            <div
              key={trainer.id}
              className={`rounded-3xl border-2 overflow-hidden transition-all shadow-md ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              {/* Trainer Profile Card Header */}
              <div className={`p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? "bg-slate-950/80 border-slate-800" : "bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-slate-200"
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-black text-black shadow-md shrink-0">
                    🏋️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black m-0 leading-tight">Coach {trainer.name}</h3>
                      <span className="text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        ⭐ {trainer.rating || 4.9} Rating
                      </span>
                    </div>
                    <span className="text-xs text-amber-500 font-semibold block mt-0.5">
                      Specialty: {trainer.specialty}
                    </span>
                    <span className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Phone: {trainer.phone}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold text-center ${
                    isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
                  }`}>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Total Athletes</span>
                    <span className="font-black text-sm">{trainerAthletes.length}</span>
                  </div>

                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold text-center ${
                    isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
                  }`}>
                    <span className="block text-[10px] uppercase font-bold text-amber-500">PT Balance</span>
                    <span className="font-black text-sm text-amber-500">{totalTrainerSessions} Sessions</span>
                  </div>

                  <a
                    href={`https://wa.me/${trainer.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Coach</span>
                  </a>
                </div>
              </div>

              {/* Athletes Roster Table */}
              <div className="overflow-x-auto">
                {trainerAthletes.length === 0 ? (
                  <div className={`p-8 text-center text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    No athletes currently assigned to Coach {trainer.name}. Assign from New Member or Edit Member.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className={`text-[10px] uppercase tracking-wider font-bold border-b ${
                      isDark ? "bg-slate-900/60 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}>
                      <tr>
                        <th className="py-3 px-4">Athlete Details</th>
                        <th className="py-3 px-4">🥗 Assigned Diet Plan</th>
                        <th className="py-3 px-4">🏋️ Workout Split</th>
                        <th className="py-3 px-4">PT Sessions</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Desk Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                      {trainerAthletes.map((member) => {
                        const diet = getDietPlan(member.dietPlanId);
                        const routine = getWorkoutRoutine(member.workoutSplitId);
                        const plan = getPlan(member.planId);

                        return (
                          <tr key={member.id} className={`transition ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                            {/* Athlete Info */}
                            <td className="py-3 px-4">
                              <div
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => setSelectedProfileMember(member)}
                              >
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-2xl object-cover border border-amber-500/30 group-hover:scale-105 transition shrink-0"
                                />
                                <div>
                                  <div className={`font-black flex items-center gap-1.5 group-hover:text-amber-500 transition ${isDark ? "text-white" : "text-slate-900"}`}>
                                    <span>{member.name}</span>
                                    {member.streak > 0 && (
                                      <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                                        <Flame className="w-3 h-3 fill-amber-500" />
                                        <span>{member.streak}d</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {member.phone}
                                  </div>
                                  <span className="text-[10px] text-amber-500/90 font-mono">
                                    {plan?.name || "Member"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Diet Plan */}
                            <td className="py-3 px-4">
                              {diet ? (
                                <div className="space-y-1">
                                  <span className={`font-black block leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {diet.name}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                    <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded font-bold">
                                      🔥 {diet.calories}
                                    </span>
                                    <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                                      🥩 {diet.protein}
                                    </span>
                                    <span className={`px-1.5 py-0.2 rounded font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                      💧 {diet.water}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className={`text-[11px] italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                  No Diet Assigned
                                </span>
                              )}
                            </td>

                            {/* Workout Split */}
                            <td className="py-3 px-4">
                              {routine ? (
                                <div>
                                  <span className={`font-bold block leading-tight ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    {routine.name}
                                  </span>
                                  <span className={`text-[10px] line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {routine.schedule?.length || 5} Training Days / Week
                                  </span>
                                </div>
                              ) : (
                                <span className={`text-[11px] italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                  General Gym Floor
                                </span>
                              )}
                            </td>

                            {/* PT Balance */}
                            <td className="py-3 px-4">
                              {(member.ptBalance || 0) > 0 ? (
                                <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-black">
                                  <span>⭐</span>
                                  <span>{member.ptBalance} Left</span>
                                </span>
                              ) : (
                                <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                  Floor Guidance
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  member.status === "active"
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                    : member.status === "expiring"
                                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                    : "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                                }`}
                              >
                                {member.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Send Diet on WhatsApp */}
                                <button
                                  onClick={() => handleSendDietWhatsApp(member, trainer)}
                                  className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black flex items-center gap-1 transition cursor-pointer"
                                  title="Send Diet Plan to Athlete's WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp Diet</span>
                                </button>

                                {/* View 360 Profile */}
                                <button
                                  onClick={() => setSelectedProfileMember(member)}
                                  className="p-1.5 rounded-xl border border-amber-500/30 text-amber-500 hover:bg-amber-500/15 transition cursor-pointer"
                                  title="View Full 360° Profile & Purchases"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => setEditingMember(member)}
                                  className={`p-1.5 rounded-xl border transition cursor-pointer ${
                                    isDark
                                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                                  }`}
                                  title="Edit Athlete / Reassign Coach"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Member 360 Profile Modal */}
      {selectedProfileMember && (
        <MemberProfileModal
          member={selectedProfileMember}
          onClose={() => setSelectedProfileMember(null)}
          onEdit={(m) => setEditingMember(m)}
        />
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}

      {/* Manage Trainers Modal */}
      {showManageTrainers && (
        <ManageTrainersModal onClose={() => setShowManageTrainers(false)} />
      )}
    </div>
  );
}

