// Simula una carga asincrónica (como si fuera fetch)
function obtenerProductos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productos); // productos viene de data.js
    }, 1000);
  });
}

async function renderizarProductos() {
  const contenedor = document.querySelector("#catalogo-container");

  try {
    const data = await obtenerProductos();

    data.forEach((producto) => {
      const card = document.createElement("div");
      card.classList.add("card-producto");

      card.innerHTML = `<a class="link-producto" href="producto.html?id=${
        producto.id
      }">
      <img class="img-producto" src="${producto.img}" alt="${producto.nombre}">
        <h2 class="nombre-producto">${producto.nombre}</h2>
        <h3 class="precio-producto">$${producto.precio.toLocaleString(
          "es-AR"
        )}</h3>
        <button class="btn-detalles">VER DETALLES</button>

      </a>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Cuando cargue el DOM, renderizamos
document.addEventListener("DOMContentLoaded", renderizarProductos);
