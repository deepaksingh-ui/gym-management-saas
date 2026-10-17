import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Smartphone,
  CreditCard,
  Banknote,
  ArrowRight,
  IndianRupee,
  Clock,
  Sparkles,
} from "lucide-react";

export default function UpiPaymentModal({
  isOpen,
  onClose,
  plan,
  discount = 0,
  finalAmount,
  member,
  onSuccess,
}) {
  const { settings, renewMembership } = useGym();
  const [paymentMethod, setPaymentMethod] = useState("upi_qr"); // 'upi_qr' | 'upi_apps' | 'cash_counter'
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen || !plan) return null;

  const upiId = settings.upiId || "fitzone@okaxis";
  const gymName = settings.gymName || "FitZone Gym";
  const amount = finalAmount || plan.price;

  // Real UPI Deep Link string according to NPCI UPI Specifications:
  // upi://pay?pa={UPI_ID}&pn={NAME}&am={AMOUNT}&cu=INR&tn={NOTE}
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(gymName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`${plan.name} Renewal - ${member?.name || "Member"}`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleConfirmPayment = (methodUsed = "UPI Online") => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const res = renewMembership(member.id, plan.id, methodUsed);

      setTimeout(() => {
        if (onSuccess) onSuccess(res);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <h3 className="text-sm font-bold text-white m-0">
                Payment & Renewal
              </h3>
              <span className="text-[11px] text-neutral-400">
                Direct to Gym Owner Account
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

        {/* Order Summary Pill */}
        <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">{plan.name}</div>
            <div className="text-[11px] text-neutral-400">
              Valid for {plan.durationMonths} Months ({member?.name})
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-amber-400 flex items-center justify-end">
              <IndianRupee className="w-4 h-4" />
              <span>{amount.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <span className="text-[10px] text-emerald-400 block font-semibold">
                Saved ₹{discount} with coupon
              </span>
            )}
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-1 rounded-xl text-xs font-semibold border border-neutral-800">
          <button
            onClick={() => setPaymentMethod("upi_qr")}
            className={`py-2 rounded-lg transition cursor-pointer text-center ${
              paymentMethod === "upi_qr"
                ? "bg-amber-500 text-black font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Scan UPI QR
          </button>
          <button
            onClick={() => setPaymentMethod("upi_apps")}
            className={`py-2 rounded-lg transition cursor-pointer text-center ${
              paymentMethod === "upi_apps"
                ? "bg-amber-500 text-black font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            UPI Apps
          </button>
          <button
            onClick={() => setPaymentMethod("cash_counter")}
            className={`py-2 rounded-lg transition cursor-pointer text-center ${
              paymentMethod === "cash_counter"
                ? "bg-amber-500 text-black font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Pay at Desk
          </button>
        </div>

        {/* Content Tab 1: Dynamic Real UPI QR */}
        {paymentMethod === "upi_qr" && (
          <div className="text-center space-y-3">
            <p className="text-xs text-neutral-300 m-0">
              Kisi bhi UPI app (GPay, PhonePe, Paytm) se scan karke pay karein:
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-md">
              <QRCodeSVG value={upiDeepLink} size={160} level="M" />
            </div>

            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between text-xs max-w-xs mx-auto">
              <span className="text-neutral-400 font-mono text-[11px] truncate">
                UPI: <strong className="text-white">{upiId}</strong>
              </span>
              <button
                onClick={handleCopyUpi}
                className="text-amber-400 font-bold hover:text-amber-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedUpi ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            {/* Simulated verification button */}
            <button
              onClick={() => handleConfirmPayment("UPI QR")}
              disabled={isVerifying || verifiedSuccess}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {verifiedSuccess
                  ? "✓ Payment Verified!"
                  : isVerifying
                  ? "Verifying Transaction..."
                  : "I Have Paid / Verify Payment"}
              </span>
            </button>
          </div>
        )}

        {/* Content Tab 2: Direct UPI App Intents */}
        {paymentMethod === "upi_apps" && (
          <div className="space-y-3">
            <p className="text-xs text-neutral-300 m-0">
              Apne mobile par installed UPI app choose karein:
            </p>

            <div className="space-y-2">
              <a
                href={upiDeepLink}
                className="w-full bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 p-3 rounded-xl flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                    G
                  </div>
                  <div>
                    <div className="font-bold text-white">Google Pay</div>
                    <div className="text-[10px] text-neutral-400">Direct open in GPay</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </a>

              <a
                href={upiDeepLink}
                className="w-full bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 p-3 rounded-xl flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                    Pe
                  </div>
                  <div>
                    <div className="font-bold text-white">PhonePe</div>
                    <div className="text-[10px] text-neutral-400">Direct open in PhonePe</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </a>

              <a
                href={upiDeepLink}
                className="w-full bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 p-3 rounded-xl flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                    Pay
                  </div>
                  <div>
                    <div className="font-bold text-white">Paytm UPI / BHIM</div>
                    <div className="text-[10px] text-neutral-400">Direct open in Paytm</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </a>
            </div>

            <button
              onClick={() => handleConfirmPayment("UPI App")}
              disabled={isVerifying || verifiedSuccess}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {verifiedSuccess
                  ? "✓ Payment Verified!"
                  : isVerifying
                  ? "Verifying Transaction..."
                  : "I Have Completed UPI Payment"}
              </span>
            </button>
          </div>
        )}

        {/* Content Tab 3: Pay at Reception Counter */}
        {paymentMethod === "cash_counter" && (
          <div className="space-y-4">
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Banknote className="w-4 h-4" />
                <span>Pay Cash or Card at Gym Desk</span>
              </div>
              <p className="m-0 leading-relaxed text-[11px] text-neutral-400">
                Aap gym ke counter par jakar cash ya card se fee jama kar sakte hain. Receptionist turant aapki entry mark karke receipt print kar degi.
              </p>
            </div>

            <button
              onClick={() => handleConfirmPayment("Cash at Desk")}
              disabled={isVerifying || verifiedSuccess}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {verifiedSuccess
                  ? "✓ Recorded at Counter!"
                  : "Confirm Counter Cash / Card Payment"}
              </span>
            </button>
          </div>
        )}

        {/* Security badge */}
        <div className="text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Direct to Gym Owner Account • Instant GST Receipt</span>
        </div>
      </div>
    </div>
  );
}

