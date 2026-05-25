import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#1C1A17] text-[#F9F7F3] relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-40 pointer-events-none" aria-hidden />
      <div className="container-x relative py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="font-display text-6xl sm:text-7xl lg:text-8xl leading-none">
              RRS Team <span className="text-[#A44A3F]">IMP</span>
            </div>
            <p className="mt-6 max-w-md text-[#E8E4D9]/70 text-sm leading-relaxed">
              Beton amprentat, elicopterizat și verticalizat. Materiale din Spania, garanție
              certificată. Lucrăm în toată țara.
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#E8E4D9]/60 mb-4">Navigare</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#servicii" className="hover:text-[#A44A3F]">Servicii</a></li>
              <li><a href="#despre" className="hover:text-[#A44A3F]">Despre</a></li>
              <li><a href="#galerie" className="hover:text-[#A44A3F]">Galerie</a></li>
              <li><a href="#recenzii" className="hover:text-[#A44A3F]">Recenzii</a></li>
              <li><a href="#contact" className="hover:text-[#A44A3F]">Contact</a></li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#E8E4D9]/60 mb-4">Contact</div>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+40770865497" className="hover:text-[#A44A3F]">0770865497</a></li>
              <li><a href="mailto:adamcristian606@gmail.com" className="hover:text-[#A44A3F]">adamcristian606@gmail.com</a></li>
              <li>România — acoperire națională</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#3B3833] flex flex-wrap items-center justify-between gap-3 text-xs text-[#E8E4D9]/60">
          <div>© {new Date().getFullYear()} RRS Team IMP. Toate drepturile rezervate.</div>
          <Link to="/admin/login" className="hover:text-[#A44A3F]" data-testid="footer-admin-link">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
