import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import { X, PackagePlus, IndianRupee, Tag, Layers, FileText } from "lucide-react";

export default function AddSupplementModal({ onClose }) {
  const { addAddOn, theme } = useGym();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    type: "product", // 'product' | 'pt' | 'diet'
    category: "Whey Protein",
    price: "",
    mrp: "",
    stock: "10",
    description: "",
  });

  const categories = [
    "Whey Protein",
    "Creatine & Pre-workout",
    "BCAA & Aminos",
    "Peanut Butter & Oats",
    "Protein Bars & Drinks",
    "Gym Shakers & Straps",
    "Personal Training",
    "Custom Diet Plan",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Kripya product ka naam aur price daalein!");
      return;
    }

    addAddOn({
      name: formData.name,
      type: formData.type,
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp) || Number(formData.price),
      stock: Number(formData.stock) || 10,
      description: formData.description || `${formData.category} item available at front desk.`,
    });

    alert(`✅ "${formData.name}" successfully added to gym inventory!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-md w-full p-6 border shadow-2xl space-y-5 animate-in fade-in duration-200 ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black m-0 leading-tight">
                Add Supplement / Product
              </h3>
              <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Protein, Creatine, Shaker, PT ya Diet store inventory mein jodein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isDark ? "bg-slate-800 text-slate-400 hover:text-white border-slate-700" : "bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-300"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Product / Supplement Name:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gold Standard 100% Whey (2kg Choco)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold outline-none border transition-colors ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 shadow-sm"
              }`}
            />
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Category:
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  const type = cat.includes("Training") ? "pt" : cat.includes("Diet") ? "diet" : "product";
                  setFormData({ ...formData, category: cat, type });
                }}
                className={`w-full rounded-2xl px-3 py-2.5 text-xs font-semibold outline-none border ${
                  isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900 shadow-sm"
                }`}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Stock Quantity (Jars/Units):
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="10"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold outline-none border ${
                  isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900 shadow-sm"
                }`}
              />
            </div>
          </div>

          {/* Selling Price & MRP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Selling Price (₹):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500">₹</span>
                <input
                  type="number"
                  required
                  placeholder="2499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full rounded-2xl pl-7 pr-3 py-2.5 text-xs font-bold outline-none border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900 shadow-sm"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                MRP (Crossed Out):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="3499"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  className={`w-full rounded-2xl pl-7 pr-3 py-2.5 text-xs font-bold outline-none border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900 shadow-sm"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Description / Flavor / Highlights:
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 25g Whey Isolate, Chocolate Fudge flavor, 60 servings"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full rounded-2xl px-3.5 py-2 text-xs outline-none border resize-none ${
                isDark ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm"
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black px-5 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              Save to Gym Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

