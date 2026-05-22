import { useEffect, useState } from "react";
import api, { formatApiError } from "../../lib/api";
import { Trash2, Check, X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EMPTY = { author_name: "", location: "", rating: 5, text: "", approved: true };

export default function ReviewsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/reviews");
      setItems(data || []);
    } catch (_e) {
      toast.error("Nu am putut încărca recenziile.");
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/reviews", form);
      toast.success("Recenzie adăugată.");
      setForm(EMPTY);
      load();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Adăugare eșuată.");
    } finally {
      setSaving(false);
    }
  };

  const toggleApprove = async (r) => {
    try {
      const { data } = await api.patch(`/admin/reviews/${r.id}`, { approved: !r.approved });
      setItems((arr) => arr.map((x) => (x.id === r.id ? data : x)));
    } catch (_e) {
      toast.error("Actualizare eșuată.");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Ștergi recenzia?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
      toast.success("Recenzie ștearsă.");
    } catch (_e) {
      toast.error("Ștergere eșuată.");
    }
  };

  return (
    <div className="p-10" data-testid="reviews-admin">
      <p className="text-xs uppercase tracking-[0.3em] text-[#5C5852] mb-3">Recenzii</p>
      <h1 className="font-display text-4xl mb-8">Gestionează recenziile</h1>

      <form
        onSubmit={onCreate}
        className="border border-[#D6D0C4] bg-[#F9F7F3] p-8 mb-10 grid md:grid-cols-2 gap-5"
        data-testid="review-form"
      >
        <input
          required
          placeholder="Nume client"
          value={form.author_name}
          onChange={(e) => setForm({ ...form, author_name: e.target.value })}
          className="bg-transparent border-b border-[#1C1A17] py-2 outline-none focus:border-[#A44A3F]"
          data-testid="review-author"
        />
        <input
          placeholder="Locație (opțional)"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="bg-transparent border-b border-[#1C1A17] py-2 outline-none focus:border-[#A44A3F]"
          data-testid="review-location"
        />
        <div className="flex items-center gap-3">
          <label className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852]">Rating</label>
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="bg-transparent border-b border-[#1C1A17] py-2 outline-none focus:border-[#A44A3F]"
            data-testid="review-rating"
          >
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{`${n} stele`}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-3 text-sm text-[#5C5852]">
          <input
            type="checkbox"
            checked={form.approved}
            onChange={(e) => setForm({ ...form, approved: e.target.checked })}
            data-testid="review-approved"
          />
          Apare pe site (aprobată)
        </label>
        <textarea
          required
          rows={4}
          placeholder="Textul recenziei"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="md:col-span-2 bg-transparent border border-[#D6D0C4] p-3 outline-none focus:border-[#A44A3F] resize-none"
          data-testid="review-text"
        />
        <div className="md:col-span-2">
          <button type="submit" disabled={saving} className="btn-terracotta" data-testid="review-submit">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? "Se salvează…" : "Adaugă recenzia"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <div className="text-sm text-[#5C5852] italic">Nu există recenzii.</div>}
        {items.map((r) => (
          <div
            key={r.id}
            className="border border-[#D6D0C4] bg-[#F9F7F3] p-6 grid md:grid-cols-12 gap-4 items-start"
            data-testid={`review-row-${r.id}`}
          >
            <div className="md:col-span-3">
              <div className="font-medium">{r.author_name}</div>
              {r.location && <div className="text-xs text-[#5C5852] mt-1">{r.location}</div>}
              <div className="text-[#A44A3F] text-sm mt-2">{"★".repeat(r.rating)}</div>
            </div>
            <div className="md:col-span-7 text-sm text-[#1C1A17] leading-relaxed">{r.text}</div>
            <div className="md:col-span-2 flex md:flex-col gap-2 md:items-end">
              <button
                onClick={() => toggleApprove(r)}
                className={`text-xs uppercase tracking-[0.18em] px-3 py-2 inline-flex items-center gap-2 border ${
                  r.approved ? "border-[#A44A3F] text-[#A44A3F]" : "border-[#5C5852] text-[#5C5852]"
                }`}
                data-testid={`toggle-approve-${r.id}`}
              >
                {r.approved ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                {r.approved ? "Aprobată" : "Neaprobată"}
              </button>
              <button
                onClick={() => onDelete(r.id)}
                className="text-xs uppercase tracking-[0.18em] px-3 py-2 inline-flex items-center gap-2 border border-[#1C1A17] hover:bg-[#1C1A17] hover:text-[#F9F7F3]"
                data-testid={`delete-review-${r.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" /> Șterge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
