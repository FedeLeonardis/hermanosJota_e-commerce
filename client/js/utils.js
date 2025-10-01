/* Utilidades generales para el e-commerce */

/**
 * Obtiene la cantidad de productos en el carrito desde localStorage
 * @returns {number} Cantidad de productos en el carrito
 */
function getCartCount() {
  // parseInt con base y manejo de NaN
  const raw = localStorage.getItem("cart-count");
  const n = parseInt(raw || "0", 10);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Actualiza la cantidad de productos en el carrito
 * @param {number} count - Nueva cantidad
 */
function setCartCount(count) {
  // Normalizar a entero no negativo
  const c = Math.max(0, Math.floor(Number(count) || 0));
  localStorage.setItem("cart-count", String(c));
  // Actualizar inmediatamente la UI (si el badge existe en la página)
  updateCartDisplay(c);
}

/**
 * Actualiza la visualización del contador del carrito
 * @param {number} count - Cantidad a mostrar
 */
function updateCartDisplay(count) {
  const cartBadge = document.querySelector("#cart-count");
  if (cartBadge) {
    cartBadge.textContent = count;
  }
}

/**
 * Agrega cantidad al contador del carrito
 * @param {number} quantity - Cantidad a agregar (por defecto 1)
 */
function addToCart(quantity = 1) {
  const old_quantity = getCartCount();
  const new_quantity = old_quantity + quantity;
  setCartCount(new_quantity);
}

// Vacía el carrito: borra la clave y actualiza la UI
function clearCart() {
  localStorage.removeItem('cart-count');
  updateCartDisplay(0);
}

// Vincula los botones del popup del header (vaciar carrito, finalizar compra)
function setupCartPopupListeners() {
  const clearBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    console.log('Finalizar compra - funcionalidad pendiente');
  });
}

// controlar apertura del popup del carrito por click ---
function toggleCartPopup(open) {
  const cart = document.querySelector('.cart');
  if (!cart) return;
  if (typeof open === 'boolean') {
    cart.classList.toggle('open', open);
  } else {
    cart.classList.toggle('open');
  }
}

function setupCartClickHandlers() {
  const cart = document.querySelector('.cart');
  if (!cart) return;

  // Toggle al hacer click en el contenedor del carrito (icono o badge)
  cart.addEventListener('click', (e) => {
    // Evitar que clicks en los botones internos cierren/reaperturen inesperadamente
    const target = e.target;
    if (target.closest('.cart-popup')) return;
    toggleCartPopup();
  });

  // Cerrar si se hace click fuera del popup
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!cart.classList.contains('open')) return;
    if (target.closest('.cart')) return; // click dentro -> no cerrar
    toggleCartPopup(false);
  });
}

/**
 * Inicializa el contador del carrito al cargar la página
 */
function initializeCart() {
  const currentCount = getCartCount();
  // Actualizar badge si ya existe
  updateCartDisplay(currentCount);
  // Vincular handlers de click para abrir/cerrar el popup del carrito
  setupCartClickHandlers();
  // Vincular listeners del popup (si el header ya está presente)
  setupCartPopupListeners();

}

// Escuchar evento personalizado 'header:ready' (disparado por include.js)
// para inicializar el badge justo cuando el header fue insertado.
document.addEventListener('header:ready', initializeCart);

// Sincronizar el contador entre pestañas: si otra pestaña modifica
// `localStorage['cart-count']`, reflejar el cambio en el badge.
window.addEventListener('storage', (e) => {
  if (e.key === 'cart-count') {
    updateCartDisplay(getCartCount());
  }
});