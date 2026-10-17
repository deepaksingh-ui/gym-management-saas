import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import confetti from "canvas-confetti";
import {
  Flame,
  QrCode,
  Calendar,
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Dumbbell,
  Tag,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import UpiPaymentModal from "../modals/UpiPaymentModal";

export default function MemberPortal() {
  const {
    currentMember,
    members,
    setSelectedMemberId,
    plans,
    addOns,
    trainers,
    processCheckIn,
    renewMembership,
    orderAddOn,
    settings,
    checkIns,
  } = useGym();

  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'renew' | 'shop' | 'history'
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("plan-3m");
  const [couponCode, setCouponCode] = useState("FIT10");
  const [couponApplied, setCouponApplied] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const member = currentMember;
  if (!member) {
    return (
      <div className="p-8 text-center text-neutral-400 space-y-3">
        <p className="text-sm">Member record not found or no member selected.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs bg-amber-500 text-black px-4 py-2 rounded-xl font-bold"
        >
          Reload
        </button>
      </div>
    );
  }

  const currentPlan = plans.find((p) => p.id === member.planId) || plans[0] || { name: "Active Plan", price: 0 };
  const trainer = trainers.find((t) => t.id === member.assignedTrainerId);

  // Trigger QR Check-in simulation
  const handleQRScan = () => {
    setIsScanning(true);
    setScanMessage(null);

    setTimeout(() => {
      setIsScanning(false);
      const res = processCheckIn(member.id, "Member QR Scan");

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#10b981", "#ef4444"],
        });
        setScanMessage({
          type: "success",
          text: `Attendance Marked! 🔥 Current Streak: ${member.streak + 1} Days`,
        });
      } else {
        setScanMessage({
          type: res.isDuplicate ? "warning" : "error",
          text: res.message,
        });
      }

      setTimeout(() => setScanMessage(null), 5000);
    }, 1200);
  };

  // Handle Member Renewal
  const handleRenew = () => {
    const res = renewMembership(member.id, selectedPlanId, "UPI (Online)");
    if (res.success) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
      setPaymentSuccess(res);
      setTimeout(() => {
        setPaymentSuccess(null);
        setActiveTab("home");
      }, 4000);
    }
  };

  // Add-on purchase
  const handleBuyAddOn = (item) => {
    const res = orderAddOn(member.id, item.id);
    if (res.success) {
      confetti({ particleCount: 50 });
      alert(`Success! ${res.message}`);
    } else {
      alert(res.message);
    }
  };

  // Member's recent check-ins
  const memberCheckins = checkIns.filter((c) => c.memberId === member.id);

  // Days remaining calculation
  const today = new Date();
  const expiry = new Date(member.expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-md mx-auto">
      {/* Mobile Frame Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden min-h-[720px] flex flex-col justify-between">
        {/* Mobile Header */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-500"
              />
              <div>
                <h3 className="text-sm font-black text-white m-0">{member.name}</h3>
                <span className="text-[11px] text-neutral-400 font-mono">{member.phone}</span>
              </div>
            </div>

            {/* Member Status Badge */}
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  member.status === "active"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : member.status === "expiring"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {member.status}
              </span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mt-4 grid grid-cols-4 gap-1 bg-neutral-900 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("home")}
              className={`py-1.5 rounded-lg transition cursor-pointer text-center ${
                activeTab === "home" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Pass
            </button>
            <button
              onClick={() => setActiveTab("renew")}
              className={`py-1.5 rounded-lg transition cursor-pointer text-center relative ${
                activeTab === "renew" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Renew
              {daysLeft <= 7 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className={`py-1.5 rounded-lg transition cursor-pointer text-center ${
                activeTab === "shop" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Store
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-1.5 rounded-lg transition cursor-pointer text-center ${
                activeTab === "history" ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* TAB 1: PASS & CHECK-IN */}
          {activeTab === "home" && (
            <div className="space-y-4">
              {/* Membership Card */}
              <div className="relative bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-2xl p-4 text-black shadow-lg shadow-amber-500/10 overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
                  <Dumbbell className="w-32 h-32" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded-full">
                    {currentPlan.name}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {member.status}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-xs opacity-75">Member Name</span>
                  <div className="text-lg font-black tracking-tight">{member.name}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-black/20 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="text-[10px] opacity-75 block">Valid Till</span>
                    <span>{member.expiryDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] opacity-75 block">Days Remaining</span>
                    <span className="font-bold">{daysLeft > 0 ? `${daysLeft} Days` : "Expired"}</span>
                  </div>
                </div>
              </div>

              {/* Renewal Expiry Warning Banner if <= 7 days */}
              {daysLeft <= 7 && (
                <div
                  onClick={() => setActiveTab("renew")}
                  className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 flex items-center justify-between text-xs cursor-pointer hover:bg-red-500/20 transition"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Membership Expiring in {daysLeft} Days!</span>
                      <p className="text-[11px] text-neutral-300 m-0">Renew now to keep streak & get 10% OFF</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-red-400" />
                </div>
              )}

              {/* Fair Streak & Weekly Goal Widget */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
                      <Flame className="w-5 h-5 fill-amber-500" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Fair Streak</div>
                      <div className="text-base font-black text-white">
                        {member.streak} Days Active 🔥
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-neutral-400 block">Weekly Goal</span>
                    <span className="text-emerald-400 font-bold">
                      {Math.min(member.weeklyGoalDays || 4, (member.streak % 7) + 2)} / {member.weeklyGoalDays || 4} Days
                    </span>
                  </div>
                </div>

                {/* Fair Streak note */}
                <p className="text-[10px] text-neutral-500 mt-2.5 m-0 border-t border-neutral-800/80 pt-2">
                  ✓ Protected: Rest days or authorized leaves do not break your streak.
                </p>
              </div>

              {/* QR Check-in Action Box */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-3">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider m-0">
                  Gym Check-in
                </h4>

                <button
                  onClick={handleQRScan}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <QrCode className="w-5 h-5" />
                  <span>{isScanning ? "Verifying with Gym Counter..." : "Tap to Scan Gym Counter QR"}</span>
                </button>

                {scanMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 text-left ${
                      scanMessage.type === "success"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : scanMessage.type === "warning"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-red-500/20 text-red-300 border border-red-500/40"
                    }`}
                  >
                    {scanMessage.type === "success" ? (
                      <CheckCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{scanMessage.text}</span>
                  </div>
                )}

                <p className="text-[11px] text-neutral-500 m-0">
                  Point phone at counter QR screen to mark attendance instantly
                </p>
              </div>

              {/* Assigned Trainer Contact */}
              {trainer && (
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-sm">
                      🏋️
                    </div>
                    <div>
                      <div className="font-bold text-white">{trainer.name}</div>
                      <div className="text-[10px] text-neutral-400">{trainer.specialty}</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${trainer.phone}`}
                    className="bg-neutral-800 hover:bg-neutral-700 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Contact Coach
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RENEWAL CHECKOUT */}
          {activeTab === "renew" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white m-0">Choose Renewal Duration</h4>
                <p className="text-xs text-neutral-400 mt-0.5 m-0">Lock in discount before your plan expires</p>
              </div>

              {/* Plans selector */}
              <div className="space-y-2">
                {plans.map((p) => {
                  const isSelected = selectedPlanId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500"
                          : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          checked={isSelected}
                          onChange={() => setSelectedPlanId(p.id)}
                          className="accent-amber-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.discountBadge && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                                {p.discountBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400">{p.durationMonths} Months access</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-amber-400">
                          {settings.currency}{p.price.toLocaleString("en-IN")}
                        </div>
                        <span className="text-[10px] text-neutral-500 line-through">
                          ₹{p.mrp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon Code"
                    className="bg-transparent text-white font-mono uppercase font-bold outline-none w-24 text-xs"
                  />
                </div>
                <button
                  onClick={() => setCouponApplied(couponCode.toUpperCase() === "FIT10")}
                  className="text-amber-400 font-bold text-xs"
                >
                  {couponApplied ? "✓ Applied (10% OFF)" : "Apply"}
                </button>
              </div>

              {/* Bill Breakdown */}
              {(() => {
                const plan = plans.find((p) => p.id === selectedPlanId) || plans[0];
                const discount = couponApplied ? Math.round(plan.price * 0.1) : 0;
                const finalAmount = plan.price - discount;

                return (
                  <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>Base Plan Price:</span>
                      <span className="text-white">₹{plan.price}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Coupon "FIT10" (10%):</span>
                        <span>- ₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-400">
                      <span>GST (Included):</span>
                      <span className="text-white">18% Included</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-sm text-white">
                      <span>Total Payable:</span>
                      <span className="text-amber-400 font-black">₹{finalAmount}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Pay Now Button */}
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay via UPI / GPay / PhonePe / Counter</span>
              </button>

              {paymentSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold text-center">
                  Payment Verified! Receipt #{paymentSuccess.receiptNo}. Extended till {paymentSuccess.newExpiryDate}!
                </div>
              )}
            </div>
          )}

          {/* UPI Payment Modal */}
          <UpiPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            plan={plans.find((p) => p.id === selectedPlanId) || plans[0]}
            discount={couponApplied ? Math.round((plans.find((p) => p.id === selectedPlanId)?.price || 0) * 0.1) : 0}
            finalAmount={
              (plans.find((p) => p.id === selectedPlanId)?.price || 0) -
              (couponApplied ? Math.round((plans.find((p) => p.id === selectedPlanId)?.price || 0) * 0.1) : 0)
            }
            member={member}
            onSuccess={(res) => {
              setPaymentSuccess(res);
              setTimeout(() => {
                setPaymentSuccess(null);
                setActiveTab("home");
              }, 3000);
            }}
          />

          {/* TAB 3: STORE / ADD-ONS */}
          {activeTab === "shop" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white m-0">Add-On Marketplace</h4>
              <p className="text-xs text-neutral-400 m-0">Personal coaching, diet plans & supplements</p>

              <div className="space-y-2.5 mt-2">
                {addOns.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 m-0 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="text-xs font-black text-amber-400 mt-1">
                        ₹{item.price}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyAddOn(item)}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white m-0">Attendance History</h4>
              <p className="text-xs text-neutral-400 m-0">All verified visits to {settings.gymName}</p>

              <div className="space-y-2 mt-2">
                {memberCheckins.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-500">
                    No check-in entries logged yet. Tap "Tap to Scan Gym Counter QR" to mark attendance!
                  </div>
                ) : (
                  memberCheckins.map((chk) => (
                    <div
                      key={chk.id}
                      className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                        <div>
                          <div className="font-semibold text-white">{chk.date}</div>
                          <div className="text-[10px] text-neutral-500">{chk.method}</div>
                        </div>
                      </div>
                      <span className="font-mono text-neutral-300 text-[11px]">{chk.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Footer branding */}
        <div className="bg-neutral-950 p-2 text-center border-t border-neutral-800 text-[10px] text-neutral-500">
          Powered by {settings.gymName} Mobile Portal
        </div>
      </div>
    </div>
  );
}

