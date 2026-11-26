import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Clock, MapPin, ChevronRight, Edit3, Download, Ban } from "lucide-react";
import { CaseRecord } from "../../../types/admin";
import { downloadTodaysHearingPdf } from "../../../lib/todaysHearingPdfGenerator";
import { getCourtHoliday, getHolidayBlockMessage } from "../../../data/courtHolidays";
import { formatDateDMY } from "../../../lib/dateFormat";

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
  const [rescheduleError, setRescheduleError] = useState<string>("");

  const currentDayHoliday = getCourtHoliday(dateStr);
  const selectedRescheduleHolidayMsg = getHolidayBlockMessage(newDateInput);

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const holidayMsg = getHolidayBlockMessage(newDateInput);
    if (holidayMsg) {
      setRescheduleError(holidayMsg);
      return;
    }
    if (rescheduleCaseId && rescheduleHearingId && newDateInput) {
      setRescheduleError("");
      onUpdateHearingDate(rescheduleCaseId, rescheduleHearingId, newDateInput, newNotesInput);
      setRescheduleCaseId(null);
      setRescheduleHearingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#EFF6FF] border-2 border-[#475569]/35 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-[#0F172A]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#475569]/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${currentDayHoliday ? "bg-red-600 shadow-red-600/20" : "bg-[#1D4ED8] shadow-[#1D4ED8]/15"}`}>
              {currentDayHoliday ? (
                <Ban className="w-5 h-5 text-white" />
              ) : (
                <CalendarIcon className="w-5 h-5 text-[#EFF6FF]" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#0F172A]">Court Schedule: {formatDateDMY(dateStr)}</h3>
              <p className={`text-[11px] font-semibold ${currentDayHoliday ? "text-red-700" : "text-[#1D4ED8]"}`}>
                {currentDayHoliday
                  ? `Government Holiday — ${currentDayHoliday.name}`
                  : `${casesForDate.length} Cause List Appearance(s)`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!currentDayHoliday && (
              <button
                onClick={() => downloadTodaysHearingPdf(casesForDate, dateStr)}
                className="px-3 py-1.5 bg-[#1D4ED8] text-[#EFF6FF] hover:bg-[#1E40AF] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Download Cause List PDF for this date"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-black/5 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Government Holiday Notice */}
        {currentDayHoliday && (
          <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-red-700">
              <Ban className="w-4 h-4 shrink-0" />
              <span>Court Closed — Government Holiday</span>
            </div>
            <p className="text-sm font-bold text-red-950">
              {currentDayHoliday.name}
              {currentDayHoliday.moonDependent ? " *" : ""}
            </p>
            <p className="text-xs text-red-800">
              Rajasthan High Court Civil Courts Calendar ({dateStr.slice(0, 4)}) marks this date as an official holiday. New hearings cannot be scheduled on this date.
              {currentDayHoliday.moonDependent ? " (* Subject to visibility of the Moon.)" : ""}
            </p>
          </div>
        )}

        {/* List of cases scheduled for this date */}
        {casesForDate.length === 0 ? (
          !currentDayHoliday && (
            <div className="p-8 text-center bg-white/60 rounded-xl border border-[#475569]/20 text-xs text-[#1D4ED8] font-semibold">
              No court hearings scheduled for {formatDateDMY(dateStr)}.
            </div>
          )
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {casesForDate.map((c) => {
              const hearing = c.hearings.find(
                (h) => h.currentHearingDate === dateStr || h.nextHearingDate === dateStr
              ) || c.hearings[0];

              const isReschedulingThis = rescheduleCaseId === c.id && rescheduleHearingId === hearing?.id;

              return (
                <div key={c.id} className="p-4 bg-white/70 border border-[#475569]/25 rounded-xl space-y-3 relative text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0F172A]">{c.caseNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#475569]/15 text-[#0F172A] border border-[#475569]/25 font-bold">
                          {c.currentStage}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1">{c.caseTitle}</h4>
                      <p className="text-[11px] text-[#1D4ED8] font-medium">Client: <strong>{c.clientName}</strong> vs. {c.opponentName}</p>
                    </div>

                    <button
                      onClick={() => {
                        onOpenCaseTimeline(c);
                        onClose();
                      }}
                      className="px-3 py-1 bg-[#1D4ED8] text-[#EFF6FF] hover:bg-[#1E40AF] font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all shrink-0 shadow-xs cursor-pointer"
                    >
                      View Timeline <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 bg-[#FFFFFF]/60 border border-[#475569]/20 rounded-lg space-y-1 text-[#0F172A] font-medium">
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1D4ED8]" /> {c.courtName} ({c.courtRoomNumber})</p>
                    <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#1D4ED8]" /> Time: {hearing?.hearingTime} | Judge: {hearing?.judgeName}</p>
                    <p className="text-[#0F172A]"><strong>Purpose:</strong> {hearing?.purpose}</p>
                    {hearing?.result && <p className="text-emerald-700 font-bold"><strong>Result:</strong> {hearing.result}</p>}
                  </div>

                  {isReschedulingThis ? (
                    <form onSubmit={handleRescheduleSubmit} className="p-3 bg-white border border-[#475569]/35 rounded-lg space-y-2">
                      <h5 className="text-[11px] font-bold text-[#0F172A]">Reschedule Hearing Date</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#1D4ED8]">New Hearing Date</label>
                          <input
                            type="date"
                            required
                            value={newDateInput}
                            onChange={(e) => {
                              setNewDateInput(e.target.value);
                              setRescheduleError(getHolidayBlockMessage(e.target.value) || "");
                            }}
                            className={`w-full bg-[#FFFFFF]/80 border rounded p-1.5 text-[#0F172A] font-semibold ${
                              selectedRescheduleHolidayMsg ? "border-red-500 bg-red-50/50" : "border-[#475569]/25"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#1D4ED8]">Reason / Notes</label>
                          <input
                            type="text"
                            value={newNotesInput}
                            onChange={(e) => setNewNotesInput(e.target.value)}
                            placeholder="Adjournment granted"
                            className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded p-1.5 text-[#0F172A] font-semibold"
                          />
                        </div>
                      </div>
                      {(rescheduleError || selectedRescheduleHolidayMsg) && (
                        <p role="alert" className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5 flex items-center gap-1.5">
                          <Ban className="w-3.5 h-3.5 shrink-0" />
                          <span>{rescheduleError || selectedRescheduleHolidayMsg}</span>
                        </p>
                      )}
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleCaseId(null);
                            setRescheduleError("");
                          }}
                          className="px-3 py-1 border border-[#475569]/25 rounded text-[#0F172A] text-[10px] font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={Boolean(selectedRescheduleHolidayMsg)}
                          className="px-3 py-1 bg-[#1D4ED8] text-[#EFF6FF] hover:bg-[#1E40AF] disabled:bg-red-300 disabled:cursor-not-allowed font-bold rounded text-[10px] cursor-pointer"
                        >
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
                            const initDate = hearing.nextHearingDate || hearing.currentHearingDate || dateStr;
                            setRescheduleCaseId(c.id);
                            setRescheduleHearingId(hearing.id);
                            setNewDateInput(initDate);
                            setRescheduleError(getHolidayBlockMessage(initDate) || "");
                          }
                        }}
                        className="text-[11px] text-[#1D4ED8] hover:text-[#0F172A] flex items-center gap-1 font-bold cursor-pointer"
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
