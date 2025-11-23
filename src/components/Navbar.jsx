import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken, logout, getDecodedToken } from "../services/auth";

export default function Navbar() {
  const token = getToken();
  const navigate = useNavigate();
  const { search } = useLocation();

  // dropdown akun
  const [open, setOpen] = useState(false);

  // ====== DECODE JWT & AMBIL NAMA + EMAIL ======
  const payload = getDecodedToken();

  // coba berbagai kemungkinan field dari backend
  const name =
    payload?.name ??
    payload?.username ??
    payload?.fullName ??
    payload?.fullname ??
    payload?.nama ??
    payload?.user?.name ??
    payload?.user?.username ??
    "Pengguna";

  const email =
    payload?.email ??
    payload?.user?.email ??
    payload?.userEmail ??
    payload?.mail ??
    "user@example.com";

  const initial = name?.[0]?.toUpperCase() || "U";

  // Ambil nilai "q" langsung dari URL saat inisialisasi state
  const params = new URLSearchParams(search);
  const [query, setQuery] = useState(params.get("q") || "");

  const primaryColor = "indigo";

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(`/?${trimmed ? `q=${encodeURIComponent(trimmed)}` : ""}`);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav
      className={`bg-gray-950 sticky top-0 z-50 border-b border-${primaryColor}-700/50 font-sans`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a
            href="/"
            className={`flex items-center space-x-2 text-2xl font-black text-white tracking-widest uppercase transition duration-300 hover:text-${primaryColor}-400`}
            style={{ textShadow: `0 0 5px rgba(129, 140, 248, 0.6)` }}
          >
            <img
              src="/logo.png"
              alt="ToHe Logo"
              className="h-8 w-8 object-contain filter invert hue-rotate-180"
            />
            <span>TOHE</span>
          </a>

          {/* Search (kalau sudah login) */}
          {token && (
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-lg mx-8 transition-opacity duration-300"
            >
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari produk sampah..."
                  className={`w-full py-2 pl-4 pr-10 text-white bg-gray-800 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 border border-gray-700 transition duration-300`}
                />
                <button
                  type="submit"
                  className={`absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-${primaryColor}-400 transition duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.61l4.57 4.57a1 1 0 01-1.42 1.42l-4.57-4.57A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Kanan */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Belum login */}
            {!token && (
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="/login"
                  className={`
                    relative inline-flex items-center justify-center
                    px-4 py-1.5 rounded-full
                    text-xs sm:text-sm font-semibold
                    border border-slate-600/70
                    bg-slate-900/60 text-slate-100
                    backdrop-blur-sm
                    hover:border-${primaryColor}-400 hover:text-${primaryColor}-100
                    hover:bg-slate-900
                    focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500/70
                    focus:ring-offset-2 focus:ring-offset-gray-950
                    transition
                  `}
                >
                  Login
                </a>

                <a
                  href="/register"
                  className={`
                    relative inline-flex items-center justify-center
                    px-4 sm:px-5 py-1.5 rounded-full
                    text-xs sm:text-sm font-bold text-white
                    bg-gradient-to-r from-${primaryColor}-500 via-purple-500 to-sky-500
                    shadow-[0_0_22px_rgba(129,140,248,0.85)]
                    hover:shadow-[0_0_32px_rgba(129,140,248,1)]
                    hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-${primaryColor}-400/80
                    focus:ring-offset-2 focus:ring-offset-gray-950
                    transition
                  `}
                >
                  Register
                </a>
              </div>
            )}

            {/* Sudah login: ikon keranjang + avatar akun */}
            {token && (
              <>
                {/* IKON KERANJANG */}
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="relative flex items-center justify-center h-9 w-9 rounded-full border border-slate-600 bg-slate-900 text-slate-200 hover:border-indigo-400 hover:text-indigo-300 hover:bg-slate-800 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="20" r="1.3" />
                    <circle cx="18" cy="20" r="1.3" />
                    <path d="M3 4h2l2.4 11.2a1 1 0 0 0 .98.8H18a1 1 0 0 0 .97-.76L21 8H7" />
                  </svg>
                </button>

                {/* AVATAR + DROPDOWN */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 border border-gray-700 px-2.5 py-1.5 hover:border-indigo-400 transition"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                      {initial}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-semibold leading-tight text-white">
                        {name}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-tight">
                        Akun
                      </span>
                    </div>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white text-gray-900 shadow-xl border border-gray-100 z-50">
                      {/* header akun */}
                      <div className="flex gap-3 px-4 py-3 border-b border-gray-100">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {email}
                          </p>
                        </div>
                      </div>

                      {/* menu */}
                      <ul className="py-1 text-sm">
                        <li>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                            Detail Akun
                          </button>
                        </li>
                        <li>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                            Ubah Nama
                          </button>
                        </li>
                        <li>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                            Ubah Sandi
                          </button>
                        </li>
                      </ul>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 border-t border-gray-100"
                      >
                        <span>Logout</span>
                        <span className="text-base">⏻</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
