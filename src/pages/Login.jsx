import { useState } from "react";
import { API_BASE_URL } from "../services/api";
import { setToken } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // state untuk notifikasi tengah layar
  const [notif, setNotif] = useState({
    open: false,
    type: "success", // 'success' | 'error'
    title: "",
    message: "",
  });

  const closeNotif = () =>
    setNotif((prev) => ({
      ...prev,
      open: false,
    }));

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        setToken(data.token);

        setNotif({
          open: true,
          type: "success",
          title: "Login berhasil",
          message: "Login sukses, selamat datang kembali.",
        });

        // kasih waktu user lihat notif sebentar
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setNotif({
          open: true,
          type: "error",
          title: "Login gagal",
          message: data.msg || "Email atau password salah.",
        });
      }
    } catch {
      setNotif({
        open: true,
        type: "error",
        title: "Terjadi kesalahan",
        message: "Server lagi ngambek. Coba beberapa saat lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center px-4">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-sky-500/30 blur-3xl rounded-full" />
      </div>

      {/* card login */}
      <div className="relative w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <img
              src="/logo.png"
              alt="ToHe Logo"
              className="h-9 w-9 object-contain filter invert hue-rotate-180"
            />
            <span className="text-2xl font-black tracking-[0.25em] text-slate-100">
              TOHE
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="mt-2 text-sm text-slate-300">
            Masuk untuk mengelola produk yang ada di TOHE.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-md p-6 sm:p-8"
        >
          {/* Email */}
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email
          </label>
          <input
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="contoh@mail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <input
            className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* tombol login */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 py-2.5 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(56,189,248,0.45)] transition transform ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-[0_18px_60px_rgba(56,189,248,0.65)] hover:-translate-y-[1px]"
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 underline-offset-2 hover:underline"
            >
              Daftar sekarang
            </a>
          </p>
        </form>
      </div>

      {/* NOTIFIKASI TENGAH LAYAR */}
      {notif.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-sm rounded-2xl px-6 py-5 text-center shadow-2xl ${
              notif.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            <p className="text-sm font-semibold tracking-wide uppercase mb-1">
              {notif.title}
            </p>
            <p className="text-sm opacity-95">{notif.message}</p>

            {notif.type === "error" && (
              <button
                type="button"
                onClick={closeNotif}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-white/20"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
