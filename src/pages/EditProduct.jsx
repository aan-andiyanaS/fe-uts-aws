import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
import { getToken } from "../services/auth";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [product, setProduct] = useState({
    title: "",
    caption: "",
    price: "",
    image_url: "",
    image: null, // file baru (opsional)
  });

  const [preview, setPreview] = useState(""); // buat preview gambar
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // ------------------------------------------------
  // Load produk
  // ------------------------------------------------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();

        const found = data.find((p) => String(p.id) === String(id));
        if (found) {
          setProduct({
            title: found.title || "",
            caption: found.caption || "",
            price: found.price || "",
            image_url: found.image_url || "",
            image: null,
          });
          setPreview(found.image_url || "");
        } else {
          setNotif({
            open: true,
            type: "error",
            title: "Produk tidak ditemukan",
            message: "Data produk dengan ID tersebut tidak tersedia.",
          });
        }
      } catch {
        // gak pakai variabel error, jadi jangan didefinisikan
        setNotif({
          open: true,
          type: "error",
          title: "Gagal memuat",
          message: "Tidak bisa mengambil data produk. Coba refresh halaman.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ------------------------------------------------
  // Ganti gambar (opsional)
  // ------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setProduct((prev) => ({
      ...prev,
      image: file, // hanya diisi kalau user pilih file
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      // kalau user batal pilih file, balik ke gambar lama
      setPreview(product.image_url);
    }
  };

  // ------------------------------------------------
  // Simpan perubahan
  // ------------------------------------------------
  async function updateProduct(e) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    try {
      const form = new FormData();
      form.append("title", product.title);
      form.append("caption", product.caption);
      form.append("price", product.price);

      // hanya kirim gambar kalau user benar-benar pilih gambar baru
      if (product.image) {
        form.append("image", product.image);
      }

      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Gagal menyimpan perubahan.");
      }

      setNotif({
        open: true,
        type: "success",
        title: "Berhasil disimpan",
        message: data.msg || "Perubahan produk sudah tersimpan.",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setNotif({
        open: true,
        type: "error",
        title: "Gagal menyimpan",
        message:
          error.message ||
          "Terjadi kesalahan saat menyimpan produk. Coba beberapa saat lagi.",
      });
    } finally {
      setSaving(false);
    }
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
          <h1 className="mt-2 text-3xl font-bold text-white">Edit Produk</h1>
          <p className="mt-1 text-sm text-slate-300">
            Update judul, caption, dan harga. Gambar cukup diubah kalau kamu
            memang mau ganti.
          </p>
        </div>

        {/* card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_70px_rgba(15,23,42,0.95)] backdrop-blur-lg p-6 md:p-8">
          {loading ? (
            <div className="py-16 text-center text-slate-300 text-sm">
              Memuat data produk...
            </div>
          ) : (
            <form
              onSubmit={updateProduct}
              className="grid gap-8 lg:grid-cols-12"
            >
              {/* kiri: form teks */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Judul
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Judul produk"
                    value={product.title}
                    onChange={(e) =>
                      setProduct({ ...product, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Caption
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[90px] resize-y"
                    placeholder="Deskripsi singkat produk"
                    value={product.caption}
                    onChange={(e) =>
                      setProduct({ ...product, caption: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Harga
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                  />
                </div>

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
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>

              {/* kanan: gambar */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2">
                    Gambar Saat Ini
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">
                    {preview ? (
                      <img
                        src={preview}
                        alt={product.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                        Tidak ada gambar
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ganti Gambar (opsional)
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Kalau tidak memilih file, sistem akan tetap memakai gambar
                    yang sekarang.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
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
