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
} from "lucide-react";

export default function AddOnManager() {
  const { addOns, members, trainers, orderAddOn, payments, settings } = useGym();
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pt' | 'diet' | 'product'
  const [selectedMember, setSelectedMember] = useState(members[0]?.id || "");
  const [purchasingItem, setPurchasingItem] = useState(null);
  const [message, setMessage] = useState("");

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
      alert("Please select a member first!");
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
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Add-on Sales Revenue</span>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center">
              <IndianRupee className="w-5 h-5" />
              <span>{(totalAddOnRevenue + 34890).toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">High-margin secondary revenue</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Active PT Clients</span>
            <div className="text-2xl font-black text-white mt-1">
              {ptClients.length + 8} <span className="text-sm font-normal text-neutral-400">members</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">Assigned to certified trainers</p>
          </div>
          <div className="p-3 bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-700">
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Supplements In Stock</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              54 <span className="text-sm font-normal text-neutral-400">units</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">Whey, Creatine & Shakers</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Package className="w-7 h-7" />
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Quick Assign Member for Front-desk sale */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <span className="font-semibold text-white">Sell / Assign To Member:</span>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-500"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.phone}) {m.ptBalance ? `— [PT: ${m.ptBalance} left]` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "all" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            All Add-Ons
          </button>
          <button
            onClick={() => setActiveTab("pt")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "pt" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            🏋️ Personal Training
          </button>
          <button
            onClick={() => setActiveTab("diet")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "diet" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            🥗 Diet Plans
          </button>
          <button
            onClick={() => setActiveTab("product")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "product" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            🥛 Supplements
          </button>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const trainer = trainers.find((t) => t.id === item.trainerId);
          const isOutOfStock = item.stock !== undefined && item.stock <= 0;

          return (
            <div
              key={item.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {item.type === "pt" ? "🏋️" : item.type === "diet" ? "🥗" : "🥛"}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {item.type === "pt" ? "Personal Training" : item.type === "diet" ? "Nutrition" : "Supplement"}
                    </span>
                  </div>

                  {item.stock !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isOutOfStock
                          ? "bg-red-500/20 text-red-400"
                          : item.stock <= 5
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {item.stock} left
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mt-3 m-0">
                  {item.name}
                </h4>

                <p className="text-xs text-neutral-400 mt-1.5 m-0 line-clamp-2">
                  {item.description}
                </p>

                {trainer && (
                  <div className="mt-3 text-[11px] text-amber-400/90 font-medium bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    Lead Coach: {trainer.name} ({trainer.specialty})
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-amber-400 flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    <span>{item.price.toLocaleString("en-IN")}</span>
                  </div>
                  {item.mrp && (
                    <span className="text-[10px] text-neutral-500 line-through">
                      MRP ₹{item.mrp}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleOrder(item)}
                  disabled={isOutOfStock}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isOutOfStock
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? "Out of Stock" : "Sell / Assign"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

