import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
import { getToken } from "../services/auth";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const token = getToken();

  const [product, setProduct] = useState({
    title: "",
    caption: "",
    price: "",
    image_url: "",
    image: null,
  });

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await res.json();

    const found = data.find((p) => p.id == id);
    if (found) {
      setProduct({
        title: found.title,
        caption: found.caption,
        price: found.price,
        image_url: found.image_url,
        image: null,
      });
    }
  }

  async function updateProduct() {
    const form = new FormData();
    form.append("title", product.title);
    form.append("caption", product.caption);
    form.append("price", product.price);

    if (product.image) {
      form.append("image", product.image);
    }

    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    alert(data.msg);
    window.location.href = "/";
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Produk</h1>

      <label className="block mb-2 font-semibold">Judul</label>
      <input
        className="w-full border p-2 mb-3"
        value={product.title}
        onChange={(e) =>
          setProduct({ ...product, title: e.target.value })
        }
      />

      <label className="block mb-2 font-semibold">Caption</label>
      <input
        className="w-full border p-2 mb-3"
        value={product.caption}
        onChange={(e) =>
          setProduct({ ...product, caption: e.target.value })
        }
      />

      <label className="block mb-2 font-semibold">Harga</label>
      <input
        className="w-full border p-2 mb-3"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: e.target.value })
        }
      />

      <label className="block mb-2 font-semibold">Gambar Saat Ini</label>
      {product.image_url && (
        <img
          src={product.image_url}
          className="w-full mb-3 rounded"
          alt="current"
        />
      )}

      <label className="block mb-2 font-semibold">Ganti Gambar</label>
      <input
        type="file"
        className="w-full border p-2 mb-3"
        onChange={(e) =>
          setProduct({ ...product, image: e.target.files[0] })
        }
      />

      <button
        onClick={updateProduct}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4"
      >
        Simpan Perubahan
      </button>
    </div>
  );
}
