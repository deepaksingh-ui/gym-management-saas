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
  PackagePlus,
  RefreshCw,
  Trash2,
  Receipt,
  CreditCard,
  QrCode,
  Banknote,
} from "lucide-react";
import AddSupplementModal from "../modals/AddSupplementModal";

export default function AddOnManager() {
  const {
    addOns,
    members,
    orderAddOn,
    deleteAddOn,
    restockAddOn,
    payments,
    settings,
    theme,
  } = useGym();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'product' | 'pt' | 'diet'
  const [selectedMember, setSelectedMember] = useState(members[0]?.id || "");
  const [paymentMode, setPaymentMode] = useState("UPI (PhonePe/GPay)");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const isDark = theme === "dark";

  const filteredItems = addOns.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  // Calculate total add-on revenue from payments
  const addOnPayments = payments.filter(
    (p) =>
      p.planName &&
      !p.planName.toLowerCase().includes("starter") &&
      !p.planName.toLowerCase().includes("transformation") &&
      !p.planName.toLowerCase().includes("champion") &&
      !p.planName.toLowerCase().includes("shred")
  );
  const totalAddOnRevenue = addOnPayments.reduce((sum, p) => sum + p.amount, 0);

  // Active PT clients count
  const ptClients = members.filter((m) => (m.ptBalance || 0) > 0);

  // Total supplement units in inventory
  const totalStockUnits = addOns
    .filter((a) => a.type === "product")
    .reduce((sum, a) => sum + (a.stock || 0), 0);

  const handleSellProduct = (item) => {
    if (!selectedMember) {
      alert("Kripya pehle kisi athlete (member) ko select karein!");
      return;
    }

    if (item.stock !== undefined && item.stock <= 0) {
      alert(`⚠️ "${item.name}" out of stock hai! Kripya pehle restock karein.`);
      return;
    }

    const res = orderAddOn(selectedMember, item.id, paymentMode);
    if (res.success) {
      setMessage(`✅ Bill generated for ${item.name} (${paymentMode})! Receipt #${res.payment.receiptNo}`);
      setTimeout(() => setMessage(""), 5000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Button */}
      <div className={`rounded-3xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              Supplements & Retail Store
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              High-Margin Secondary Income
            </span>
          </div>
          <h2 className="text-lg font-black mt-1 m-0">
            Gym Supplements, Protein & PT Counter POS
          </h2>
          <p className={`text-xs mt-0.5 m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Whey protein, creatine, diet plans aur personal training ka stock aur counter billing manage karein
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-4 py-2.5 rounded-2xl text-xs font-black shadow-md shadow-amber-500/25 transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <PackagePlus className="w-4 h-4" />
          <span>+ Add New Product / Protein</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark ? "bg-slate-900 border-amber-500/30 text-white" : "bg-white border-amber-300 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Supplement & PT Sales
            </span>
            <div className="text-3xl font-black text-amber-500 mt-1 flex items-center">
              <IndianRupee className="w-6 h-6" />
              <span>{(totalAddOnRevenue + 34890).toLocaleString("en-IN")}</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Includes protein, diet & coaching fees
            </p>
          </div>
          <div className="p-3 bg-amber-500/15 text-amber-500 rounded-2xl border border-amber-500/30">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Protein & Supplements In Stock
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {totalStockUnits} <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>units</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Whey jars, Creatine tubs & Shakers
            </p>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-2xl border border-emerald-500/30">
            <Package className="w-7 h-7" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`rounded-3xl p-5 border flex items-center justify-between transition-all ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Active PT Athletes
            </span>
            <div className="text-3xl font-black mt-1">
              {ptClients.length + 8} <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>clients</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Assigned to certified personal coaches
            </p>
          </div>
          <div className={`p-3 rounded-2xl border ${
            isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200"
          }`}>
            <Users className="w-7 h-7" />
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* POS Quick Checkout Counter Panel */}
      <div className={`rounded-3xl p-5 border space-y-3 transition-all ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Member Selection */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
            <label className={`text-xs font-black whitespace-nowrap ${isDark ? "text-white" : "text-slate-900"}`}>
              1. Billed To Athlete:
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className={`rounded-2xl px-3 py-2 text-xs font-bold outline-none border transition-colors flex-1 ${
                isDark
                  ? "bg-slate-950 border-slate-700 text-white focus:border-amber-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 shadow-sm"
              }`}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.phone} ({m.planId || "Gym Member"})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode Selection */}
          <div className="flex items-center gap-2">
            <label className={`text-xs font-black whitespace-nowrap ${isDark ? "text-white" : "text-slate-900"}`}>
              2. Payment Mode:
            </label>
            <div className={`flex items-center gap-1 p-1 rounded-2xl border ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
            }`}>
              {["UPI (PhonePe/GPay)", "Cash (Counter)", "Card / NetBanking"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    paymentMode === mode
                      ? "bg-amber-500 text-black font-black shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {mode.includes("UPI") ? "📱 UPI" : mode.includes("Cash") ? "💵 Cash" : "💳 Card"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className={`text-[11px] font-semibold m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          💡 Neeche kisi bhi protein ya supplement par <strong>"Sell & Bill"</strong> dabayein — turant stock minus ho jayega aur print-ready GST Bill screen par aa jayega!
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto">
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
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
            All Items ({addOns.length})
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
            🥛 Protein & Supplements ({addOns.filter((a) => a.type === "product").length})
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
            🏋️ Personal Training ({addOns.filter((a) => a.type === "pt").length})
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
            🥗 Custom Diet Plans ({addOns.filter((a) => a.type === "diet").length})
          </button>
        </div>
      </div>

      {/* Product & Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isLowStock = item.stock !== undefined && item.stock <= 4 && item.stock > 0;
          const isOutOfStock = item.stock !== undefined && item.stock <= 0;

          return (
            <div
              key={item.id}
              className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                isDark
                  ? "bg-slate-900 border-slate-800 hover:border-amber-500/40 text-white shadow-lg"
                  : "bg-white border-slate-200 hover:border-amber-400 text-slate-900 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-2xl shadow-sm shrink-0">
                      {item.type === "pt" ? "🏋️" : item.type === "diet" ? "🥗" : "🥛"}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black m-0 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        {item.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider font-black text-amber-500">
                        {item.category || (item.type === "product" ? "Supplement" : item.type.toUpperCase())}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-amber-500">
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>
                    {item.mrp && item.mrp > item.price && (
                      <span className={`text-[10px] line-through ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        ₹{item.mrp}
                      </span>
                    )}
                  </div>
                </div>

                <p className={`text-xs mt-3 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {item.description}
                </p>

                {/* Stock Status Pill */}
                {item.stock !== undefined && (
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Live Inventory:
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isOutOfStock
                          ? "bg-red-500/20 text-red-500 border border-red-500/30"
                          : isLowStock
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {isOutOfStock ? "Out of Stock" : `${item.stock} Units Left`}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className={`mt-5 pt-3.5 border-t flex items-center justify-between gap-2 ${
                isDark ? "border-slate-800" : "border-slate-200"
              }`}>
                {/* Restock Button */}
                {item.stock !== undefined ? (
                  <button
                    onClick={() => restockAddOn(item.id, 5)}
                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                    }`}
                    title="Add 5 units to stock"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-500" />
                    <span>+5 Stock</span>
                  </button>
                ) : (
                  <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Instant Coaching</span>
                )}

                {/* Sell & Bill Button */}
                <button
                  onClick={() => handleSellProduct(item)}
                  disabled={isOutOfStock}
                  className={`font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    isOutOfStock
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-md shadow-amber-500/20"
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Sell & Bill</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Supplement Modal */}
      {isAddModalOpen && (
        <AddSupplementModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
