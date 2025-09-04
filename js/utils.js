/* Utilidades generales para el e-commerce */

/**
 * Obtiene la cantidad de productos en el carrito desde localStorage
 * @returns {number} Cantidad de productos en el carrito
 */
function getCartCount() {
  return parseInt(localStorage.getItem("cart-count") || "0");
}

/**
 * Actualiza la cantidad de productos en el carrito
 * @param {number} count - Nueva cantidad
 */
function setCartCount(count) {
  localStorage.setItem("cart-count", String(count));
  updateCartDisplay(count);
}

/**
 * Actualiza la visualización del contador del carrito
 * @param {number} count - Cantidad a mostrar
 */
function updateCartDisplay(count) {
  const cartBadge = document.querySelector("#cart-count");
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? "inline" : "none";
  }
}

/**
 * Inicializa el contador del carrito al cargar la página
 */
function initializeCart() {
  const currentCount = getCartCount();
  updateCartDisplay(currentCount);
}

/**
 * Obtiene el carrito completo desde localStorage
 * @returns {Array} Array de productos en el carrito
 */
function getCart() {
  const cart = localStorage.getItem("cart-items");
  return cart ? JSON.parse(cart) : [];
}

/**
 * Guarda el carrito completo en localStorage
 * @param {Array} cart - Array de productos
 */
function saveCart(cart) {
  localStorage.setItem("cart-items", JSON.stringify(cart));
  setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
}

/**
 * Agrega un producto específico al carrito
 * @param {number} productId - ID del producto
 * @param {number} quantity - Cantidad a agregar (por defecto 1)
 */
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === parseInt(productId));
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: parseInt(productId),
      quantity: quantity,
      addedAt: new Date().toISOString()
    });
  }
  
  saveCart(cart);
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initializeCart);