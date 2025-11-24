# FE UTS KWH – Frontend Guide

Selamat datang di repo frontend aplikasi TOHE. Berikut panduan ringkas namun interaktif agar kamu bisa menjalankannya dengan mudah.

---

## 📦 Persiapan Awal

1. **Node.js & npm**  
   - Pastikan Node.js >= 18 sudah terpasang.  
   - Cek dengan `node -v` dan `npm -v`.  
   - Jika belum, unduh dari [nodejs.org](https://nodejs.org).

2. **Masuk ke folder frontend**  
   ```bash
   cd fe-uts-kwh-main
   ```

3. **Instal dependensi**  
   ```bash
   npm install
   ```
   Tunggu hingga selesai. Jika terjadi error, jalankan ulang atau pastikan koneksi internet stabil.

---

## ⚙️ Konfigurasi Lingkungan

1. **File `.env` (opsional, tapi disarankan)**  
   Buat file `.env` di direktori `fe-uts-kwh-main` dan isi variabel berikut sesuai kebutuhan:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
   Sesuaikan URL dengan alamat backend yang kamu jalankan.

2. **Struktur penting**  
   - `src/` berisi komponen React, halaman, dan layanan.
   - `public/` berisi aset statis (logo, ikon, dll).
   - `package.json` menyimpan daftar script dan dependensi.

---

## 🚀 Menjalankan Aplikasi

1. **Mode pengembangan (auto reload)**  
   ```bash
   npm run dev
   ```
   Buka browser dan akses URL yang ditampilkan (biasanya `http://localhost:5173`).

2. **Build untuk produksi**  
   ```bash
   npm run build
   ```
   Hasil build ada di folder `dist/`.

3. **Preview hasil build**  
   ```bash
   npm run preview
   ```
   Berguna untuk memastikan output produksi berjalan baik sebelum deployment.

---

## 💻 Alur Kerja Cepat

1. **Start backend** terlebih dahulu (lihat README backend).  
2. **Set variabel VITE_API_BASE_URL** agar frontend terhubung ke backend.  
3. **Jalankan frontend** dengan `npm run dev`.  
4. **Login / register** melalui halaman utama.  
5. **Nikmati fitur**: manajemen produk, keranjang, akun, tema, dsb.

---

## ❓Troubleshooting

| Masalah | Solusi Cepat |
| --- | --- |
| `npm install` gagal | Pastikan koneksi internet dan hak akses folder. Coba `npm cache clean --force` lalu install ulang. |
| Frontend tidak bisa memanggil API | Cek `.env` dan pastikan backend berjalan di URL yang sama. |
| CORS error | Pastikan backend mengizinkan origin frontend. |
| Port 5173 bentrok | Jalankan `npm run dev -- --port=XXXX` untuk port berbeda. |

---

## 🤝 Kontribusi

1. Fork repo ini (jika perlu).  
2. Buat branch baru: `git checkout -b fitur-baru`.  
3. Commit perubahan: `git commit -m "feat: tambah fitur baru"`.  
4. Push branch: `git push origin fitur-baru`.  
5. Ajukan pull request.

Selamat coding! 🎉 Jika masih bingung, jangan ragu untuk bertanya ke tim. Kami siap bantu. 💪
