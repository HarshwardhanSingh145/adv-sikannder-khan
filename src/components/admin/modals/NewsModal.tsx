import React, { useState } from "react";
import { X, Newspaper, Plus, Image as ImageIcon, FileText, Pin, Clock } from "lucide-react";
import { NewsItem } from "../../../types/admin";

interface NewsModalProps {
  item?: NewsItem | null;
  onSave: (newsData: Omit<NewsItem, "id" | "publishedAt">) => void;
  onUpdate?: (id: string, updates: Partial<NewsItem>) => void;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ item, onSave, onUpdate, onClose }) => {
  const [title, setTitle] = useState(item?.title || "");
  const [content, setContent] = useState(item?.content || "");
  const [category, setCategory] = useState<NewsItem["category"]>(item?.category || "Important Notice");
  const [isPinned, setIsPinned] = useState<boolean>(item?.isPinned ?? true);
  const [caseNumber, setCaseNumber] = useState(item?.caseNumber || "");
  const [courtName, setCourtName] = useState(item?.courtName || "Civil Court Makrana");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please provide both Announcement Title and Content.");
      return;
    }

    if (item && onUpdate) {
      onUpdate(item.id, {
        title,
        content,
        category,
        isPinned,
        caseNumber: caseNumber || undefined,
        courtName: courtName || undefined,
      });
    } else {
      onSave({
        title,
        content,
        category,
        isPinned,
        caseNumber: caseNumber || undefined,
        courtName: courtName || undefined,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-[#0F172A]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#475569]/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FFFFFF]/80 border border-[#475569]/25 flex items-center justify-center shadow-md shadow-[#1D4ED8]/15">
              <Newspaper className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#0F172A]">
                {item ? "Edit Announcement" : "Publish Court Notice / Announcement"}
              </h3>
              <p className="text-[10px] text-[#1D4ED8] font-semibold">Live Public Website Ticker Broadcast</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#FFFFFF]/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#0F172A] font-bold mb-1">Announcement Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Court Closure Notice / Urgent Stay Order Granted"
              className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#475569]/35"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#0F172A] font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsItem["category"])}
                className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#475569]/35"
              >
                <option value="Today's Hearing">Today's Hearing</option>
                <option value="Tomorrow's Hearing">Tomorrow's Hearing</option>
                <option value="Court Order">Court Order</option>
                <option value="Important Notice">Important Notice</option>
                <option value="Urgent Case">Urgent Case</option>
                <option value="Court Holiday">Court Holiday</option>
                <option value="Meeting Reminder">Meeting Reminder</option>
                <option value="General Announcement">General Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-[#0F172A] font-bold mb-1">Associated Court</label>
              <input
                type="text"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="Civil Court Makrana"
                className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#475569]/35"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#0F172A] font-bold mb-1">Case Number (Optional)</label>
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="e.g. CIVIL-124/2026"
              className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] font-semibold outline-none focus:border-[#475569]/35"
            />
          </div>

          <div>
            <label className="block text-[#0F172A] font-bold mb-1">Full Announcement Body Content *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write complete notice details, hearing instructions, or client advisory..."
              className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-3 text-[#0F172A] font-semibold outline-none focus:border-[#475569]/35"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pinNotice"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 accent-[#EFF6FF]"
            />
            <label htmlFor="pinNotice" className="text-xs text-[#0F172A] font-bold cursor-pointer">
              Pin to Top of Website Breaking News Ticker
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#475569]/25">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#475569]/25 rounded-xl text-[#0F172A] font-bold"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#EFF6FF] text-black font-bold rounded-xl shadow-md hover:bg-[#EFF6FF]">
              {item ? "Update Notice" : "Broadcast Notice Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
