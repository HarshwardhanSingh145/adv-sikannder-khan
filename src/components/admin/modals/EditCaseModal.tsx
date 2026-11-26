import React, { useState } from "react";
import { X, Edit3 } from "lucide-react";
import { CaseRecord, CaseStage, CaseStatus, CasePriority } from "../../../types/admin";

interface EditCaseModalProps {
  caseRecord: CaseRecord;
  onSave: (caseId: string, updates: Partial<CaseRecord>) => void;
  onClose: () => void;
}

const STANDARD_STAGES = [
  "Charge",
  "Appearance of the Accused",
  "Bail Jump",
  "Evidence",
  "Argument",
  "Order",
  "Judgment",
  "Notice Issued",
  "Reply Filed",
];

const COURT_OPTIONS = [
  "ACJM Makrana",
  "ADJ Makrana",
  "MJM Makrana",
  "ADJ Parbatsar",
  "ACJM Parbatsar",
  "ADJ Kuchaman",
  "ACJM Kuchaman",
  "POCSO Court Didwana",
  "SC/ST Court Didwana",
  "SDO Court Makrana",
];

export const EditCaseModal: React.FC<EditCaseModalProps> = ({ caseRecord, onSave, onClose }) => {
  const isCustomStageInitial = Boolean(caseRecord.currentStage && !STANDARD_STAGES.includes(caseRecord.currentStage));
  
  const [formData, setFormData] = useState({
    partyName: caseRecord.partyName || caseRecord.clientName,
    clientName: caseRecord.clientName,
    clientMobile: caseRecord.clientMobile || "",
    caseTitle: caseRecord.caseTitle,
    caseNumber: caseRecord.caseNumber,
    caseType: caseRecord.caseType.includes("Criminal") ? "Criminal" : "Civil",
    caseBackground: caseRecord.caseBackground || "None",
    courtName: caseRecord.courtName || "ACJM Makrana",
    act: caseRecord.act || "CPC / IPC / Special Act",
    opponentName: caseRecord.opponentName,
    stageOption: isCustomStageInitial ? "Custom" : caseRecord.currentStage,
    customStageInput: isCustomStageInitial ? caseRecord.currentStage : "",
    currentStatus: caseRecord.currentStatus,
    priority: caseRecord.priority,
    caseTags: (caseRecord.caseTags || []).join(", "),
  });

  const [mobileError, setMobileError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate 10-digit mobile number
    const cleanMobile = formData.clientMobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      setMobileError("Please enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");

    const finalStage = formData.stageOption === "Custom" 
      ? (formData.customStageInput.trim() || "Custom Stage") 
      : formData.stageOption;

    onSave(caseRecord.id, {
      partyName: formData.clientName,
      clientName: formData.clientName,
      clientMobile: cleanMobile,
      caseNumber: formData.caseNumber,
      caseType: formData.caseType,
      caseBackground: formData.caseBackground,
      courtName: formData.courtName,
      act: formData.act,
      opponentName: formData.opponentName,
      currentStage: finalStage as CaseStage,
      currentStatus: formData.currentStatus as CaseStatus,
      priority: formData.priority as CasePriority,
      caseTitle: `${formData.clientName} vs. ${formData.opponentName}`,
      caseTags: formData.caseTags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#E2DDD0] border border-[#706C61]/30 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-[#221C16] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#706C61]/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EFE9DC] border border-[#706C61]/25 flex items-center justify-center shadow-md shadow-[#524738]/15">
              <Edit3 className="w-5 h-5 text-[#221C16]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#221C16]">Edit Case Record</h3>
              <p className="text-[11px] text-[#524738] font-bold">{caseRecord.caseNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#524738] hover:text-[#221C16] hover:bg-[#EFE9DC]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Name & Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              />
            </div>
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Client Mobile Number *</label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={formData.clientMobile}
                onChange={(e) => {
                  setFormData({ ...formData, clientMobile: e.target.value });
                  if (mobileError) setMobileError("");
                }}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              />
              {mobileError && <p className="text-rose-600 font-bold text-[10px] mt-1">{mobileError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Opponent Name *</label>
              <input
                type="text"
                required
                value={formData.opponentName}
                onChange={(e) => setFormData({ ...formData, opponentName: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              />
            </div>
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Court Name *</label>
              <select
                value={formData.courtName}
                onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              >
                {COURT_OPTIONS.map((court) => (
                  <option key={court} value={court}>
                    {court}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Case Type *</label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              >
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
              </select>
            </div>
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Appeal / Background *</label>
              <select
                value={formData.caseBackground}
                onChange={(e) => setFormData({ ...formData, caseBackground: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              >
                <option value="None">None</option>
                <option value="Appeal">Appeal</option>
                <option value="Revision">Revision</option>
                <option value="Family Case">Family Case</option>
              </select>
            </div>
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Case Number *</label>
              <input
                type="text"
                required
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Act / Section *</label>
              <input
                type="text"
                required
                value={formData.act}
                onChange={(e) => setFormData({ ...formData, act: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              />
            </div>
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Current Stage *</label>
              <select
                value={formData.stageOption}
                onChange={(e) => setFormData({ ...formData, stageOption: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              >
                {STANDARD_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="Custom">Custom...</option>
              </select>
            </div>
          </div>

          {/* Conditional Custom Stage Input */}
          {formData.stageOption === "Custom" && (
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Specify Custom Stage *</label>
              <input
                type="text"
                required
                placeholder="e.g., Notice for Production of Documents"
                value={formData.customStageInput}
                onChange={(e) => setFormData({ ...formData, customStageInput: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#221C16] font-bold mb-1">Status</label>
              <select
                value={formData.currentStatus}
                onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value as CaseStatus })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Stay Granted">Stay Granted</option>
                <option value="Won">Won / Disposed</option>
              </select>
            </div>

            <div>
              <label className="block text-[#221C16] font-bold mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CasePriority })}
                className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#221C16] font-bold mb-1">Case Tags (comma separated)</label>
            <input
              type="text"
              value={formData.caseTags}
              onChange={(e) => setFormData({ ...formData, caseTags: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#706C61]/35 rounded-xl p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#221C16]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#706C61]/25">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#706C61]/35 rounded-xl text-[#221C16] font-bold hover:bg-[#EFE9DC]">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#221C16] text-[#EFE9DC] font-bold rounded-xl shadow-md hover:bg-[#382F25] cursor-pointer">
              Save Case Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
