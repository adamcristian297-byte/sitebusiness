import { useEffect, useState } from "react";
import api, { galleryImageUrl } from "../../lib/api";

const FALLBACK = [];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/gallery")
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, []);

  const display = items.length > 0
    ? items.map((it) => ({ id: it.id, url: galleryImageUrl(it.id), title: it.title }))
    : FALLBACK;

  return (
    <section id="galerie" data-testid="gallery-section" className="section bg-[#F9F7F3]">
      <div className="container-x">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#5C5852] mb-4">Portofoliu</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Proiecte <em>din teren</em>.
            </h2>
          </div>
          {items.length === 0 && loaded && (
            <p className="text-sm text-[#5C5852] italic">În curând — lucrări noi adăugate constant.</p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {display.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setActive(g)}
              data-testid={`gallery-item-${i}`}
              className={`gallery-tile relative overflow-hidden group ${
                i === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-[4/5]" : "aspect-square"
              }`}
            >
              <img src={g.url} alt={g.title || "proiect"} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#1C1A17]/0 group-hover:bg-[#1C1A17]/30 transition-colors duration-300" />
              {g.title && (
                <span className="absolute left-3 bottom-3 text-[10px] uppercase tracking-[0.22em] text-[#F9F7F3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {g.title}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title || "Imagine galerie"}
          className="fixed inset-0 z-50 bg-[#1C1A17]/90 flex items-center justify-center p-6"
          onClick={() => setActive(null)}
          onKeyDown={(e) => e.key === "Escape" && setActive(null)}
          tabIndex={-1}
          ref={(el) => el && el.focus()}
          data-testid="gallery-lightbox"
        >
          <button
            onClick={() => setActive(null)}
            aria-label="Închide"
            className="absolute top-6 right-6 text-[#F9F7F3] hover:text-[#A44A3F] transition-colors"
            data-testid="lightbox-close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <img src={active.url} alt={active.title || ""} className="max-h-[85vh] max-w-[90vw] object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
