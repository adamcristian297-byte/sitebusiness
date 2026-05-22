import { useEffect, useState } from "react";
import api, { galleryImageUrl } from "../../lib/api";

const FALLBACK = [
  {
    id: "fb1",
    url: "https://images.unsplash.com/photo-1771531072574-af6ed6b954c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxwb2xpc2hlZCUyMGNvbmNyZXRlJTIwZmxvb3IlMjBpbmR1c3RyaWFsfGVufDB8fHx8MTc3OTI2OTk2OXww&ixlib=rb-4.1.0&q=85",
    title: "Pardoseală industrială",
  },
  {
    id: "fb2",
    url: "https://images.unsplash.com/photo-1764856601179-dfeca7b37e4c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwyfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBjb25jcmV0ZSUyMHBvdXJpbmd8ZW58MHx8fHwxNzc5MjY5OTY5fDA&ixlib=rb-4.1.0&q=85",
    title: "Turnare beton",
  },
  {
    id: "fb3",
    url: "https://images.pexels.com/photos/35742732/pexels-photo-35742732.jpeg",
    title: "Zid decorativ",
  },
  {
    id: "fb4",
    url: "https://static.prod-images.emergentagent.com/jobs/8c4a4944-dfd0-4c6f-8674-e010e8aad293/images/44803b3e2fbf9a844d91d75f22c938f5d92c44999ef03bd578adaf9c5f8747d6.png",
    title: "Hala elicopterizată",
  },
  {
    id: "fb5",
    url: "https://static.prod-images.emergentagent.com/jobs/8c4a4944-dfd0-4c6f-8674-e010e8aad293/images/da2956666c1eeaccb8c91013a4b76daa2f12fe2b2f9b3a228fedec92fff3a071.png",
    title: "Beton verticalizat",
  },
  {
    id: "fb6",
    url: "https://images.unsplash.com/photo-1678794792766-84eb99fe3010?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxzdGFtcGVkJTIwY29uY3JldGUlMjBwYXRpbyUyMHRleHR1cmV8ZW58MHx8fHwxNzc5MjY5OTY5fDA&ixlib=rb-4.1.0&q=85",
    title: "Beton amprentat",
  },
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/gallery")
      .then((r) => setItems(r.data || []))
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
            <p className="text-sm text-[#5C5852] italic">Galerie demonstrativă — în curând lucrări reale.</p>
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
