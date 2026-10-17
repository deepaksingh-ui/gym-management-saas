import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  X,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  IndianRupee,
  Sparkles,
} from "lucide-react";

export default function ManagePlansModal({ onClose }) {
  const { plans, addPlan, updatePlan, deletePlan, settings } = useGym();
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    name: "",
    durationMonths: 1,
    price: 1500,
    mrp: 2000,
    description: "Full Gym Floor Access",
  });
  const [saveToast, setSaveToast] = useState("");

  const startEdit = (plan) => {
    setEditingPlanId(plan.id);
    setEditFormData({ ...plan });
  };

  const handleSaveEdit = (planId) => {
    updatePlan(planId, editFormData);
    setEditingPlanId(null);
    setSaveToast("Plan updated successfully!");
    setTimeout(() => setSaveToast(""), 3000);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newPlanData.name.trim() || !newPlanData.price) {
      alert("Please provide valid name and price!");
      return;
    }

    addPlan(newPlanData);
    setShowAddForm(false);
    setNewPlanData({
      name: "",
      durationMonths: 1,
      price: 1500,
      mrp: 2000,
      description: "Full Gym Floor Access",
    });
    setSaveToast("New custom plan added!");
    setTimeout(() => setSaveToast(""), 3000);
  };

  const handleDelete = (planId) => {
    if (plans.length <= 1) {
      alert("You must have at least one active membership plan!");
      return;
    }
    if (window.confirm("Are you sure you want to delete this plan?")) {
      deletePlan(planId);
      setSaveToast("Plan removed!");
      setTimeout(() => setSaveToast(""), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white m-0">
                Manage Gym Plans & Pricing
              </h3>
              <span className="text-xs text-neutral-400">
                Har gym ki apni pricing hoti hai — yahan se plans aur rates customize karein
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

        {saveToast && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-semibold">
            Active Membership Plans ({plans.length})
          </span>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Plan</span>
            </button>
          )}
        </div>

        {/* Add Plan Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddNew}
            className="bg-neutral-950 p-4 rounded-2xl border border-amber-500/40 space-y-3 text-xs"
          >
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider m-0">
              Create New Custom Gym Plan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Special, Couple Plan"
                  value={newPlanData.name}
                  onChange={(e) => setNewPlanData({ ...newPlanData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Duration (Months) *</label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  required
                  value={newPlanData.durationMonths}
                  onChange={(e) =>
                    setNewPlanData({ ...newPlanData, durationMonths: Number(e.target.value) })
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Final Price (₹) *</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={newPlanData.price}
                  onChange={(e) =>
                    setNewPlanData({ ...newPlanData, price: Number(e.target.value) })
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white font-mono font-bold outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Description / Perks</label>
              <input
                type="text"
                placeholder="e.g. Unlimited gym access + free locker + 1 diet consultation"
                value={newPlanData.description}
                onChange={(e) => setNewPlanData({ ...newPlanData, description: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400"
              >
                Save & Add Plan
              </button>
            </div>
          </form>
        )}

        {/* Existing Plans List */}
        <div className="space-y-3">
          {plans.map((plan) => {
            const isEditing = editingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 transition-all"
              >
                {isEditing ? (
                  /* Edit Form */
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">Plan Name</label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, name: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Duration (Months)</label>
                        <input
                          type="number"
                          value={editFormData.durationMonths}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              durationMonths: Number(e.target.value),
                            })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={editFormData.price}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-amber-400 font-mono font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingPlanId(null)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(plan.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black font-bold"
                      >
                        Update Plan
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Row */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white m-0">{plan.name}</h4>
                        <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full font-semibold">
                          {plan.durationMonths} Month{plan.durationMonths > 1 ? "s" : ""}
                        </span>
                        {plan.popular && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-400 text-[11px] mt-1 m-0">
                        {plan.description || "Full Gym Access"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-base font-black text-amber-400 flex items-center justify-end">
                          <IndianRupee className="w-4 h-4" />
                          <span>{plan.price.toLocaleString("en-IN")}</span>
                        </div>
                        {plan.mrp && (
                          <span className="text-[10px] text-neutral-500 line-through">
                            MRP ₹{plan.mrp}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(plan)}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                          title="Edit Plan & Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-neutral-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

