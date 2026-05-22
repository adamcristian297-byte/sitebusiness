import { useEffect, useRef, useState } from "react";
import api, { galleryImageUrl, formatApiError } from "../../lib/api";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/gallery");
      setItems(data || []);
    } catch (e) {
      toast.error("Nu am putut încărca galeria.");
    }
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (title) fd.append("title", title);
      await api.post("/admin/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Imagine adăugată.");
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Upload eșuat.");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Ștergi imaginea?")) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      setItems((arr) => arr.filter((i) => i.id !== id));
      toast.success("Imagine ștearsă.");
    } catch (_e) {
      toast.error("Ștergere eșuată.");
    }
  };

  return (
    <div className="p-10" data-testid="gallery-admin">
      <p className="text-xs uppercase tracking-[0.3em] text-[#5C5852] mb-3">Galerie</p>
      <h1 className="font-display text-4xl mb-8">Gestionează imaginile</h1>

      <form
        onSubmit={onUpload}
        className="border border-[#D6D0C4] bg-[#F9F7F3] p-8 mb-10 grid md:grid-cols-3 gap-6 items-end"
        data-testid="upload-form"
      >
        <div>
          <label className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Imagine (jpg/png/webp, max 10MB)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            required
            className="block w-full text-sm"
            data-testid="upload-file"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Titlu (opțional)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-[#1C1A17] py-2 outline-none focus:border-[#A44A3F]"
            data-testid="upload-title"
          />
        </div>
        <button type="submit" disabled={uploading} className="btn-terracotta" data-testid="upload-submit">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Se încarcă…" : "Adaugă imagine"}
        </button>
      </form>

      {items.length === 0 ? (
        <div className="text-sm text-[#5C5852] italic">Nu există încă imagini.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((it) => (
            <div key={it.id} className="relative group bg-[#E8E4D9] overflow-hidden" data-testid={`gallery-tile-${it.id}`}>
              <img src={galleryImageUrl(it.id)} alt={it.title || ""} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-[#1C1A17]/0 group-hover:bg-[#1C1A17]/40 transition-colors flex items-end p-3">
                <div className="flex-1 text-xs text-[#F9F7F3] opacity-0 group-hover:opacity-100">
                  {it.title || "fără titlu"}
                </div>
                <button
                  onClick={() => onDelete(it.id)}
                  className="opacity-0 group-hover:opacity-100 bg-[#A44A3F] text-[#F9F7F3] p-2"
                  data-testid={`delete-image-${it.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
