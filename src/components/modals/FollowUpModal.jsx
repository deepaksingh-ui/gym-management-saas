import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import { X, CheckCircle, Clock, Calendar, AlertCircle } from "lucide-react";

export default function FollowUpModal({ member, onClose }) {
  const { markFollowUp } = useGym();
  const [outcome, setOutcome] = useState("Will Return Soon");
  const [notes, setNotes] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");

  const outcomesList = [
    { label: "Will Return Soon", desc: "Spoke to member, coming back in 1-2 days" },
    { label: "Travelling / Out of Town", desc: "Out of city, will resume after return" },
    { label: "Injured / Health Issue", desc: "Sprain or unwell, requested rest" },
    { label: "Timing Issue / Busy", desc: "Job/college exam busy schedule" },
    { label: "Unhappy with Service", desc: "Trainer or equipment complaint" },
    { label: "No Response / Not Reachable", desc: "Call not answered, WhatsApp sent" },
    { label: "Cancelled / Quitting", desc: "Moving away or decided to quit" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    markFollowUp(member.id, outcome, notes, nextActionDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white m-0">
              Log Follow-up Call: {member.name}
            </h3>
            <span className="text-xs text-red-400 font-medium">
              Absent for {member.absentDays} Days ({member.phone})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Call / WhatsApp Conversation Outcome:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {outcomesList.map((item) => (
                <div
                  key={item.label}
                  onClick={() => setOutcome(item.label)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    outcome === item.label
                      ? "bg-amber-500/15 border-amber-500 text-white font-bold"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <div>
                    <div>{item.label}</div>
                    <div className="text-[10px] text-neutral-500">{item.desc}</div>
                  </div>
                  {outcome === item.label && <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Notes / Member's Remark:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Member said exams ending on Friday, will come Saturday morning..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Next Action Date (Optional):
            </label>
            <input
              type="date"
              value={nextActionDate}
              onChange={(e) => setNextActionDate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20"
            >
              Save Follow-up Outcome
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

