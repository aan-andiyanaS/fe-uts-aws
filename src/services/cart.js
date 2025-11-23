// src/services/cart.js
import { getDecodedToken } from "./auth";

const BASE_CART_KEY = "tohe_cart";

// Kunci cart per pengguna (fallback ke guest)
const getCartKey = () => {
  const payload = getDecodedToken();
  const userId =
    payload?.id || payload?.user?.id || payload?.data?.id || payload?.sub;
  return userId ? `${BASE_CART_KEY}_${userId}` : `${BASE_CART_KEY}_guest`;
};

const loadCartByKey = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// Ambil cart dari localStorage
export function getCart() {
  const key = getCartKey();
  const cart = loadCartByKey(key);

  // fallback: migrasi cart lama (tanpa prefix user)
  if (cart.length === 0 && key !== BASE_CART_KEY) {
    const legacy = loadCartByKey(BASE_CART_KEY);
    if (legacy.length) {
      saveCart(legacy);
      localStorage.removeItem(BASE_CART_KEY);
      return legacy;
    }
  }

  return cart;
}

// Simpan cart ke localStorage
function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

// Tambah produk ke cart (kalau sudah ada, tambahin qty)
export function addToCart(product, qty = 1) {
  const cart = getCart();
  const quantity = Math.max(1, Number(qty) || 1);

  const idx = cart.findIndex((item) => String(item.id) === String(product.id));

  if (idx >= 0) {
    cart[idx] = {
      ...cart[idx],
      quantity: cart[idx].quantity + quantity,
    };
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      image_url: product.image_url,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
}

// Update jumlah item tertentu
export function updateCartItem(id, quantity) {
  const cart = getCart();
  const newQty = Math.max(1, Number(quantity) || 1);

  const updated = cart.map((item) =>
    String(item.id) === String(id) ? { ...item, quantity: newQty } : item
  );

  saveCart(updated);
  return updated;
}

// Ubah qty dengan delta (+1 / -1)
export function changeCartItemQty(id, delta) {
  const cart = getCart();

  const updated = cart
    .map((item) => {
      if (String(item.id) !== String(id)) return item;
      const newQty = (item.quantity || 1) + delta;
      if (newQty <= 0) return null; // kalau <=0, nanti difilter
      return { ...item, quantity: newQty };
    })
    .filter(Boolean);

  saveCart(updated);
  return updated;
}

// Hapus item dari cart
export function removeFromCart(id) {
  const cart = getCart();
  const updated = cart.filter((item) => String(item.id) !== String(id));
  saveCart(updated);
  return updated;
}
