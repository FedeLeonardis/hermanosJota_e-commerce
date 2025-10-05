/**
 * Obtiene el conteo de productos almacenado en localStorage.
 * Devuelve cero por defecto o cuando el entorno no dispone de `window`.
 */
export const readCartFromStorage = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem("cart-count");
  const parsed = parseInt(raw || "0", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

// Persistencia defensiva: evita valores negativos o no numéricos.
export const writeCartToStorage = (count) => {
  if (typeof window === "undefined") {
    return;
  }

  const safeValue = Math.max(0, Math.floor(Number(count) || 0));
  window.localStorage.setItem("cart-count", String(safeValue));
};

// Elimina la clave utilizada para almacenar el conteo del carrito.
export const clearCartStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("cart-count");
};
