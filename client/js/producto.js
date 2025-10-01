/**
 * Agrega el producto actual al carrito y muestra feedback
 */
function addProductToCart() {
  
  // Obtener la cantidad seleccionada
  const quantityInput = document.querySelector("#cantidad");
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
  
  // Usar la función global de utils.js
  addToCart(quantity);
  
  // Feedback visual
  const stockBadge = document.querySelector("#estadoStock");
  if (stockBadge) {
    const originalText = stockBadge.textContent;
    const originalBackground = stockBadge.style.background;
    
    stockBadge.textContent = "Agregado ✔";
    stockBadge.style.background = "var(--sage-green)";
    
    // Restaurar estado original después de 2 segundos
    setTimeout(() => {
      stockBadge.textContent = originalText;
      stockBadge.style.background = originalBackground;
    }, 2000);
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
    
    // Crear tabla HTML
    const table = document.createElement("table");
    table.className = "features-table";
    
    const tbody = document.createElement("tbody");
    
    // Iterar sobre las claves del objeto features
    Object.entries(product.features).forEach(([key, value]) => {
      const row = document.createElement("tr");
      
      const labelCell = document.createElement("td");
      labelCell.className = "feature-label";
      labelCell.textContent = key.toUpperCase();
      
      const valueCell = document.createElement("td");
      valueCell.className = "feature-value";
      valueCell.textContent = value;
      
      row.appendChild(labelCell);
      row.appendChild(valueCell);
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    featuresContainer.appendChild(table);
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
  
  if (typeof productos === "undefined" || !Array.isArray(productos)) {
    console.error("Los datos de productos no están disponibles");
    return null;
  }
  
  return productos.find(p => p.id === productId) || productos[0] || null;
}

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener("DOMContentLoaded", () => {
  // Verificar que tenemos acceso a los productos
  if (typeof productos === "undefined") {
    console.error("Los datos de productos no están disponibles");
    return;
  }
  
  // Obtener y renderizar producto actual
  const currentProduct = getCurrentProduct();
  if (currentProduct) {
    renderProduct(currentProduct);
  } else {
    console.error("No se pudo obtener el producto actual");
  }
  
  // Event listeners
  const addButton = document.querySelector("#btnAgregar");
  if (addButton) {
    addButton.addEventListener("click", addProductToCart);
  } else {
    console.warn("Botón de agregar al carrito no encontrado");
  }
   
  console.log("Página de producto inicializada correctamente");
});
