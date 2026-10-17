import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import { X, UserPlus, CheckCircle, IndianRupee, Edit2, Plus } from "lucide-react";
import ManagePlansModal from "./ManagePlansModal";
import ManageTrainersModal from "./ManageTrainersModal";

export default function NewMemberModal({ onClose }) {
  const { plans, trainers, addMember, settings } = useGym();

  const [formData, setFormData] = useState({
    name: "",
    phone: "+91 ",
    email: "",
    planId: plans[0]?.id || "plan-3m",
    assignedTrainerId: trainers[0]?.id || "none",
    weeklyGoalDays: 4,
    paymentMethod: "UPI",
    notes: "",
  });

  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showTrainersModal, setShowTrainersModal] = useState(false);

  const selectedPlan = plans.find((p) => p.id === formData.planId) || plans[0] || { price: 1500, name: "Plan" };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.length < 10) {
      alert("Please provide valid Name and Phone number!");
      return;
    }

    addMember(formData);
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
                <option value="none">General Gym Floor (No Personal Trainer)</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialty})
                  </option>
                ))}
              </select>
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
          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Total Admission & Plan Fee:</span>
            <span className="text-base font-black text-amber-400 flex items-center">
              <IndianRupee className="w-4 h-4" />
              <span>{selectedPlan.price.toLocaleString("en-IN")}</span>
            </span>
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

