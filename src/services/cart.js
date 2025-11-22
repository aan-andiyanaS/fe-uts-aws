// src/services/cart.js

const CART_KEY = "tohe_cart";

// Ambil cart dari localStorage
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Simpan cart ke localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
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
