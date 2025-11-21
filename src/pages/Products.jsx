import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
import { getToken } from "../services/auth";

export default function Products() {
  const [products, setProducts] = useState([]);

  const token = getToken();
  const isAdmin = token
    ? JSON.parse(atob(token.split(".")[1])).role === "admin"
    : false;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await res.json();
    setProducts(data);
  }

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
    load(); // refresh data setelah delete
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Produk Sampah</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold">{p.title}</h2>
            <p>{p.caption}</p>
            <p className="font-bold mt-2">Rp {p.price}</p>

            {p.image_url && (
              <img src={p.image_url} className="w-full mt-2 rounded" />
            )}

            {/* Tombol admin */}
            {isAdmin && (
              <div className="mt-4 flex gap-3">
                <a
                  href={`/edit/${p.id}`}
                  className="text-blue-600 font-semibold"
                >
                  Edit
                </a>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
