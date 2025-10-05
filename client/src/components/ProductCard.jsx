import React from "react";

import "../css/productos.css";
import "../css/variables.css";
import "../css/global.css";

/**
 * Tarjeta individual del catálogo. Expone un callback cuando se selecciona.
 */
function ProductCard({ producto, onSelect = () => {} }) {
  // Normaliza la acción de selección desde teclado o mouse.
  const handleClick = () => {
    if (typeof onSelect === "function") {
      onSelect(producto);
    }
  };

  return (
    <article
      className="card-producto"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <img className="img-producto" src={producto.img} alt={producto.nombre} />
      <h2 className="nombre-producto">{producto.nombre}</h2>
      <h3 className="precio-producto">
        ${producto.precio.toLocaleString("es-AR")}
      </h3>
      <button
        type="button"
        className="btn-detalles"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }}
      >
        VER DETALLES
      </button>
    </article>
  );
}

export default ProductCard;
