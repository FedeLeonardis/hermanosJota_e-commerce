// Selecciono la sección directamente
const destacadosContainer = document.querySelector(".productos-destacados");

// Tomo 3 productos aleatorios
function obtenerProductosAleatorios(cantidad) {
    const copia = [...productos].sort(() => 0.5 - Math.random());
    return copia.slice(0, cantidad);
}

const destacados = obtenerProductosAleatorios(3);

// Renderizo después del <h2>
destacados.forEach(prod => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
    <img src="${prod.img}" alt="${prod.nombre}">
    <h3>${prod.nombre}</h3>
    <p>$${prod.precio}</p>
  `;
    destacadosContainer.appendChild(div);
});