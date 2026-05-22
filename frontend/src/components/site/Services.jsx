const SERVICES = [
  {
    n: "01",
    title: "Beton amprentat",
    img: "https://images.unsplash.com/photo-1678794792766-84eb99fe3010?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxzdGFtcGVkJTIwY29uY3JldGUlMjBwYXRpbyUyMHRleHR1cmV8ZW58MHx8fHwxNzc5MjY5OTY5fDA&ixlib=rb-4.1.0&q=85",
    desc:
      "Soluție decorativă pentru alei, terase și curți. Texturi și culori variate, cu pigmenți rezistenți la UV și agenți de protecție profesionali.",
    tags: ["Alei carosabile", "Terase", "Curți", "Trotuare"],
  },
  {
    n: "02",
    title: "Beton elicopterizat",
    img: "https://static.prod-images.emergentagent.com/jobs/8c4a4944-dfd0-4c6f-8674-e010e8aad293/images/44803b3e2fbf9a844d91d75f22c938f5d92c44999ef03bd578adaf9c5f8747d6.png",
    desc:
      "Pardoseli industriale lustruite, cu finisaj neted și rezistență sporită la uzură. Recomandat pentru hale, depozite și spații comerciale.",
    tags: ["Hale industriale", "Depozite", "Service-uri", "Garaje"],
  },
  {
    n: "03",
    title: "Beton verticalizat",
    img: "https://static.prod-images.emergentagent.com/jobs/8c4a4944-dfd0-4c6f-8674-e010e8aad293/images/da2956666c1eeaccb8c91013a4b76daa2f12fe2b2f9b3a228fedec92fff3a071.png",
    desc:
      "Suprafețe verticale decorative ce imită piatra naturală. Soluția ideală pentru fațade, garduri și ziduri ornamentale cu impact arhitectural.",
    tags: ["Fațade", "Garduri", "Ziduri decorative", "Stâlpi"],
  },
];

export default function Services() {
  return (
    <section id="servicii" data-testid="services-section" className="section bg-[#F9F7F3] relative">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#5C5852] mb-4">Servicii</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Trei tehnici, <em>un singur</em> standard.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 text-[#5C5852] text-base leading-relaxed">
            Fiecare proiect este executat de echipa noastră cu materiale aduse din Spania —
            superioare ca rezistență și uniformitate față de alternativele locale. De la patio-uri
            elegante la pardoseli industriale, lucrăm la calitatea pe care o garantăm prin
            certificat de conformitate.
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {SERVICES.map((s, i) => (
            <article
              key={s.n}
              data-testid={`service-${s.n}`}
              className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch border-t border-[#D6D0C4] pt-6 sm:pt-8 group"
            >
              <div className="lg:col-span-7 relative overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D6D0C4] mb-3">Serviciul {s.n}</span>
                <h3 className="font-display text-3xl sm:text-4xl leading-tight mb-6">{s.title}</h3>
                <p className="text-[#5C5852] leading-relaxed text-base mb-6">{s.desc}</p>
                <ul className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="text-[11px] uppercase tracking-[0.18em] text-[#1C1A17] border border-[#D6D0C4] px-3 py-1"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-auto pt-8 text-sm uppercase tracking-[0.22em] text-[#A44A3F] hover:text-[#8E3F35] inline-flex items-center gap-2 group/link"
                  data-testid={`service-cta-${s.n}`}
                >
                  Solicită ofertă
                  <span className="transition-transform group-hover/link:translate-x-1">&rarr;</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
