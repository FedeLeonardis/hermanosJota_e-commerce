// const catalogoContainer = document.getElementById("catalogo-container");

// function renderCatalogo() {
//   productos.forEach(prod => {
//     const card = document.createElement("div");
//     card.classList.add("card");
//     card.innerHTML = `
//       <img src="${prod.img}" alt="${prod.nombre}">
//       <h3>${prod.nombre}</h3>
//       <p>$${prod.precio}</p>
//       <a href="producto.html?id=${prod.id}">Ver más</a>
//     `;
//     catalogoContainer.appendChild(card);
//   });
// }

// if (catalogoContainer) renderCatalogo();

// ../js/productos.js

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

      card.innerHTML = `
        <img class="img-producto" src="${producto.img}" alt="${
        producto.nombre
      }">
        <h2 class="nombre-producto">${producto.nombre}</h2>
        <h3 class="precio-producto">$${producto.precio.toLocaleString(
          "es-AR"
        )}</h3>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Cuando cargue el DOM, renderizamos
document.addEventListener("DOMContentLoaded", renderizarProductos);
