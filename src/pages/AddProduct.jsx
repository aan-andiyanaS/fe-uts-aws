import { useState } from "react";
import { API_BASE_URL } from "../services/api";
import { getToken } from "../services/auth";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  async function saveProduct() {
    const token = getToken();

    if (!token) {
      alert("Anda harus login untuk menambah produk");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("price", price);
    if (image) formData.append("image", image);

    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,   // 👉 TOKEN DIKIRIMKAN DI SINI
      },
      body: formData,
    });

    const data = await res.json();
    alert(data.msg);
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk</h1>

      <input className="w-full border p-2 mb-3"
        placeholder="Judul"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input className="w-full border p-2 mb-3"
        placeholder="Caption"
        onChange={(e) => setCaption(e.target.value)}
      />

      <input className="w-full border p-2 mb-3"
        placeholder="Harga"
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        className="w-full border p-2 mb-3"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        onClick={saveProduct}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Simpan
      </button>
    </div>
  );
}
