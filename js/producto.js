/**
 * Obtiene la cantidad de productos en el carrito desde localStorage
 * @returns {number} Cantidad de productos en el carrito
 */
function getCartCount() {
  return parseInt(localStorage.getItem("hj_cart_count") || "0");
}

/**
 * Actualiza la cantidad de productos en el carrito
 * @param {number} count - Nueva cantidad
 */
function setCartCount(count) {
  localStorage.setItem("hj_cart_count", String(count));
  const cartBadge = document.querySelector("#cartCount");
  if (cartBadge) {
    cartBadge.textContent = count;
  }
}

/**
 * Agrega un producto al carrito y muestra feedback
 */
function addToCart() {
  const currentCount = getCartCount();
  const newCount = currentCount + 1;
  setCartCount(newCount);
  
  // Feedback visual
  const stockBadge = document.querySelector("#estadoStock");
  if (stockBadge) {
    stockBadge.textContent = "Agregado ✔";
    stockBadge.style.background = "var(--sage-green)";
  }
  
  // Animación del botón
  const addButton = document.querySelector("#btnAgregar");
  if (addButton) {
    addButton.style.transform = "scale(0.95)";
    setTimeout(() => {
      addButton.style.transform = "";
    }, 150);
  }
}

/**
 * Renderiza toda la información del producto en la página
 * @param {Object} product - Objeto con los datos del producto
 */
function renderProduct(product) {
  if (!product) {
    console.error("Producto no encontrado");
    return;
  }
  
  // Actualizar breadcrumb
  const breadcrumbProduct = document.querySelector("#bcProducto");
  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = product.nombre;
  }
  
  // Información básica
  const title = document.querySelector("#titulo");
  if (title) title.textContent = product.nombre;
  
  const price = document.querySelector("#precioVal");
  if (price) price.textContent = product.precio.toLocaleString("es-AR");
  
  const description = document.querySelector("#descripcion");
  if (description) description.textContent = product.descripcion;
  
  // Detalles técnicos
  const wood = document.querySelector("#madera");
  if (wood) wood.textContent = product.madera;
  
  const finish = document.querySelector("#terminacion");
  if (finish) finish.textContent = product.terminacion;
  
  const dimensions = document.querySelector("#medidas");
  if (dimensions) dimensions.textContent = product.medidas;
  
  // Imagen principal
  const mainImage = document.querySelector("#imgPrincipal");
  if (mainImage) {
    mainImage.src = product.img;
    mainImage.alt = product.nombre;
  }
  
  // Características
  const featuresContainer = document.querySelector("#features");
  if (featuresContainer && product.features) {
    featuresContainer.innerHTML = "";
    product.features.forEach((feature) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = feature;
      featuresContainer.appendChild(chip);
    });
  }
  
  // Actualizar título de la página
  document.title = `HJ — ${product.nombre}`;
}

/**
 * Obtiene el producto actual basado en el parámetro ID de la URL
 * @returns {Object|null} Producto encontrado o null
 */
function getCurrentProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id")) || 1;
  
  if (typeof products === "undefined" || !Array.isArray(products)) {
    console.error("Los datos de productos no están disponibles");
    return null;
  }
  
  return products.find(p => p.id === productId) || products[0] || null;
}

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener("DOMContentLoaded", () => {
  // Verificar que tenemos acceso a los productos
  if (typeof products === "undefined") {
    console.error("Los datos de productos no están disponibles");
    return;
  }
  
  // Obtener y renderizar producto actual
  const currentProduct = getCurrentProduct();
  renderProduct(currentProduct);
  
  // Inicializar contador del carrito
  setCartCount(getCartCount());
  
  // Event listeners
  const addButton = document.querySelector("#btnAgregar");
  if (addButton) {
    addButton.addEventListener("click", addToCart);
  }
  
  const favoriteButton = document.querySelector("#btnFavorito");
  if (favoriteButton) {
    favoriteButton.addEventListener("click", toggleFavorite);
  }
   
  console.log("Página de producto inicializada correctamente");
});
