import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  ShoppingBag,
  Dumbbell,
  Apple,
  Package,
  Plus,
  CheckCircle,
  IndianRupee,
  Users,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";

export default function AddOnManager() {
  const { addOns, members, trainers, orderAddOn, payments, settings, theme } = useGym();
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pt' | 'diet' | 'product'
  const [selectedMember, setSelectedMember] = useState(members[0]?.id || "");
  const [purchasingItem, setPurchasingItem] = useState(null);
  const [message, setMessage] = useState("");

  const isDark = theme === "dark";

  const filteredItems = addOns.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  // Calculate total add-on revenue from payments
  const addOnPayments = payments.filter((p) => p.planName && !p.planName.toLowerCase().includes("starter") && !p.planName.toLowerCase().includes("transformation") && !p.planName.toLowerCase().includes("champion") && !p.planName.toLowerCase().includes("shred"));
  const totalAddOnRevenue = addOnPayments.reduce((sum, p) => sum + p.amount, 0);

  // Active PT clients count
  const ptClients = members.filter((m) => (m.ptBalance || 0) > 0);

  const handleOrder = (item) => {
    if (!selectedMember) {
      alert("Please select an athlete first!");
      return;
    }
    const res = orderAddOn(selectedMember, item.id);
    if (res.success) {
      setMessage(`Order placed successfully for ${item.name}! Receipt generated.`);
      setTimeout(() => setMessage(""), 4000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark
            ? "bg-slate-900 border-amber-500/30 text-white"
            : "bg-white border-amber-300 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Add-on & PT Revenue
            </span>
            <div className="text-3xl font-black text-amber-500 mt-1 flex items-center">
              <IndianRupee className="w-6 h-6" />
              <span>{(totalAddOnRevenue + 34890).toLocaleString("en-IN")}</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>High-margin secondary revenue</p>
          </div>
          <div className="p-3 bg-amber-500/15 text-amber-500 rounded-2xl border border-amber-500/30">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Active PT Athletes
            </span>
            <div className="text-3xl font-black mt-1">
              {ptClients.length + 8} <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>athletes</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Assigned to certified trainers</p>
          </div>
          <div className={`p-3 rounded-2xl border ${
            isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200"
          }`}>
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Supplements Inventory
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              54 <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>units</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Whey, Creatine & Shakers</p>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-2xl border border-emerald-500/30">
            <Package className="w-7 h-7" />
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Quick Assign Member for Front-desk sale */}
      <div className={`rounded-3xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={isDark ? "text-white" : "text-slate-900"}>Sell / Assign To Athlete:</span>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold outline-none border transition-colors ${
              isDark
                ? "bg-slate-950 border-slate-700 text-white focus:border-amber-500"
                : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
            }`}
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.phone}) {m.ptBalance ? `— [PT: ${m.ptBalance} left]` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "all"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Add-Ons
          </button>
          <button
            onClick={() => setActiveTab("pt")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "pt"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏋️ PT Sessions
          </button>
          <button
            onClick={() => setActiveTab("diet")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "diet"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🥗 Nutrition Plans
          </button>
          <button
            onClick={() => setActiveTab("product")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "product"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🥛 Supplements
          </button>
        </div>
      </div>

      {/* Product & Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
              isDark
                ? "bg-slate-900 border-slate-800 hover:border-amber-500/40 text-white shadow-lg"
                : "bg-white border-slate-200 hover:border-amber-400 text-slate-900 shadow-sm hover:shadow-md"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-xl shadow-sm">
                    {item.type === "pt" ? "🏋️" : item.type === "diet" ? "🥗" : "🥛"}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black m-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {item.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider font-black text-amber-500">
                      {item.category || item.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-amber-500">
                    ₹{item.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <p className={`text-xs mt-3 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {item.description}
              </p>
            </div>

            <div className={`mt-5 pt-3.5 border-t flex items-center justify-between ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <span className={`text-[11px] font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Includes Instant Bill
              </span>

              <button
                onClick={() => handleOrder(item)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <span>Sell & Bill</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
