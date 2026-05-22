import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && typeof user === "object") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) setError(res.error || "Eroare la autentificare");
    else navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F3]" data-testid="login-page">
      <div className="container-x pt-10">
        <Link to="/" className="text-sm uppercase tracking-[0.22em] text-[#5C5852] hover:text-[#A44A3F] inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Înapoi pe site
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md border border-[#D6D0C4] bg-[#F9F7F3] p-10"
          data-testid="login-form"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#5C5852] mb-4">Acces administrator</p>
          <h1 className="font-display text-4xl mb-8">Autentificare</h1>

          <label className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Email</label>
          <input
            required
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-[#1C1A17] py-3 mb-5 outline-none focus:border-[#A44A3F] transition"
            data-testid="login-email"
          />

          <label className="text-[11px] uppercase tracking-[0.22em] text-[#5C5852] block mb-2">Parolă</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-[#1C1A17] py-3 mb-8 outline-none focus:border-[#A44A3F] transition"
            data-testid="login-password"
          />

          {error && (
            <div className="text-sm text-[#A44A3F] mb-5" data-testid="login-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-terracotta w-full" data-testid="login-submit">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Se autentifică…" : "Intră în panou"}
          </button>
        </form>
      </div>
    </div>
  );
}
