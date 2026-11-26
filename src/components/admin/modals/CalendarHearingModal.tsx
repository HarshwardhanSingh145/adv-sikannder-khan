import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Clock, MapPin, Scale, User, FileText, ChevronRight, Edit3, Download } from "lucide-react";
import { CaseRecord, HearingRecord } from "../../../types/admin";
import { downloadTodaysHearingPdf } from "../../../lib/todaysHearingPdfGenerator";

interface CalendarHearingModalProps {
  dateStr: string;
  casesForDate: CaseRecord[];
  onOpenCaseTimeline: (c: CaseRecord) => void;
  onUpdateHearingDate: (caseId: string, hearingId: string, newDate: string, notes?: string) => void;
  onClose: () => void;
}

export const CalendarHearingModal: React.FC<CalendarHearingModalProps> = ({
  dateStr,
  casesForDate,
  onOpenCaseTimeline,
  onUpdateHearingDate,
  onClose,
}) => {
  const [rescheduleCaseId, setRescheduleCaseId] = useState<string | null>(null);
  const [rescheduleHearingId, setRescheduleHearingId] = useState<string | null>(null);
  const [newDateInput, setNewDateInput] = useState<string>(dateStr);
  const [newNotesInput, setNewNotesInput] = useState<string>("");

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rescheduleCaseId && rescheduleHearingId && newDateInput) {
      onUpdateHearingDate(rescheduleCaseId, rescheduleHearingId, newDateInput, newNotesInput);
      setRescheduleCaseId(null);
      setRescheduleHearingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#EFE9DC] border-2 border-[#706C61]/35 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-[#221C16]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#706C61]/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#524738] flex items-center justify-center shadow-md shadow-[#524738]/15">
              <CalendarIcon className="w-5 h-5 text-[#EFE9DC]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#221C16]">Court Schedule: {dateStr}</h3>
              <p className="text-[11px] text-[#524738] font-semibold">{casesForDate.length} Cause List Appearance(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadTodaysHearingPdf(casesForDate, dateStr)}
              className="px-3 py-1.5 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Download Cause List PDF for this date"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#706C61] hover:text-[#221C16] hover:bg-black/5 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of cases scheduled for this date */}
        {casesForDate.length === 0 ? (
          <div className="p-8 text-center bg-white/60 rounded-xl border border-[#706C61]/20 text-xs text-[#524738] font-semibold">
            No court hearings scheduled for {dateStr}.
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {casesForDate.map((c) => {
              const hearing = c.hearings.find(
                (h) => h.currentHearingDate === dateStr || h.nextHearingDate === dateStr
              ) || c.hearings[0];

              const isReschedulingThis = rescheduleCaseId === c.id && rescheduleHearingId === hearing?.id;

              return (
                <div key={c.id} className="p-4 bg-white/70 border border-[#706C61]/25 rounded-xl space-y-3 relative text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#221C16]">{c.caseNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#706C61]/15 text-[#221C16] border border-[#706C61]/25 font-bold">
                          {c.currentStage}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#221C16] mt-1">{c.caseTitle}</h4>
                      <p className="text-[11px] text-[#524738] font-medium">Client: <strong>{c.clientName}</strong> vs. {c.opponentName}</p>
                    </div>

                    <button
                      onClick={() => {
                        onOpenCaseTimeline(c);
                        onClose();
                      }}
                      className="px-3 py-1 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all shrink-0 shadow-xs cursor-pointer"
                    >
                      View Timeline <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 bg-[#E2DDD0]/60 border border-[#706C61]/20 rounded-lg space-y-1 text-[#221C16] font-medium">
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#524738]" /> {c.courtName} ({c.courtRoomNumber})</p>
                    <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#524738]" /> Time: {hearing?.hearingTime} | Judge: {hearing?.judgeName}</p>
                    <p className="text-[#221C16]"><strong>Purpose:</strong> {hearing?.purpose}</p>
                    {hearing?.result && <p className="text-emerald-700 font-bold"><strong>Result:</strong> {hearing.result}</p>}
                  </div>

                  {isReschedulingThis ? (
                    <form onSubmit={handleRescheduleSubmit} className="p-3 bg-white border border-[#706C61]/35 rounded-lg space-y-2">
                      <h5 className="text-[11px] font-bold text-[#221C16]">Reschedule Hearing Date</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#524738]">New Hearing Date</label>
                          <input
                            type="date"
                            required
                            value={newDateInput}
                            onChange={(e) => setNewDateInput(e.target.value)}
                            className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded p-1.5 text-[#221C16] font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#524738]">Reason / Notes</label>
                          <input
                            type="text"
                            value={newNotesInput}
                            onChange={(e) => setNewNotesInput(e.target.value)}
                            placeholder="Adjournment granted"
                            className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded p-1.5 text-[#221C16] font-semibold"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={() => setRescheduleCaseId(null)} className="px-3 py-1 border border-[#706C61]/25 rounded text-[#221C16] text-[10px] font-semibold cursor-pointer">
                          Cancel
                        </button>
                        <button type="submit" className="px-3 py-1 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold rounded text-[10px] cursor-pointer">
                          Save Reschedule
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (hearing) {
                            setRescheduleCaseId(c.id);
                            setRescheduleHearingId(hearing.id);
                            setNewDateInput(hearing.nextHearingDate || hearing.currentHearingDate || dateStr);
                          }
                        }}
                        className="text-[11px] text-[#524738] hover:text-[#221C16] flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Reschedule / Edit Hearing
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
