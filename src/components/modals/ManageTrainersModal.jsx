import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  X,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Phone,
  Award,
} from "lucide-react";

export default function ManageTrainersModal({ onClose }) {
  const { trainers, addTrainer, updateTrainer, deleteTrainer } = useGym();
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrainerData, setNewTrainerData] = useState({
    name: "",
    specialty: "General Fitness & Strength",
    phone: "+91 ",
  });
  const [toastMsg, setToastMsg] = useState("");

  const startEdit = (trainer) => {
    setEditingTrainerId(trainer.id);
    setEditFormData({ ...trainer });
  };

  const handleSaveEdit = (trainerId) => {
    updateTrainer(trainerId, editFormData);
    setEditingTrainerId(null);
    setToastMsg("Trainer profile updated!");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newTrainerData.name.trim()) {
      alert("Please enter trainer name!");
      return;
    }

    addTrainer(newTrainerData);
    setShowAddForm(false);
    setNewTrainerData({
      name: "",
      specialty: "General Fitness & Strength",
      phone: "+91 ",
    });
    setToastMsg("New trainer added to gym roster!");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleDelete = (trainerId) => {
    if (trainers.length <= 1) {
      alert("At least one trainer/coach is required in the system!");
      return;
    }
    if (window.confirm("Remove this trainer from gym staff?")) {
      deleteTrainer(trainerId);
      setToastMsg("Trainer removed.");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white m-0">
                Manage Gym Trainers & Coaches
              </h3>
              <span className="text-xs text-neutral-400">
                Gym ke apne trainers add karein ya unke naam aur phone edit karein
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

        {toastMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-semibold">
            Gym Trainers ({trainers.length})
          </span>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Trainer</span>
            </button>
          )}
        </div>

        {/* Add Trainer Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddNew}
            className="bg-neutral-950 p-4 rounded-2xl border border-amber-500/40 space-y-3 text-xs"
          >
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider m-0">
              Add Trainer to Gym
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Trainer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newTrainerData.name}
                  onChange={(e) => setNewTrainerData({ ...newTrainerData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="+91 98260 XXXXX"
                  value={newTrainerData.phone}
                  onChange={(e) => setNewTrainerData({ ...newTrainerData, phone: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white font-mono outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Specialty / Role</label>
              <input
                type="text"
                placeholder="e.g. Weight Loss, Powerlifting, HIIT, Crossfit"
                value={newTrainerData.specialty}
                onChange={(e) => setNewTrainerData({ ...newTrainerData, specialty: e.target.value })}
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
                Save Trainer
              </button>
            </div>
          </form>
        )}

        {/* Existing Trainers List */}
        <div className="space-y-2.5">
          {trainers.map((trainer) => {
            const isEditing = editingTrainerId === trainer.id;

            return (
              <div
                key={trainer.id}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3.5 transition-all"
              >
                {isEditing ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">Trainer Name</label>
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
                        <label className="block text-neutral-400 mb-1">Phone</label>
                        <input
                          type="text"
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, phone: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">Specialty</label>
                      <input
                        type="text"
                        value={editFormData.specialty}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, specialty: e.target.value })
                        }
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingTrainerId(null)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(trainer.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black font-bold"
                      >
                        Update Trainer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lg">
                        🏋️
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white m-0">{trainer.name}</h4>
                        <div className="text-[11px] text-amber-400/90 font-medium mt-0.5">
                          {trainer.specialty}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {trainer.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startEdit(trainer)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                        title="Edit Trainer Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(trainer.id)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                        title="Delete Trainer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

