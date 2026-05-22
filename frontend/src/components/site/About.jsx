import { ShieldCheck, MapPin, Award } from "lucide-react";

export default function About() {
  return (
    <section id="despre" data-testid="about-section" className="section bg-[#E8E4D9] relative overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#5C5852] mb-4">Despre</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-8">
              Lucrăm cu <em>răbdare</em>, cu materiale <em>de încredere</em>.
            </h2>
            <p className="text-[#1C1A17] text-base leading-relaxed mb-6">
              Sunt <strong>Ionut Encea</strong>, fondatorul RRS Team IMP. De peste un deceniu,
              echipa noastră execută lucrări de beton amprentat, elicopterizat și verticalizat
              pentru clienți privați, firme și constructori, în toată țara.
            </p>
            <blockquote className="border-l-2 border-[#A44A3F] pl-6 text-lg text-[#1C1A17] leading-relaxed italic mb-6">
              „Pentru beton, garanția se obține direct de la stația de beton, prin certificatul
              de conformitate eliberat la livrare."
            </blockquote>
            <p className="text-[#5C5852] text-base leading-relaxed">
              Nu folosim materiale din România — pentru că nu oferă aceeași rezistență. Aducem
              totul din Spania, cu certificat de conformitate pentru fiecare comandă.
            </p>
            <div className="mt-8 overflow-hidden border border-[#D6D0C4]">
              <img
                src="https://static.prod-images.emergentagent.com/jobs/8c4a4944-dfd0-4c6f-8674-e010e8aad293/images/07fe56637c168ded29353c60a693c3f47ade0d51a074c9eba14a931c49f55f59.png"
                alt="Echipa RRS Team IMP la lucru — beton amprentat"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="bg-[#F9F7F3] p-8 sm:p-10 border border-[#D6D0C4] mb-px">
              <div className="font-display text-5xl text-[#A44A3F] mb-2">10+</div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#5C5852] mb-2">Ani de experiență</div>
              <p className="text-[#5C5852] text-sm leading-relaxed">
                Peste un deceniu de lucrări executate în toată România, de la terase rezidențiale
                la hale industriale.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-[#D6D0C4]">
              {[
                {
                  icon: ShieldCheck,
                  title: "Garanție certificată",
                  text:
                    "Certificat de conformitate de la stația de beton pentru fiecare lucrare executată.",
                },
                {
                  icon: Award,
                  title: "Materiale din Spania",
                  text:
                    "Pigmenți, agenți de protecție și amprente — totul cu certificate europene.",
                },
                {
                  icon: MapPin,
                  title: "Acoperire națională",
                  text:
                    "Deplasare în toată țara. Echipa se mobilizează rapid, indiferent de județ.",
                },
                {
                  icon: () => (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                      <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="square" />
                    </svg>
                  ),
                  title: "Execuție profesională",
                  text:
                    "Echipă proprie, utilaje specializate, finisaje uniforme și durabile în timp.",
                },
              ].map((f) => (
                <div key={f.title} className="bg-[#F9F7F3] p-8 hover:bg-[#F5F2EC] transition-colors">
                  <f.icon className="w-7 h-7 text-[#A44A3F]" strokeWidth={1.5} />
                  <h3 className="font-display text-2xl mt-5 mb-3">{f.title}</h3>
                  <p className="text-sm text-[#5C5852] leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
