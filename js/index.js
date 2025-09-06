const destacadosContainer = document.getElementById("destacados-container");

function renderDestacados() {
  const destacados = productos.slice(0, 3);
  destacados.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <a href="producto.html?id=${prod.id}">Ver más</a>
    `;
    destacadosContainer.appendChild(card);
  });
}

if (destacadosContainer) renderDestacados();
