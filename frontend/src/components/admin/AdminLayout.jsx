import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Image as ImageIcon, Star, Mail, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Prezentare", icon: LayoutDashboard, end: true, testid: "nav-overview" },
  { to: "/admin/galerie", label: "Galerie", icon: ImageIcon, testid: "nav-gallery" },
  { to: "/admin/recenzii", label: "Recenzii", icon: Star, testid: "nav-reviews" },
  { to: "/admin/mesaje", label: "Mesaje", icon: Mail, testid: "nav-messages" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3] flex" data-testid="admin-layout">
      <aside className="w-64 bg-[#1C1A17] text-[#F9F7F3] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#3B3833]">
          <div className="font-display text-2xl">RRS Team <span className="text-[#A44A3F]">IMP</span></div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#E8E4D9]/60 mt-2">Panou Administrator</div>
        </div>
        <nav className="flex-1 py-6">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={n.testid}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm tracking-wide transition-colors border-l-2 ${
                  isActive
                    ? "border-[#A44A3F] bg-[#3B3833]/40 text-[#F9F7F3]"
                    : "border-transparent text-[#E8E4D9]/70 hover:text-[#F9F7F3] hover:bg-[#3B3833]/30"
                }`
              }
            >
              <n.icon className="w-4 h-4" strokeWidth={1.5} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[#3B3833] p-6 space-y-4">
          <div className="text-xs text-[#E8E4D9]/70">
            <div className="uppercase tracking-[0.2em] text-[10px] mb-1">Conectat</div>
            <div>{user?.email}</div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E8E4D9]/70 hover:text-[#A44A3F]" data-testid="view-site-link">
            <ExternalLink className="w-3.5 h-3.5" /> Vezi site-ul
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E8E4D9]/70 hover:text-[#A44A3F]"
            data-testid="logout-button"
          >
            <LogOut className="w-3.5 h-3.5" /> Deconectează-te
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
