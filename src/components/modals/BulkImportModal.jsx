import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Download, Trash2, ArrowRight } from "lucide-react";

export default function BulkImportModal({ onClose }) {
  const { bulkImportMembers, clearAllMembers, plans } = useGym();
  const [pasteData, setPasteData] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [previewRows, setPreviewRows] = useState([]);
  const [importedCount, setImportedCount] = useState(null);

  // Sample CSV format: Name, Phone, Plan, ExpiryDate, AbsentDays
  const handleParse = (rawText) => {
    if (!rawText.trim()) {
      setPreviewRows([]);
      return;
    }

    const lines = rawText.trim().split("\n");
    const parsed = [];

    lines.forEach((line) => {
      // Split by comma or tab (if pasted from Excel)
      const parts = line.includes("\t") ? line.split("\t") : line.split(",");
      const name = parts[0]?.trim();
      const phone = parts[1]?.trim();
      const planName = parts[2]?.trim() || "Quarterly Transformation";
      const expiryDate = parts[3]?.trim();
      const absentDays = parts[4]?.trim() || "0";

      if (name && name.toLowerCase() !== "name") {
        // Find matching plan
        const matchedPlan =
          plans.find(
            (p) =>
              p.name.toLowerCase().includes(planName.toLowerCase()) ||
              p.id.toLowerCase().includes(planName.toLowerCase())
          ) || plans[1];

        parsed.push({
          name,
          phone: phone || "+91 98000 00000",
          planId: matchedPlan.id,
          planName: matchedPlan.name,
          expiryDate: expiryDate || new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split("T")[0],
          absentDays: Number(absentDays) || 0,
        });
      }
    });

    setPreviewRows(parsed);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setPasteData(text);
      handleParse(text);
    };
    reader.readAsText(file);
  };

  const downloadSampleTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Phone,Plan,ExpiryDate,AbsentDays\n" +
      "Rohit Sharma,9826011111,Quarterly Transformation,2026-12-15,0\n" +
      "Sunil Verma,9826022222,Monthly Starter,2026-10-25,12\n" +
      "Priya Kapoor,9826033333,Half-Yearly Shred,2027-02-10,0\n" +
      "Amit Patel,9826044444,Annual Elite Champion,2027-06-01,15\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gym_members_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    if (previewRows.length === 0) {
      alert("No members detected to import! Please paste or upload data first.");
      return;
    }

    const count = bulkImportMembers(previewRows, replaceExisting);
    setImportedCount(count);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white m-0">
                Bulk Import Client's Existing Members
              </h3>
              <span className="text-xs text-neutral-400">
                Gym ke Excel sheet ya register se 1-click mein saare members load karein
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

        {/* Options Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-3 rounded-2xl border border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="replaceData"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="replaceData" className="text-neutral-300 cursor-pointer">
              <strong>Replace Sample Demo Data</strong> (Clean Slate for this new client gym)
            </label>
          </div>

          <button
            onClick={downloadSampleTemplate}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Sample Excel / CSV</span>
          </button>
        </div>

        {/* Upload or Paste */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300">
              Option 1: Paste Text from Excel / Notepad (Name, Phone, Plan, ExpiryDate)
            </span>
            <label className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Upload .CSV File</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            rows={5}
            value={pasteData}
            onChange={(e) => {
              setPasteData(e.target.value);
              handleParse(e.target.value);
            }}
            placeholder={`Paste rows from Excel or type here:\nRohit Sharma, 9826011111, Quarterly Transformation, 2026-12-15, 0\nSunil Verma, 9826022222, Monthly Starter, 2026-10-25, 14\nPriya Kapoor, 9826033333, Half-Yearly Shred, 2027-02-10, 0`}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-3 text-xs text-white font-mono placeholder-neutral-600 outline-none focus:border-amber-500"
          />
        </div>

        {/* Preview Table */}
        {previewRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">
                ✓ Ready to Import {previewRows.length} Members:
              </span>
              <button
                onClick={() => {
                  setPasteData("");
                  setPreviewRows([]);
                }}
                className="text-neutral-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto border border-neutral-800 rounded-2xl bg-neutral-950">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-900 text-neutral-400 uppercase text-[9px] sticky top-0">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Plan</th>
                    <th className="p-2">Expiry</th>
                    <th className="p-2">Absent (d)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {previewRows.slice(0, 15).map((row, i) => (
                    <tr key={i} className="hover:bg-neutral-900/40">
                      <td className="p-2 font-bold text-white">{row.name}</td>
                      <td className="p-2 font-mono text-neutral-400">{row.phone}</td>
                      <td className="p-2 text-neutral-300">{row.planName}</td>
                      <td className="p-2 font-mono text-neutral-300">{row.expiryDate}</td>
                      <td className="p-2 font-bold text-amber-400">{row.absentDays}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewRows.length > 15 && (
                <div className="p-2 text-center text-[10px] text-neutral-500">
                  ...and {previewRows.length - 15} more members
                </div>
              )}
            </div>
          </div>
        )}

        {importedCount !== null && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Success! Imported {importedCount} members into this gym client's database!</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={previewRows.length === 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              previewRows.length > 0
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            <span>Confirm & Import Members</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

