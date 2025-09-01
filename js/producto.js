const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const detalle = document.getElementById("detalle-producto");

const prod = productos.find(p => p.id === id);

if (prod && detalle) {
  detalle.innerHTML = `
    <img src="${prod.img}" alt="${prod.nombre}">
    <h1>${prod.nombre}</h1>
    <p>${prod.descripcion}</p>
    <p><strong>Precio:</strong> $${prod.precio}</p>
    <button onclick="addToCart()">Añadir al Carrito</button>
    `;
    }



// const qs = (s) => document.querySelector(s);

// function getCartCount() {
//   return parseInt(localStorage.getItem("hj_cart_count") || "0");
// }

// function setCartCount(v) {
//   localStorage.setItem("hj_cart_count", String(v));
//   qs("#cartCount").textContent = v;
// }

// function renderProducto(p) {
//   qs("#bcProducto").textContent = p.nombre;
//   qs("#titulo").textContent = p.nombre;
//   qs("#precioVal").textContent = p.precio.toLocaleString("es-AR");
//   qs("#descripcion").textContent = p.descripcion;
//   qs("#madera").textContent = p.madera;
//   qs("#terminacion").textContent = p.terminacion;
//   qs("#medidas").textContent = p.medidas;
//   const img = qs("#imgPrincipal");
//   img.src = p.img;
//   img.alt = p.nombre;

//   const cont = qs("#features");
//   cont.innerHTML = "";
//   p.features.forEach((f) => {
//     const span = document.createElement("span");
//     span.className = "chip";
//     span.textContent = f;
//     cont.appendChild(span);
//   });
//   document.title = `Hermanos Jota — ${p.nombre}`;
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const qsp = new URLSearchParams(location.search);
//   const id = parseInt(qsp.get("id")) || products[0].id;
//   const producto = products.find((p) => p.id === id) || products[0];

//   renderProducto(producto);
//   setCartCount(getCartCount());

//   qs("#btnAgregar").addEventListener("click", () => {
//     const next = getCartCount() + 1;
//     setCartCount(next);
//     qs("#estadoStock").textContent = "Agregado ✔";
//     qs("#estadoStock").style.background = "rgba(160,82,45,.12)";
//   });

//   qs("#btnFavorito").addEventListener("click", (e) => {
//     const pressed = e.currentTarget.getAttribute("aria-pressed") === "true";
//     e.currentTarget.setAttribute("aria-pressed", String(!pressed));
//     e.currentTarget.textContent = pressed ? "Guardar" : "Guardado";
//   });

//   qs("#year").textContent = new Date().getFullYear();
// });