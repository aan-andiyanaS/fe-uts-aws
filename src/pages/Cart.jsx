// src/pages/Cart.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  changeCartItemQty,
  removeFromCart,
} from "../services/cart";

// ambil SweetAlert2 dari window (CDN)
const Swal = window.Swal;

export default function Cart() {
  const navigate = useNavigate();

  // langsung ambil isi cart sebagai initial state
  const [items, setItems] = useState(() => getCart());

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const handleChangeQty = (id, delta) => {
    const updated = changeCartItemQty(id, delta);
    setItems(updated);
  };

  // KONFIRMASI HAPUS PAKAI SWEETALERT2
  const handleRemove = async (id) => {
    // kalau Swal belum ada (misal CDN nggak ke-load), fallback ke confirm biasa
    if (!Swal) {
      if (!window.confirm("Hapus produk ini dari keranjang?")) return;
      const updated = removeFromCart(id);
      setItems(updated);
      return;
    }

    // dialog konfirmasi
    const result = await Swal.fire({
      title: "Hapus produk ini?",
      text: "Produk akan hilang dari keranjangmu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      background: "#020617",
      color: "#e5e7eb",
    });

    if (!result.isConfirmed) return;

    const updated = removeFromCart(id);
    setItems(updated);

    // toast sukses singkat
    await Swal.fire({
      icon: "success",
      title: "Produk dihapus",
      text: "Item sudah dihapus dari keranjang.",
      timer: 1500,
      showConfirmButton: false,
      background: "#020617",
      color: "#e5e7eb",
    });
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden px-4 py-10 flex items-start justify-center">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-sky-500/30 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-5xl">
        {/* header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-sky-400">
              Keranjang
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Keranjang Belanja
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Cek lagi sebelum bayar.
            </p>
          </div>

          {/* tombol kembali ke menu utama (halaman produk) */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-100 hover:border-indigo-400 hover:text-indigo-200 hover:bg-slate-900 transition"
          >
            <span className="text-sm">←</span>
            <span>Kembali ke menu utama</span>
          </button>
        </div>

        {/* isi */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_70px_rgba(15,23,42,0.95)] backdrop-blur-lg p-10 text-center">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-slate-200 font-medium">
              Keranjangmu masih kosong.
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Silakan pilih produk dulu di halaman utama.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(56,189,248,0.45)] hover:shadow-[0_18px_60px_rgba(56,189,248,0.65)] hover:-translate-y-[1px] transition"
            >
              <span className="text-base">←</span>
              <span>Kembali ke menu utama</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* daftar item */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_70px_rgba(15,23,42,0.95)] backdrop-blur-lg p-4 sm:p-6">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4"
                  >
                    {/* gambar */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* detail */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-50 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatRupiah(item.price)} / item
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-xs text-rose-400 hover:text-rose-300"
                        >
                          Hapus
                        </button>
                      </div>

                      {/* qty + subtotal */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleChangeQty(item.id, -1)}
                            className="h-8 w-8 flex items-center justify-center rounded border border-slate-600 text-sm text-slate-200 hover:bg-slate-800"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleChangeQty(item.id, 1)}
                            className="h-8 w-8 flex items-center justify-center rounded border border-slate-600 text-sm text-slate-200 hover:bg-slate-800"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-emerald-300">
                          {formatRupiah(
                            (Number(item.price) || 0) * (item.quantity || 1)
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ringkasan */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_70px_rgba(15,23,42,0.95)] backdrop-blur-lg p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-100">
                Ringkasan Belanja
              </h2>

              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Total item</span>
                <span>
                  {items.reduce((sum, i) => sum + (i.quantity || 1), 0)} pcs
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Total harga</span>
                <span className="font-semibold text-emerald-300">
                  {formatRupiah(total)}
                </span>
              </div>

              <button
                type="button"
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 py-2.5 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(56,189,248,0.45)] hover:shadow-[0_18px_60px_rgba(56,189,248,0.65)] hover:-translate-y-[1px] transition"
              >
                Lanjut ke Checkout
              </button>

              <p className="text-[11px] text-slate-500">
                Checkout belum disambungkan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
