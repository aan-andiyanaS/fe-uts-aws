import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import { getToken } from "../services/auth";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  // theme: false = light, true = dark
  const [isDark, setIsDark] = useState(false);

  // produk yang sedang dibuka di modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const token = getToken();
  const isAdmin = token
    ? JSON.parse(atob(token.split(".")[1])).role === "admin"
    : false;

  const q = (searchParams.get("q") || "").toLowerCase();

  // ------------------------------------------------
  // Load produk
  // ------------------------------------------------
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    };

    load();
  }, []);

  // ------------------------------------------------
  // Delete produk
  // ------------------------------------------------
  async function deleteProduct(id) {
    if (!confirm("Yakin hapus produk ini?")) return;

    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    alert(data.msg);

    const reload = async () => {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    };

    reload();
  }

  // ------------------------------------------------
  // Filter pencarian
  // ------------------------------------------------
  const visibleProducts = products.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const caption = p.caption?.toLowerCase() || "";
    return !q || title.includes(q) || caption.includes(q);
  });

  // ------------------------------------------------
  // Format harga
  // ------------------------------------------------
  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleAddToCart = (product, qty) => {
    alert(
      `Produk "${product.title}" x${qty} ditambahkan ke keranjang. (masih dummy)`
    );
  };

  // ❌ handleBuyNow DIHAPUS, sudah tidak dipakai

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#020617]" : "bg-slate-50"
      }`}
    >
      <div className="relative max-w-6xl mx-auto px-4 lg:px-0 py-10">
        {/* Glow background */}
        <div
          className={`pointer-events-none absolute inset-x-[-80px] top-24 h-40 blur-3xl opacity-80 -z-10 ${
            isDark
              ? "bg-gradient-to-r from-sky-500/25 via-blue-500/15 to-indigo-500/25"
              : "bg-gradient-to-r from-sky-200/70 via-blue-200/40 to-indigo-200/70"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-40 -z-10 ${
            isDark
              ? "bg-gradient-to-t from-slate-950 via-[#020617] to-transparent"
              : "bg-gradient-to-t from-slate-200 via-slate-50 to-transparent"
          }`}
        />

        {/* Header + tombol */}
        <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p
              className={`text-[11px] font-semibold tracking-[0.28em] uppercase ${
                isDark ? "text-sky-400" : "text-sky-600"
              }`}
            >
              Dashboard Produk
            </p>
            <h1
              className={`mt-2 text-3xl font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Produk
            </h1>
            <p
              className={`mt-1 text-sm ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              Kelola semua produk yang tampil di toko kamu di sini.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Toggle theme */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isDark
                  ? "border-slate-600 bg-slate-800 text-slate-100"
                  : "border-slate-300 bg-white text-slate-700 shadow-sm"
              }`}
            >
              <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
              <span>{isDark ? "Dark mode" : "Light mode"}</span>
            </button>

            {/* Tambah produk (admin saja) */}
            {isAdmin && (
              <a
                href="/add"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500
                  px-6 py-3 text-sm font-semibold text-white
                  shadow-[0_10px_30px_rgba(37,99,235,0.35)]
                  hover:shadow-[0_14px_40px_rgba(37,99,235,0.45)]
                  hover:-translate-y-0.5
                  transition
                "
              >
                <span className="text-lg leading-none">＋</span>
                <span>Tambah Produk</span>
              </a>
            )}
          </div>
        </div>

        {/* Jika kosong */}
        {visibleProducts.length === 0 && (
          <div
            className={`mt-10 text-center ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            <div className="text-4xl mb-2">📭</div>
            <p className="font-medium">Produk tidak ditemukan.</p>
            <p className="text-sm mt-1 text-slate-400">
              Coba ubah kata kunci pencarian atau tambahkan produk baru.
            </p>
          </div>
        )}

        {/* Grid produk */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {visibleProducts.map((p) => (
            <article
              key={p.id}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border shadow-[0_14px_40px_rgba(0,0,0,0.18)] hover:shadow-[0_18px_55px_rgba(0,0,0,0.28)] hover:-translate-y-1 transition ${
                isDark
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* gambar (klik untuk detail) - SEKARANG DI ATAS */}
              {p.image_url && (
                <div
                  onClick={() => {
                    setSelectedProduct(p);
                    setQuantity(1);
                  }}
                  className={`relative aspect-video overflow-hidden cursor-pointer ${
                    isDark ? "bg-slate-900" : "bg-slate-100"
                  }`}
                >
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 transition ${
                      isDark
                        ? "bg-gradient-to-t from-slate-950/75 via-transparent opacity-0 group-hover:opacity-100"
                        : "bg-gradient-to-t from-slate-900/20 via-transparent opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              )}

              {/* header card (judul, caption, harga) DI BAWAH GAMBAR */}
              <div className="flex items-start justify-between p-4">
                <div className="space-y-1">
                  <h2
                    className={`text-base font-semibold line-clamp-1 transition ${
                      isDark
                        ? "text-white group-hover:text-sky-300"
                        : "text-slate-900 group-hover:text-blue-600"
                    }`}
                  >
                    {p.title}
                  </h2>
                  {p.caption && (
                    <p
                      className={`text-xs line-clamp-2 ${
                        isDark ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {p.caption}
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                    isDark
                      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/60"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {formatRupiah(p.price)}
                </span>
              </div>

              {/* footer / tombol admin */}
              {isAdmin && (
                <div
                  className={`flex items-center justify-between px-4 py-3 border-t ${
                    isDark
                      ? "border-slate-800 bg-slate-950/70"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <a
                    href={`/edit/${p.id}`}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isDark
                        ? "border border-sky-400/60 bg-sky-500/10 text-sky-100 hover:bg-sky-500/25"
                        : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    ✏️ <span>Edit</span>
                  </a>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
                  >
                    🗑 <span>Delete</span>
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Modal detail produk */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className={`relative max-w-6xl w-full mx-4 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(15,23,42,0.8)] ${
                isDark ? "bg-slate-900 border border-slate-700" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-slate-100/60 dark:border-slate-800/80">
                <div>
                  <p
                    className={`text-[11px] font-semibold tracking-[0.22em] uppercase ${
                      isDark ? "text-sky-300" : "text-sky-600"
                    }`}
                  >
                    Detail Produk
                  </p>
                  <h2
                    className={`mt-1 text-lg md:text-xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {selectedProduct.title}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className={`text-xs px-3 py-1 rounded-full border transition ${
                    isDark
                      ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* isi: layout 3 kolom */}
              <div className="grid gap-6 px-6 pb-6 pt-4 lg:grid-cols-12">
                {/* kiri: gambar besar */}
                <div className="lg:col-span-5">
                  <div
                    className={`rounded-2xl overflow-hidden ${
                      isDark ? "bg-slate-900" : "bg-slate-100"
                    }`}
                  >
                    {selectedProduct.image_url && (
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.title}
                        className="w-full h-full object-contain max-h-[420px] bg-black/5"
                      />
                    )}
                  </div>
                </div>

                {/* tengah: detail text */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {/* harga */}
                  <div>
                    <p
                      className={`text-xs mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      Harga
                    </p>
                    <p
                      className={`text-2xl font-semibold ${
                        isDark ? "text-emerald-300" : "text-emerald-600"
                      }`}
                    >
                      {formatRupiah(selectedProduct.price)}
                    </p>
                  </div>

                  {/* tab palsu */}
                  <div className="border-b border-slate-200 dark:border-slate-700 flex gap-4 text-sm">
                    <button
                      className={`pb-2 border-b-2 ${
                        isDark
                          ? "border-emerald-400 text-emerald-300"
                          : "border-emerald-500 text-emerald-600"
                      } font-semibold`}
                    >
                      Detail Produk
                    </button>
                    <button className="pb-2 text-slate-400 cursor-not-allowed">
                      Spesifikasi
                    </button>
                    <button className="pb-2 text-slate-400 cursor-not-allowed">
                      Info Penting
                    </button>
                  </div>

                  {/* deskripsi */}
                  <div className="text-sm leading-relaxed">
                    <p
                      className={`mb-1 font-medium ${
                        isDark ? "text-slate-100" : "text-slate-800"
                      }`}
                    >
                      Deskripsi
                    </p>
                    <p
                      className={`${
                        isDark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {selectedProduct.caption || "Belum ada deskripsi."}
                    </p>
                  </div>
                </div>

                {/* kanan: panel jumlah & keranjang */}
                <div className="lg:col-span-3">
                  <div
                    className={`rounded-2xl border p-4 flex flex-col gap-4 ${
                      isDark
                        ? "border-slate-700 bg-slate-900 text-slate-100"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-1">
                      Atur jumlah dan catatan
                    </h3>

                    {/* jumlah */}
                    <div className="flex items-center justify-between text-sm">
                      <span>Jumlah</span>
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() =>
                            setQuantity((q) => Math.max(1, q - 1))
                          }
                          className={`h-8 w-8 flex items-center justify-center rounded border text-lg font-semibold ${
                            isDark
                              ? "border-slate-600 hover:bg-slate-800"
                              : "border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity((q) => Math.min(999, q + 1))
                          }
                          className={`h-8 w-8 flex items-center justify-center rounded border text-lg font-semibold ${
                            isDark
                              ? "border-slate-600 hover:bg-slate-800"
                              : "border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* subtotal */}
                    <div className="flex items-center justify-between text-sm border-t pt-3 border-slate-200 dark:border-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {formatRupiah(
                          (Number(selectedProduct.price) || 0) * quantity
                        )}
                      </span>
                    </div>

                    {/* tombol aksi */}
                    <div className="flex flex-col gap-2 mt-1">
                      <button
                        onClick={() =>
                          handleAddToCart(selectedProduct, quantity)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md transition"
                      >
                        + Keranjang
                      </button>

                      {/* Tombol Beli Langsung: DINONAKTIFKAN */}
                      <button
                        type="button"
                        disabled
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border opacity-60 cursor-not-allowed ${
                          isDark
                            ? "border-emerald-400 text-emerald-300"
                            : "border-emerald-500 text-emerald-600"
                        }`}
                      >
                        Beli Langsung
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
