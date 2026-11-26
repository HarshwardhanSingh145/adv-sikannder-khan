import React, { useState, useRef } from "react";
import {
  FileText,
  Paperclip,
  Plus,
  Image as ImageIcon,
  FileCheck,
  Trash2,
  Eye,
  Download,
  X,
  Upload,
  Calendar,
  MessageSquare,
  ZoomIn,
} from "lucide-react";
import { CaseRecord, CaseNoteItem, CaseAttachment } from "../../types/admin";
import { useAdmin } from "../../context/AdminContext";

interface CaseNotesAndAttachmentsProps {
  caseRecord: CaseRecord;
}

export const CaseNotesAndAttachments: React.FC<CaseNotesAndAttachmentsProps> = ({ caseRecord }) => {
  const { cases, activeCase, addCaseNote, deleteCaseNote, addCaseAttachment, deleteCaseAttachment } = useAdmin();

  // Retrieve live updated case record from context state to ensure instant UI re-render on delete/add
  const liveCase = cases.find((c) => c.id === caseRecord.id) || activeCase || caseRecord;

  // Note Form State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState<CaseNoteItem["category"]>("General Note");

  // Attachment Form State
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attTitle, setAttTitle] = useState("");
  const [attDescription, setAttDescription] = useState("");
  const [attFileType, setAttFileType] = useState<"image" | "pdf">("image");
  const [attFileUrl, setAttFileUrl] = useState("");
  const [attFileName, setAttFileName] = useState("");
  const [attFileSize, setAttFileSize] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter State for Attachments
  const [attFilter, setAttFilter] = useState<"all" | "image" | "pdf">("all");

  // Preview Modal Lightbox
  const [previewAttachment, setPreviewAttachment] = useState<CaseAttachment | null>(null);

  // Deletion Modal State
  const [confirmDeleteAttachment, setConfirmDeleteAttachment] = useState<CaseAttachment | null>(null);
  const [confirmDeleteNote, setConfirmDeleteNote] = useState<CaseNoteItem | null>(null);

  // Combine sticky notes into caseNotes for backwards compatibility display
  const combinedNotes: CaseNoteItem[] = [
    ...(liveCase.caseNotes || []),
    ...(liveCase.stickyNotes || []).map((sn) => ({
      id: sn.id,
      caseId: liveCase.id,
      title: "Sticky Note",
      content: sn.text,
      category: "General Note" as const,
      createdAt: sn.createdAt,
    })),
  ];

  // Unify uploaded attachments with case evidence and documents so all files are accessible and deletable
  const attachments: CaseAttachment[] = [
    ...(liveCase.attachments || []),
    ...(liveCase.evidence || []).map((ev) => ({
      id: ev.id,
      caseId: liveCase.id,
      title: ev.fileName ? ev.fileName.replace(/\.[^/.]+$/, "") : "Evidence File",
      fileType: "image" as const,
      fileName: ev.fileName || "evidence.jpg",
      fileUrl: ev.fileUrl,
      fileSize: "1.5 MB",
      description: ev.description,
      uploadedAt: ev.uploadedAt,
    })),
    ...(liveCase.documents || []).map((doc) => ({
      id: doc.id,
      caseId: liveCase.id,
      title: doc.title,
      fileType: "pdf" as const,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      uploadedAt: doc.uploadedAt,
    })),
  ];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    addCaseNote(liveCase.id, noteTitle.trim(), noteContent.trim(), noteCategory);
    setNoteTitle("");
    setNoteContent("");
    setNoteCategory("General Note");
    setShowNoteModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttFileName(file.name);
    // Determine size string
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setAttFileSize(`${sizeInMB} MB`);

    if (!attTitle) {
      setAttTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    if (file.type.startsWith("image/")) {
      setAttFileType("image");
    } else if (file.type === "application/pdf") {
      setAttFileType("pdf");
    }

    // Convert file to base64 Data URL for persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAttFileUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attTitle.trim() || !attFileUrl) return;

    addCaseAttachment(liveCase.id, {
      title: attTitle.trim(),
      fileType: attFileType,
      fileName: attFileName || `${attTitle}.${attFileType === "pdf" ? "pdf" : "jpg"}`,
      fileUrl: attFileUrl,
      fileSize: attFileSize || "1.2 MB",
      description: attDescription.trim(),
    });

    setAttTitle("");
    setAttDescription("");
    setAttFileUrl("");
    setAttFileName("");
    setAttFileSize("");
    setShowAttachmentModal(false);
  };

  const filteredAttachments = attachments.filter((att) => {
    if (attFilter === "image") return att.fileType === "image";
    if (attFilter === "pdf") return att.fileType === "pdf";
    return true;
  });

  return (
    <div className="space-y-8 text-[#221C16]">
      {/* SECTION 1: CASE NOTES MODULE */}
      <div className="p-6 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl space-y-6 shadow-lg shadow-black/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#706C61]/20 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#221C16] font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#221C16]" />
              Case Notes & Legal Remarks
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E2DDD0]/80 border border-[#706C61]/25 text-[#221C16] font-sans font-bold">
                {combinedNotes.length} Notes
              </span>
            </h3>
            <p className="text-xs text-[#524738] mt-1">
              Keep detailed court observations, client strategy, and witness notes linked to this case file.
            </p>
          </div>

          <button
            onClick={() => setShowNoteModal(true)}
            className="px-4 py-2 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] transition-all flex items-center gap-1.5 shadow-lg shadow-black/50 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Case Note
          </button>
        </div>

        {/* Note Cards List */}
        {combinedNotes.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#706C61] border border-dashed border-[#706C61]/25 rounded-xl bg-[#E2DDD0]/80/50 space-y-2">
            <MessageSquare className="w-8 h-8 text-[#706C61]/60 mx-auto" />
            <p className="font-semibold text-[#221C16]">No notes added to this case yet.</p>
            <p className="text-[11px] text-[#706C61]">Click "Add Case Note" above to write observations or legal strategies.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {combinedNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-xl space-y-3 relative group hover:border-[#706C61]/35 transition-all shadow-md shadow-[#524738]/15"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      note.category === "Legal Strategy"
                        ? "bg-purple-100 border-purple-300 text-purple-900"
                        : note.category === "Court Observation"
                        ? "bg-[#EFE9DC]/10 border-[#EFE9DC] text-[#EFE9DC]"
                        : note.category === "Client Discussion"
                        ? "bg-sky-500/20 border-sky-500/20 text-sky-400"
                        : note.category === "Evidence Note"
                        ? "bg-rose-500/20 border-rose-500/20 text-rose-400"
                        : "bg-[#706C61]/10 border border-[#706C61]/25 text-[#221C16]"
                    }`}
                  >
                    {note.category || "General Note"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#706C61] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#706C61]/80" /> {note.createdAt}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteNote(note);
                      }}
                      className="p-1 text-red-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-50 rounded"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-[#221C16]">{note.title}</h4>
                <p className="text-xs text-[#221C16]/90 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: CASE ATTACHMENTS (IMAGES & PDFS) MODULE */}
      <div className="p-6 bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl space-y-6 shadow-lg shadow-black/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#706C61]/20 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#221C16] font-serif flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-[#221C16]" />
              Case Attachments (Images & PDFs)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E2DDD0]/80 border border-[#706C61]/25 text-[#221C16] font-sans font-bold">
                {attachments.length} Files
              </span>
            </h3>
            <p className="text-xs text-[#524738] mt-1">
              Attach image evidence, scanned petitions, FIR copies, or court order PDFs to this case.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Filter Pills */}
            <div className="flex items-center bg-[#E2DDD0]/80 p-1 border border-[#706C61]/25 rounded-lg text-xs">
              <button
                onClick={() => setAttFilter("all")}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  attFilter === "all" ? "bg-[#EFE9DC] text-black font-bold" : "text-[#524738] hover:text-[#221C16]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAttFilter("image")}
                className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  attFilter === "image" ? "bg-[#EFE9DC] text-black font-bold" : "text-[#524738] hover:text-[#221C16]"
                }`}
              >
                <ImageIcon className="w-3 h-3" /> Images
              </button>
              <button
                onClick={() => setAttFilter("pdf")}
                className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  attFilter === "pdf" ? "bg-[#EFE9DC] text-black font-bold" : "text-[#524738] hover:text-[#221C16]"
                }`}
              >
                <FileCheck className="w-3 h-3" /> PDFs
              </button>
            </div>

            <button
              onClick={() => setShowAttachmentModal(true)}
              className="px-4 py-2 bg-[#EFE9DC] text-black font-bold rounded-lg text-xs hover:bg-[#EFE9DC] transition-all flex items-center gap-1.5 shadow-lg shadow-black/50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Attach File
            </button>
          </div>
        </div>

        {/* Attachments Grid */}
        {filteredAttachments.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#706C61] border border-dashed border-[#706C61]/25 rounded-xl bg-[#E2DDD0]/80/50 space-y-2">
            <Paperclip className="w-8 h-8 text-[#706C61]/60 mx-auto" />
            <p className="font-semibold text-[#221C16]">No attachments found for this case.</p>
            <p className="text-[11px] text-[#706C61]">Click "Attach File" above to upload photos, scanned court documents, or PDF records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAttachments.map((att) => (
              <div
                key={att.id}
                className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-xl overflow-hidden shadow-md shadow-[#524738]/15 group hover:border-[#706C61]/35 transition-all flex flex-col justify-between"
              >
                {/* File Thumbnail or Icon Header */}
                {att.fileType === "image" ? (
                  <div className="h-44 bg-[#E2DDD0]/80 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                    <img
                      src={att.fileUrl}
                      alt={att.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-[#EFE9DC]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewAttachment(att)}
                        className="px-3 py-1.5 bg-[#EFE9DC] text-black font-bold text-xs rounded shadow flex items-center gap-1 cursor-pointer hover:bg-[#EFE9DC]"
                      >
                        <ZoomIn className="w-3.5 h-3.5" /> View Image
                      </button>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                      Image
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteAttachment(att);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-[#E2DDD0]/80 hover:bg-red-50 border border-[#706C61]/25 text-red-400 hover:text-red-400 rounded-lg transition-colors z-20 cursor-pointer shadow-lg shadow-black/50"
                      title="Delete Image Attachment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-44 bg-[#E2DDD0]/80 relative p-4 flex flex-col items-center justify-center border-b border-white/5 space-y-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-700" />
                    </div>
                    <span className="text-xs font-bold text-[#221C16] max-w-[200px] truncate">{att.fileName}</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase">
                      PDF Document
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteAttachment(att);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-[#E2DDD0]/80 hover:bg-red-50 border border-[#706C61]/25 text-red-400 hover:text-red-400 rounded-lg transition-colors z-20 cursor-pointer shadow-lg shadow-black/50"
                      title="Delete PDF Attachment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* File Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#221C16] line-clamp-1">{att.title}</h4>
                    {att.description && (
                      <p className="text-xs text-[#524738] mt-1 line-clamp-2">{att.description}</p>
                    )}
                    <p className="text-[10px] text-[#706C61] mt-2">
                      Uploaded: {att.uploadedAt} • {att.fileSize || "1 MB"}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewAttachment(att)}
                      className="px-3 py-1.5 border border-[#706C61]/25 text-[#221C16] font-semibold rounded text-xs flex items-center gap-1 hover:bg-[#E2DDD0]/80 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#221C16]" /> Preview
                    </button>

                    <a
                      href={att.fileUrl}
                      download={att.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 border border-[#706C61]/25 text-[#221C16] hover:bg-[#E2DDD0]/80 rounded transition-colors"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteAttachment(att);
                      }}
                      className="p-1.5 text-red-400 hover:text-red-400 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete Attachment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD CASE NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl max-w-lg w-full p-6 space-y-4 text-[#221C16] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#706C61]/25 pb-3">
              <h3 className="text-base font-bold font-serif text-[#221C16] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#221C16]" /> Add Case Note
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-[#706C61] hover:text-[#221C16] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#221C16] uppercase mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Cross-examination point for Witness 2"
                  className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded px-3 py-2 text-xs text-[#221C16] outline-none focus:border-[#706C61]/35 placeholder-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221C16] uppercase mb-1">
                  Category
                </label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded px-3 py-2 text-xs text-[#221C16] outline-none focus:border-[#706C61]/35"
                >
                  <option value="General Note">General Note</option>
                  <option value="Legal Strategy">Legal Strategy</option>
                  <option value="Court Observation">Court Observation</option>
                  <option value="Client Discussion">Client Discussion</option>
                  <option value="Evidence Note">Evidence Note</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221C16] uppercase mb-1">
                  Note Details / Content *
                </label>
                <textarea
                  required
                  rows={5}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type detailed case remarks, statutory references, or key arguments..."
                  className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded px-3 py-2 text-xs text-[#221C16] outline-none focus:border-[#706C61]/35 placeholder-white/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#706C61]/20">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 border border-[#706C61]/25 text-[#221C16] text-xs rounded hover:bg-[#E2DDD0]/80 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#EFE9DC] text-black font-bold text-xs rounded hover:bg-[#EFE9DC] cursor-pointer shadow-lg shadow-black/50"
                >
                  Save Case Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ATTACH FILE (IMAGE OR PDF) MODAL */}
      {showAttachmentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl max-w-lg w-full p-6 space-y-4 text-[#221C16] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#706C61]/25 pb-3">
              <h3 className="text-base font-bold font-serif text-[#221C16] flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-[#221C16]" /> Attach Image or PDF File
              </h3>
              <button
                onClick={() => setShowAttachmentModal(false)}
                className="text-[#706C61] hover:text-[#221C16] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAttachment} className="space-y-4">
              {/* File Upload Trigger Dropzone */}
              <div>
                <label className="block text-xs font-bold text-[#221C16] uppercase mb-1">
                  Select File (Image or PDF) *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-[#706C61]/25 hover:border-[#706C61]/35 rounded-xl bg-[#E2DDD0]/80 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 text-[#221C16]" />
                  {attFileName ? (
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#221C16]">{attFileName}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                        {attFileType.toUpperCase()} • {attFileSize} Ready
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-[#221C16] font-semibold">Click to browse or drop Image / PDF file</p>
                      <p className="text-[10px] text-[#706C61] mt-1">Supports JPG, PNG, WEBP images & PDF documents</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-bold text-[#221C16] uppercase mb-1">
                  Attachment Title / Label *
                </label>
                <input
                  type="text"
                  required
                  value={attTitle}
                  onChange={(e) => setAttTitle(e.target.value)}
                  placeholder="e.g. Scanned FIR Copy / Property Map Photo"
                  className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded px-3 py-2 text-xs text-[#221C16] outline-none focus:border-[#706C61]/35 placeholder-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221C16] uppercase mb-1">
                  File Description / Caption (Optional)
                </label>
                <input
                  type="text"
                  value={attDescription}
                  onChange={(e) => setAttDescription(e.target.value)}
                  placeholder="Brief note about what this document or photo contains..."
                  className="w-full bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded px-3 py-2 text-xs text-[#221C16] outline-none focus:border-[#706C61]/35 placeholder-white/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#706C61]/20">
                <button
                  type="button"
                  onClick={() => setShowAttachmentModal(false)}
                  className="px-4 py-2 border border-[#706C61]/25 text-[#221C16] text-xs rounded hover:bg-[#E2DDD0]/80 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!attFileUrl}
                  className="px-5 py-2 bg-[#EFE9DC] text-black font-bold text-xs rounded hover:bg-[#EFE9DC] disabled:opacity-50 cursor-pointer shadow-lg shadow-black/50"
                >
                  Confirm & Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LIGHTBOX PREVIEW MODAL */}
      {previewAttachment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#E2DDD0]/80 border border-[#706C61]/25 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl relative text-[#221C16] overflow-hidden">
            <div className="p-4 bg-[#E2DDD0]/80 border-b border-[#706C61]/25 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-serif text-[#221C16]">{previewAttachment.title}</h3>
                <p className="text-[10px] text-[#706C61]">
                  {previewAttachment.fileName} • {previewAttachment.uploadedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDeleteAttachment(previewAttachment);
                  }}
                  className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-200 font-bold rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Delete Attachment"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <a
                  href={previewAttachment.fileUrl}
                  download={previewAttachment.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#EFE9DC] text-black font-bold rounded text-xs flex items-center gap-1 hover:bg-[#EFE9DC] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1 text-[#706C61] hover:text-[#221C16] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#E2DDD0]/80/50 p-4 flex items-center justify-center overflow-auto">
              {previewAttachment.fileType === "image" ? (
                <img
                  src={previewAttachment.fileUrl}
                  alt={previewAttachment.title}
                  className="max-w-full max-h-full object-contain rounded shadow-lg border border-[#706C61]/25"
                />
              ) : (
                <iframe
                  src={previewAttachment.fileUrl}
                  title={previewAttachment.title}
                  className="w-full h-full rounded border border-[#706C61]/25 bg-white"
                />
              )}
            </div>

            {previewAttachment.description && (
              <div className="p-3 bg-[#E2DDD0]/80 border-t border-[#706C61]/20 text-xs text-[#221C16]">
                <strong>Description:</strong> {previewAttachment.description}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRM DELETE ATTACHMENT MODAL */}
      {confirmDeleteAttachment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#E2DDD0]/80 border border-red-500/20 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-[#221C16]">
            <button
              onClick={() => setConfirmDeleteAttachment(null)}
              className="absolute top-4 right-4 text-[#706C61] hover:text-[#221C16] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif text-[#221C16]">Delete Attachment?</h3>
                <p className="text-xs text-[#524738] mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3 bg-[#E2DDD0]/80 border border-[#706C61]/20 rounded-xl space-y-1">
              <p className="text-xs font-bold text-[#221C16] truncate">{confirmDeleteAttachment.title}</p>
              <p className="text-[11px] text-[#706C61]">
                {confirmDeleteAttachment.fileName} ({confirmDeleteAttachment.fileType.toUpperCase()})
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteAttachment(null)}
                className="px-4 py-2 border border-[#706C61]/25 text-[#221C16] text-xs font-semibold rounded-lg hover:bg-[#E2DDD0]/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCaseAttachment(liveCase.id, confirmDeleteAttachment.id);
                  setConfirmDeleteAttachment(null);
                  if (previewAttachment?.id === confirmDeleteAttachment.id) {
                    setPreviewAttachment(null);
                  }
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-[#221C16] font-bold text-xs rounded-lg transition-colors cursor-pointer shadow flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Attachment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CONFIRM DELETE NOTE MODAL */}
      {confirmDeleteNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#E2DDD0]/80 border border-red-500/20 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-[#221C16]">
            <button
              onClick={() => setConfirmDeleteNote(null)}
              className="absolute top-4 right-4 text-[#706C61] hover:text-[#221C16] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif text-[#221C16]">Delete Case Note?</h3>
                <p className="text-xs text-[#524738] mt-0.5">Are you sure you want to delete this note?</p>
              </div>
            </div>

            <div className="p-3 bg-[#E2DDD0]/80 border border-[#706C61]/20 rounded-xl space-y-1">
              <p className="text-xs font-bold text-[#221C16] truncate">{confirmDeleteNote.title}</p>
              <p className="text-[11px] text-[#706C61] line-clamp-2">{confirmDeleteNote.content}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteNote(null)}
                className="px-4 py-2 border border-[#706C61]/25 text-[#221C16] text-xs font-semibold rounded-lg hover:bg-[#E2DDD0]/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCaseNote(liveCase.id, confirmDeleteNote.id);
                  setConfirmDeleteNote(null);
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-[#221C16] font-bold text-xs rounded-lg transition-colors cursor-pointer shadow flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
