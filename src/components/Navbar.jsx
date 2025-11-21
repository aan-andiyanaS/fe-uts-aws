import { getToken, logout } from "../services/auth";

export default function Navbar() {
  const token = getToken();

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <a href="/" className="font-bold text-xl">E-Sampah</a>

      <div className="flex gap-4">
        {!token && (
          <>
            <a href="/login" className="text-blue-600">Login</a>
            <a href="/register" className="text-green-600">Register</a>
          </>
        )}

        {token && (
          <>
            <a href="/add" className="text-blue-600">Tambah Produk</a>
            <button
              className="text-red-600"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
