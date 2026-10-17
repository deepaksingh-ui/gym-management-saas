import React from "react";
import { useGym } from "../../context/GymContext";
import { X, Printer, CheckCircle, Dumbbell } from "lucide-react";

export default function InvoiceModal({ payment, onClose }) {
  const { settings } = useGym();

  if (!payment) return null;

  const basePrice = Math.round(payment.amount / 1.18);
  const gstAmount = payment.amount - basePrice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Payment Receipt
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="bg-white text-neutral-900 p-6 rounded-2xl shadow-inner space-y-4 font-sans text-xs">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-3 text-center">
            <h2 className="text-base font-black tracking-tight text-neutral-950 uppercase m-0">
              {settings.gymName}
            </h2>
            <p className="text-[10px] text-neutral-600 m-0">{settings.address}</p>
            <div className="text-[10px] text-neutral-600 font-mono mt-0.5">
              Phone: {settings.phone} | GSTIN: {settings.gstin}
            </div>
          </div>

          {/* Receipt Info */}
          <div className="flex justify-between text-[11px] border-b border-neutral-100 pb-2">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">Billed To</span>
              <strong className="text-neutral-950">{payment.memberName}</strong>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">Receipt No</span>
              <strong className="font-mono text-neutral-950">{payment.receiptNo}</strong>
              <div className="text-[10px] text-neutral-500">{payment.date}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[9px]">
                <th className="py-1">Description</th>
                <th className="py-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="py-2">
                  <div className="font-bold text-neutral-950">{payment.planName}</div>
                  <div className="text-[9px] text-neutral-500">Mode: {payment.method} ({payment.status})</div>
                </td>
                <td className="py-2 text-right font-mono font-bold text-neutral-950">
                  ₹{payment.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Tax Breakdown */}
          <div className="border-t border-neutral-200 pt-2 space-y-1 text-[10px] text-neutral-600">
            <div className="flex justify-between">
              <span>Taxable Base Value:</span>
              <span className="font-mono">₹{basePrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%) + SGST (9%):</span>
              <span className="font-mono">₹{gstAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-black text-xs text-neutral-950 border-t border-neutral-200 pt-1.5">
              <span>Total Received:</span>
              <span className="font-mono text-sm">₹{payment.amount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Stamp / Verification */}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-200 text-[9px] text-neutral-500">
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified & Paid</span>
            </div>
            <div className="text-right">
              Authorized Signatory
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}

