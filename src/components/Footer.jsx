export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-slate-600 py-6">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-semibold tracking-wide text-slate-800">
          TOHE • Daur Ulang &amp; Marketplace Ramah Lingkungan
        </span>
        <span className="text-xs text-slate-500">
          © {year} TOHE. Semua hak dilindungi.
        </span>
      </div>
    </footer>
  );
}
