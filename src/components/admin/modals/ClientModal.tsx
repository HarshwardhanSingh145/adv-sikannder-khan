import React, { useState } from "react";
import { X, UserPlus, Phone, MessageSquare, Mail, MapPin, CreditCard, ShieldCheck, FileText, Image as ImageIcon } from "lucide-react";
import { ClientProfile, CaseRecord } from "../../../types/admin";

interface ClientModalProps {
  client?: ClientProfile | null;
  mode: "create" | "edit" | "view";
  allCases: CaseRecord[];
  onSave: (clientData: Omit<ClientProfile, "id" | "createdAt">) => void;
  onUpdate?: (clientId: string, updates: Partial<ClientProfile>) => void;
  onDelete?: (clientId: string) => void;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  client,
  mode,
  allCases,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    mobile: client?.mobile || "",
    whatsapp: client?.whatsapp || "",
    email: client?.email || "",
    address: client?.address || "Makrana, Nagaur, Rajasthan",
    aadhaar: client?.aadhaar || "",
    pan: client?.pan || "",
    photoUrl: client?.photoUrl || "",
    linkedCaseIds: client?.linkedCaseIds || [],
    paymentStatus: client?.paymentStatus || ("Paid" as const),
    totalFees: client?.totalFees || 25000,
    paidAmount: client?.paidAmount || 15000,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert("Client Name and Mobile Number are required!");
      return;
    }

    if (mode === "edit" && client && onUpdate) {
      onUpdate(client.id, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-[#0F172A] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#475569]/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FFFFFF]/80 border border-[#475569]/25 flex items-center justify-center shadow-md shadow-[#1D4ED8]/15">
              <UserPlus className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#0F172A]">
                {mode === "view" ? "Client CRM Profile" : mode === "edit" ? "Edit Client Record" : "Register New Client"}
              </h3>
              <p className="text-[10px] text-[#1D4ED8] font-semibold">Advocate Sikandar Khan CRM Database</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#FFFFFF]/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === "view" && client ? (
          /* VIEW PROFILE MODE */
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FFFFFF]/80/70 border border-[#475569]/25 rounded-xl flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-[#475569]/35 bg-[#FFFFFF]/80 overflow-hidden flex items-center justify-center text-xl font-bold text-[#0F172A] shrink-0">
                {client.photoUrl ? (
                  <img src={client.photoUrl} alt={client.name} className="w-full h-full object-cover" />
                ) : (
                  client.name.charAt(0)
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#0F172A] font-serif">{client.name}</h4>
                <div className="flex items-center gap-3 text-[#0F172A]/90 font-semibold">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#0F172A]" /> {client.mobile}</span>
                  <a
                    href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" /> WhatsApp
                  </a>
                </div>
                <p className="text-[#1D4ED8] font-medium">📍 {client.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FFFFFF]/80/60 border border-[#475569]/25 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#475569]">Aadhaar Card</span>
                <p className="font-extrabold text-[#0F172A]">{client.aadhaar || "Verified in Office File"}</p>
              </div>
              <div className="p-3 bg-[#FFFFFF]/80/60 border border-[#475569]/25 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#475569]">PAN Card</span>
                <p className="font-extrabold text-[#0F172A]">{client.pan || "N/A"}</p>
              </div>
            </div>

            <div className="p-4 bg-[#FFFFFF]/80/60 border border-[#475569]/25 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#0F172A] font-serif">Linked Case Records</span>
              <div className="space-y-1">
                {allCases
                  .filter((c) => c.clientName.toLowerCase() === client.name.toLowerCase() || client.linkedCaseIds.includes(c.id))
                  .map((c) => (
                    <div key={c.id} className="p-2 bg-[#FFFFFF]/80 border border-[#475569]/20 rounded-lg flex justify-between">
                      <span className="font-bold text-[#0F172A]">{c.caseTitle} ({c.caseNumber})</span>
                      <span className="text-[#0F172A] font-extrabold">{c.currentStage}</span>
                    </div>
                  ))}
              </div>
            </div>

            {onDelete && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${client.name}'s profile?`)) {
                      onDelete(client.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl text-xs hover:bg-red-200"
                >
                  Delete Client Record
                </button>
              </div>
            )}
          </div>
        ) : (
          /* CREATE / EDIT FORM */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#0F172A] font-bold mb-1">Full Client Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rameshwar Sharma"
                className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] outline-none focus:border-[#475569]/35 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#0F172A] font-bold mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value, whatsapp: e.target.value })}
                  placeholder="+91 98290 12345"
                  className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] outline-none focus:border-[#475569]/35 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[#0F172A] font-bold mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+91 98290 12345"
                  className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] outline-none focus:border-[#475569]/35 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0F172A] font-bold mb-1">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Ward No. 12, Main Bazaar, Makrana"
                className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] outline-none focus:border-[#475569]/35 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#0F172A] font-bold mb-1">Aadhaar Card No.</label>
                <input
                  type="text"
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                  placeholder="12-digit Aadhaar No."
                  className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] outline-none focus:border-[#475569]/35 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[#0F172A] font-bold mb-1">PAN Card No.</label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                  placeholder="10-digit PAN No."
                  className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2.5 text-[#0F172A] outline-none focus:border-[#475569]/35 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0F172A] font-bold mb-1">Upload Client Photo / ID Document</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full bg-[#FFFFFF]/80 border border-[#475569]/25 rounded-xl p-2 text-[#0F172A] text-xs font-semibold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#475569]/25">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#475569]/25 rounded-xl text-[#0F172A] font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-[#EFF6FF] text-black font-bold rounded-xl shadow-md hover:bg-[#EFF6FF]">
                {mode === "edit" ? "Save Changes" : "Create Client Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
