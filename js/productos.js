// // Simula una carga asincrónica (como si fuera fetch)
// function obtenerProductos() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(productos); // productos viene de data.js
//     }, 1000);
//   });
// }

// async function renderizarProductos() {
//   const contenedor = document.querySelector("#catalogo-container");

//   try {
//     const data = await obtenerProductos();

//     data.forEach((producto) => {
//       const card = document.createElement("div");
//       card.classList.add("card-producto");

//       card.innerHTML = `<a class="link-producto" href="producto.html?id=${
//         producto.id
//       }">
//       <img class="img-producto" src="${producto.img}" alt="${producto.nombre}">
//         <h2 class="nombre-producto">${producto.nombre}</h2>
//         <h3 class="precio-producto">$${producto.precio.toLocaleString(
//           "es-AR"
//         )}</h3>
//         <button class="btn-detalles">VER DETALLES</button>

//       </a>
//       `;

//       contenedor.appendChild(card);
//     });
//   } catch (error) {
//     console.error("Error al cargar los productos:", error);
//   }
// }

// // Cuando cargue el DOM, renderizamos
// document.addEventListener("DOMContentLoaded", renderizarProductos);

// // Busqueda de productos

///////////////////////////////

// Simula una carga asincrónica (como si fuera fetch)
function obtenerProductos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productos); // productos viene de data.js
    }, 1000);
  });
}

// Función que renderiza cualquier array de productos
function mostrarProductos(lista) {
  const contenedor = document.querySelector("#catalogo-container");
  contenedor.innerHTML = ""; // limpia antes de renderizar

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  lista.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("card-producto");

    card.innerHTML =
     `<a class="link-producto" href="producto.html?id=${producto.id}">
      <img class="img-producto" src="${producto.img}" alt="${producto.nombre}">
      <h2 class="nombre-producto">${producto.nombre}</h2>
      <h3 class="precio-producto">$${producto.precio.toLocaleString("es-AR")}</h3>
      <button class="btn-detalles">VER DETALLES</button>
      </a>`;

    contenedor.appendChild(card);
  });
}

// Inicialización: carga los productos y prepara normalización para búsqueda
async function inicializarCatalogo() {
  const data = await obtenerProductos();

  // Preprocesar productos normalizados
  window.productosNormalizados = data.map((p) => ({
    ...p,
    nombreNorm: p.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    descripcionNorm: p.descripcion
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    maderaNorm: p.madera
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
  }));

  // Mostrar todos los productos al inicio
  mostrarProductos(data);
}

// Listener de búsqueda
function configurarBusqueda() {
  const input = document.querySelector("#search");

  function buscarProductos(texto) {
    const textoNorm = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const filtrados = window.productosNormalizados.filter(
      (p) =>
        p.nombreNorm.includes(textoNorm) || p.maderaNorm.includes(textoNorm)
    );

    mostrarProductos(filtrados);
  }

  input.addEventListener("input", () => buscarProductos(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarProductos(input.value);
  });
}

// Cuando cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  inicializarCatalogo();
  configurarBusqueda();
});
