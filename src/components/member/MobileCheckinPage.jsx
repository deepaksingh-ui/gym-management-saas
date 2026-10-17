import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import confetti from "canvas-confetti";
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function MobileCheckinPage({ onContinueToApp }) {
  const { members, processCheckIn, settings } = useGym();
  const [phoneInput, setPhoneInput] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [result, setResult] = useState(null);

  const handlePhoneCheckin = (e) => {
    e.preventDefault();
    let member = null;

    if (selectedMemberId) {
      member = members.find((m) => m.id === selectedMemberId);
    } else if (phoneInput.trim()) {
      const cleanInput = phoneInput.replace(/[^0-9]/g, "");
      member = members.find((m) => m.phone.replace(/[^0-9]/g, "").includes(cleanInput));
    }

    if (!member) {
      setResult({
        success: false,
        message: "Mobile number gym database mein nahi mila! Please check number or contact front desk.",
      });
      return;
    }

    const res = processCheckIn(member.id, "Mobile Camera Scan");
    setResult(res);

    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6 pt-4">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center text-black font-black shadow-xl shadow-amber-500/20">
            <Dumbbell className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-white m-0 tracking-tight">
            {settings.gymName}
          </h2>
          <span className="inline-block bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-3 py-1 rounded-full">
            📲 QR Attendance Verified
          </span>
        </div>

        {/* Check-in Form Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white m-0">Mark Your Attendance</h3>
            <p className="text-xs text-neutral-400 mt-1 m-0">
              Apna 10-digit mobile number enter karein ya list se apna naam chunein:
            </p>
          </div>

          <form onSubmit={handlePhoneCheckin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Enter Mobile Number:
              </label>
              <input
                type="tel"
                placeholder="e.g. 98261 45890"
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value);
                  setSelectedMemberId("");
                }}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl p-3 text-sm text-white font-mono placeholder-neutral-500 outline-none focus:border-amber-500"
              />
            </div>

            <div className="relative flex items-center justify-center">
              <span className="bg-neutral-900 px-2 text-[10px] text-neutral-500 uppercase font-bold">
                OR Select Name (Demo)
              </span>
            </div>

            <div>
              <select
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  setPhoneInput("");
                }}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl p-3 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value="">-- Choose your name --</option>
                {members.slice(0, 10).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.phone})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Mark My Attendance Now</span>
            </button>
          </form>

          {/* Feedback Result */}
          {result && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold space-y-1 ${
                result.success
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                  : result.isDuplicate
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  : "bg-red-500/20 border border-red-500/40 text-red-300"
              }`}
            >
              <div className="flex items-center gap-2 text-sm">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{result.success ? "Attendance Recorded!" : "Notice"}</span>
              </div>
              <p className="m-0 text-xs font-normal opacity-90">{result.message}</p>
            </div>
          )}
        </div>

        {/* Open Full App Button */}
        <div className="text-center pt-2">
          <button
            onClick={onContinueToApp}
            className="text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto font-semibold cursor-pointer"
          >
            <span>Open Member Portal & Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-neutral-600 py-3">
        {settings.gymName} • Digital Attendance System
      </div>
    </div>
  );
}

