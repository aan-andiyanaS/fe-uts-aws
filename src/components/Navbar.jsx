import { getToken, logout } from "../services/auth";

export default function Navbar() {
  const token = getToken();

  const primaryColor = 'indigo'; 

  return (
    <nav className={`bg-gray-950 sticky top-0 z-50 border-b border-${primaryColor}-700/50 font-sans`}> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Teks (Sudah Keren) */}
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

          {/* Navigasi / Tautan Aksi */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {!token && (
              <>
                {/* 1. Tombol Login: Border & Background Halus (Paling Keren!) */}
                <a 
                  href="/login" 
                  // Background gelap, border aksen, teks aksen
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-800 border border-${primaryColor}-400 text-${primaryColor}-400 transition duration-300 hover:bg-gray-700 hover:border-${primaryColor}-300 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-opacity-50`}
                >
                  Login
                </a>
                
                {/* 2. Tombol Register: Tetap Solid (Primary Action dengan Glow) */}
                <a 
                  href="/register" 
                  className={`px-4 py-1.5 rounded-full text-sm font-bold text-white bg-${primaryColor}-600 hover:bg-${primaryColor}-700 transition duration-300 shadow-xl shadow-${primaryColor}-500/50`}
                >
                  Join ToHe
                </a>
              </>
            )}

            {token && (
              <>
                {/* Tambah Produk */}
                <a 
                  href="/add" 
                  className={`px-4 py-1.5 rounded-full text-sm font-medium text-gray-300 transition duration-300 hover:text-${primaryColor}-400 hover:bg-gray-800`}
                >
                  + Tambah Produk
                </a>
                
                {/* Logout: Merah (Aksi Sekunder/Peringatan) */}
                <button
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md"
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
        </div>
      </div>
    </nav>
  );
}