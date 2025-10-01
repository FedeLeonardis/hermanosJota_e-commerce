document.addEventListener("DOMContentLoaded", () => {
    const destacadosContainer = document.querySelector(".productos-destacados");

    if (!destacadosContainer) {
        console.error("No se encontró el contenedor .productos-destacados");
        return;
    }

    if (typeof productos === "undefined" || !Array.isArray(productos)) {
        console.error("Los datos de productos no están disponibles");
        return;
    }

    function obtenerProductosAleatorios(cantidad) {
        const copia = [...productos].sort(() => 0.5 - Math.random());
        return copia.slice(0, cantidad);
    }

    const destacados = obtenerProductosAleatorios(3);

    destacados.forEach(prod => {
        const link = document.createElement("a");
        link.href = `producto.html?id=${prod.id}`;
        link.classList.add("producto");

        link.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
    `;

        destacadosContainer.appendChild(link);
    });

    console.log("Se cargaron 3 productos destacados aleatorios");
});