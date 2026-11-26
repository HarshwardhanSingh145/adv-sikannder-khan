import React from "react";
import { X, Printer, Download, CheckCircle2, ShieldCheck, Scale } from "lucide-react";
import { FeePaymentRecord } from "../../../types/admin";
import { formatDateDMY } from "../../../lib/dateFormat";

interface ReceiptModalProps {
  payment: FeePaymentRecord;
  historyItem?: {
    id: string;
    amount: number;
    date: string;
    mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque";
    receiptNo: string;
    note?: string;
  };
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, historyItem, onClose }) => {
  const receipt = historyItem || payment.history[0] || {
    id: `rec-${Date.now()}`,
    amount: payment.paidAmount,
    date: payment.lastPaymentDate || new Date().toISOString().split("T")[0],
    mode: "Cash" as const,
    receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
    note: "Legal Consultation & Court Representation Fee",
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Generate text/file download or trigger window print
    const element = document.getElementById("printable-receipt");
    if (!element) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Advocate_Receipt_${receipt.receiptNo}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #111; }
              .header { text-align: center; border-bottom: 2px solid #EFF6FF; padding-bottom: 15px; margin-bottom: 20px; }
              .seal { border: 2px solid #000; padding: 10px; display: inline-block; margin-top: 20px; font-weight: bold; }
              .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
              .total { font-size: 18px; font-weight: bold; color: #047857; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div className="header">
              <h2>ADVOCATE SIKANDAR KHAN</h2>
              <p>Chamber No. 4, Civil & District Court Complex, Makrana (Nagaur), Rajasthan</p>
              <p>Phone: +91 9257923773 | Email: advocate.sikandar@lawfirm.in</p>
            </div>
            <h3>FEE PAYMENT RECEIPT #${receipt.receiptNo}</h3>
            <div className="row"><span>Date:</span> <strong>${formatDateDMY(receipt.date)}</strong></div>
            <div className="row"><span>Received From (Client):</span> <strong>${payment.clientName}</strong></div>
            <div className="row"><span>Case Number:</span> <strong>${payment.caseNumber}</strong></div>
            <div className="row"><span>Payment Mode:</span> <strong>${receipt.mode}</strong></div>
            <div className="row"><span>Particulars / Notes:</span> <strong>${receipt.note || "Court Litigation & Professional Fees"}</strong></div>
            <div className="total">Amount Received: ₹${receipt.amount.toLocaleString()} INR</div>
            <div className="seal">OFFICIAL ADVOCATE SEAL & SIGNATURE</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-[#0F172A]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#475569]/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FFFFFF]/80 border border-[#475569]/25 flex items-center justify-center shadow-md shadow-[#1D4ED8]/15">
              <Scale className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#0F172A]">Official Advocate Fee Receipt</h3>
              <p className="text-[10px] text-[#1D4ED8] font-semibold">Receipt #{receipt.receiptNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#FFFFFF]/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div id="printable-receipt" className="p-6 bg-[#FFFFFF]/80/80 border border-[#475569]/25 rounded-xl space-y-4 text-xs relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
            <Scale className="w-32 h-32 text-[#0F172A]" />
          </div>

          <div className="text-center border-b border-[#475569]/25 pb-3">
            <h4 className="text-base font-bold font-serif text-[#0F172A]">ADVOCATE SIKANDAR KHAN</h4>
            <p className="text-[10px] text-[#1D4ED8] font-semibold">Civil, Revenue & High Court Litigation Specialist</p>
            <p className="text-[10px] text-[#475569] font-medium">Chamber No. 4, Civil Court Makrana, Nagaur, Rajasthan</p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">Receipt No:</span>
              <span className="font-extrabold text-[#0F172A]">{receipt.receiptNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">Payment Date:</span>
              <span className="font-bold text-[#0F172A]">{formatDateDMY(receipt.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">Client Name:</span>
              <span className="font-extrabold text-[#0F172A]">{payment.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">Case Number:</span>
              <span className="font-extrabold text-[#0F172A]">{payment.caseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">Payment Mode:</span>
              <span className="font-extrabold text-emerald-400">{receipt.mode}</span>
            </div>
            {receipt.note && (
              <div className="flex justify-between">
                <span className="text-[#475569] font-semibold">Notes / Purpose:</span>
                <span className="font-semibold text-[#0F172A]">{receipt.note}</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl flex items-center justify-between mt-4">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#1D4ED8]">Amount Received</span>
              <p className="text-xl font-bold font-serif text-emerald-400">₹{receipt.amount.toLocaleString()} INR</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="pt-4 border-t border-[#475569]/25 flex justify-between items-end text-[10px] text-[#1D4ED8]">
            <div>
              <p className="font-bold text-[#0F172A]">Advocate Office Seal</p>
              <p className="font-medium">Digitally Authenticated</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0F172A]">Adv. Sikandar Khan</p>
              <p className="font-medium">Enrolment No: R/2918/2018</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 border border-[#475569]/25 rounded-xl text-[#0F172A] text-xs font-bold hover:bg-[#FFFFFF]/80 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#0F172A]" /> Save / Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#EFF6FF] text-black font-bold rounded-xl text-xs hover:bg-[#EFF6FF] flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
