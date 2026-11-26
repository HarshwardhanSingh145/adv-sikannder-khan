import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { PremiumBackground } from "./PremiumBackground";
import { DownloadAppBanner } from "../DownloadAppBanner";
import {
  Scale,
  Users,
  Briefcase,
  FileSpreadsheet,
  Plus,
  Search,
  Download,
  Upload,
  Calendar as CalendarIcon,
  ShieldCheck,
  Bell,
  LogOut,
  Edit,
  Trash2,
  Eye,
  CreditCard,
  Newspaper,
  Bot,
  Pin,
  Star,
  Clock,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  X,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
  Receipt,
  LayoutGrid,
  Smartphone,
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { useAdmin } from "../../context/AdminContext";
import { CaseRecord, CaseStage, ClientProfile, NewsItem, FeePaymentRecord } from "../../types/admin";
import { motion, AnimatePresence } from "motion/react";
const EditCaseModal = React.lazy(() => import('./modals/EditCaseModal').then(module => ({ default: module.EditCaseModal })));
const ClientModal = React.lazy(() => import('./modals/ClientModal').then(module => ({ default: module.ClientModal })));
const NewsModal = React.lazy(() => import('./modals/NewsModal').then(module => ({ default: module.NewsModal })));
const PaymentModal = React.lazy(() => import('./modals/PaymentModal').then(module => ({ default: module.PaymentModal })));
const ReceiptModal = React.lazy(() => import('./modals/ReceiptModal').then(module => ({ default: module.ReceiptModal })));
const CalendarHearingModal = React.lazy(() => import('./modals/CalendarHearingModal').then(module => ({ default: module.CalendarHearingModal })));
const GoogleSheetsManager = React.lazy(() => import('./GoogleSheetsManager').then(module => ({ default: module.GoogleSheetsManager })));
const CaseNotesAndAttachments = React.lazy(() => import('./CaseNotesAndAttachments').then(module => ({ default: module.CaseNotesAndAttachments })));
const HearingPdfManagerTab = React.lazy(() => import('./HearingPdfManagerTab').then(module => ({ default: module.HearingPdfManagerTab })));
import { downloadTodaysHearingPdf, getTodaysHearingCases, getTodayDateStr } from "../../lib/todaysHearingPdfGenerator";











interface AdminDashboardProps {
  onClose: () => void;
}

// Simple Toast Notification Component
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-4 sm:right-6 z-[60] bg-[#1D4ED8] text-[#EFF6FF] px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-[#475569]/40 max-w-[calc(100vw-2rem)]"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="ml-2 text-[#EFF6FF]/80 hover:text-white cursor-pointer"
      >
        ×
      </button>
    </motion.div>
  );
};

// Animated Counter helper
const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  return <span>{value}</span>;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    cases,
    clients,
    news,
    payments,
    reminders,
    auditLogs,
    activeCase,
    setActiveCase,
    addCase,
    updateCase,
    deleteCase,
    addHearingToCase,
    deleteHearingFromCase,
    togglePinCase,
    toggleStarCase,
    addClient,
    updateClient,
    deleteClient,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    addPaymentRecord,
    deletePaymentRecord,
    importCauseList,
    askAiAssistant,
    logout,
    updatePin,
    idleTimeoutMinutes,
    setIdleTimeoutMinutes,
    exportBackupJson,
    importBackupJson,
  } = useAdmin();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    "analytics" | "cases" | "calendar" | "news" | "clients" | "fees" | "causelist" | "sheets" | "ai" | "security" | "documents" | "pdf-manager"
  >("analytics");

  // Filtering & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courtFilter, setCourtFilter] = useState("All");
  const [caseCategoryFilter, setCaseCategoryFilter] = useState<"All" | "Civil" | "Criminal" | "TodaysHearings">("All");

  // Modals state
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [editingCaseRecord, setEditingCaseRecord] = useState<CaseRecord | null>(null);
  const [showAddHearingModal, setShowAddHearingModal] = useState(false);
  const [clientModalState, setClientModalState] = useState<{
    show: boolean;
    client: ClientProfile | null;
    mode: "view" | "edit" | "create";
  }>({ show: false, client: null, mode: "create" });

  const [newsModalState, setNewsModalState] = useState<{ show: boolean; item: NewsItem | null }>({
    show: false,
    item: null,
  });

  const [showCollectPaymentModal, setShowCollectPaymentModal] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<{ payment: FeePaymentRecord; historyItem?: any } | null>(null);

  const [calendarModalState, setCalendarModalState] = useState<{
    show: boolean;
    dateStr: string;
    cases: CaseRecord[];
  }>({ show: false, dateStr: "", cases: [] });

  // Notifications Drawer & Mobile App More Sheet
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showMobileMoreSheet, setShowMobileMoreSheet] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => setToastMessage(msg);

  // Form states for Modal inputs
  const [newCaseData, setNewCaseData] = useState({
    partyName: "", // Client Name
    clientMobile: "", // 10 digit mobile number
    opponentName: "",
    caseType: "Civil",
    caseBackground: "None",
    courtName: "ACJM Makrana",
    caseNumber: "",
    act: "Section 138 NI Act",
    stageOption: "Charge",
    customStageInput: "",
  });
  const [newCaseMobileError, setNewCaseMobileError] = useState("");

  const [newHearingData, setNewHearingData] = useState({
    currentHearingDate: new Date().toISOString().split("T")[0],
    nextHearingDate: "",
    purpose: "Evidence Recording",
  });

  const [causeListText, setCauseListText] = useState("");
  const [aiQueryText, setAiQueryText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "ai", text: "Greetings Advocate Sikandar Khan. How can I assist you with your case files, hearing schedules, or legal records today?" },
  ]);

  // Security Form State
  const [oldPinInput, setOldPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [pinFormError, setPinFormError] = useState("");

  // Dynamic Calendar Month State (defaults to current month)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Case selector for Add Hearing Modal when opened from Analytics
  const [selectedHearingCaseId, setSelectedHearingCaseId] = useState<string>("");

  const backupInputRef = useRef<HTMLInputElement | null>(null);
  const aiChatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showNewCaseModal) setShowNewCaseModal(false);
        else if (showAddHearingModal) setShowAddHearingModal(false);
        else if (showNotificationsDrawer) setShowNotificationsDrawer(false);
        else if (showMobileMoreSheet) setShowMobileMoreSheet(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNewCaseModal, showAddHearingModal, showNotificationsDrawer, showMobileMoreSheet]);

  // Capture PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  // Native Android hardware back button handling
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let listenerHandle: { remove: () => Promise<void> } | null = null;
    CapacitorApp.addListener("backButton", () => {
      if (showMobileMoreSheet) setShowMobileMoreSheet(false);
      else if (showNotificationsDrawer) setShowNotificationsDrawer(false);
      else if (showNewCaseModal) setShowNewCaseModal(false);
      else if (showAddHearingModal) setShowAddHearingModal(false);
      else if (activeCase) setActiveCase(null);
      else if (activeTab !== "analytics") setActiveTab("analytics");
      else CapacitorApp.exitApp();
    }).then((handle) => {
      listenerHandle = handle;
    });
    return () => {
      listenerHandle?.remove();
    };
  }, [showMobileMoreSheet, showNotificationsDrawer, showNewCaseModal, showAddHearingModal, activeCase, activeTab, setActiveCase]);

  const handleInstallPwa = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    if (result?.outcome === "accepted") {
      showToast("App installed on your home screen!");
      setDeferredInstallPrompt(null);
    }
  };

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatLogs, isAiLoading]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todaysHearingsList = React.useMemo(() => getTodaysHearingCases(cases), [cases]);

  // Filtered cases
  const filteredCases = React.useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.courtName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || c.currentStatus === statusFilter;
      const matchesCourt = courtFilter === "All" || c.courtName.toLowerCase().includes(courtFilter.toLowerCase());

      let matchesCategory = true;
      if (caseCategoryFilter === "Civil") {
        matchesCategory = c.caseType.toLowerCase().includes("civil") || c.caseType === "Civil";
      } else if (caseCategoryFilter === "Criminal") {
        matchesCategory = c.caseType.toLowerCase().includes("criminal") || c.caseType === "Criminal";
      } else if (caseCategoryFilter === "TodaysHearings") {
        matchesCategory = c.hearings.some((h) => h.currentHearingDate === todayStr || h.nextHearingDate === todayStr);
      }

      return matchesSearch && matchesStatus && matchesCourt && matchesCategory;
    });
  }, [cases, searchQuery, statusFilter, courtFilter, caseCategoryFilter, todayStr]);

  const casesByDate = React.useMemo(() => {
    const map = new Map();
    cases.forEach(c => {
      c.hearings.forEach(h => {
        if (h.currentHearingDate) {
          if (!map.has(h.currentHearingDate)) map.set(h.currentHearingDate, []);
          if (!map.get(h.currentHearingDate).includes(c)) map.get(h.currentHearingDate).push(c);
        }
        if (h.nextHearingDate) {
          if (!map.has(h.nextHearingDate)) map.set(h.nextHearingDate, []);
          if (!map.get(h.nextHearingDate).includes(c)) map.get(h.nextHearingDate).push(c);
        }
      });
    });
    return map;
  }, [cases]);

  // Pin & Star Sorting
  const sortedCases = React.useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      return 0;
    });
  }, [filteredCases]);

  // Submit Handlers
  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseData.partyName || !newCaseData.caseNumber) return;

    // Validate 10-digit mobile number
    const cleanMobile = newCaseData.clientMobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      setNewCaseMobileError("Please enter a valid 10-digit mobile number");
      return;
    }
    setNewCaseMobileError("");

    const finalStage = newCaseData.stageOption === "Custom" 
      ? (newCaseData.customStageInput.trim() || "Custom Stage") 
      : newCaseData.stageOption;

    addCase({
      caseTitle: `${newCaseData.partyName} vs. ${newCaseData.opponentName}`,
      caseNumber: newCaseData.caseNumber,
      clientName: newCaseData.partyName,
      partyName: newCaseData.partyName,
      clientMobile: cleanMobile,
      opponentName: newCaseData.opponentName,
      courtName: newCaseData.courtName,
      caseType: newCaseData.caseType,
      caseBackground: newCaseData.caseBackground,
      act: newCaseData.act,
      currentStage: finalStage as CaseStage,
      currentStatus: "Active",
      priority: "high",
      hearings: [
        {
          id: `h_${Date.now()}`,
          currentHearingDate: todayStr,
          nextHearingDate: "",
          hearingTime: "10:30 AM",
          courtRoomNumber: newCaseData.courtName,
          judgeName: "Hon'ble Presiding Judge",
          purpose: "Initial Hearing & Notice",
        },
      ],
      documents: [],
      evidence: [],
      attachments: [],
      caseNotes: [],
      stickyNotes: [],
      caseTags: ["#NewCase"],
      isPinned: false,
      isStarred: false,
    });

    showToast("New Case File Registered Successfully!");
    setShowNewCaseModal(false);
    // Reset form
    setNewCaseData({
      partyName: "",
      clientMobile: "",
      opponentName: "",
      caseType: "Civil",
      caseBackground: "None",
      courtName: "ACJM Makrana",
      caseNumber: "",
      act: "Section 138 NI Act",
      stageOption: "Charge",
      customStageInput: "",
    });
    setNewCaseMobileError("");
  };

  const handleAddHearingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCase = activeCase || cases.find((c) => c.id === selectedHearingCaseId) || cases[0];
    if (!targetCase) {
      showToast("Please create a case record before scheduling a hearing.");
      return;
    }

    addHearingToCase(targetCase.id, {
      currentHearingDate: newHearingData.currentHearingDate,
      nextHearingDate: newHearingData.nextHearingDate,
      purpose: newHearingData.purpose,
      hearingTime: "11:00 AM",
      courtRoomNumber: targetCase.courtName,
      judgeName: "Hon'ble Presiding Officer",
    });

    showToast(`Hearing scheduled for ${targetCase.caseNumber}!`);
    setShowAddHearingModal(false);
    setNewHearingData({
      currentHearingDate: new Date().toISOString().split("T")[0],
      nextHearingDate: "",
      purpose: "Evidence Recording",
    });
  };

  const handlePinUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinFormError("");
    if (newPinInput.length < 4) {
      setPinFormError("New PIN must be at least 4 digits.");
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinFormError("New PIN and Confirm PIN do not match.");
      return;
    }
    if (updatePin(oldPinInput, newPinInput)) {
      showToast("Security PIN updated successfully!");
      setOldPinInput("");
      setNewPinInput("");
      setConfirmPinInput("");
    } else {
      setPinFormError("Current Security PIN is incorrect.");
    }
  };

  const handleAiChatSubmit = async (e: React.FormEvent, presetQuery?: string) => {
    e.preventDefault();
    const q = (presetQuery ?? aiQueryText).trim();
    if (!q || isAiLoading) return;

    if (!presetQuery) setAiQueryText("");
    setAiChatLogs((prev) => [...prev, { role: "user", text: q }]);
    setIsAiLoading(true);
    try {
      const response = await askAiAssistant(q);
      setAiChatLogs((prev) => [...prev, { role: "ai", text: response }]);
    } catch {
      setAiChatLogs((prev) => [
        ...prev,
        { role: "ai", text: "Unable to process that request right now. Please try again." },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBackupImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importBackupJson(String(reader.result || ""));
      showToast(ok ? "Database restored from JSON backup!" : "Invalid backup JSON file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(sidebarRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(".gsap-fade-in", {
        y: 20,
        opacity: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: "power2.out",
        delay: 0.15,
      });
    }, containerRef);

    return () => mm.revert();
  }, []);

  const sendTomorrowReminders = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const tomorrowCases = casesByDate.get(tomorrowStr) || [];

    if (tomorrowCases.length === 0) {
      showToast("Tomorrow there are no hearings.");
      return;
    }

    tomorrowCases.forEach((c, index) => {
      setTimeout(() => {
        const client = clients.find(cl => cl.linkedCaseIds.includes(c.id) || cl.mobile === c.clientMobile);
        let phone = client ? client.whatsapp : c.clientMobile;
        if (phone) {
           phone = phone.replace(/\D/g, "");
           if (phone.length === 10) phone = "91" + phone;
           
           const dateObj = new Date(tomorrowStr);
           const formattedDate = dateObj.toLocaleDateString("hi-IN", { day: 'numeric', month: 'long', year: 'numeric' });
           
           const text = encodeURIComponent(`नमस्ते ${c.clientName} जी,\n\nयह एक अनुस्मारक है कि आपके केस (${c.caseNumber} - ${c.caseTitle}) की सुनवाई कल (${formattedDate}) माननीय न्यायालय (${c.courtName}) में निर्धारित है। कृपया समय पर उपस्थित रहें।\n\nधन्यवाद,\nएडवोकेट सिकंदर खान`);
           
           window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
        }
      }, index * 1000); // 1-second delay between tabs to prevent aggressive blocking
    });
    
    showToast(`Sending WhatsApp reminders to ${tomorrowCases.length} clients...`);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col font-sans overflow-hidden h-dvh w-full">
      <PremiumBackground />
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header ref={headerRef} className="min-h-16 md:h-20 safe-pt bg-white/85 backdrop-blur-xl border-b border-[#475569]/20 px-4 md:px-8 py-2 md:py-0 flex items-center justify-between shrink-0 z-20 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex p-2 text-[#1D4ED8] border border-[#475569]/25 hover:bg-[#475569]/10 rounded-xl transition-all cursor-pointer bg-white shrink-0"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg sm:text-xl tracking-tight text-[#0F172A] flex items-center gap-2 font-serif font-medium truncate">
              Hello Sikander Khan 👋
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs sm:text-sm font-medium text-[#1D4ED8]">{getGreeting()}</span>
              <span className="text-sm text-[#475569] hidden sm:inline">Ready to manage today's work?</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 md:gap-5 shrink-0">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-[#0F172A]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="w-px h-8 bg-[#475569]/20 hidden md:block" />

          {/* Quick Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim() && activeTab !== "cases") {
                setActiveTab("cases");
                setActiveCase(null);
              }
            }}
            className="relative hidden lg:block w-64"
          >
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#475569] pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search cases, clients, or courts"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() && activeTab === "analytics") {
                  setActiveTab("cases");
                  setActiveCase(null);
                }
              }}
              placeholder="Search cases, clients..."
              className="w-full bg-white border border-[#475569]/25 rounded-full pl-9 pr-8 py-2 text-sm text-[#0F172A] placeholder-[#475569]/50 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10 transition-all outline-none shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-2.5 text-[#475569] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Install Mobile App Button (PWA) */}
          {deferredInstallPrompt && (
            <button
              type="button"
              onClick={handleInstallPwa}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1D4ED8] text-[#EFF6FF] text-xs font-bold shadow-sm hover:bg-[#1E40AF] transition-colors cursor-pointer"
              title="Install Mobile App"
            >
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={() => setShowNotificationsDrawer((prev) => !prev)}
            aria-label={`Reminders & Notifications (${reminders.filter((r) => r.isTriggered).length} active)`}
            aria-expanded={showNotificationsDrawer}
            className="p-2.5 text-[#1D4ED8] border border-[#475569]/25 hover:bg-[#475569]/10 rounded-full relative transition-all cursor-pointer bg-white"
            title="Reminders & Notifications"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            {reminders.filter((r) => r.isTriggered).length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1D4ED8] text-[#EFF6FF] text-[9px] font-bold flex items-center justify-center border-2 border-[#EFF6FF]">
                {Math.min(reminders.filter((r) => r.isTriggered).length, 99)}
              </span>
            )}
          </button>

          {/* Profile Avatar / Settings */}
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            aria-label="Account & Security settings"
            title="Account & Security Settings"
            className="w-9 h-9 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] flex items-center justify-center text-[#EFF6FF] font-bold text-sm shadow-md shadow-[#1D4ED8]/20 cursor-pointer transition-colors"
          >
            SK
          </button>

          {/* Close Admin Dashboard / Logout */}
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            aria-label="Logout"
            className="p-2.5 text-red-600 border border-red-500/30 hover:bg-red-500/10 rounded-full transition-all cursor-pointer bg-white"
            title="Logout"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <motion.aside ref={sidebarRef} animate={{ width: isSidebarCollapsed ? 80 : 280 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="bg-white/80 backdrop-blur-2xl border-r border-[#475569]/20 shrink-0 hidden md:flex m-4 rounded-[24px] shadow-[0_4px_20px_rgba(29,78,216,0.08)] relative overflow-hidden min-h-0">
          <SimpleBar className="w-full h-full p-3.5 flex flex-col justify-between">
            <nav aria-label="Workspace sections" className="space-y-1">
            {[
              { id: "analytics", label: "Analytics Overview", icon: LayoutDashboard },
              { id: "cases", label: "Case Records & Timeline", icon: Briefcase, count: cases.length },
              { id: "calendar", label: "Hearing Calendar", icon: CalendarIcon },
              { id: "fees", label: "Fee & Payment Tracker", icon: CreditCard, count: payments.length },
              { id: "news", label: "Live News Portal", icon: Newspaper, count: news.length },
              { id: "clients", label: "Client Database (CRM)", icon: Users, count: clients.length },
              { id: "causelist", label: "Cause List Importer", icon: FileSpreadsheet },
              { id: "pdf-manager", label: "Hearing PDF Manager", icon: FileText, count: todaysHearingsList.length },
              { id: "sheets", label: "Google Sheets Sync", icon: FileSpreadsheet },
              { id: "ai", label: "Gemini AI Case Assistant", icon: Bot },
              { id: "security", label: "Security & Audit Logs", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  title={isSidebarCollapsed ? tab.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== "cases") setActiveCase(null);
                  }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "justify-between px-3.5"} py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1D4ED8] text-[#EFF6FF] font-bold shadow-md shadow-[#1D4ED8]/20"
                      : "text-[#1D4ED8] hover:bg-[#475569]/10 hover:text-[#0F172A]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {!isSidebarCollapsed && <span className="truncate">{tab.label}</span>}
                  </div>
                  {!isSidebarCollapsed && tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        isActive ? "bg-[#EFF6FF]/20 text-[#EFF6FF]" : "bg-[#475569]/15 text-[#1E40AF]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

            {!isSidebarCollapsed && (
              <div className="p-3 bg-white/90 border border-[#475569]/20 rounded-xl space-y-1 text-[11px] text-[#1D4ED8] mt-6">
                <p className="font-bold text-[#0F172A]">Chamber Workstation</p>
                <p className="text-[#475569]">Civil & District Court Makrana</p>
                <p className="text-[10px] text-[#475569]/70 mt-1">Version 2.4 Encrypted Admin</p>
              </div>
            )}
          </SimpleBar>
        </motion.aside>

        {/* Content Pane */}
        <main className="flex-1 min-h-0 min-w-0 bg-[#FFFFFF]/90">
          <SimpleBar className="h-full p-4 pb-24 md:p-6 md:pb-6 space-y-6 scroll-smooth">
          {/* TAB 1: ANALYTICS OVERVIEW */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Today's Court Hearing List & PDF Quick Banner */}
              <div className="bg-[#FFFFFF]/90 border border-[#475569]/25 rounded-[24px] p-5 md:p-6 shadow-md shadow-[#1D4ED8]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#1D4ED8] text-[#EFF6FF] text-[10px] font-bold uppercase tracking-wider">
                    <FileText className="w-3 h-3 text-[#EFF6FF]" />
                    <span>Daily Cause List • {todayStr}</span>
                  </div>
                  <h3 className="text-xl font-serif font-extrabold text-[#0F172A]">
                    Today's Hearing List PDF (दैनिक पेशी सूची)
                  </h3>
                  <p className="text-xs text-[#1D4ED8] font-medium">
                    {todaysHearingsList.length > 0
                      ? `${todaysHearingsList.length} verified court hearing(s) scheduled for today across ACJM, ADJ & MJM Courts.`
                      : "No court appearances scheduled for today in chamber records."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      try {
                        const fileName = downloadTodaysHearingPdf(cases);
                        showToast(`Today's Hearing List PDF downloaded: ${fileName}`);
                      } catch (e) {
                        showToast("Error generating PDF");
                      }
                    }}
                    className="px-4 py-2.5 bg-[#1D4ED8] text-[#EFF6FF] hover:bg-[#1E40AF] font-bold text-xs rounded-xl shadow-md shadow-[#1D4ED8]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#EFF6FF]" />
                    <span>Download Today's PDF</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pdf-manager")}
                    className="px-4 py-2.5 bg-white/80 hover:bg-white text-[#0F172A] border border-[#475569]/30 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>Open PDF Manager</span>
                  </button>
                </div>
              </div>

              {/* Court-wise Analytics Overview Cards */}
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-serif font-bold text-[#0F172A]">Court-wise Analytics Overview</h2>
                  <p className="text-xs text-[#1D4ED8] font-medium">Click any court card to view and filter cases belonging to that specific court jurisdiction.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { courtKey: "ACJM", courtTitle: "ACJM Court", icon: Scale, description: "Additional Chief Judicial Magistrate Court" },
                    { courtKey: "ADJ", courtTitle: "ADJ Court", icon: ShieldCheck, description: "Additional District Judge Court" },
                    { courtKey: "MJM", courtTitle: "MJM Court", icon: Briefcase, description: "Munshif Judicial Magistrate Court" },
                  ].map((item) => {
                    const courtCases = cases.filter(c => c.courtName.toUpperCase().includes(item.courtKey));
                    const totalCases = courtCases.length;
                    const activeCases = courtCases.filter(c => c.currentStatus === "Active" || c.currentStatus === "Pending" || c.currentStatus === "Stay Granted").length;
                    const closedCases = courtCases.filter(c => c.currentStatus === "Won" || c.currentStatus === "Disposed").length;
                    const IconComponent = item.icon;

                    return (
                      <motion.div
                        key={item.courtKey}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setCourtFilter(item.courtKey);
                          setActiveTab("cases");
                          setActiveCase(null);
                        }}
                        className="bg-white/95 backdrop-blur-xl border border-[#475569]/30 rounded-[24px] p-6 shadow-md hover:shadow-xl hover:border-[#1D4ED8] transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">Jurisdiction</span>
                            <h3 className="text-xl font-serif font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">{item.courtTitle}</h3>
                            <p className="text-xs text-[#1D4ED8] font-medium">{item.description}</p>
                          </div>
                          <div className="p-3 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded-2xl group-hover:bg-[#1D4ED8] group-hover:text-[#EFF6FF] transition-all shrink-0">
                            <IconComponent className="w-6 h-6" />
                          </div>
                        </div>

                        {/* Counts Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-[#FFFFFF]/50 p-3 rounded-2xl border border-[#475569]/20">
                          <div className="text-center p-2 rounded-xl bg-white shadow-xs">
                            <span className="text-[10px] text-[#1D4ED8] font-bold block uppercase tracking-tight">Total</span>
                            <span className="text-xl font-serif font-bold text-[#0F172A]">{totalCases}</span>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
                            <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-tight">Active</span>
                            <span className="text-xl font-serif font-bold text-emerald-700">{activeCases}</span>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
                            <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-tight">Closed</span>
                            <span className="text-xl font-serif font-bold text-amber-700">{closedCases}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#475569]/15 text-xs text-[#1D4ED8] font-bold group-hover:text-[#0F172A]">
                          <span>Filter cases for {item.courtKey}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions & Urgent Hearings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="gsap-fade-in lg:col-span-2 p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-4 shadow-md shadow-[#1D4ED8]/15">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h2 className="text-base font-bold text-[#0F172A] font-serif flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#1D4ED8]" />
                      Upcoming Priority Court Appearances
                    </h2>
                    <button
                      onClick={() => setActiveTab("cases")}
                      className="text-xs text-[#0F172A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All Records <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cases.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveCase(c);
                          setActiveTab("cases");
                        }}
                        className="p-4 bg-[#FFFFFF]/90 border border-[#475569]/25 rounded-xl flex items-center justify-between hover:border-[#475569]/35 transition-all cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0F172A] text-xs">{c.caseTitle}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#475569]/15 text-[#0F172A] font-bold">
                              {c.caseNumber}
                            </span>
                          </div>
                          <p className="text-xs text-[#1D4ED8]">
                            Client: <strong>{c.clientName}</strong> | Court: {c.courtName}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-[#1D4ED8] block">
                            {c.hearings[0]?.currentHearingDate || "Pending Schedule"}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">{c.currentStage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gsap-fade-in p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-4 shadow-md shadow-[#1D4ED8]/15">
                  <h2 className="text-base font-bold text-[#0F172A] font-serif mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowNewCaseModal(true)}
                      className="w-full p-4 bg-[#1D4ED8] border border-[#1D4ED8] text-[#EFF6FF] font-bold rounded-xl text-[11px] hover:bg-[#1E40AF] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer transition-all"
                    >
                      <Plus className="w-5 h-5" /> Add New Case
                    </button>
                    <button
                      onClick={() => {
                        try {
                          const fileName = downloadTodaysHearingPdf(cases);
                          showToast(`Today's Hearing List PDF downloaded: ${fileName}`);
                        } catch (e) {
                          showToast("Error generating PDF");
                        }
                      }}
                      className="w-full p-4 bg-[#1D4ED8] border border-[#1D4ED8] text-[#EFF6FF] font-bold rounded-xl text-[11px] hover:bg-[#1E40AF] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer transition-all"
                    >
                      <Download className="w-5 h-5 text-[#EFF6FF]" /> Today's PDF
                    </button>
                    <button
                      onClick={() => setNewsModalState({ show: true, item: null })}
                      className="w-full p-4 bg-[#FFFFFF]/90 border border-[#475569]/25 text-[#0F172A] font-bold rounded-xl text-[11px] hover:bg-[#DBEAFE] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer transition-all"
                    >
                      <Newspaper className="w-5 h-5" /> Create Blog
                    </button>
                    <button
                      onClick={() => {
                        setClientModalState({ show: true, client: null, mode: "create" });
                      }}
                      className="w-full p-4 bg-[#FFFFFF]/90 border border-[#475569]/25 text-[#0F172A] font-bold rounded-xl text-[11px] hover:bg-[#DBEAFE] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer transition-all"
                    >
                      <Users className="w-5 h-5" /> Add Client
                    </button>
                    <button
                      onClick={() => setShowAddHearingModal(true)}
                      className="w-full p-4 bg-[#FFFFFF]/90 border border-[#475569]/25 text-[#0F172A] font-bold rounded-xl text-[11px] hover:bg-[#DBEAFE] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer transition-all"
                    >
                      <CalendarIcon className="w-5 h-5" /> Schedule Meeting
                    </button>
                    <button
                      onClick={() => setActiveTab("pdf-manager")}
                      className="w-full p-4 bg-[#FFFFFF]/90 border border-[#475569]/25 text-[#0F172A] font-bold rounded-xl text-[11px] hover:bg-[#DBEAFE] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer transition-all"
                    >
                      <FileText className="w-5 h-5 text-[#1D4ED8]" /> Hearing PDF Manager
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CASE RECORDS & TIMELINE */}
          {activeTab === "cases" && (
            <div className="space-y-6">
              {/* Header Bar & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-xl shadow-md shadow-[#1D4ED8]/15">
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#475569]/80" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, client, court..."
                      className="w-full bg-[#FFFFFF]/90 border border-[#475569]/25 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0F172A] outline-none focus:border-[#475569]/35"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#FFFFFF]/90 border border-[#475569]/25 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Stay Granted">Stay Granted</option>
                    <option value="Won">Won / Disposed</option>
                  </select>

                  <select
                    value={courtFilter}
                    onChange={(e) => setCourtFilter(e.target.value)}
                    className="bg-white border border-[#475569]/35 rounded-lg px-3 py-2 text-xs text-[#0F172A] font-bold outline-none"
                  >
                    <option value="All">All Courts</option>
                    <option value="ACJM">ACJM Courts</option>
                    <option value="ADJ">ADJ Courts</option>
                    <option value="MJM">MJM Courts</option>
                    <option value="ACJM Makrana">ACJM Makrana</option>
                    <option value="ADJ Makrana">ADJ Makrana</option>
                    <option value="MJM Makrana">MJM Makrana</option>
                    <option value="ADJ Parbatsar">ADJ Parbatsar</option>
                    <option value="ACJM Parbatsar">ACJM Parbatsar</option>
                    <option value="ADJ Kuchaman">ADJ Kuchaman</option>
                    <option value="ACJM Kuchaman">ACJM Kuchaman</option>
                    <option value="POCSO Court Didwana">POCSO Court Didwana</option>
                    <option value="SC/ST Court Didwana">SC/ST Court Didwana</option>
                    <option value="SDO Court Makrana">SDO Court Makrana</option>
                  </select>
                </div>

                {/* Category Pills Bar */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {[
                    { key: "All", label: "All Cases" },
                    { key: "Civil", label: "Civil Cases" },
                    { key: "Criminal", label: "Criminal Cases" },
                    { key: "TodaysHearings", label: "Today's Court Hearings" },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setCaseCategoryFilter(cat.key as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                        caseCategoryFilter === cat.key
                          ? "bg-[#EFF6FF] text-black font-bold"
                          : "bg-[#FFFFFF]/90 border border-[#475569]/25 text-[#1D4ED8] hover:text-[#0F172A]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowNewCaseModal(true)}
                  className="px-4 py-2 bg-[#EFF6FF] text-black font-bold rounded-lg text-xs hover:bg-[#EFF6FF] flex items-center gap-2 shadow-md shadow-[#1D4ED8]/15 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New Case Record
                </button>
              </div>

              {/* Case Cards / Table */}
              {activeCase ? (
                /* CASE DETAILS VIEW WITH TIMELINE, STICKY NOTES, EVIDENCE GALLERY */
                <div className="space-y-6">
                  <button
                    onClick={() => setActiveCase(null)}
                    className="text-xs text-[#0F172A] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    ← Back to Case Records List
                  </button>

                  {/* Case Summary Card */}
                  <div className="p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-4 shadow-lg shadow-black/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#475569]/20 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/90 border border-[#475569]/25 text-[#0F172A] font-bold">
                            {activeCase.caseNumber}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold">
                            {activeCase.currentStatus}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/30 text-[#1D4ED8] font-bold">
                            Priority: {activeCase.priority.toUpperCase()}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-[#0F172A] font-serif mt-2">{activeCase.caseTitle}</h2>
                        <p className="text-xs text-[#1D4ED8] mt-1">
                          Client: <strong className="text-[#0F172A]">{activeCase.clientName}</strong> ({activeCase.clientMobile}) vs. {activeCase.opponentName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingCaseRecord(activeCase)}
                          className="px-3 py-2 rounded-lg border border-[#475569]/25 text-[#0F172A] hover:bg-[#FFFFFF]/90 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Record
                        </button>
                        <button
                          onClick={() => toggleStarCase(activeCase.id)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            activeCase.isStarred ? "bg-[#1D4ED8] border-[#1D4ED8] text-[#EFF6FF] font-bold" : "border-[#475569]/25 text-[#475569]"
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => togglePinCase(activeCase.id)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            activeCase.isPinned ? "bg-[#1D4ED8] text-[#EFF6FF] font-bold" : "border-[#475569]/25 text-[#475569]"
                          }`}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowAddHearingModal(true)}
                          className="px-4 py-2 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-lg text-xs hover:bg-[#1E40AF] flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#1D4ED8]/15"
                        >
                          <Plus className="w-4 h-4" /> Add Hearing Record
                        </button>
                      </div>
                    </div>

                    {/* Stage Progress Bar */}
                    <div>
                      <span className="text-[10px] tracking-wider text-[#475569] uppercase font-bold">
                        Immutable Stage History Tracker
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-2">
                        {[
                          "Filed",
                          "Notice Issued",
                          "Reply Filed",
                          "Evidence",
                          "Arguments",
                          "Order Reserved",
                          "Judgment",
                        ].map((stg, i) => {
                          const stagesOrder = [
                            "Filed",
                            "Notice Issued",
                            "Reply Filed",
                            "Evidence",
                            "Arguments",
                            "Order Reserved",
                            "Judgment",
                          ];
                          const isPassed = stagesOrder.indexOf(activeCase.currentStage) >= i;
                          const isCurrent = activeCase.currentStage === stg;
                          return (
                            <div
                              key={stg}
                              className={`p-2 rounded-lg border text-center transition-all ${
                                isCurrent
                                  ? "bg-[#EFF6FF] text-black font-bold border-[#475569]/35 shadow-md shadow-[#1D4ED8]/15"
                                  : isPassed
                                  ? "bg-[#FFFFFF]/90 border-[#475569]/35 text-[#0F172A]"
                                  : "border-[#475569]/20 text-[#475569]/60"
                              }`}
                            >
                              <p className="text-[10px] uppercase font-bold">{stg}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Hearing Timeline History */}
                  <div className="p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-4 shadow-lg shadow-black/50">
                    <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 font-serif">
                      <Clock className="w-4 h-4 text-[#0F172A]" />
                      Hearing Timeline History
                    </h3>

                    <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EFF6FF]/20">
                      {activeCase.hearings.map((h) => (
                        <div key={h.id} className="relative pl-10 group">
                          <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-[#EFF6FF] border-2 border-[#0B0B0B]" />
                          <div className="p-4 bg-[#FFFFFF]/90 border border-[#475569]/25 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#0F172A]">
                                {h.currentHearingDate} ({h.hearingTime})
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[#475569]">{h.judgeName}</span>
                                <button
                                  onClick={() => {
                                    if (confirm("Delete this hearing entry from timeline?")) {
                                      deleteHearingFromCase(activeCase.id, h.id);
                                      showToast("Hearing record removed.");
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-[#0F172A]">
                              <strong>Purpose:</strong> {h.purpose}
                            </p>
                            {h.result && (
                              <p className="text-xs text-emerald-800 font-bold">
                                <strong>Court Result:</strong> {h.result}
                              </p>
                            )}
                            {h.nextAction && (
                              <p className="text-xs text-[#0F172A] font-bold">
                                <strong>Next Action:</strong> {h.nextAction}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Notes & Image/PDF Attachments Feature */}
                  <CaseNotesAndAttachments caseRecord={activeCase} />
                </div>
              ) : (
                /* CASE RECORDS LIST: MOBILE CARDS + DESKTOP TABLE */
                <>
                  {/* Mobile App Card List */}
                  <div className="md:hidden space-y-3">
                    {sortedCases.length === 0 ? (
                      <div className="p-8 text-center bg-white/75 rounded-2xl border border-[#475569]/20 text-xs text-[#475569]">
                        No matching case records found.
                      </div>
                    ) : (
                      sortedCases.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setActiveCase(c)}
                          className="p-4 bg-white/90 border border-[#475569]/25 rounded-2xl shadow-sm active:scale-[0.99] transition-transform space-y-2.5 cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="font-mono text-[11px] font-bold text-[#1D4ED8] block">{c.caseNumber}</span>
                              <h3 className="text-sm font-bold text-[#0F172A] truncate">{c.partyName || c.clientName}</h3>
                              {c.opponentName && (
                                <p className="text-[11px] text-[#1D4ED8] truncate">vs. {c.opponentName}</p>
                              )}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              c.currentStatus === "Active" ? "bg-emerald-100 border border-emerald-300 text-emerald-900" : "bg-gray-100 border border-gray-300 text-gray-800"
                            }`}>
                              {c.currentStatus}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              c.caseType.toLowerCase().includes("criminal") ? "bg-rose-100 text-rose-900" : "bg-sky-100 text-sky-900"
                            }`}>
                              {c.caseType}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#0F172A] font-semibold">{c.courtName}</span>
                            <span className="px-2 py-0.5 rounded bg-white border border-[#475569]/30 text-[#1D4ED8] font-bold">{c.currentStage}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-[#475569]/15 text-[11px]">
                            <span className="font-semibold text-[#1D4ED8]">
                              Next: <strong className="text-[#0F172A]">{c.hearings[0]?.nextHearingDate || c.hearings[0]?.currentHearingDate || "Pending"}</strong>
                            </span>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setEditingCaseRecord(c)}
                                className="px-2.5 py-1 bg-[#EFF6FF] border border-[#475569]/25 rounded-lg text-[#0F172A] font-bold text-[11px]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                aria-label={`Delete ${c.caseNumber}`}
                                onClick={() => {
                                  if (confirm(`Delete case file for "${c.partyName || c.clientName}" permanently?`)) {
                                    deleteCase(c.id);
                                    showToast("Case record deleted.");
                                  }
                                }}
                                className="p-1.5 text-red-600 rounded-lg bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] overflow-hidden shadow-md shadow-[#1D4ED8]/15">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FFFFFF]/90 border-b border-[#475569]/25 text-[#0F172A] uppercase text-[10px] tracking-wider font-bold">
                        <tr>
                          <th className="p-3.5">S.No</th>
                          <th className="p-3.5">Party Name</th>
                          <th className="p-3.5">Case Number</th>
                          <th className="p-3.5">Case Type</th>
                          <th className="p-3.5">Court Name</th>
                          <th className="p-3.5">Current Stage</th>
                          <th className="p-3.5">Next Hearing Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-[#0F172A]">
                        {sortedCases.map((c, idx) => (
                          <tr key={c.id} className="hover:bg-[#FFFFFF]/90/50 transition-colors">
                            <td className="p-3.5 font-mono text-[#0F172A] font-semibold">{idx + 1}</td>
                             <td className="p-3.5 font-bold text-[#0F172A]">
                              {c.partyName || c.clientName}
                              {c.opponentName && <span className="block text-[10px] text-[#1D4ED8] font-semibold">vs. {c.opponentName}</span>}
                              {c.clientMobile && <span className="block text-[10px] text-[#1E40AF] font-bold">📱 {c.clientMobile}</span>}
                            </td>
                            <td className="p-3.5 font-mono text-[#0F172A] font-bold">{c.caseNumber}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.caseType.toLowerCase().includes("criminal") ? "bg-rose-100 border border-rose-300 text-rose-900" : "bg-sky-100 border border-sky-300 text-sky-900"
                              }`}>
                                {c.caseType}
                              </span>
                            </td>
                            <td className="p-3.5 text-[#0F172A] font-semibold">{c.courtName}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full bg-white border border-[#475569]/35 text-[#0F172A] text-[10px] font-bold shadow-2xs">
                                {c.currentStage}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-[#0F172A]">
                              {c.hearings[0]?.nextHearingDate || c.hearings[0]?.currentHearingDate || "Pending"}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.currentStatus === "Active" ? "bg-emerald-100 border border-emerald-300 text-emerald-900" : "bg-gray-100 border border-gray-300 text-gray-800"
                              }`}>
                                {c.currentStatus}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => setActiveCase(c)}
                                className="px-3 py-1 bg-[#EFF6FF] text-black font-bold rounded hover:bg-[#EFF6FF] transition-all inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </button>
                              <button
                                onClick={() => setEditingCaseRecord(c)}
                                className="px-3 py-1 bg-[#FFFFFF]/90 border border-[#475569]/25 rounded text-[#0F172A] hover:bg-[#475569]/10 font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete case file for "${c.partyName || c.clientName}" permanently?`)) {
                                    deleteCase(c.id);
                                    showToast("Case record deleted.");
                                  }
                                }}
                                className="p-1 text-red-600 hover:text-red-700 inline-block align-middle cursor-pointer"
                                title="Delete Case"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: HEARING CALENDAR */}
          {activeTab === "calendar" && (
            <div className="space-y-6">
              <div className="p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-4 shadow-md shadow-[#1D4ED8]/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A] font-serif">Interactive Hearing Calendar & Reminders</h2>
                    <p className="text-xs text-[#1D4ED8] font-medium">Click on any date to inspect cause lists, reschedule dates, or download PDF.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        try {
                          const fileName = downloadTodaysHearingPdf(cases);
                          showToast(`Today's Hearing List PDF downloaded: ${fileName}`);
                        } catch (e) {
                          showToast("Error generating PDF");
                        }
                      }}
                      className="px-3.5 py-2 bg-[#1D4ED8] text-[#EFF6FF] hover:bg-[#1E40AF] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#EFF6FF]" /> Download Today's PDF
                    </button>
                    <button 
                      onClick={sendTomorrowReminders}
                      className="px-3.5 py-2 bg-[#128C7E] text-white font-bold rounded-lg hover:bg-[#075E54] flex items-center justify-center gap-1.5 shadow-md transition-colors text-xs cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" /> Send Tomorrow's Reminders
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 bg-white/60 border border-[#475569]/20 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() =>
                        setCalendarMonth((prev) =>
                          prev.month === 0
                            ? { year: prev.year - 1, month: 11 }
                            : { year: prev.year, month: prev.month - 1 }
                        )
                      }
                      className="p-1.5 rounded-lg border border-[#475569]/25 bg-white text-[#0F172A] hover:bg-[#EFF6FF] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#0F172A] min-w-[150px] text-center">
                      {new Date(calendarMonth.year, calendarMonth.month, 1).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setCalendarMonth((prev) =>
                          prev.month === 11
                            ? { year: prev.year + 1, month: 0 }
                            : { year: prev.year, month: prev.month + 1 }
                        )
                      }
                      className="p-1.5 rounded-lg border border-[#475569]/25 bg-white text-[#0F172A] hover:bg-[#EFF6FF] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setCalendarMonth({ year: now.getFullYear(), month: now.getMonth() });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1D4ED8] text-[#EFF6FF] text-xs font-bold hover:bg-[#1E40AF] cursor-pointer"
                  >
                    Today
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[540px] space-y-2">
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#0F172A] uppercase border-b border-[#475569]/20 pb-2">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 min-h-[320px]">
                      {(() => {
                        const firstWeekday = new Date(calendarMonth.year, calendarMonth.month, 1).getDay();
                        const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
                        const monthStr = String(calendarMonth.month + 1).padStart(2, "0");

                        return [
                          ...Array.from({ length: firstWeekday }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="p-2 rounded-xl bg-[#FFFFFF]/35 border border-transparent min-h-[75px]" />
                          )),
                          ...Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const dateStr = `${calendarMonth.year}-${monthStr}-${String(dayNum).padStart(2, "0")}`;
                            const dayCases = casesByDate.get(dateStr) || [];
                            const isTodayCell = dateStr === todayStr;

                            return (
                              <button
                                type="button"
                                key={dateStr}
                                onClick={() => setCalendarModalState({ show: true, dateStr, cases: dayCases })}
                                className={`p-2 text-left border rounded-xl min-h-[78px] space-y-1 transition-all cursor-pointer flex flex-col items-stretch justify-start ${
                                  isTodayCell
                                    ? "bg-white border-[#1D4ED8] ring-2 ring-[#1D4ED8]/20 shadow-sm"
                                    : "border-[#475569]/20 bg-[#FFFFFF]/90 hover:border-[#1D4ED8]/50 hover:bg-white/70"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`text-[11px] font-bold ${isTodayCell ? "text-[#1D4ED8]" : "text-[#0F172A]"}`}>
                                    {dayNum}
                                  </span>
                                  {isTodayCell && (
                                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#1D4ED8] text-[#EFF6FF]">
                                      Today
                                    </span>
                                  )}
                                </div>
                                {dayCases.slice(0, 2).map((dh: CaseRecord) => (
                                  <div key={dh.id} className="p-1 rounded bg-[#1D4ED8]/10 border border-[#1D4ED8]/30 text-[9px] font-bold text-[#1D4ED8] truncate">
                                    • {dh.caseNumber}
                                  </div>
                                ))}
                                {dayCases.length > 2 && (
                                  <span className="text-[9px] font-bold text-[#1D4ED8]">+{dayCases.length - 2} more</span>
                                )}
                              </button>
                            );
                          }),
                        ];
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FEE & PAYMENT TRACKER */}
          {activeTab === "fees" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-xl shadow-md shadow-[#1D4ED8]/15">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] font-serif">Fee & Payment Tracker</h2>
                  <p className="text-xs text-[#475569]">Track legal fee agreements, installments, pending balances, and printable client receipts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCollectPaymentModal(true)}
                  className="px-4 py-2 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-lg text-xs hover:bg-[#1E40AF] flex items-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Collect Payment
                </button>
              </div>

              {/* Fee Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white/90 border border-[#475569]/25 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">Total Agreed Fees</span>
                  <p className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    ₹{payments.reduce((sum, p) => sum + (p.totalFee || 0), 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-5 bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Total Collected</span>
                  <p className="text-2xl font-serif font-bold text-emerald-700 mt-1">
                    ₹{payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-5 bg-amber-50/90 border border-amber-200 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Pending Balance</span>
                  <p className="text-2xl font-serif font-bold text-amber-700 mt-1">
                    ₹{payments.reduce((sum, p) => sum + Math.max(0, p.pendingAmount || 0), 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] overflow-hidden shadow-md shadow-[#1D4ED8]/15">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/60 border-b border-[#475569]/25 text-[#0F172A] uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th scope="col" className="p-3.5">Client / Case</th>
                        <th scope="col" className="p-3.5">Total Fee</th>
                        <th scope="col" className="p-3.5">Paid</th>
                        <th scope="col" className="p-3.5">Pending</th>
                        <th scope="col" className="p-3.5">Status</th>
                        <th scope="col" className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#475569]/15 text-[#0F172A]">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#475569]">
                            No fee records yet. Click &ldquo;Collect Payment&rdquo; to log a client payment.
                          </td>
                        </tr>
                      ) : (
                        payments.map((p) => (
                          <tr key={p.id} className="hover:bg-white/40 transition-colors">
                            <td className="p-3.5">
                              <span className="font-bold block">{p.clientName}</span>
                              <span className="text-[10px] text-[#1D4ED8] font-mono">{p.caseNumber}</span>
                            </td>
                            <td className="p-3.5 font-semibold">₹{(p.totalFee || 0).toLocaleString("en-IN")}</td>
                            <td className="p-3.5 font-bold text-emerald-700">₹{(p.paidAmount || 0).toLocaleString("en-IN")}</td>
                            <td className="p-3.5 font-bold text-amber-700">₹{Math.max(0, p.pendingAmount || 0).toLocaleString("en-IN")}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === "Paid"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : p.status === "Partial"
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-rose-100 text-rose-800 border border-rose-300"
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setViewingReceipt({ payment: p, historyItem: p.paymentHistory?.[0] })}
                                className="px-3 py-1 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-lg hover:bg-[#1E40AF] inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Receipt className="w-3.5 h-3.5" /> Receipt
                              </button>
                              <button
                                type="button"
                                aria-label={`Delete payment record for ${p.clientName}`}
                                onClick={() => {
                                  if (confirm(`Delete payment record for ${p.clientName}?`)) {
                                    deletePaymentRecord(p.id);
                                    showToast("Payment record deleted.");
                                  }
                                }}
                                className="p-1.5 text-red-600 hover:text-red-700 inline-block align-middle cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE NEWS PORTAL */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-xl shadow-md shadow-[#1D4ED8]/15">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] font-serif">Live Website News Portal Manager</h2>
                  <p className="text-xs text-[#475569]">Announcements published here are displayed on the public breaking news ticker.</p>
                </div>

                <button
                  onClick={() => setNewsModalState({ show: true, item: null })}
                  className="px-4 py-2 bg-[#EFF6FF] text-black font-bold rounded-lg text-xs hover:bg-[#EFF6FF] flex items-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Publish Announcement
                </button>
              </div>

              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="p-4 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-xl space-y-2 relative group shadow-md shadow-[#1D4ED8]/15">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#475569]/15 text-[#0F172A]">
                          {item.category}
                        </span>
                        {item.isPinned && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1D4ED8]/10 text-[#1D4ED8] font-bold flex items-center gap-1 border border-[#1D4ED8]/30">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNewsModalState({ show: true, item })}
                          className="p-1 text-[#475569] hover:text-[#0F172A]"
                          title="Edit Notice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            deleteNewsItem(item.id);
                            showToast("Notice deleted.");
                          }}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs text-[#1D4ED8]">{item.content}</p>
                    <span className="text-[10px] text-[#475569]/80 block pt-1">Published: {item.publishedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CLIENT DATABASE CRM */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-xl shadow-md shadow-[#1D4ED8]/15">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] font-serif">Client Database CRM</h2>
                  <p className="text-xs text-[#475569]">Manage client contact details, WhatsApp connections, and linked court records.</p>
                </div>

                <button
                  onClick={() => setClientModalState({ show: true, client: null, mode: "create" })}
                  className="px-4 py-2 bg-[#EFF6FF] text-black font-bold rounded-lg text-xs hover:bg-[#EFF6FF] flex items-center gap-2 shadow-md shadow-[#1D4ED8]/15 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Client Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <div key={client.id} className="p-5 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-3 shadow-md shadow-[#1D4ED8]/15 hover:border-[#475569]/35 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#0F172A]">{client.name}</h3>
                        <p className="text-xs text-[#475569]">{client.mobile}</p>
                      </div>
                      <a
                        href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </div>

                    <div className="text-xs text-[#1D4ED8] space-y-1">
                      <p>📍 {client.address}</p>
                      <p>🆔 Aadhaar: {client.aadhaar || "N/A"} | PAN: {client.pan || "N/A"}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => setClientModalState({ show: true, client, mode: "view" })}
                        className="px-3 py-1.5 bg-[#FFFFFF]/90 border border-[#475569]/25 rounded-lg text-xs font-bold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-black transition-all cursor-pointer"
                      >
                        View Full Profile
                      </button>
                      <button
                        onClick={() => setClientModalState({ show: true, client, mode: "edit" })}
                        className="p-1.5 text-[#475569] hover:text-[#0F172A] cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CAUSE LIST IMPORTER */}
          {activeTab === "causelist" && (
            <div className="space-y-6">
              <div className="p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-4 shadow-md shadow-[#1D4ED8]/15">
                <h2 className="text-lg font-bold text-[#0F172A] font-serif">Daily Court Cause List Importer</h2>
                <p className="text-xs text-[#475569]">
                  Paste the daily cause list text or upload cause list PDF to automatically match existing cases and update court hearing dates.
                </p>

                <textarea
                  rows={8}
                  value={causeListText}
                  onChange={(e) => setCauseListText(e.target.value)}
                  placeholder="Paste Cause List raw text here... e.g. CIVIL-124/2026 Rameshwar Sharma vs State..."
                  className="w-full bg-[#FFFFFF]/90 border border-[#475569]/25 rounded-xl p-4 text-xs font-mono text-[#0F172A] outline-none focus:border-[#475569]/35"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const res = importCauseList(causeListText);
                      showToast(`Cause List Imported! Matched ${res.matched} case records.`);
                      setCauseListText("");
                    }}
                    className="px-5 py-2.5 bg-[#EFF6FF] text-black font-bold rounded-xl text-xs hover:bg-[#EFF6FF] shadow-md shadow-[#1D4ED8]/15 cursor-pointer"
                  >
                    Process & Auto-Match Cause List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GOOGLE SHEETS SYNC */}
          {activeTab === "sheets" && <GoogleSheetsManager />}

          {/* TAB 9: AI CASE ASSISTANT */}
          {activeTab === "ai" && (
            <div className="p-5 sm:p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-4 flex flex-col h-[calc(100dvh-11rem)] min-h-[460px] max-h-[680px] shadow-md shadow-[#1D4ED8]/15">
              <div className="flex items-center gap-2 border-b border-[#475569]/20 pb-3">
                <Bot className="w-6 h-6 text-[#0F172A] shrink-0" aria-hidden="true" />
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] font-serif">Gemini AI Legal Case Assistant</h2>
                  <p className="text-xs text-[#475569]">Ask natural language questions about your cases, deadlines, or pending tasks.</p>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Show all hearings next week",
                  "Which cases have pending documents?",
                  "Give me an active case overview",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={isAiLoading}
                    onClick={(e) => handleAiChatSubmit(e, prompt)}
                    className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#475569]/25 text-[11px] font-semibold text-[#1D4ED8] hover:text-[#0F172A] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-white/40 rounded-xl border border-[#475569]/15">
                {aiChatLogs.map((log, idx) => (
                  <div key={idx} className={`flex ${log.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xl p-3 rounded-xl text-xs whitespace-pre-wrap leading-relaxed ${
                        log.role === "user"
                          ? "bg-[#1D4ED8] text-[#EFF6FF] font-semibold"
                          : "bg-white/95 border border-[#475569]/25 text-[#0F172A]"
                      }`}
                    >
                      {log.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl text-xs bg-white/90 border border-[#475569]/25 text-[#1D4ED8] flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      <span>Analyzing chamber records...</span>
                    </div>
                  </div>
                )}
                <div ref={aiChatEndRef} />
              </div>

              <form onSubmit={handleAiChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  aria-label="Ask AI Legal Case Assistant"
                  value={aiQueryText}
                  onChange={(e) => setAiQueryText(e.target.value)}
                  placeholder="e.g., Show all hearings next week..."
                  className="flex-1 bg-white border border-[#475569]/25 rounded-xl px-4 py-2.5 text-xs text-[#0F172A] outline-none focus:border-[#1D4ED8]"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiQueryText.trim()}
                  className="px-5 py-2.5 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-xl text-xs hover:bg-[#1E40AF] cursor-pointer shadow-md shadow-[#1D4ED8]/15 disabled:opacity-50"
                >
                  Ask AI
                </button>
              </form>
            </div>
          )}

          {/* TAB 10: SECURITY & AUDIT LOGS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="p-6 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] space-y-6 shadow-md shadow-[#1D4ED8]/15">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#475569]/20 pb-3">
                  <h2 className="text-lg font-bold text-[#0F172A] font-serif">Security Controls & Audit Log Ledger</h2>
                  <span className="text-xs text-emerald-700 font-bold">● AES-256 PIN Encrypted</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PIN Reset Form */}
                  <form onSubmit={handlePinUpdateSubmit} className="p-5 bg-white/60 border border-[#475569]/25 rounded-xl space-y-3 text-xs">
                    <h3 className="font-bold text-[#0F172A] text-sm font-serif">Change Admin Security PIN</h3>
                    <div>
                      <label htmlFor="old-pin" className="block text-[#1D4ED8] mb-1 font-semibold">Current Security PIN</label>
                      <input
                        id="old-pin"
                        type="password"
                        required
                        maxLength={6}
                        value={oldPinInput}
                        onChange={(e) => {
                          setOldPinInput(e.target.value);
                          setPinFormError("");
                        }}
                        placeholder="••••"
                        className="w-full bg-white border border-[#475569]/25 rounded-lg p-2.5 text-[#0F172A] font-mono text-center tracking-widest outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-pin" className="block text-[#1D4ED8] mb-1 font-semibold">New Security PIN</label>
                      <input
                        id="new-pin"
                        type="password"
                        required
                        maxLength={6}
                        value={newPinInput}
                        onChange={(e) => {
                          setNewPinInput(e.target.value);
                          setPinFormError("");
                        }}
                        placeholder="••••"
                        className="w-full bg-white border border-[#475569]/25 rounded-lg p-2.5 text-[#0F172A] font-mono text-center tracking-widest outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-pin" className="block text-[#1D4ED8] mb-1 font-semibold">Confirm New PIN</label>
                      <input
                        id="confirm-pin"
                        type="password"
                        required
                        maxLength={6}
                        value={confirmPinInput}
                        onChange={(e) => {
                          setConfirmPinInput(e.target.value);
                          setPinFormError("");
                        }}
                        placeholder="••••"
                        className="w-full bg-white border border-[#475569]/25 rounded-lg p-2.5 text-[#0F172A] font-mono text-center tracking-widest outline-none font-bold"
                      />
                    </div>
                    {pinFormError && (
                      <p role="alert" className="text-red-600 font-semibold text-xs">
                        {pinFormError}
                      </p>
                    )}
                    <button type="submit" className="w-full py-2.5 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-lg mt-2 shadow-md shadow-[#1D4ED8]/15 hover:bg-[#1E40AF] cursor-pointer">
                      Update Security PIN
                    </button>
                  </form>

                  {/* Auto-logout & Backup settings */}
                  <div className="space-y-4">
                    <div className="p-5 bg-white/60 border border-[#475569]/25 rounded-xl space-y-3 text-xs">
                      <h3 className="font-bold text-[#0F172A] text-sm font-serif">Auto Logout Idle Timeout</h3>
                      <p className="text-[#1D4ED8]">Automatically log out admin session after specified period of inactivity.</p>

                      <div>
                        <label htmlFor="idle-timeout-select" className="block text-[#1D4ED8] mb-1 font-semibold">Inactivity Timeout Duration</label>
                        <select
                          id="idle-timeout-select"
                          value={idleTimeoutMinutes}
                          onChange={(e) => {
                            setIdleTimeoutMinutes(Number(e.target.value));
                            showToast(`Idle timeout updated to ${e.target.value} minutes.`);
                          }}
                          className="w-full bg-white border border-[#475569]/25 rounded-lg p-2.5 text-[#0F172A] outline-none font-bold"
                        >
                          <option value={5}>5 Minutes</option>
                          <option value={15}>15 Minutes</option>
                          <option value={30}>30 Minutes</option>
                          <option value={60}>60 Minutes</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-5 bg-white/60 border border-[#475569]/25 rounded-xl space-y-3 text-xs">
                      <h3 className="font-bold text-[#0F172A] text-sm font-serif">Database Backup & Restore</h3>
                      <p className="text-[#1D4ED8]">Export all cases, clients, payments, and notices to JSON or restore from a previous backup.</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            exportBackupJson();
                            showToast("Database backup exported!");
                          }}
                          className="px-4 py-2 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-lg hover:bg-[#1E40AF] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Export JSON Backup
                        </button>
                        <button
                          type="button"
                          onClick={() => backupInputRef.current?.click()}
                          className="px-4 py-2 bg-white border border-[#475569]/30 text-[#0F172A] font-bold rounded-lg hover:bg-[#EFF6FF] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" /> Restore JSON
                        </button>
                        <input
                          ref={backupInputRef}
                          type="file"
                          accept=".json,application/json"
                          onChange={handleBackupImportFile}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Logs Table */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#0F172A] font-serif">Security Audit Logs Ledger</span>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white/60 border border-[#475569]/15 rounded-xl text-xs flex justify-between items-center gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-[#0F172A]">{log.action}</p>
                          <p className="text-[#475569] text-[11px] truncate">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-[#475569]/80 shrink-0">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HEARING PDF MANAGER TAB */}
          {activeTab === "pdf-manager" && (
            <HearingPdfManagerTab onShowToast={showToast} onNavigateTab={setActiveTab} />
          )}

          {/* Bottom Download Android App Section (visible on web) */}
          <DownloadAppBanner
            canInstallPwa={Boolean(deferredInstallPrompt)}
            onInstallPwa={handleInstallPwa}
          />
          </SimpleBar>
        </main>
      </div>

      {/* MOBILE NATIVE BOTTOM TAB BAR */}
      <nav
        aria-label="Primary mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-[#475569]/20 safe-pb shadow-[0_-6px_24px_rgba(15,23,42,0.08)]"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {[
            { id: "analytics", label: "Home", icon: LayoutDashboard },
            { id: "cases", label: "Cases", icon: Briefcase, badge: cases.length },
            { id: "calendar", label: "Calendar", icon: CalendarIcon },
            { id: "clients", label: "Clients", icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !showMobileMoreSheet;
            return (
              <button
                type="button"
                key={item.id}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  setShowMobileMoreSheet(false);
                  setActiveTab(item.id as any);
                  if (item.id !== "cases") setActiveCase(null);
                }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors cursor-pointer relative ${
                  isActive ? "text-[#1D4ED8]" : "text-[#475569]"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-[#1D4ED8] text-[#EFF6FF]" : ""}`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className={`text-[10px] leading-none ${isActive ? "font-bold text-[#0F172A]" : "font-medium"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            aria-expanded={showMobileMoreSheet}
            aria-label="More workspace tools"
            onClick={() => setShowMobileMoreSheet((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              showMobileMoreSheet || ["fees", "pdf-manager", "news", "causelist", "sheets", "ai", "security"].includes(activeTab)
                ? "text-[#1D4ED8]"
                : "text-[#475569]"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                showMobileMoreSheet || ["fees", "pdf-manager", "news", "causelist", "sheets", "ai", "security"].includes(activeTab)
                  ? "bg-[#1D4ED8] text-[#EFF6FF]"
                  : ""
              }`}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-[10px] leading-none font-semibold">More</span>
          </button>
        </div>
      </nav>

      {/* MOBILE MORE APPS BOTTOM SHEET */}
      <AnimatePresence>
        {showMobileMoreSheet && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-xs flex items-end"
            onClick={() => setShowMobileMoreSheet(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="More Workspace Tools"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-[#EFF6FF] rounded-t-3xl border-t border-[#475569]/25 p-5 pb-24 safe-pb shadow-2xl space-y-4 max-h-[82dvh] overflow-y-auto"
            >
              <div className="w-10 h-1 rounded-full bg-[#475569]/35 mx-auto" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#0F172A]">Workspace Tools</h3>
                  <p className="text-[11px] text-[#475569]">Advocate Sikandar Khan • Makrana Court</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileMoreSheet(false)}
                  aria-label="Close workspace tools"
                  className="p-2 rounded-full bg-white/80 text-[#1D4ED8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "fees", label: "Fees & Receipts", icon: CreditCard },
                  { id: "pdf-manager", label: "Hearing PDFs", icon: FileText },
                  { id: "news", label: "News Portal", icon: Newspaper },
                  { id: "causelist", label: "Cause List", icon: FileSpreadsheet },
                  { id: "sheets", label: "Google Sheets", icon: FileSpreadsheet },
                  { id: "ai", label: "Gemini AI", icon: Bot },
                  { id: "security", label: "Security & Backup", icon: ShieldCheck },
                ].map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTab === tool.id;
                  return (
                    <button
                      type="button"
                      key={tool.id}
                      onClick={() => {
                        setActiveTab(tool.id as any);
                        setActiveCase(null);
                        setShowMobileMoreSheet(false);
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#1D4ED8] text-[#EFF6FF] border-[#1D4ED8] shadow-md"
                          : "bg-white/90 text-[#0F172A] border-[#475569]/20 hover:bg-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span className="text-[11px] font-bold leading-tight">{tool.label}</span>
                    </button>
                  );
                })}
              </div>

              {deferredInstallPrompt && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMoreSheet(false);
                    handleInstallPwa();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#1D4ED8] text-[#EFF6FF] font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  Install App on Home Screen
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS & REMINDERS DRAWER */}
      <AnimatePresence>
        {showNotificationsDrawer && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end"
            onClick={() => setShowNotificationsDrawer(false)}
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Hearing Reminders and Notifications"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-dvh bg-[#EFF6FF] border-l border-[#475569]/25 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-[#475569]/20 flex items-center justify-between bg-white/80">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#0F172A]">Hearing Reminders</h3>
                  <p className="text-[11px] text-[#475569]">
                    {reminders.filter((r) => r.isTriggered).length} active alert(s) • {reminders.length} scheduled
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotificationsDrawer(false)}
                  aria-label="Close notifications drawer"
                  className="p-2 rounded-lg text-[#1D4ED8] hover:bg-[#475569]/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {reminders.length === 0 ? (
                  <p className="text-xs text-[#475569] text-center py-8">No upcoming hearing reminders.</p>
                ) : (
                  reminders
                    .filter((r) => r.isTriggered)
                    .slice(0, 20)
                    .map((rem) => (
                      <button
                        type="button"
                        key={rem.id}
                        onClick={() => {
                          const found = cases.find((c) => c.id === rem.caseId);
                          if (found) {
                            setActiveCase(found);
                            setActiveTab("cases");
                          }
                          setShowNotificationsDrawer(false);
                        }}
                        className="w-full text-left p-3.5 bg-white/90 hover:bg-white border border-[#475569]/20 rounded-xl space-y-1 transition-all cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1D4ED8]/10 text-[#1D4ED8]">
                            {rem.caseNumber}
                          </span>
                          <span className="text-[10px] text-[#475569] font-semibold">{rem.hearingDate}</span>
                        </div>
                        <p className="text-xs font-bold text-[#0F172A]">{rem.message}</p>
                        <p className="text-[11px] text-[#1D4ED8]">{rem.courtName}</p>
                      </button>
                    ))
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* NEW CASE MODAL */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNewCaseModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-case-modal-title"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFFFF]/95 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] p-6 max-w-xl w-full space-y-4 max-h-[90dvh] overflow-y-auto shadow-2xl text-[#0F172A]"
            >
              <div className="flex items-center justify-between border-b border-[#475569]/25 pb-3">
                <h3 id="new-case-modal-title" className="text-base font-bold text-[#0F172A] font-serif">Create New Case Record</h3>
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  aria-label="Close create case modal"
                  className="text-[#475569] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCaseSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Ramesh Kumar"
                      value={newCaseData.partyName}
                      onChange={(e) => setNewCaseData({ ...newCaseData, partyName: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-medium outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Client Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g., 9829012345"
                      value={newCaseData.clientMobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setNewCaseData({ ...newCaseData, clientMobile: val });
                        if (val.length === 10) setNewCaseMobileError("");
                      }}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-medium outline-none focus:border-[#1D4ED8]"
                    />
                    {newCaseMobileError && (
                      <p className="text-[10px] text-red-600 font-bold mt-1">{newCaseMobileError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Opponent Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., State of Rajasthan / Suresh Singh"
                      value={newCaseData.opponentName}
                      onChange={(e) => setNewCaseData({ ...newCaseData, opponentName: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-medium outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Case Type *</label>
                    <select
                      value={newCaseData.caseType}
                      onChange={(e) => setNewCaseData({ ...newCaseData, caseType: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#1D4ED8]"
                    >
                      <option value="Civil">Civil</option>
                      <option value="Criminal">Criminal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Appeal / Case Background *</label>
                    <select
                      value={newCaseData.caseBackground}
                      onChange={(e) => setNewCaseData({ ...newCaseData, caseBackground: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#1D4ED8]"
                    >
                      <option value="None">None</option>
                      <option value="Appeal">Appeal</option>
                      <option value="Revision">Revision</option>
                      <option value="Family Case">Family Case</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Court Name *</label>
                    <select
                      value={newCaseData.courtName}
                      onChange={(e) => setNewCaseData({ ...newCaseData, courtName: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#1D4ED8]"
                    >
                      <option value="ACJM Makrana">ACJM Makrana</option>
                      <option value="ADJ Makrana">ADJ Makrana</option>
                      <option value="MJM Makrana">MJM Makrana</option>
                      <option value="ADJ Parbatsar">ADJ Parbatsar</option>
                      <option value="ACJM Parbatsar">ACJM Parbatsar</option>
                      <option value="ADJ Kuchaman">ADJ Kuchaman</option>
                      <option value="ACJM Kuchaman">ACJM Kuchaman</option>
                      <option value="POCSO Court Didwana">POCSO Court Didwana</option>
                      <option value="SC/ST Court Didwana">SC/ST Court Didwana</option>
                      <option value="SDO Court Makrana">SDO Court Makrana</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Case Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., CIS/2026/0491"
                      value={newCaseData.caseNumber}
                      onChange={(e) => setNewCaseData({ ...newCaseData, caseNumber: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-medium outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Act / Law Section *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Section 138 NI Act / IPC 302"
                      value={newCaseData.act}
                      onChange={(e) => setNewCaseData({ ...newCaseData, act: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-medium outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1D4ED8] mb-1 font-bold">Current Stage *</label>
                    <select
                      value={newCaseData.stageOption}
                      onChange={(e) => setNewCaseData({ ...newCaseData, stageOption: e.target.value })}
                      className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#1D4ED8]"
                    >
                      <option value="Charge">Charge</option>
                      <option value="Appearance of the Accused">Appearance of the Accused</option>
                      <option value="Bail Jump">Bail Jump</option>
                      <option value="Evidence">Evidence</option>
                      <option value="Argument">Argument</option>
                      <option value="Order">Order</option>
                      <option value="Judgment">Judgment</option>
                      <option value="Notice Issued">Notice Issued</option>
                      <option value="Reply Filed">Reply Filed</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  {newCaseData.stageOption === "Custom" && (
                    <div>
                      <label className="block text-[#1D4ED8] mb-1 font-bold">Specify Custom Stage *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Pre-Framing of Charges"
                        value={newCaseData.customStageInput}
                        onChange={(e) => setNewCaseData({ ...newCaseData, customStageInput: e.target.value })}
                        className="w-full bg-white border border-[#475569]/35 rounded-lg p-2.5 text-[#0F172A] font-medium outline-none focus:border-[#1D4ED8]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#475569]/20">
                  <button type="button" onClick={() => setShowNewCaseModal(false)} className="px-4 py-2 border border-[#475569]/25 rounded-lg text-[#0F172A] font-bold hover:bg-[#FFFFFF]/90">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-lg hover:bg-[#1E40AF] shadow-md shadow-[#1D4ED8]/15 cursor-pointer">
                    Create Case File
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <React.Suspense fallback={null}>
      {/* EDIT CASE MODAL */}
      {editingCaseRecord && (
        <EditCaseModal
          caseRecord={editingCaseRecord}
          onSave={(caseId, updates) => {
            updateCase(caseId, updates);
            if (activeCase && activeCase.id === caseId) {
              setActiveCase({ ...activeCase, ...updates });
            }
            showToast("Case details updated!");
          }}
          onClose={() => setEditingCaseRecord(null)}
        />
      )}

      {/* ADD HEARING MODAL */}
      <AnimatePresence>
        {showAddHearingModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddHearingModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-hearing-modal-title"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFFFF]/95 backdrop-blur-xl border border-[#475569]/25 rounded-[24px] p-6 max-w-lg w-full space-y-4 text-[#0F172A] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#475569]/20 pb-3">
                <h3 id="add-hearing-modal-title" className="text-base font-bold text-[#0F172A] font-serif">
                  {activeCase ? `Add Hearing Record for ${activeCase.caseNumber}` : "Schedule Court Hearing / Meeting"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddHearingModal(false)}
                  aria-label="Close schedule hearing modal"
                  className="text-[#475569] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddHearingSubmit} className="space-y-3 text-xs">
                {!activeCase && (
                  <div>
                    <label htmlFor="hearing-case-select" className="block text-[#1D4ED8] mb-1 font-semibold">Select Case Record *</label>
                    <select
                      id="hearing-case-select"
                      required
                      value={selectedHearingCaseId || cases[0]?.id || ""}
                      onChange={(e) => setSelectedHearingCaseId(e.target.value)}
                      className="w-full bg-white border border-[#475569]/30 rounded-lg p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#1D4ED8]"
                    >
                      {cases.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.caseNumber} — {c.caseTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="hearing-current-date" className="block text-[#1D4ED8] mb-1 font-semibold">Hearing Date *</label>
                    <input
                      id="hearing-current-date"
                      type="date"
                      required
                      value={newHearingData.currentHearingDate}
                      onChange={(e) => setNewHearingData({ ...newHearingData, currentHearingDate: e.target.value })}
                      className="w-full bg-white border border-[#475569]/30 rounded-lg p-2.5 text-[#0F172A] outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label htmlFor="hearing-next-date" className="block text-[#1D4ED8] mb-1 font-semibold">Next Hearing Date</label>
                    <input
                      id="hearing-next-date"
                      type="date"
                      value={newHearingData.nextHearingDate}
                      onChange={(e) => setNewHearingData({ ...newHearingData, nextHearingDate: e.target.value })}
                      className="w-full bg-white border border-[#475569]/30 rounded-lg p-2.5 text-[#0F172A] outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hearing-purpose" className="block text-[#1D4ED8] mb-1 font-semibold">Purpose of Hearing *</label>
                  <input
                    id="hearing-purpose"
                    type="text"
                    required
                    value={newHearingData.purpose}
                    onChange={(e) => setNewHearingData({ ...newHearingData, purpose: e.target.value })}
                    className="w-full bg-white border border-[#475569]/30 rounded-lg p-2.5 text-[#0F172A] outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#475569]/20">
                  <button type="button" onClick={() => setShowAddHearingModal(false)} className="px-4 py-2 border border-[#475569]/25 rounded-lg text-[#0F172A] font-bold hover:bg-white/60 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#1D4ED8] text-[#EFF6FF] font-bold rounded-lg cursor-pointer hover:bg-[#1E40AF]">
                    Save Hearing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CLIENT MODAL */}
      {clientModalState.show && (
        <ClientModal
          client={clientModalState.client}
          mode={clientModalState.mode}
          allCases={cases}
          onSave={(clientData) => {
            addClient(clientData);
            showToast("New client registered!");
          }}
          onUpdate={(clientId, updates) => {
            updateClient(clientId, updates);
            showToast("Client details updated!");
          }}
          onDelete={(clientId) => {
            deleteClient(clientId);
            showToast("Client profile removed.");
          }}
          onClose={() => setClientModalState({ show: false, client: null, mode: "create" })}
        />
      )}

      {/* NEWS MODAL */}
      {newsModalState.show && (
        <NewsModal
          item={newsModalState.item}
          onSave={(newsData) => {
            addNewsItem(newsData);
            showToast("Announcement published to website ticker!");
          }}
          onUpdate={(id, updates) => {
            updateNewsItem(id, updates);
            showToast("Announcement updated!");
          }}
          onClose={() => setNewsModalState({ show: false, item: null })}
        />
      )}

      {/* COLLECT PAYMENT MODAL */}
      {showCollectPaymentModal && (
        <PaymentModal
          cases={cases}
          onCollectPayment={(caseId, amount, mode, note) => {
            addPaymentRecord(caseId, amount, mode, note);
            showToast(`Collected ₹${amount.toLocaleString()} payment! Receipt generated.`);
          }}
          onClose={() => setShowCollectPaymentModal(false)}
        />
      )}

      {/* RECEIPT MODAL */}
      {viewingReceipt && (
        <ReceiptModal
          payment={viewingReceipt.payment}
          historyItem={viewingReceipt.historyItem}
          onClose={() => setViewingReceipt(null)}
        />
      )}

      {/* CALENDAR HEARING MODAL */}
      {calendarModalState.show && (
        <CalendarHearingModal
          dateStr={calendarModalState.dateStr}
          casesForDate={calendarModalState.cases}
          onOpenCaseTimeline={(c) => {
            setActiveCase(c);
            setActiveTab("cases");
          }}
          onUpdateHearingDate={(caseId, hearingId, newDate, notes) => {
            addHearingToCase(caseId, { currentHearingDate: newDate, purpose: notes || "Rescheduled hearing" });
            showToast(`Hearing rescheduled to ${newDate}!`);
          }}
          onClose={() => setCalendarModalState({ show: false, dateStr: "", cases: [] })}
        />
      )}
      </React.Suspense>
    </div>
  );
};
