import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { PremiumBackground } from "./PremiumBackground";
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
  ChevronRight,
  MessageSquare,
  X,
  FileText,
} from "lucide-react";
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-6 z-50 bg-[#EFE9DC] text-black px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-[#706C61]/25"
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-black/70 hover:text-[#221C16]">
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
    importCauseList,
    askAiAssistant,
    logout,
    updateSecurityPin,
    exportBackupJson,
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

  // Notifications Drawer
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

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
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "ai", text: "Greetings Advocate Sikandar Khan. How can I assist you with your case files, hearing schedules, or legal records today?" },
  ]);

  // Security Form State
  const [oldPinInput, setOldPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState(15);

  const pdfInputRef = useRef<HTMLInputElement | null>(null);

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
    if (!activeCase) return;

    addHearingToCase(activeCase.id, {
      currentHearingDate: newHearingData.currentHearingDate,
      nextHearingDate: newHearingData.nextHearingDate,
      purpose: newHearingData.purpose,
      hearingTime: "11:00 AM",
      courtRoomNo: activeCase.courtName,
      judgeName: "Hon'ble Presiding Officer",
    });

    showToast("New Hearing Date Added!");
    setShowAddHearingModal(false);
  };

  const handlePinUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput !== confirmPinInput) {
      alert("New PIN and Confirm PIN do not match!");
      return;
    }
    if (updateSecurityPin(oldPinInput, newPinInput)) {
      showToast("Security PIN updated successfully!");
      setOldPinInput("");
      setNewPinInput("");
      setConfirmPinInput("");
    } else {
      alert("Current PIN incorrect!");
    }
  };

  const handleAiChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQueryText.trim()) return;

    const q = aiQueryText;
    setAiQueryText("");
    setAiChatLogs((prev) => [...prev, { role: "user", text: q }]);

    const response = await askAiAssistant(q);
    setAiChatLogs((prev) => [...prev, { role: "ai", text: response }]);
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
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Sidebar animation
      gsap.from(sidebarRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });

      // Main content animation (staggered children)
      gsap.from(".gsap-fade-in", {
        y: 30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.01,
        ease: "power2.out",
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
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
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col font-sans overflow-hidden h-screen w-screen">
      <PremiumBackground />
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Top Header Bar */}
      <header ref={headerRef} className="h-20 bg-white/80 backdrop-blur-xl border-b border-[#706C61]/20 px-4 md:px-8 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-light tracking-tight text-[#221C16] flex items-center gap-2 font-serif font-medium">
              Hello Sikander Khan 👋
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-medium text-[#524738]">{getGreeting()}</span>
              <span className="text-sm text-[#706C61] hidden sm:inline">Ready to manage today's work?</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-[#221C16]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[10px] text-[#706C61] uppercase tracking-wider font-semibold">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="w-px h-8 bg-[#706C61]/20 hidden md:block" />

          {/* Quick Search Bar */}
          <div className="relative hidden lg:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#706C61]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white border border-[#706C61]/25 rounded-full pl-9 pr-4 py-2 text-sm text-[#221C16] placeholder-[#706C61]/50 focus:border-[#524738] focus:ring-2 focus:ring-[#524738]/10 transition-all outline-none shadow-sm"
            />
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
            className="p-2.5 text-[#524738] border border-[#706C61]/25 hover:bg-[#706C61]/10 rounded-full relative transition-all cursor-pointer bg-white"
            title="Reminders & Notifications"
          >
            <Bell className="w-4 h-4" />
            {reminders.length > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#524738] border-2 border-[#EFE9DC]" />
            )}
          </button>

          {/* Profile Avatar / Settings */}
          <div className="w-9 h-9 rounded-full bg-[#524738] flex items-center justify-center text-[#EFE9DC] font-bold text-sm shadow-md shadow-[#524738]/20">
            SK
          </div>

          {/* Close Admin Dashboard / Logout */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="p-2.5 text-red-600 border border-red-500/30 hover:bg-red-500/10 rounded-full transition-all cursor-pointer bg-white"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <motion.aside ref={sidebarRef} animate={{ width: isSidebarCollapsed ? 80 : 280 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="bg-white/80 backdrop-blur-2xl border-r border-[#706C61]/20 shrink-0 hidden md:flex m-4 rounded-[24px] shadow-[0_4px_20px_rgba(82,71,56,0.08)] relative overflow-hidden min-h-0">
          <SimpleBar className="w-full h-full p-4 flex flex-col justify-between">
            <nav className="space-y-1">
            {[
              { id: "analytics", label: "Analytics Overview", icon: LayoutDashboard },
              { id: "cases", label: "Case Records & Timeline", icon: Briefcase, count: cases.length },
              { id: "calendar", label: "Hearing Calendar", icon: CalendarIcon },
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
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== "cases") setActiveCase(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#524738] text-[#EFE9DC] font-bold shadow-md shadow-[#524738]/20"
                      : "text-[#524738] hover:bg-[#706C61]/10 hover:text-[#221C16]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-[#706C61]/20 text-[#221C16]" : "bg-[#706C61]/15 text-[#382F25]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

            <div className="p-3 bg-white/90 border border-[#706C61]/20 rounded-xl space-y-1 text-[11px] text-[#524738] mt-6">
              <p className="font-bold text-[#221C16]">Chamber Workstation</p>
              <p className="text-[#706C61]">Civil & District Court Makrana</p>
              <p className="text-[10px] text-[#706C61]/70 mt-1">Version 2.4 Encrypted Admin</p>
            </div>
          </SimpleBar>
        </motion.aside>

        {/* Content Pane */}
        <main className="flex-1 min-h-0 min-w-0 bg-[#E2DDD0]/90">
          <SimpleBar className="h-full p-4 md:p-6 space-y-6 scroll-smooth">
          {/* Mobile Horizontal Navigation Tabs */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-2 scrollbar-none shrink-0 border-b border-[#706C61]/20">
            {[
              { id: "analytics", label: "Analytics", icon: LayoutDashboard },
              { id: "cases", label: "Cases", icon: Briefcase, count: cases.length },
              { id: "calendar", label: "Calendar", icon: CalendarIcon },
              { id: "news", label: "News", icon: Newspaper, count: news.length },
              { id: "clients", label: "Clients", icon: Users, count: clients.length },
              { id: "causelist", label: "Cause List", icon: FileSpreadsheet },
              { id: "pdf-manager", label: "PDF Manager", icon: FileText, count: todaysHearingsList.length },
              { id: "sheets", label: "Sheets", icon: FileSpreadsheet },
              { id: "ai", label: "Gemini AI", icon: Bot },
              { id: "security", label: "Security", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== "cases") setActiveCase(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? "bg-[#524738] text-[#EFE9DC] shadow-sm"
                      : "bg-white/80 text-[#524738] border border-[#706C61]/20"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/10">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* TAB 1: ANALYTICS OVERVIEW */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Today's Court Hearing List & PDF Quick Banner */}
              <div className="bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-[24px] p-5 md:p-6 shadow-md shadow-[#524738]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#524738] text-[#EFE9DC] text-[10px] font-bold uppercase tracking-wider">
                    <FileText className="w-3 h-3 text-[#EFE9DC]" />
                    <span>Daily Cause List • {todayStr}</span>
                  </div>
                  <h3 className="text-xl font-serif font-extrabold text-[#221C16]">
                    Today's Hearing List PDF (दैनिक पेशी सूची)
                  </h3>
                  <p className="text-xs text-[#524738] font-medium">
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
                    className="px-4 py-2.5 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold text-xs rounded-xl shadow-md shadow-[#524738]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#EFE9DC]" />
                    <span>Download Today's PDF</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pdf-manager")}
                    className="px-4 py-2.5 bg-white/80 hover:bg-white text-[#221C16] border border-[#706C61]/30 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#524738]" />
                    <span>Open PDF Manager</span>
                  </button>
                </div>
              </div>

              {/* Court-wise Analytics Overview Cards */}
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-serif font-bold text-[#221C16]">Court-wise Analytics Overview</h2>
                  <p className="text-xs text-[#524738] font-medium">Click any court card to view and filter cases belonging to that specific court jurisdiction.</p>
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
                        className="bg-white/95 backdrop-blur-xl border border-[#706C61]/30 rounded-[24px] p-6 shadow-md hover:shadow-xl hover:border-[#524738] transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#706C61]">Jurisdiction</span>
                            <h3 className="text-xl font-serif font-bold text-[#221C16] group-hover:text-[#524738] transition-colors">{item.courtTitle}</h3>
                            <p className="text-xs text-[#524738] font-medium">{item.description}</p>
                          </div>
                          <div className="p-3 bg-[#524738]/10 text-[#524738] rounded-2xl group-hover:bg-[#524738] group-hover:text-[#EFE9DC] transition-all shrink-0">
                            <IconComponent className="w-6 h-6" />
                          </div>
                        </div>

                        {/* Counts Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-[#E2DDD0]/50 p-3 rounded-2xl border border-[#706C61]/20">
                          <div className="text-center p-2 rounded-xl bg-white shadow-xs">
                            <span className="text-[10px] text-[#524738] font-bold block uppercase tracking-tight">Total</span>
                            <span className="text-xl font-serif font-bold text-[#221C16]">{totalCases}</span>
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

                        <div className="flex items-center justify-between pt-2 border-t border-[#706C61]/15 text-xs text-[#524738] font-bold group-hover:text-[#221C16]">
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
                <div className="gsap-fade-in lg:col-span-2 p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-4 shadow-md shadow-[#524738]/15">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h2 className="text-base font-bold text-[#221C16] font-serif flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#524738]" />
                      Upcoming Priority Court Appearances
                    </h2>
                    <button
                      onClick={() => setActiveTab("cases")}
                      className="text-xs text-[#221C16] font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
                        className="p-4 bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-xl flex items-center justify-between hover:border-[#706C61]/35 transition-all cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#221C16] text-xs">{c.caseTitle}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#706C61]/15 text-[#221C16] font-bold">
                              {c.caseNumber}
                            </span>
                          </div>
                          <p className="text-xs text-[#524738]">
                            Client: <strong>{c.clientName}</strong> | Court: {c.courtName}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-[#524738] block">
                            {c.hearings[0]?.currentHearingDate || "Pending Schedule"}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">{c.currentStage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gsap-fade-in p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-4 shadow-md shadow-[#524738]/15">
                  <h2 className="text-base font-bold text-[#221C16] font-serif mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowNewCaseModal(true)}
                      className="w-full p-4 bg-[#524738] border border-[#524738] text-[#EFE9DC] font-bold rounded-xl text-[11px] hover:bg-[#382F25] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer transition-all"
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
                      className="w-full p-4 bg-[#524738] border border-[#524738] text-[#EFE9DC] font-bold rounded-xl text-[11px] hover:bg-[#382F25] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer transition-all"
                    >
                      <Download className="w-5 h-5 text-[#EFE9DC]" /> Today's PDF
                    </button>
                    <button
                      onClick={() => setNewsModalState({ show: true, item: null })}
                      className="w-full p-4 bg-[#E2DDD0]/90 border border-[#706C61]/25 text-[#221C16] font-bold rounded-xl text-[11px] hover:bg-[#DCD7C8] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer transition-all"
                    >
                      <Newspaper className="w-5 h-5" /> Create Blog
                    </button>
                    <button
                      onClick={() => {
                        setClientModalState({ show: true, client: null, mode: "create" });
                      }}
                      className="w-full p-4 bg-[#E2DDD0]/90 border border-[#706C61]/25 text-[#221C16] font-bold rounded-xl text-[11px] hover:bg-[#DCD7C8] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer transition-all"
                    >
                      <Users className="w-5 h-5" /> Add Client
                    </button>
                    <button
                      onClick={() => setShowAddHearingModal(true)}
                      className="w-full p-4 bg-[#E2DDD0]/90 border border-[#706C61]/25 text-[#221C16] font-bold rounded-xl text-[11px] hover:bg-[#DCD7C8] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer transition-all"
                    >
                      <CalendarIcon className="w-5 h-5" /> Schedule Meeting
                    </button>
                    <button
                      onClick={() => setActiveTab("pdf-manager")}
                      className="w-full p-4 bg-[#E2DDD0]/90 border border-[#706C61]/25 text-[#221C16] font-bold rounded-xl text-[11px] hover:bg-[#DCD7C8] flex flex-col items-center justify-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer transition-all"
                    >
                      <FileText className="w-5 h-5 text-[#524738]" /> Hearing PDF Manager
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-xl shadow-md shadow-[#524738]/15">
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#706C61]/80" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, client, court..."
                      className="w-full bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#221C16] outline-none focus:border-[#706C61]/35"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-lg px-3 py-2 text-xs text-[#221C16] outline-none"
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
                    className="bg-white border border-[#706C61]/35 rounded-lg px-3 py-2 text-xs text-[#221C16] font-bold outline-none"
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
                          ? "bg-[#EFE9DC] text-black font-bold"
                          : "bg-[#E2DDD0]/90 border border-[#706C61]/25 text-[#524738] hover:text-[#221C16]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowNewCaseModal(true)}
                  className="px-4 py-2 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] flex items-center gap-2 shadow-md shadow-[#524738]/15 shrink-0 cursor-pointer"
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
                    className="text-xs text-[#221C16] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    ← Back to Case Records List
                  </button>

                  {/* Case Summary Card */}
                  <div className="p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-4 shadow-lg shadow-black/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#706C61]/20 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E2DDD0]/90 border border-[#706C61]/25 text-[#221C16] font-bold">
                            {activeCase.caseNumber}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold">
                            {activeCase.currentStatus}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#524738]/10 border border-[#524738]/30 text-[#524738] font-bold">
                            Priority: {activeCase.priority.toUpperCase()}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-[#221C16] font-serif mt-2">{activeCase.caseTitle}</h2>
                        <p className="text-xs text-[#524738] mt-1">
                          Client: <strong className="text-[#221C16]">{activeCase.clientName}</strong> ({activeCase.clientMobile}) vs. {activeCase.opponentName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingCaseRecord(activeCase)}
                          className="px-3 py-2 rounded-lg border border-[#706C61]/25 text-[#221C16] hover:bg-[#E2DDD0]/90 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Record
                        </button>
                        <button
                          onClick={() => toggleStarCase(activeCase.id)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            activeCase.isStarred ? "bg-[#524738] border-[#524738] text-[#EFE9DC] font-bold" : "border-[#706C61]/25 text-[#706C61]"
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => togglePinCase(activeCase.id)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            activeCase.isPinned ? "bg-[#524738] text-[#EFE9DC] font-bold" : "border-[#706C61]/25 text-[#706C61]"
                          }`}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowAddHearingModal(true)}
                          className="px-4 py-2 bg-[#524738] text-[#EFE9DC] font-bold rounded-lg text-xs hover:bg-[#382F25] flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#524738]/15"
                        >
                          <Plus className="w-4 h-4" /> Add Hearing Record
                        </button>
                      </div>
                    </div>

                    {/* Stage Progress Bar */}
                    <div>
                      <span className="text-[10px] tracking-wider text-[#706C61] uppercase font-bold">
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
                                  ? "bg-[#EFE9DC] text-black font-bold border-[#706C61]/35 shadow-md shadow-[#524738]/15"
                                  : isPassed
                                  ? "bg-[#E2DDD0]/90 border-[#706C61]/35 text-[#221C16]"
                                  : "border-[#706C61]/20 text-[#706C61]/60"
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
                  <div className="p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-4 shadow-lg shadow-black/50">
                    <h3 className="text-sm font-bold text-[#221C16] flex items-center gap-2 font-serif">
                      <Clock className="w-4 h-4 text-[#221C16]" />
                      Hearing Timeline History
                    </h3>

                    <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EFE9DC]/20">
                      {activeCase.hearings.map((h) => (
                        <div key={h.id} className="relative pl-10 group">
                          <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-[#EFE9DC] border-2 border-[#0B0B0B]" />
                          <div className="p-4 bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#221C16]">
                                {h.currentHearingDate} ({h.hearingTime})
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[#706C61]">{h.judgeName}</span>
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
                            <p className="text-xs text-[#221C16]">
                              <strong>Purpose:</strong> {h.purpose}
                            </p>
                            {h.result && (
                              <p className="text-xs text-emerald-800 font-bold">
                                <strong>Court Result:</strong> {h.result}
                              </p>
                            )}
                            {h.nextAction && (
                              <p className="text-xs text-[#221C16] font-bold">
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
                /* CASE RECORDS LIST TABLE */
                <div className="bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] overflow-hidden shadow-md shadow-[#524738]/15">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#E2DDD0]/90 border-b border-[#706C61]/25 text-[#221C16] uppercase text-[10px] tracking-wider font-bold">
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
                      <tbody className="divide-y divide-white/10 text-[#221C16]">
                        {sortedCases.map((c, idx) => (
                          <tr key={c.id} className="hover:bg-[#E2DDD0]/90/50 transition-colors">
                            <td className="p-3.5 font-mono text-[#221C16] font-semibold">{idx + 1}</td>
                             <td className="p-3.5 font-bold text-[#221C16]">
                              {c.partyName || c.clientName}
                              {c.opponentName && <span className="block text-[10px] text-[#524738] font-semibold">vs. {c.opponentName}</span>}
                              {c.clientMobile && <span className="block text-[10px] text-[#382F25] font-bold">📱 {c.clientMobile}</span>}
                            </td>
                            <td className="p-3.5 font-mono text-[#221C16] font-bold">{c.caseNumber}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.caseType.toLowerCase().includes("criminal") ? "bg-rose-100 border border-rose-300 text-rose-900" : "bg-sky-100 border border-sky-300 text-sky-900"
                              }`}>
                                {c.caseType}
                              </span>
                            </td>
                            <td className="p-3.5 text-[#221C16] font-semibold">{c.courtName}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full bg-white border border-[#706C61]/35 text-[#221C16] text-[10px] font-bold shadow-2xs">
                                {c.currentStage}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-[#221C16]">
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
                                className="px-3 py-1 bg-[#EFE9DC] text-black font-bold rounded hover:bg-[#EFE9DC] transition-all inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </button>
                              <button
                                onClick={() => setEditingCaseRecord(c)}
                                className="px-3 py-1 bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded text-[#221C16] hover:bg-[#706C61]/10 font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
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
              )}
            </div>
          )}

          {/* TAB 4: HEARING CALENDAR */}
          {activeTab === "calendar" && (
            <div className="space-y-6">
              <div className="p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-4 shadow-md shadow-[#524738]/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#221C16] font-serif">Interactive Hearing Calendar & Reminders</h2>
                    <p className="text-xs text-[#524738] font-medium">Click on any date to inspect cause lists, reschedule dates, or download PDF.</p>
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
                      className="px-3.5 py-2 bg-[#524738] text-[#EFE9DC] hover:bg-[#382F25] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#EFE9DC]" /> Download Today's PDF
                    </button>
                    <button 
                      onClick={sendTomorrowReminders}
                      className="px-3.5 py-2 bg-[#128C7E] text-white font-bold rounded-lg hover:bg-[#075E54] flex items-center justify-center gap-1.5 shadow-md transition-colors text-xs cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" /> Send Tomorrow's Reminders
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#221C16] uppercase border-b border-[#706C61]/20 pb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-2 min-h-[320px]">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `2026-08-${dayNum < 10 ? "0" + dayNum : dayNum}`;
                    const dayCases = casesByDate.get(dateStr) || [];

                    return (
                      <div
                        key={i}
                        onClick={() => setCalendarModalState({ show: true, dateStr, cases: dayCases })}
                        className="p-2 border border-[#706C61]/20 bg-[#E2DDD0]/90 rounded-xl min-h-[75px] space-y-1 hover:border-[#706C61]/35 transition-all cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-[#221C16]">{dayNum}</span>
                        {dayCases.map((dh) => (
                          <div key={dh.id} className="p-1 rounded bg-[#524738]/10 border border-[#524738]/30 text-[9px] font-bold text-[#524738] truncate">
                            🔴 {dh.caseNumber}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE NEWS PORTAL */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-xl shadow-md shadow-[#524738]/15">
                <div>
                  <h2 className="text-base font-bold text-[#221C16] font-serif">Live Website News Portal Manager</h2>
                  <p className="text-xs text-[#706C61]">Announcements published here are displayed on the public breaking news ticker.</p>
                </div>

                <button
                  onClick={() => setNewsModalState({ show: true, item: null })}
                  className="px-4 py-2 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] flex items-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Publish Announcement
                </button>
              </div>

              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="p-4 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-xl space-y-2 relative group shadow-md shadow-[#524738]/15">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#706C61]/15 text-[#221C16]">
                          {item.category}
                        </span>
                        {item.isPinned && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#524738]/10 text-[#524738] font-bold flex items-center gap-1 border border-[#524738]/30">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNewsModalState({ show: true, item })}
                          className="p-1 text-[#706C61] hover:text-[#221C16]"
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
                    <h4 className="text-sm font-bold text-[#221C16]">{item.title}</h4>
                    <p className="text-xs text-[#524738]">{item.content}</p>
                    <span className="text-[10px] text-[#706C61]/80 block pt-1">Published: {item.publishedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CLIENT DATABASE CRM */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-xl shadow-md shadow-[#524738]/15">
                <div>
                  <h2 className="text-base font-bold text-[#221C16] font-serif">Client Database CRM</h2>
                  <p className="text-xs text-[#706C61]">Manage client contact details, WhatsApp connections, and linked court records.</p>
                </div>

                <button
                  onClick={() => setClientModalState({ show: true, client: null, mode: "create" })}
                  className="px-4 py-2 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] flex items-center gap-2 shadow-md shadow-[#524738]/15 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Client Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <div key={client.id} className="p-5 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-3 shadow-md shadow-[#524738]/15 hover:border-[#706C61]/35 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#221C16]">{client.name}</h3>
                        <p className="text-xs text-[#706C61]">{client.mobile}</p>
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

                    <div className="text-xs text-[#524738] space-y-1">
                      <p>📍 {client.address}</p>
                      <p>🆔 Aadhaar: {client.aadhaar || "N/A"} | PAN: {client.pan || "N/A"}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => setClientModalState({ show: true, client, mode: "view" })}
                        className="px-3 py-1.5 bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-lg text-xs font-bold text-[#221C16] hover:bg-[#EFE9DC] hover:text-black transition-all cursor-pointer"
                      >
                        View Full Profile
                      </button>
                      <button
                        onClick={() => setClientModalState({ show: true, client, mode: "edit" })}
                        className="p-1.5 text-[#706C61] hover:text-[#221C16] cursor-pointer"
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
              <div className="p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-4 shadow-md shadow-[#524738]/15">
                <h2 className="text-lg font-bold text-[#221C16] font-serif">Daily Court Cause List Importer</h2>
                <p className="text-xs text-[#706C61]">
                  Paste the daily cause list text or upload cause list PDF to automatically match existing cases and update court hearing dates.
                </p>

                <textarea
                  rows={8}
                  value={causeListText}
                  onChange={(e) => setCauseListText(e.target.value)}
                  placeholder="Paste Cause List raw text here... e.g. CIVIL-124/2026 Rameshwar Sharma vs State..."
                  className="w-full bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-xl p-4 text-xs font-mono text-[#221C16] outline-none focus:border-[#706C61]/35"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const res = importCauseList(causeListText);
                      showToast(`Cause List Imported! Matched ${res.matched} case records.`);
                      setCauseListText("");
                    }}
                    className="px-5 py-2.5 bg-[#EFE9DC] text-black font-bold rounded-xl text-xs hover:bg-[#EFE9DC] shadow-md shadow-[#524738]/15 cursor-pointer"
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
            <div className="p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-4 flex flex-col h-[600px] shadow-md shadow-[#524738]/15">
              <div className="flex items-center gap-2 border-b border-[#706C61]/20 pb-3">
                <Bot className="w-6 h-6 text-[#221C16]" />
                <div>
                  <h2 className="text-base font-bold text-[#221C16] font-serif">Gemini AI Legal Case Assistant</h2>
                  <p className="text-xs text-[#706C61]">Ask natural language questions about your cases, deadlines, or pending tasks.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-[#E2DDD0]/90/60 rounded-xl border border-white/5">
                {aiChatLogs.map((log, idx) => (
                  <div key={idx} className={`flex ${log.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xl p-3 rounded-xl text-xs whitespace-pre-wrap ${
                        log.role === "user"
                          ? "bg-[#EFE9DC] text-black font-bold"
                          : "bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 text-[#221C16]"
                      }`}
                    >
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAiChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={aiQueryText}
                  onChange={(e) => setAiQueryText(e.target.value)}
                  placeholder="e.g., Show all hearings next week..."
                  className="flex-1 bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-xl px-4 py-2.5 text-xs text-[#221C16] outline-none"
                />
                <button type="submit" className="px-5 py-2.5 bg-[#EFE9DC] text-black font-bold rounded-xl text-xs hover:bg-[#EFE9DC] cursor-pointer shadow-md shadow-[#524738]/15">
                  Ask AI
                </button>
              </form>
            </div>
          )}

          {/* TAB 10: SECURITY & AUDIT LOGS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="p-6 bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] space-y-6 shadow-md shadow-[#524738]/15">
                <div className="flex items-center justify-between border-b border-[#706C61]/20 pb-3">
                  <h2 className="text-lg font-bold text-[#221C16] font-serif">Security Controls & Audit Log Ledger</h2>
                  <span className="text-xs text-emerald-700 font-bold">● AES-256 PIN Encrypted</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PIN Reset Form */}
                  <form onSubmit={handlePinUpdateSubmit} className="p-5 bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-xl space-y-3 text-xs">
                    <h3 className="font-bold text-[#221C16] text-sm font-serif">Change Admin Security PIN</h3>
                    <div>
                      <label className="block text-[#524738] mb-1 font-semibold">Current Security PIN</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={oldPinInput}
                        onChange={(e) => setOldPinInput(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-lg p-2.5 text-[#221C16] font-mono text-center tracking-widest outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[#524738] mb-1 font-semibold">New Security PIN</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-lg p-2.5 text-[#221C16] font-mono text-center tracking-widest outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[#524738] mb-1 font-semibold">Confirm New PIN</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-lg p-2.5 text-[#221C16] font-mono text-center tracking-widest outline-none font-bold"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-[#EFE9DC] text-black font-bold rounded-lg mt-2 shadow-md shadow-[#524738]/15 hover:bg-[#EFE9DC] cursor-pointer">
                      Update Security PIN
                    </button>
                  </form>

                  {/* Auto-logout settings */}
                  <div className="p-5 bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-xl space-y-3 text-xs">
                    <h3 className="font-bold text-[#221C16] text-sm font-serif">Auto Logout Idle Timeout</h3>
                    <p className="text-[#524738]">Automatically log out admin session after specified period of inactivity.</p>

                    <div>
                      <label className="block text-[#524738] mb-1 font-semibold">Inactivity Timeout Duration</label>
                      <select
                        value={idleTimeoutMinutes}
                        onChange={(e) => {
                          setIdleTimeoutMinutes(Number(e.target.value));
                          showToast(`Idle timeout updated to ${e.target.value} minutes.`);
                        }}
                        className="w-full bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-lg p-2.5 text-[#221C16] outline-none font-bold"
                      >
                        <option value={5}>5 Minutes</option>
                        <option value={15}>15 Minutes</option>
                        <option value={30}>30 Minutes</option>
                        <option value={60}>60 Minutes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Audit Logs Table */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#221C16] font-serif">Security Audit Logs Ledger</span>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-[#E2DDD0]/90 border border-white/5 rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[#221C16]">{log.action}</p>
                          <p className="text-[#706C61] text-[11px]">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-[#706C61]/80 shrink-0">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HEARING PDF MANAGER TAB */}
          {activeTab === "pdf-manager" && <HearingPdfManagerTab />}
          </SimpleBar>
        </main>
      </div>

      {/* NEW CASE MODAL */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl text-[#221C16]">
              <div className="flex items-center justify-between border-b border-[#706C61]/25 pb-3">
                <h3 className="text-base font-bold text-[#221C16] font-serif">Create New Case Record</h3>
                <button onClick={() => setShowNewCaseModal(false)} className="text-[#706C61] hover:text-[#221C16]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCaseSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Ramesh Kumar"
                      value={newCaseData.partyName}
                      onChange={(e) => setNewCaseData({ ...newCaseData, partyName: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-medium outline-none focus:border-[#524738]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Client Mobile Number *</label>
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
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-medium outline-none focus:border-[#524738]"
                    />
                    {newCaseMobileError && (
                      <p className="text-[10px] text-red-600 font-bold mt-1">{newCaseMobileError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Opponent Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., State of Rajasthan / Suresh Singh"
                      value={newCaseData.opponentName}
                      onChange={(e) => setNewCaseData({ ...newCaseData, opponentName: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-medium outline-none focus:border-[#524738]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Case Type *</label>
                    <select
                      value={newCaseData.caseType}
                      onChange={(e) => setNewCaseData({ ...newCaseData, caseType: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#524738]"
                    >
                      <option value="Civil">Civil</option>
                      <option value="Criminal">Criminal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Appeal / Case Background *</label>
                    <select
                      value={newCaseData.caseBackground}
                      onChange={(e) => setNewCaseData({ ...newCaseData, caseBackground: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#524738]"
                    >
                      <option value="None">None</option>
                      <option value="Appeal">Appeal</option>
                      <option value="Revision">Revision</option>
                      <option value="Family Case">Family Case</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Court Name *</label>
                    <select
                      value={newCaseData.courtName}
                      onChange={(e) => setNewCaseData({ ...newCaseData, courtName: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#524738]"
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
                    <label className="block text-[#524738] mb-1 font-bold">Case Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., CIS/2026/0491"
                      value={newCaseData.caseNumber}
                      onChange={(e) => setNewCaseData({ ...newCaseData, caseNumber: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-medium outline-none focus:border-[#524738]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Act / Law Section *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Section 138 NI Act / IPC 302"
                      value={newCaseData.act}
                      onChange={(e) => setNewCaseData({ ...newCaseData, act: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-medium outline-none focus:border-[#524738]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#524738] mb-1 font-bold">Current Stage *</label>
                    <select
                      value={newCaseData.stageOption}
                      onChange={(e) => setNewCaseData({ ...newCaseData, stageOption: e.target.value })}
                      className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-semibold outline-none focus:border-[#524738]"
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
                      <label className="block text-[#524738] mb-1 font-bold">Specify Custom Stage *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Pre-Framing of Charges"
                        value={newCaseData.customStageInput}
                        onChange={(e) => setNewCaseData({ ...newCaseData, customStageInput: e.target.value })}
                        className="w-full bg-white border border-[#706C61]/35 rounded-lg p-2.5 text-[#221C16] font-medium outline-none focus:border-[#524738]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#706C61]/20">
                  <button type="button" onClick={() => setShowNewCaseModal(false)} className="px-4 py-2 border border-[#706C61]/25 rounded-lg text-[#221C16] font-bold hover:bg-[#E2DDD0]/90">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#524738] text-[#EFE9DC] font-bold rounded-lg hover:bg-[#382F25] shadow-md shadow-[#524738]/15 cursor-pointer">
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
        {showAddHearingModal && activeCase && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#E2DDD0]/90 backdrop-blur-xl border border-[#706C61]/25 rounded-[24px] p-6 max-w-lg w-full space-y-4 text-[#221C16]">
              <h3 className="text-base font-bold text-[#221C16] font-serif">Add Hearing Record for {activeCase.caseNumber}</h3>
              <form onSubmit={handleAddHearingSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#524738] mb-1 font-semibold">Hearing Date</label>
                    <input
                      type="date"
                      required
                      value={newHearingData.currentHearingDate}
                      onChange={(e) => setNewHearingData({ ...newHearingData, currentHearingDate: e.target.value })}
                      className="w-full bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-lg p-2.5 text-[#221C16] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#524738] mb-1 font-semibold">Next Hearing Date</label>
                    <input
                      type="date"
                      value={newHearingData.nextHearingDate}
                      onChange={(e) => setNewHearingData({ ...newHearingData, nextHearingDate: e.target.value })}
                      className="w-full bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-lg p-2.5 text-[#221C16] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#524738] mb-1 font-semibold">Purpose of Hearing</label>
                  <input
                    type="text"
                    required
                    value={newHearingData.purpose}
                    onChange={(e) => setNewHearingData({ ...newHearingData, purpose: e.target.value })}
                    className="w-full bg-[#E2DDD0]/90 border border-[#706C61]/25 rounded-lg p-2.5 text-[#221C16] outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setShowAddHearingModal(false)} className="px-4 py-2 border border-[#706C61]/25 rounded-lg text-[#221C16]">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#EFE9DC] text-black font-bold rounded-lg cursor-pointer hover:bg-[#EFE9DC]">
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
