import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  RefreshCw,
  Clock,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  History,
  Eye,
  Printer,
  Share2,
  CalendarCheck,
  ChevronRight,
  X,
  AlertCircle
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import {
  HearingPdfMeta,
  getHearingPdfArchive,
  getTodaysHearingCases,
  downloadTodaysHearingPdf,
  getTodaysHearingPdfBlobUrl,
  printTodaysHearingPdf,
  saveHearingPdfArchive,
  getTodayDateStr,
  getTodaysHearingSummaryText,
  TodaysHearingItem,
} from "../../lib/todaysHearingPdfGenerator";
import { motion, AnimatePresence } from "motion/react";

interface HearingPdfManagerTabProps {
  onShowToast?: (msg: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const HearingPdfManagerTab: React.FC<HearingPdfManagerTabProps> = ({
  onShowToast,
  onNavigateTab,
}) => {
  const { cases, setActiveCase } = useAdmin();
  const showToast = onShowToast ?? (() => {});
  const setActiveTab = onNavigateTab ?? (() => {});
  const [archive, setArchive] = useState<HearingPdfMeta[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const todayIso = getTodayDateStr();
  const tomorrowIso = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  const selectedDateFormatted = (() => {
    const parts = selectedDate.split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
    return selectedDate;
  })();

  const todayHearings = getTodaysHearingCases(cases, todayIso);
  const selectedDateHearings = getTodaysHearingCases(cases, selectedDate);
  const caseCount = selectedDateHearings.length;

  useEffect(() => {
    refreshArchive();
  }, [cases]);

  const refreshArchive = () => {
    const list = getHearingPdfArchive();
    setArchive(list);
  };

  const handleDownloadSelected = () => {
    try {
      const fileName = downloadTodaysHearingPdf(cases, selectedDate);
      showToast(`Today's Hearing List PDF downloaded: ${fileName}`);
    } catch (e) {
      console.error(e);
      showToast("Error generating PDF document. Please try again.");
    }
  };

  const handlePreviewSelected = () => {
    try {
      const url = getTodaysHearingPdfBlobUrl(cases, selectedDate);
      setPreviewPdfUrl(url);
      setPreviewTitle(`Cause List Preview - ${selectedDateFormatted}`);
    } catch (e) {
      console.error(e);
      showToast("Error creating PDF preview.");
    }
  };

  const handlePrintSelected = () => {
    try {
      printTodaysHearingPdf(cases, selectedDate);
      showToast("Opening Print Dialog...");
    } catch (e) {
      console.error(e);
      showToast("Error opening print dialog.");
    }
  };

  const handleShareWhatsApp = () => {
    const summary = getTodaysHearingSummaryText(cases, selectedDate);
    const encoded = encodeURIComponent(summary);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
    showToast("Opening WhatsApp with Cause List summary...");
  };

  const handleManualRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const currentHearings = getTodaysHearingCases(cases, todayIso);
      const newMeta: HearingPdfMeta = {
        id: `arc-${todayIso}-${Date.now()}`,
        date: todayIso,
        generatedAt: new Date().toISOString(),
        totalCases: currentHearings.length,
        status: currentHearings.length > 0 ? "Success" : "No Hearings Scheduled",
        fileName: `Todays_Hearing_List_${todayIso}.pdf`,
      };
      saveHearingPdfArchive(newMeta);
      refreshArchive();
      setIsRegenerating(false);
      showToast("Today's Hearing List PDF re-indexed & refreshed!");
    }, 600);
  };

  const handleDownloadArchiveItem = (item: HearingPdfMeta) => {
    const fileName = downloadTodaysHearingPdf(cases, item.date);
    showToast(`Downloaded: ${fileName}`);
  };

  const handlePreviewArchiveItem = (item: HearingPdfMeta) => {
    const url = getTodaysHearingPdfBlobUrl(cases, item.date);
    setPreviewPdfUrl(url);
    setPreviewTitle(`Archived Hearing PDF - ${item.date}`);
  };

  const latestMeta = archive.find((a) => a.date === todayIso) || {
    id: `arc-${todayIso}`,
    date: todayIso,
    generatedAt: new Date().toISOString(),
    totalCases: todayHearings.length,
    status: todayHearings.length > 0 ? "Success" : "No Hearings Scheduled",
    fileName: `Todays_Hearing_List_${todayIso}.pdf`,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#E2DDD0]/90 border-2 border-[#706C61]/25 rounded-2xl p-6 sm:p-8 shadow-md shadow-[#524738]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#524738] text-[#EFE9DC] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EFE9DC]" />
            <span>Automated Daily Engine • Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#221C16]">
            Today's Hearing PDF Generator
          </h2>
          <p className="text-xs sm:text-sm text-[#524738] font-medium max-w-xl">
            Official chamber daily cause list PDF generator for Advocate Sikandar Khan. Runs automatically every midnight at 12:00 AM IST and generates verified cause lists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handlePreviewSelected}
            className="px-4 py-2.5 bg-[#524738]/10 hover:bg-[#524738]/20 border border-[#524738]/30 text-[#221C16] font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Eye className="w-4 h-4 text-[#524738]" />
            <span>Preview PDF</span>
          </button>

          <button
            onClick={handleDownloadSelected}
            className="px-5 py-2.5 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold text-xs rounded-xl shadow-md shadow-[#524738]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#EFE9DC]" />
            <span>Download Today's PDF</span>
          </button>

          <button
            onClick={handlePrintSelected}
            className="px-3.5 py-2.5 bg-[#E2DDD0] hover:bg-[#D8D2C2] border border-[#706C61]/30 text-[#221C16] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Print PDF"
          >
            <Printer className="w-4 h-4 text-[#524738]" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleManualRegenerate}
            disabled={isRegenerating}
            className="px-3.5 py-2.5 bg-[#E2DDD0] hover:bg-[#D8D2C2] border border-[#706C61]/30 text-[#221C16] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#524738] ${isRegenerating ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Real-Time Engine Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-5 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#706C61]">
            <span>Today's Appearances</span>
            <CalendarCheck className="w-4 h-4 text-[#524738]" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#221C16]">{todayHearings.length}</p>
          <p className="text-[11px] text-[#524738] font-semibold">{todayIso === selectedDate ? "Scheduled for Today" : `Today: ${todayIso}`}</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-5 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#706C61]">
            <span>Last Sync & Generation</span>
            <Clock className="w-4 h-4 text-[#524738]" />
          </div>
          <p className="text-lg font-serif font-bold text-[#221C16]">
            {new Date(latestMeta.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-[11px] text-[#524738] font-semibold">{new Date(latestMeta.generatedAt).toLocaleDateString()}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-5 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#706C61]">
            <span>Midnight Auto-Run</span>
            <Calendar className="w-4 h-4 text-[#524738]" />
          </div>
          <p className="text-lg font-serif font-bold text-[#221C16]">12:00 AM IST</p>
          <p className="text-[11px] text-[#524738] font-semibold">Every Night Scheduled</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-5 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#706C61]">
            <span>PDF Engine Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ready & Operational</span>
          </div>
          <p className="text-[11px] font-semibold text-[#524738]">Official Chamber Letterhead</p>
        </div>
      </div>

      {/* Date Selector & Action Strip */}
      <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#221C16]">
              Select Cause List Date
            </h3>
            <p className="text-xs text-[#524738]">
              Generate or download the official hearing list for today, tomorrow, or any specific court date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedDate(todayIso)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDate === todayIso
                  ? "bg-[#524738] text-[#EFE9DC] shadow-xs"
                  : "bg-white/80 text-[#524738] hover:bg-white border border-[#706C61]/20"
              }`}
            >
              Today ({todayIso})
            </button>

            <button
              onClick={() => setSelectedDate(tomorrowIso)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDate === tomorrowIso
                  ? "bg-[#524738] text-[#EFE9DC] shadow-xs"
                  : "bg-white/80 text-[#524738] hover:bg-white border border-[#706C61]/20"
              }`}
            >
              Tomorrow ({tomorrowIso})
            </button>

            <div className="flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded-lg border border-[#706C61]/20">
              <span className="text-[11px] font-semibold text-[#524738]">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="text-xs font-bold text-[#221C16] bg-transparent outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
              title="Share Cause List via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cases Included in this PDF */}
      <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#706C61]/20 pb-4">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#524738]" />
            <div>
              <h3 className="text-lg font-serif font-extrabold text-[#221C16]">
                Hearings in PDF for {selectedDateFormatted}
              </h3>
              <p className="text-xs text-[#524738] font-medium">
                {caseCount} hearing case(s) found in Chamber records for this date
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewSelected}
              className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-[#221C16] border border-[#706C61]/30 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#524738]" />
              <span>View PDF</span>
            </button>
            <button
              onClick={handleDownloadSelected}
              className="px-3.5 py-1.5 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {caseCount === 0 ? (
          <div className="p-8 text-center bg-white/60 border border-dashed border-[#706C61]/30 rounded-xl space-y-2">
            <AlertCircle className="w-8 h-8 text-[#706C61] mx-auto opacity-70" />
            <p className="text-sm font-bold text-[#221C16]">No court hearings scheduled on {selectedDate}</p>
            <p className="text-xs text-[#524738] max-w-md mx-auto">
              You can still generate or download the PDF; it will include the official Chamber Notice certifying no appearances are listed for this date.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-[#706C61]/25 bg-white/70 text-[#221C16]">
                  <th className="py-2.5 px-3 font-extrabold text-center w-12">S.No.</th>
                  <th className="py-2.5 px-3 font-extrabold w-36">Case Number</th>
                  <th className="py-2.5 px-3 font-extrabold">Parties & Client</th>
                  <th className="py-2.5 px-3 font-extrabold">Court & Room</th>
                  <th className="py-2.5 px-3 font-extrabold text-center w-24">Time</th>
                  <th className="py-2.5 px-3 font-extrabold">Purpose / Stage</th>
                  <th className="py-2.5 px-3 font-extrabold text-right w-20">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#706C61]/15 text-[#221C16]">
                {selectedDateHearings.map((item: TodaysHearingItem, index: number) => {
                  const c = item.caseRecord;
                  return (
                    <tr key={c.id || index} className="hover:bg-white/60 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-[#524738]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#221C16]">
                        {c.caseNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        <div className="text-[#221C16] font-bold">{c.caseTitle}</div>
                        <div className="text-[11px] text-[#524738]">
                          Client: <span className="font-semibold text-[#221C16]">{c.clientName}</span>
                          {c.opponentName && <span> vs. {c.opponentName}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#221C16]">{c.courtName || "Makrana Court"}</div>
                        <div className="text-[10.5px] text-[#524738]">{item.courtRoom}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-[#221C16]">
                        {item.hearingTime}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#524738]">
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#706C61]/25 text-[10px] font-bold text-[#221C16]">
                          {item.purpose}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setActiveCase(c);
                            setActiveTab("cases");
                          }}
                          className="p-1 hover:bg-[#524738]/10 text-[#524738] rounded-md transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold"
                          title="View Case File"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PDF Archive Table */}
      <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#706C61]/20 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#524738]" />
            <h3 className="text-lg font-serif font-extrabold text-[#221C16]">
              Previous Daily Hearing List Archive
            </h3>
          </div>
          <span className="text-xs font-bold text-[#524738]">
            Total In Archive: {archive.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-[#706C61]/25 bg-white/70 text-[#221C16]">
                <th className="py-2.5 px-4 font-extrabold">Date</th>
                <th className="py-2.5 px-4 font-extrabold">Generated Timestamp</th>
                <th className="py-2.5 px-4 font-extrabold text-center">Cases</th>
                <th className="py-2.5 px-4 font-extrabold">Status</th>
                <th className="py-2.5 px-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#706C61]/15">
              {archive.map((item) => {
                const isToday = item.date === todayIso;
                return (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#221C16]">
                      <div className="flex items-center gap-2">
                        <span>{item.date}</span>
                        {isToday && (
                          <span className="px-2 py-0.5 rounded-full bg-[#524738] text-[#EFE9DC] text-[9px] font-black uppercase">
                            Today
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#524738]">
                      {new Date(item.generatedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-[#221C16]">
                      {item.totalCases}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.status === "Success"
                            ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                            : "bg-amber-100 border-amber-300 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handlePreviewArchiveItem(item)}
                          className="px-2.5 py-1.5 bg-white border border-[#706C61]/25 text-[#221C16] hover:bg-neutral-100 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadArchiveItem(item)}
                          className="px-3 py-1.5 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal Viewer */}
      <AnimatePresence>
        {previewPdfUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#EFE9DC] border-2 border-[#706C61]/35 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              <div className="bg-[#524738] text-[#EFE9DC] px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#EFE9DC]" />
                  <h3 className="font-serif font-bold text-sm sm:text-base leading-tight">
                    {previewTitle || "Hearing List PDF Preview"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      downloadTodaysHearingPdf(cases, selectedDate);
                      showToast("PDF downloaded from preview!");
                    }}
                    className="px-3 py-1 bg-[#EFE9DC] text-[#221C16] hover:bg-[#E2DDD0] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => {
                      URL.revokeObjectURL(previewPdfUrl);
                      setPreviewPdfUrl(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg text-[#EFE9DC] transition-colors cursor-pointer"
                    title="Close Preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-neutral-200 relative p-2">
                <iframe
                  src={previewPdfUrl}
                  className="w-full h-full rounded-xl border border-neutral-300"
                  title="PDF Preview Frame"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
