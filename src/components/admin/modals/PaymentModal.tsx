import React, { useState } from "react";
import { X, CreditCard, DollarSign } from "lucide-react";
import { FeePaymentRecord, CaseRecord } from "../../../types/admin";

interface PaymentModalProps {
  payment?: FeePaymentRecord | null;
  cases: CaseRecord[];
  onCollectPayment: (caseId: string, amount: number, mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque", note: string) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ payment, cases, onCollectPayment, onClose }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(payment?.caseId || cases[0]?.id || "");
  const [amountInput, setAmountInput] = useState<number>(5000);
  const [modeInput, setModeInput] = useState<"Cash" | "UPI" | "Bank Transfer" | "Cheque">("Cash");
  const [noteInput, setNoteInput] = useState<string>("Part Fee Payment for Case Litigation");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) {
      alert("Please select a Case Record.");
      return;
    }
    if (!amountInput || amountInput <= 0) {
      alert("Please enter a valid positive payment amount.");
      return;
    }

    onCollectPayment(selectedCaseId, Number(amountInput), modeInput, noteInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-[#221C16]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#706C61]/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E2DDD0]/80 border border-[#706C61]/25 flex items-center justify-center shadow-md shadow-[#524738]/15">
              <CreditCard className="w-5 h-5 text-[#221C16]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#221C16]">Collect Advocate Fee Payment</h3>
              <p className="text-[10px] text-[#524738] font-semibold">Generate Instant Advocate Fee Receipt</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#706C61] hover:text-[#221C16] hover:bg-[#E2DDD0]/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#221C16] font-bold mb-1">Select Case Record *</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#706C61]/35"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.clientName} ({c.caseTitle})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Amount Collected (₹) *</label>
              <input
                type="number"
                required
                min={100}
                value={amountInput}
                onChange={(e) => setAmountInput(Number(e.target.value))}
                className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-xl p-2.5 text-[#221C16] font-bold outline-none focus:border-[#706C61]/35"
              />
            </div>

            <div>
              <label className="block text-[#221C16] font-bold mb-1">Payment Mode</label>
              <select
                value={modeInput}
                onChange={(e) => setModeInput(e.target.value as any)}
                className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#706C61]/35"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / Google Pay</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#221C16] font-bold mb-1">Payment Particulars / Note</label>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Interim Fee installment / Legal Opinion"
              className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#706C61]/35"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#706C61]/25">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#706C61]/25 rounded-xl text-[#221C16] font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#EFE9DC] text-black font-bold rounded-xl shadow-md hover:bg-[#EFE9DC]">
              Record & Generate Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
