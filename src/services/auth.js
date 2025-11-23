export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

// Decode JWT di sisi client secara aman
export function getDecodedToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
}

// Cek apakah pengguna saat ini adalah admin
export function isAdmin() {
  const payload = getDecodedToken();
  const role =
    payload?.role ||
    payload?.user?.role ||
    payload?.data?.role ||
    payload?.userRole;

  return role === "admin";
}
