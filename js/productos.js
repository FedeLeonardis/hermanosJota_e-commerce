const catalogoContainer = document.getElementById("catalogo-container");

function renderCatalogo() {
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <a href="producto.html?id=${prod.id}">Ver más</a>
    `;
    catalogoContainer.appendChild(card);
  });
}

if (catalogoContainer) renderCatalogo();
