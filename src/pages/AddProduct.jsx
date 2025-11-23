import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import { getToken, isAdmin as isAdminUser } from "../services/auth";

// Ambil SweetAlert2 dari CDN global
const Swal = window.Swal;

export default function AddProduct() {
  const navigate = useNavigate();
  const isAdmin = isAdminUser();

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAdmin) return;

    const message = "Hanya admin yang boleh menambah produk.";

    if (Swal) {
      Swal.fire({
        icon: "error",
        title: "Akses ditolak",
        text: message,
      }).then(() => navigate("/", { replace: true }));
    } else {
      alert(message);
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  const previews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  async function saveProduct(e) {
    e.preventDefault();
    if (saving) return;

    const token = getToken();

    if (!token || !isAdmin) {
      Swal.fire({
        icon: "error",
        title: "Akses ditolak",
        text: "Anda harus login sebagai admin.",
        position: "center",
      });
      return;
    }

    // Validasi simpel
    if (!title.trim() || !price) {
      Swal.fire({
        icon: "warning",
        title: "Form belum lengkap",
        text: "Judul dan harga wajib diisi.",
        position: "center",
      });
      return;
    }

    if (!images.length) {
      Swal.fire({
        icon: "warning",
        title: "Gambar belum dipilih",
        text: "Pilih minimal satu gambar produk terlebih dahulu.",
        position: "center",
      });
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("price", price);
      images.forEach((file) => formData.append("images", file));

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Gagal menyimpan produk.");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: data.msg || "Produk baru berhasil ditambahkan.",
        position: "center",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/";
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text:
          err.message ||
          "Terjadi kesalahan saat menyimpan produk. Coba beberapa saat lagi.",
        position: "center",
      });
    } finally {
      setSaving(false);
    }
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden px-4 py-10 flex items-start justify-center">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-sky-500/30 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-4xl">
        {/* header */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-sky-400">
            Manajemen Produk
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Tambah Produk</h1>
          <p className="mt-1 text-sm text-slate-300">
            Lengkapi detail produk, lalu simpan untuk menampilkannya di toko.
          </p>
        </div>

        {/* card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_70px_rgba(15,23,42,0.95)] backdrop-blur-lg p-6 md:p-8">
          <form
            onSubmit={saveProduct}
            className="grid gap-8 lg:grid-cols-12"
          >
            {/* kiri: form teks */}
            <div className="lg:col-span-7 space-y-5">
              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Judul
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Judul produk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Caption
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[90px] resize-y"
                  placeholder="Deskripsi singkat produk"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              {/* Harga */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Harga
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* tombol simpan */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 py-2.5 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(56,189,248,0.45)] transition transform ${
                    saving
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-[0_18px_60px_rgba(56,189,248,0.65)] hover:-translate-y-[1px]"
                  }`}
                >
                  {saving ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </div>

            {/* kanan: preview gambar */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-2">
                  Preview Gambar ({previews.length || 0})
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">
                  {previews.length ? (
                    <div className="grid grid-cols-2 gap-2 p-3">
                      {previews.map((src, idx) => (
                        <img
                          key={src}
                          src={src}
                          alt={`${title || "Preview"}-${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-800"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                      Belum ada gambar dipilih
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Upload Gambar (bisa lebih dari satu)
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Format JPG, PNG, atau WEBP. Bisa pilih beberapa file sekaligus.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
