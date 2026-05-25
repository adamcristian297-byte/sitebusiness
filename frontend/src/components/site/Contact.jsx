import { useState } from "react";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import api, { formatApiError } from "../../lib/api";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Mesajul tău a fost trimis. Te contactăm cât de curând.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Trimiterea a eșuat. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" data-testid="contact-section" className="section bg-[#F9F7F3]">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#5C5852] mb-4">Contact</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-8">
              Spune-ne despre <em>proiectul</em> tău.
            </h2>
            <p className="text-[#5C5852] mb-10 leading-relaxed">
              Răspundem rapid solicitărilor și venim cu o ofertă personalizată. Lucrăm în toată
              țara — fără excepții.
            </p>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#A44A3F] mt-1" strokeWidth={1.5} />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#5C5852] mb-1">Telefon</div>
                  <a href="tel:+40770865497" className="text-lg" data-testid="contact-phone">
                    0770865497
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#A44A3F] mt-1" strokeWidth={1.5} />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#5C5852] mb-1">Email</div>
                  <a href="mailto:adamcristian606@gmail.com" className="text-lg" data-testid="contact-email">
                    adamcristian606@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#A44A3F] mt-1" strokeWidth={1.5} />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#5C5852] mb-1">Zonă</div>
                  <div className="text-lg">Acoperire națională — toată România</div>
                </div>
              </li>
            </ul>
          </div>

          <form
            onSubmit={onSubmit}
            className="lg:col-span-6 lg:col-start-7 border border-[#D6D0C4] border-l-4 border-l-[#A44A3F] bg-white p-8 sm:p-10"
            data-testid="contact-form"
          >
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label htmlFor="contact-name" className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Nume</label>
                <input
                  id="contact-name"
                  required
                  value={form.name}
                  onChange={set("name")}
                  className="w-full bg-white border border-[#D6D0C4] px-4 py-3 outline-none focus:border-[#A44A3F] transition"
                  data-testid="contact-name"
                />
              </div>
              <div>
                <label htmlFor="contact-phone-input" className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Telefon</label>
                <input
                  id="contact-phone-input"
                  required
                  value={form.phone}
                  onChange={set("phone")}
                  className="w-full bg-white border border-[#D6D0C4] px-4 py-3 outline-none focus:border-[#A44A3F] transition"
                  data-testid="contact-phone-input"
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="contact-email-input" className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Email</label>
              <input
                id="contact-email-input"
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                className="w-full bg-white border border-[#D6D0C4] px-4 py-3 outline-none focus:border-[#A44A3F] transition"
                data-testid="contact-email-input"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="contact-message" className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Detalii proiect</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={set("message")}
                className="w-full bg-white border border-[#D6D0C4] px-4 py-3 outline-none focus:border-[#A44A3F] transition resize-none"
                data-testid="contact-message"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-terracotta w-full sm:w-auto" data-testid="contact-submit">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Se trimite…" : "Trimite mesajul"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
