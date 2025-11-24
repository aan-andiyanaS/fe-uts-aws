import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getToken,
  logout,
  getDecodedToken,
  isAdmin as isAdminUser,
} from "../services/auth";

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
  const dropdownRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const isAdmin = isAdminUser();
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if (!open) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const handler = (event) => {
      if (
        !showSearchPanel ||
        (mobileSearchRef.current &&
          mobileSearchRef.current.contains(event.target))
      ) {
        return;
      }
      setShowSearchPanel(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSearchPanel]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(`/?${trimmed ? `q=${encodeURIComponent(trimmed)}` : ""}`);
    setShowSearchPanel(false);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    window.location.href = "/login";
  };

  return (
    <nav
      className={`bg-gray-950 sticky top-0 z-50 border-b border-${primaryColor}-700/50 font-sans`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:h-16 sm:py-0">
          <div className="flex items-center gap-2 flex-shrink-0">
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
          </div>

          {/* Kanan */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-end">
            {token && (
              <button
                type="button"
                onClick={() => setShowSearchPanel(true)}
                className={`h-10 w-10 rounded-full border border-slate-700 text-slate-200 flex items-center justify-center hover:text-${primaryColor}-300 hover:border-${primaryColor}-400 transition`}
                aria-label="Buka pencarian"
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
            )}

            {/* Belum login */}
            {!token && (
              <div className="flex flex-col w-full sm:w-auto sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <a
                  href="/login"
                  className={`
                    relative inline-flex items-center justify-center w-full sm:w-auto
                    px-4 py-2 rounded-full
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
                    relative inline-flex items-center justify-center w-full sm:w-auto
                    px-4 sm:px-5 py-2 rounded-full
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
                {!isAdmin && (
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
                )}

                {/* AVATAR + DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full bg-gray-900 border border-gray-700 p-1.5 hover:border-indigo-400 transition"
                    aria-label="Menu akun"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                      {initial}
                    </div>
                    <div className="hidden sm:flex flex-col items-start pr-2">
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
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                            onClick={() => {
                              setOpen(false);
                              navigate("/account");
                            }}
                          >
                            Detail Akun & Edit Profil
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

      {token && showSearchPanel && (
        <div
          className="fixed inset-x-0 top-16 z-40 bg-gray-900 border-b border-slate-700/70 px-4 py-3 sm:max-w-2xl sm:left-1/2 sm:-translate-x-1/2 sm:rounded-b-2xl sm:shadow-xl"
          ref={mobileSearchRef}
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="flex-1 py-2 px-3 rounded-lg bg-gray-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center"
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
            <button
              type="button"
              onClick={() => setShowSearchPanel(false)}
              className="h-10 w-10 rounded-lg border border-slate-600 text-slate-200 flex items-center justify-center"
              aria-label="Tutup pencarian"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
