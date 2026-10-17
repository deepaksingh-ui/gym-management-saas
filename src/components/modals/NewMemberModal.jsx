import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import { X, UserPlus, CheckCircle, IndianRupee, Edit2, Plus } from "lucide-react";
import ManagePlansModal from "./ManagePlansModal";
import ManageTrainersModal from "./ManageTrainersModal";

export default function NewMemberModal({ onClose }) {
  const { plans, trainers, dietPlans = [], workoutRoutines = [], addMember, settings } = useGym();

  const [formData, setFormData] = useState({
    name: "",
    phone: "+91 ",
    email: "",
    planId: plans[0]?.id || "plan-3m",
    assignedTrainerId: trainers[0]?.id || "none",
    dietPlanId: dietPlans[0]?.id || "diet-hypertrophy",
    workoutSplitId: workoutRoutines[0]?.id || "split-5day-hypertrophy",
    weeklyGoalDays: 4,
    paymentMethod: "UPI",
    notes: "",
  });

  const [ptOption, setPtOption] = useState("none");
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showTrainersModal, setShowTrainersModal] = useState(false);

  const selectedPlan = plans.find((p) => p.id === formData.planId) || plans[0] || { price: 1500, name: "Plan" };
  const ptFee = ptOption === "pt-12" ? 4999 : ptOption === "pt-24" ? 8999 : 0;
  const ptSessions = ptOption === "pt-12" ? 12 : ptOption === "pt-24" ? 24 : 0;
  const ptPackageName = ptOption === "pt-12" ? "1-on-1 Personal Training (12 Sessions)" : ptOption === "pt-24" ? "Elite Transformation PT (24 Sessions)" : "";
  const totalAdmissionFee = selectedPlan.price + ptFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.length < 10) {
      alert("Please provide valid Name and Phone number!");
      return;
    }

    addMember({
      ...formData,
      ptSessions,
      ptFee,
      ptPackageName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white m-0">
                Register New Gym Member
              </h3>
              <span className="text-xs text-neutral-400">
                Instantly generates receipt & creates member QR pass
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rohit Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Mobile Number (WhatsApp) *
              </label>
              <input
                type="text"
                required
                placeholder="+91 98260 XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  Membership Plan *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPlansModal(true)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit/Add Plans</span>
                </button>
              </div>
              <select
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.durationMonths}m - ₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  Assigned Trainer
                </label>
                <button
                  type="button"
                  onClick={() => setShowTrainersModal(true)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit/Add Trainers</span>
                </button>
              </div>
              <select
                value={formData.assignedTrainerId}
                onChange={(e) => setFormData({ ...formData, assignedTrainerId: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value="none">General Floor (No Personal Coach)</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    Coach {t.name} — {t.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Training Add-on Option */}
          <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
                🏋️ Personal Training (PT) Package
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">1-on-1 Dedicated Coach</span>
            </div>
            <select
              value={ptOption}
              onChange={(e) => setPtOption(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="none">No PT Package (Standard Gym Floor Access) — ₹0</option>
              <option value="pt-12">⭐ 1-on-1 PT (12 Sessions with Coach) — +₹4,999</option>
              <option value="pt-24">🏆 Elite Transformation PT (24 Sessions) — +₹8,999</option>
            </select>
          </div>

          {/* Nutrition & Training Assignment */}
          <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
                🥗 Nutrition & 🏋️ Workout Plan Assignment
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">Team Member / Coach Split</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  🥗 Assigned Diet Plan
                </label>
                <select
                  value={formData.dietPlanId}
                  onChange={(e) => setFormData({ ...formData, dietPlanId: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="none">Standard Guidance (No Diet Plan)</option>
                  {dietPlans.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.calories})
                    </option>
                  ))}
                </select>
                {dietPlans.find((d) => d.id === formData.dietPlanId) && (
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-emerald-400 font-mono">
                    <span>🔥 {dietPlans.find((d) => d.id === formData.dietPlanId)?.calories}</span>
                    <span>•</span>
                    <span>🥩 Protein: {dietPlans.find((d) => d.id === formData.dietPlanId)?.protein}</span>
                    <span>•</span>
                    <span>💧 Water: {dietPlans.find((d) => d.id === formData.dietPlanId)?.water}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  🏋️‍♂️ Assigned Workout Routine Split
                </label>
                <select
                  value={formData.workoutSplitId}
                  onChange={(e) => setFormData({ ...formData, workoutSplitId: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="none">General Gym Routine</option>
                  {workoutRoutines.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                {workoutRoutines.find((w) => w.id === formData.workoutSplitId) && (
                  <div className="mt-1.5 text-[10px] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-300 font-medium">
                    ✓ {workoutRoutines.find((w) => w.id === formData.workoutSplitId)?.name} ({workoutRoutines.find((w) => w.id === formData.workoutSplitId)?.schedule?.length || 5} days/week)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Initial Payment Mode
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Cash">Cash at Counter</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Weekly Attendance Goal
              </label>
              <select
                value={formData.weeklyGoalDays}
                onChange={(e) => setFormData({ ...formData, weeklyGoalDays: Number(e.target.value) })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value={3}>3 Days / Week (Casual)</option>
                <option value={4}>4 Days / Week (Standard)</option>
                <option value={5}>5 Days / Week (Dedicated)</option>
                <option value={6}>6 Days / Week (Athlete)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Member Notes / Fitness Goals:
            </label>
            <input
              type="text"
              placeholder="e.g. Muscle gain, wants diet guidance, works night shifts"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
            />
          </div>

          {/* Amount Summary */}
          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Base Plan ({selectedPlan.name}):</span>
              <span className="font-mono text-white font-bold">₹{selectedPlan.price.toLocaleString("en-IN")}</span>
            </div>
            {ptFee > 0 && (
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>Personal Training ({ptSessions} Sessions):</span>
                <span className="font-mono">+₹{ptFee.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 font-black text-sm">
              <span className="text-white">Total Admission Collection:</span>
              <span className="text-base font-black text-amber-400 flex items-center">
                <IndianRupee className="w-4 h-4" />
                <span>{totalAdmissionFee.toLocaleString("en-IN")}</span>
              </span>
            </div>
          </div>

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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Activate Membership & Generate Pass
            </button>
          </div>
        </form>

        {/* Sub-modals for inline management */}
        {showPlansModal && (
          <ManagePlansModal onClose={() => setShowPlansModal(false)} />
        )}
        {showTrainersModal && (
          <ManageTrainersModal onClose={() => setShowTrainersModal(false)} />
        )}
      </div>
    </div>
  );
}

