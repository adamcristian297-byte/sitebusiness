import { ArrowDownRight } from "lucide-react";

const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/8c4a4944-dfd0-4c6f-8674-e010e8aad293/images/07fe56637c168ded29353c60a693c3f47ade0d51a074c9eba14a931c49f55f59.png";

export default function Hero() {
  return (
    <section id="top" data-testid="hero-section" className="relative min-h-[100svh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#1C1A17]/55" aria-hidden />
      <div className="absolute inset-0 grain" aria-hidden />

      <div className="relative container-x pt-44 pb-24 min-h-[100svh] flex flex-col justify-between">
        <div className="grid lg:grid-cols-12 gap-10 items-end pt-10">
          <div className="lg:col-span-9 text-[#F9F7F3] rise">
            <p className="text-xs uppercase tracking-[0.35em] text-[#E8E4D9]/80 mb-6" data-testid="hero-eyebrow">
              RRS Team IMP — Beton decorativ & industrial
            </p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] leading-[1.02] font-medium">
              Beton amprentat,
              <br />
              <em className="not-italic text-[#E8E4D9]">elicopterizat</em> și{" "}
              <span className="text-[#A44A3F]">verticalizat</span>.
            </h1>
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-[#E8E4D9]/90 leading-relaxed">
              Lucrări de beton executate la standard european, cu materiale aduse din Spania și
              garanție certificată. Acoperim întreaga țară.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-terracotta" data-testid="hero-cta-quote">
                Cere o ofertă
                <ArrowDownRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="#servicii"
                className="text-sm uppercase tracking-[0.2em] text-[#F9F7F3] border border-[#F9F7F3]/30 px-5 py-2.5 hover:bg-[#F9F7F3]/10 hover:border-[#F9F7F3]/60 transition-all"
                data-testid="hero-cta-services"
              >
                Vezi serviciile
              </a>
            </div>
          </div>
        </div>

        <div className="relative mt-16 border-t border-[#F9F7F3]/15 pt-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-[#F9F7F3]">
          {[
            { k: "10+", v: "ani de experiență" },
            { k: "Spania", v: "materiale certificate" },
            { k: "Național", v: "zonă de acoperire" },
            { k: "Garanție", v: "certificat de conformitate" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-4xl sm:text-5xl font-semibold">{s.k}</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#E8E4D9]/70 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
