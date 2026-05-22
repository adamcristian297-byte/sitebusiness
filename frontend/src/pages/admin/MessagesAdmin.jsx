import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Mail, MailOpen, Trash2, Phone } from "lucide-react";
import { toast } from "sonner";

export default function MessagesAdmin() {
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/messages");
      setItems(data || []);
    } catch (_e) {
      toast.error("Nu am putut încărca mesajele.");
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (m) => {
    if (m.read) return;
    try {
      await api.patch(`/admin/messages/${m.id}`);
      setItems((arr) => arr.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
    } catch (_e) {}
  };

  const onDelete = async (id) => {
    if (!window.confirm("Ștergi mesajul?")) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
      toast.success("Mesaj șters.");
    } catch (_e) {
      toast.error("Ștergere eșuată.");
    }
  };

  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("ro-RO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-10" data-testid="messages-admin">
      <p className="text-xs uppercase tracking-[0.3em] text-[#5C5852] mb-3">Mesaje</p>
      <h1 className="font-display text-4xl mb-8">Mesaje primite</h1>

      {items.length === 0 ? (
        <div className="text-sm text-[#5C5852] italic">Nu există mesaje.</div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div
              key={m.id}
              className={`border bg-[#F9F7F3] p-6 grid md:grid-cols-12 gap-4 items-start ${
                m.read ? "border-[#D6D0C4]" : "border-[#A44A3F]"
              }`}
              data-testid={`message-row-${m.id}`}
              onClick={() => markRead(m)}
            >
              <div className="md:col-span-3">
                <div className="flex items-center gap-2">
                  {m.read ? <MailOpen className="w-4 h-4 text-[#5C5852]" /> : <Mail className="w-4 h-4 text-[#A44A3F]" />}
                  <span className="font-medium">{m.name}</span>
                </div>
                <div className="text-xs text-[#5C5852] mt-1">{m.email}</div>
                <div className="text-xs text-[#5C5852] mt-1 inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {m.phone}
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#5C5852] mt-2">{fmt(m.created_at)}</div>
              </div>
              <div className="md:col-span-7 text-sm text-[#1C1A17] leading-relaxed whitespace-pre-wrap">{m.message}</div>
              <div className="md:col-span-2 flex md:justify-end">
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(m.id); }}
                  className="text-xs uppercase tracking-[0.18em] px-3 py-2 inline-flex items-center gap-2 border border-[#1C1A17] hover:bg-[#1C1A17] hover:text-[#F9F7F3]"
                  data-testid={`delete-message-${m.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
