import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Image as ImageIcon, Star, Mail, BellDot } from "lucide-react";

export default function Overview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => setStats({}));
  }, []);

  const cards = [
    { icon: ImageIcon, label: "Imagini galerie", value: stats?.gallery_count ?? "—", testid: "stat-gallery" },
    { icon: Star, label: "Recenzii aprobate", value: stats?.reviews_approved ?? "—", testid: "stat-reviews" },
    { icon: Mail, label: "Mesaje primite", value: stats?.messages_count ?? "—", testid: "stat-messages" },
    { icon: BellDot, label: "Necitite", value: stats?.messages_unread ?? "—", testid: "stat-unread" },
  ];

  return (
    <div className="p-10" data-testid="overview-page">
      <p className="text-xs uppercase tracking-[0.3em] text-[#5C5852] mb-3">Panou admin</p>
      <h1 className="font-display text-4xl mb-10">Prezentare generală</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D6D0C4] border border-[#D6D0C4]">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#F9F7F3] p-7" data-testid={c.testid}>
            <c.icon className="w-5 h-5 text-[#A44A3F]" strokeWidth={1.5} />
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] mt-5">{c.label}</div>
            <div className="font-display text-4xl mt-2">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 border border-[#D6D0C4] p-8 bg-[#F9F7F3]">
        <h2 className="font-display text-2xl mb-4">Sfaturi rapide</h2>
        <ul className="text-sm text-[#5C5852] space-y-2 list-disc pl-5">
          <li>Adaugă imagini noi din secțiunea <strong>Galerie</strong> pentru a actualiza portofoliul.</li>
          <li>Marchează recenziile cu <strong>Aprobă</strong> ca să apară pe site-ul public.</li>
          <li>Verifică zilnic <strong>Mesajele</strong> pentru a nu pierde lead-uri.</li>
        </ul>
      </div>
    </div>
  );
}
