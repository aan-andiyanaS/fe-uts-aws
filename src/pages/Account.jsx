import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import { getToken, setToken, getDecodedToken } from "../services/auth";

const Swal = window.Swal || null;

export default function Account() {
  const navigate = useNavigate();
  const token = getToken();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Gagal memuat profil");

        setProfile({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch (err) {
        if (Swal) {
          Swal.fire("Gagal", err.message, "error");
        } else {
          alert(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          password: password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Gagal menyimpan profil");

      if (data.token) {
        setToken(data.token);
      }

      if (Swal) {
        Swal.fire("Berhasil", data.msg || "Profil diperbarui", "success");
      } else {
        alert(data.msg || "Profil diperbarui");
      }

      const decoded = getDecodedToken();
      setProfile((prev) => ({
        ...prev,
        name: decoded?.name || prev.name,
        email: decoded?.email || prev.email,
      }));
      setPassword("");
    } catch (err) {
      if (Swal) {
        Swal.fire("Gagal", err.message, "error");
      } else {
        alert(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden px-4 py-10 flex items-start justify-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-sky-500/30 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-sky-400">
            Detail Akun
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Profil Saya</h1>
          <p className="mt-1 text-sm text-slate-300">
            Lihat dan perbarui informasi akunmu di sini.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_70px_rgba(15,23,42,0.95)] backdrop-blur-lg p-6 md:p-8">
          {loading ? (
            <div className="py-16 text-center text-slate-300 text-sm">
              Memuat profil...
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Peran
                  </label>
                  <input
                    disabled
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-400"
                    value={profile.role || "user"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password Baru (opsional)
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(56,189,248,0.45)] transition ${
                    saving
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-[0_18px_60px_rgba(56,189,248,0.65)] hover:-translate-y-[1px]"
                  }`}
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-2 text-sm font-semibold text-slate-100 hover:border-indigo-400 hover:text-indigo-200 transition"
                >
                  Kembali
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
