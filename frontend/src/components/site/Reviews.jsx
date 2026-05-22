import { useEffect, useState } from "react";
import { Star, Quote, Loader2, Send } from "lucide-react";
import api, { formatApiError } from "../../lib/api";
import { toast } from "sonner";

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ author_name: "", location: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api
      .get("/reviews")
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reviews", form);
      setSubmitted(true);
      setForm({ author_name: "", location: "", rating: 5, text: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Trimiterea a eșuat.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="recenzii" data-testid="reviews-section" className="section bg-[#1C1A17] text-[#F9F7F3] relative">
      <div className="absolute inset-0 grain opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-14 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.35em] text-[#E8E4D9]/80 mb-4">Recenzii</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Vorbele <em className="text-[#A44A3F]">clienților</em> noștri.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 text-[#E8E4D9]/80 text-sm leading-relaxed">
            Fiecare proiect este o relație. Iată ce spun oamenii cu care am lucrat.
          </div>
        </div>

        {/* Reviews grid */}
        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#3B3833] mb-16">
            {items.map((r, i) => (
              <article
                key={r.id || i}
                data-testid={`review-${i}`}
                className="bg-[#221F1C] p-8 flex flex-col"
              >
                <Quote className="w-5 h-5 text-[#A44A3F] mb-4" strokeWidth={1.5} aria-hidden="true" />
                <p className="font-display text-lg italic leading-relaxed mb-6">"{r.text}"</p>
                <div className="mt-auto pt-5 border-t border-[#3B3833]">
                  <div className="flex gap-1 mb-3" aria-label={`Rating: ${r.rating || 5} din 5 stele`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${idx < (r.rating || 5) ? "fill-[#A44A3F] text-[#A44A3F]" : "text-[#5C5852]"}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="text-sm font-medium">{r.author_name}</div>
                  {r.location && (
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#E8E4D9]/80 mt-1">
                      {r.location}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Public review form */}
        <div className="max-w-2xl mx-auto" data-testid="review-form-section">
          <h3 className="font-display text-3xl mb-2 text-center">Lasă o recenzie</h3>
          <p className="text-[#E8E4D9]/80 text-sm text-center mb-8">
            Recenzia ta va fi publicată după verificare.
          </p>

          {submitted ? (
            <div
              className="border border-[#3B3833] bg-[#221F1C] p-8 text-center"
              data-testid="review-success"
            >
              <p className="font-display text-2xl mb-3">Mulțumim!</p>
              <p className="text-[#E8E4D9]/80 text-sm">
                Recenzia a fost trimisă cu succes. Va apărea pe site după ce va fi verificată.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" data-testid="public-review-form">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="review-name" className="text-[11px] uppercase tracking-[0.22em] text-[#E8E4D9]/80 mb-2 block">
                    Nume
                  </label>
                  <input
                    id="review-name"
                    required
                    placeholder="Numele tău"
                    value={form.author_name}
                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                    className="w-full bg-[#221F1C] border border-[#3B3833] px-4 py-3 text-sm text-[#F9F7F3] placeholder:text-[#E8E4D9]/30 outline-none focus:border-[#A44A3F]"
                    data-testid="review-input-name"
                  />
                </div>
                <div>
                  <label htmlFor="review-location" className="text-[11px] uppercase tracking-[0.22em] text-[#E8E4D9]/80 mb-2 block">
                    Oraș / Localitate
                  </label>
                  <input
                    id="review-location"
                    placeholder="Opțional"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-[#221F1C] border border-[#3B3833] px-4 py-3 text-sm text-[#F9F7F3] placeholder:text-[#E8E4D9]/30 outline-none focus:border-[#A44A3F]"
                    data-testid="review-input-location"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#E8E4D9]/80 mb-2 block">
                  Rating
                </span>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating" data-testid="review-rating-selector">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      className="p-0.5"
                      aria-label={`${n} stea${n > 1 ? "le" : ""}`}
                      aria-pressed={n <= form.rating}
                      data-testid={`star-${n}`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          n <= form.rating
                            ? "fill-[#A44A3F] text-[#A44A3F]"
                            : "text-[#3B3833]"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="review-text" className="text-[11px] uppercase tracking-[0.22em] text-[#E8E4D9]/80 mb-2 block">
                  Recenzia ta
                </label>
                <textarea
                  id="review-text"
                  required
                  rows={4}
                  placeholder="Descrie experiența ta cu noi..."
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full bg-[#221F1C] border border-[#3B3833] px-4 py-3 text-sm text-[#F9F7F3] placeholder:text-[#E8E4D9]/30 outline-none focus:border-[#A44A3F] resize-none"
                  data-testid="review-input-text"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-terracotta w-full"
                data-testid="review-submit"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? "Se trimite…" : "Trimite recenzia"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
