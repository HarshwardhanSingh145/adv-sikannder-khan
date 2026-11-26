import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Table,
  Database,
  Users,
  Briefcase
} from "lucide-react";
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  listUserGoogleSheets,
  createSpreadsheet,
  getSpreadsheet,
  getSpreadsheetValues,
  updateSpreadsheetValues,
  DriveSheetFile,
  SpreadsheetInfo
} from "../../lib/googleSheetsService";
import { User } from "firebase/auth";
import { useAdmin } from "../../context/AdminContext";

export const GoogleSheetsManager: React.FC = () => {
  const { cases, clients } = useAdmin();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sheets state
  const [sheetsList, setSheetsList] = useState<DriveSheetFile[]>([]);
  const [selectedSheetId, setSelectedSheetId] = useState<string>("");
  const [activeSpreadsheet, setActiveSpreadsheet] = useState<SpreadsheetInfo | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [sheetRows, setSheetRows] = useState<string[][]>([]);

  // Status/Feedback
  const [isFetchingSheets, setIsFetchingSheets] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isReadingRows, setIsReadingRows] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // User confirmation dialog for destructive / mutating ops
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Initialize auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        fetchSheetsList(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setStatusMessage({ type: "success", text: `Signed in as ${result.user.displayName || result.user.email}` });
        fetchSheetsList(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "Google Sign-In failed." });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleSignOut();
    setUser(null);
    setToken(null);
    setSheetsList([]);
    setSelectedSheetId("");
    setActiveSpreadsheet(null);
    setSheetRows([]);
    setStatusMessage({ type: "info", text: "Signed out of Google Workspace." });
  };

  const fetchSheetsList = async (authToken: string) => {
    setIsFetchingSheets(true);
    try {
      const list = await listUserGoogleSheets(authToken);
      setSheetsList(list);
      if (list.length > 0 && !selectedSheetId) {
        setSelectedSheetId(list[0].id);
        loadSpreadsheetDetails(list[0].id, authToken);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsFetchingSheets(false);
    }
  };

  const loadSpreadsheetDetails = async (sheetId: string, authToken: string) => {
    setIsReadingRows(true);
    try {
      const info = await getSpreadsheet(authToken, sheetId);
      setActiveSpreadsheet(info);
      if (info.sheets && info.sheets.length > 0) {
        const firstTab = info.sheets[0].properties.title;
        setActiveTab(firstTab);
        await loadSheetRows(sheetId, firstTab, authToken);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Could not load spreadsheet details." });
    } finally {
      setIsReadingRows(false);
    }
  };

  const loadSheetRows = async (sheetId: string, tabName: string, authToken: string) => {
    setIsReadingRows(true);
    try {
      const rows = await getSpreadsheetValues(authToken, sheetId, `${tabName}!A1:Z100`);
      setSheetRows(rows);
    } catch (err: any) {
      console.error(err);
      setSheetRows([]);
    } finally {
      setIsReadingRows(false);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!token) {
      setStatusMessage({ type: "error", text: "Please sign in with Google first." });
      return;
    }
    setIsCreatingSheet(true);
    setStatusMessage(null);
    try {
      const newSheet = await createSpreadsheet(token, `Advocate Sikandar Khan - Legal Records (${new Date().toLocaleDateString()})`);
      setStatusMessage({ type: "success", text: `Created new Google Sheet "${newSheet.properties.title}"!` });
      await fetchSheetsList(token);
      setSelectedSheetId(newSheet.spreadsheetId);
      await loadSpreadsheetDetails(newSheet.spreadsheetId, token);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "Failed to create Google Sheet." });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const requestExportCases = () => {
    if (!selectedSheetId) {
      setStatusMessage({ type: "error", text: "Please select or create a Google Sheet first." });
      return;
    }
    setConfirmDialog({
      isOpen: true,
      title: "Export Cases to Google Sheets",
      message: `Are you sure you want to write ${cases.length} case files into tab "Cases" of Google Sheet "${activeSpreadsheet?.properties.title || "Selected Sheet"}"?`,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await performExportCases();
      },
    });
  };

  const performExportCases = async () => {
    if (!token || !selectedSheetId) return;
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const headers = [
        "Case Number",
        "Client Name",
        "Opposing Party",
        "Court",
        "Case Type",
        "Stage",
        "Status",
        "Next Hearing Date",
        "Filing Date",
        "Fees Total",
        "Fees Paid"
      ];

      const caseRows = cases.map((c) => [
        c.caseNumber || "",
        c.clientName || "",
        c.opposingParty || "",
        c.court || "Civil Court, Makrana",
        c.caseType || "",
        c.stage || "",
        c.status || "",
        c.nextHearingDate || "",
        c.filingDate || "",
        c.financials?.totalFees || 0,
        c.financials?.paidFees || 0
      ]);

      const values = [headers, ...caseRows];

      await updateSpreadsheetValues(token, selectedSheetId, "Cases!A1", values);
      setStatusMessage({ type: "success", text: `Successfully exported ${cases.length} cases to Google Sheets!` });
      await loadSheetRows(selectedSheetId, "Cases", token);
      setActiveTab("Cases");
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "Failed to export cases to Google Sheets." });
    } finally {
      setIsExporting(false);
    }
  };

  const requestExportClients = () => {
    if (!selectedSheetId) {
      setStatusMessage({ type: "error", text: "Please select or create a Google Sheet first." });
      return;
    }
    setConfirmDialog({
      isOpen: true,
      title: "Export Clients to Google Sheets",
      message: `Are you sure you want to write ${clients.length} client profiles into tab "Clients" of Google Sheet "${activeSpreadsheet?.properties.title || "Selected Sheet"}"?`,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await performExportClients();
      },
    });
  };

  const performExportClients = async () => {
    if (!token || !selectedSheetId) return;
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const headers = ["Client Name", "Phone Number", "Email", "Address", "Total Cases"];
      const clientRows = clients.map((cl) => [
        cl.name || "",
        cl.phone || "",
        cl.email || "",
        cl.address || "",
        cl.casesCount || 0
      ]);

      const values = [headers, ...clientRows];

      await updateSpreadsheetValues(token, selectedSheetId, "Clients!A1", values);
      setStatusMessage({ type: "success", text: `Successfully exported ${clients.length} clients to Google Sheets!` });
      await loadSheetRows(selectedSheetId, "Clients", token);
      setActiveTab("Clients");
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "Failed to export clients to Google Sheets." });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl text-[#221C16] space-y-6 shadow-lg shadow-black/50">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#706C61]/20 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-xl">
            <FileSpreadsheet className="w-8 h-8 text-[#221C16]" />
          </div>
          <div>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-[#221C16]">
              Google Sheets Synchronization
            </h3>
            <p className="text-xs text-[#706C61] font-sans mt-0.5">
              Connect your Google Workspace account to read, write, and backup law firm data directly in Google Sheets.
            </p>
          </div>
        </div>

        {/* Auth status & Sign-In button */}
        <div>
          {user ? (
            <div className="flex items-center gap-3 bg-[#E2DDD0]/80 border border-[#706C61]/25 px-4 py-2 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#EFE9DC] text-black flex items-center justify-center font-bold text-sm">
                {user.displayName ? user.displayName.charAt(0) : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#221C16]">{user.displayName || "Google User"}</span>
                <span className="text-[10px] text-[#706C61]">{user.email}</span>
              </div>
              <button
                onClick={handleGoogleLogout}
                className="ml-2 text-[#706C61] hover:text-[#221C16] transition-colors p-1"
                title="Sign out of Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E2DDD0]/80 hover:bg-[#706C61]/10 text-[#221C16] font-sans text-xs font-bold rounded-xl shadow-md shadow-[#524738]/15 transition-all cursor-pointer border border-[#706C61]/25"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isSigningIn ? "Signing in..." : "Sign in with Google"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : statusMessage.type === "error"
              ? "bg-red-50 border-red-500/20 text-red-400"
              : "bg-[#E2DDD0]/80 border-[#706C61]/25 text-[#221C16]"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
            {statusMessage.type === "error" && <AlertCircle className="w-4 h-4 text-red-700" />}
            {statusMessage.type === "info" && <Database className="w-4 h-4 text-[#221C16]" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs underline opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {user ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#E2DDD0]/80 p-4 border border-[#706C61]/25 rounded-xl">
            
            {/* Sheet selector */}
            <div className="md:col-span-5 flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#221C16] uppercase tracking-wider">
                Select Google Sheet
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedSheetId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedSheetId(id);
                    if (token && id) loadSpreadsheetDetails(id, token);
                  }}
                  className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 text-[#221C16] px-3 py-2 rounded-lg text-xs outline-none focus:border-[#706C61]/35"
                >
                  {sheetsList.length === 0 ? (
                    <option value="">No Google Sheets found in Drive</option>
                  ) : (
                    sheetsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  )}
                </select>
                <button
                  onClick={() => token && fetchSheetsList(token)}
                  disabled={isFetchingSheets}
                  className="p-2 border border-[#706C61]/25 hover:bg-[#706C61]/10 text-[#221C16] rounded-lg transition-colors"
                  title="Refresh Sheets list"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetchingSheets ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Actions: Create Sheet or Open Link */}
            <div className="md:col-span-7 flex flex-wrap items-center justify-end gap-2 pt-2 md:pt-4">
              <button
                onClick={handleCreateNewSheet}
                disabled={isCreatingSheet}
                className="px-3.5 py-2 bg-[#EFE9DC] text-black font-bold text-xs rounded-lg hover:bg-[#EFE9DC] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#524738]/15"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreatingSheet ? "Creating..." : "Create New Legal Sheet"}</span>
              </button>

              <button
                onClick={requestExportCases}
                disabled={isExporting || !selectedSheetId}
                className="px-3.5 py-2 border border-[#706C61]/25 hover:bg-[#706C61]/10 text-[#221C16] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 bg-[#E2DDD0]/80 cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#221C16]" />
                <span>Sync Cases to Sheet</span>
              </button>

              <button
                onClick={requestExportClients}
                disabled={isExporting || !selectedSheetId}
                className="px-3.5 py-2 border border-[#706C61]/25 hover:bg-[#706C61]/10 text-[#221C16] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 bg-[#E2DDD0]/80 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#221C16]" />
                <span>Sync Clients to Sheet</span>
              </button>

              {selectedSheetId && (
                <a
                  href={`https://docs.google.com/spreadsheets/d/${selectedSheetId}/edit`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-[#706C61]/25 text-[#221C16] hover:bg-[#706C61]/10 rounded-lg transition-colors"
                  title="Open in Google Sheets"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Spreadsheet Tabs & Live Table Viewer */}
          {activeSpreadsheet && (
            <div className="border border-[#706C61]/25 rounded-xl bg-[#E2DDD0]/80 p-4 space-y-4">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-[#706C61]/20 pb-2 overflow-x-auto">
                <span className="text-xs font-bold text-[#221C16] uppercase mr-2 flex items-center gap-1">
                  <Table className="w-3.5 h-3.5" /> Tabs:
                </span>
                {activeSpreadsheet.sheets.map((s) => {
                  const tTitle = s.properties.title;
                  const isActive = activeTab === tTitle;
                  return (
                    <button
                      key={s.properties.sheetId}
                      onClick={() => {
                        setActiveTab(tTitle);
                        if (token && selectedSheetId) loadSheetRows(selectedSheetId, tTitle, token);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#EFE9DC] text-black shadow-md shadow-[#524738]/15"
                          : "bg-[#E2DDD0]/80 text-[#221C16] hover:bg-[#706C61]/10"
                      }`}
                    >
                      {tTitle}
                    </button>
                  );
                })}
              </div>

              {/* Table Data Preview */}
              <div className="overflow-x-auto max-h-96 rounded-lg border border-white/5">
                {isReadingRows ? (
                  <div className="py-12 text-center text-xs text-[#706C61] flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#221C16]" />
                    <span>Loading rows from Google Sheet...</span>
                  </div>
                ) : sheetRows.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#706C61]/80 italic">
                    This tab is currently empty or contains no data rows.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#E2DDD0]/80 border-b border-[#706C61]/25 text-[#221C16] font-bold">
                        {sheetRows[0]?.map((col, idx) => (
                          <th key={idx} className="p-2.5 whitespace-nowrap border-r border-white/5">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {sheetRows.slice(1).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#E2DDD0]/80/50 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 border-r border-white/5 text-[#221C16]/90">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Unauthenticated Prompt */
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-[#E2DDD0]/80 border border-dashed border-[#706C61]/25 rounded-2xl p-6">
          <Database className="w-12 h-12 text-[#706C61]/80" />
          <h4 className="font-serif text-lg font-bold text-[#221C16]">
            Google Workspace Not Connected
          </h4>
          <p className="text-xs text-[#706C61] max-w-md">
            Sign in with your Google Account above to enable real-time export and synchronization of cases, client profiles, and consultation leads to Google Sheets.
          </p>
        </div>
      )}

      {/* Confirmation Modal for Mutating Ops */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-[#221C16]">
            <h4 className="font-serif text-lg font-bold text-[#221C16] border-b border-[#706C61]/25 pb-2">
              {confirmDialog.title}
            </h4>
            <p className="text-xs text-[#524738] leading-relaxed font-sans">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-[#706C61]/25 text-[#221C16] text-xs rounded-lg hover:bg-[#E2DDD0]/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-[#EFE9DC] text-black font-bold text-xs rounded-lg hover:bg-[#EFE9DC] transition-colors shadow-md shadow-[#524738]/15"
              >
                Confirm & Write
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
