import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";

const links = [
  { href: "#servicii", label: "Servicii" },
  { href: "#despre", label: "Despre" },
  { href: "#galerie", label: "Galerie" },
  { href: "#recenzii", label: "Recenzii" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-[#F9F7F3] border-b border-[#D6D0C4]" : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <a href="#top" className="flex items-baseline gap-2" data-testid="logo-link">
          <span className={`font-display text-2xl font-semibold tracking-tight ${scrolled ? "text-[#1C1A17]" : "text-[#F9F7F3]"}`}>RRS Team</span>
          <span className={`text-[10px] uppercase tracking-[0.3em] ${scrolled ? "text-[#5C5852]" : "text-[#E8E4D9]/80"}`}>IMP</span>
        </a>

        <nav className="hidden lg:flex items-center gap-10" aria-label="Navigare principală">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className={`text-sm uppercase tracking-[0.18em] hover:text-[#A44A3F] transition-colors ${scrolled ? "text-[#1C1A17]" : "text-[#F9F7F3]"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+40771751285"
            data-testid="header-phone-cta"
            className="hidden sm:inline-flex btn-terracotta"
          >
            <Phone className="w-4 h-4" strokeWidth={1.5} /> 0771 751 285
          </a>
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Meniu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X className={`w-5 h-5 ${scrolled ? "text-[#1C1A17]" : "text-[#F9F7F3]"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? "text-[#1C1A17]" : "text-[#F9F7F3]"}`} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#D6D0C4] bg-[#F9F7F3]">
          <div className="container-x py-6 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.18em]"
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
              >
                {l.label}
              </a>
            ))}
            <a href="tel:+40771751285" className="btn-terracotta w-fit" data-testid="mobile-phone-cta">
              <Phone className="w-4 h-4" /> 0771 751 285
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
