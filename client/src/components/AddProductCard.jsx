import React from "react";
import "../css/productos.css";
import "../css/variables.css";
import "../css/global.css";

/**
 * Tarjeta especial para agregar productos (solo visible para admins).
 * Mantiene el mismo estilo que ProductCard pero muestra un ícono +
 */
function AddProductCard({ onAddProduct = () => {} }) {
  const handleClick = () => {
    if (typeof onAddProduct === "function") {
      onAddProduct();
    }
  };

  return (
    <article
      className="card-producto add-product-card"
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
      <div className="add-product-icon">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="60"
            cy="60"
            r="58"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <line
            x1="60"
            y1="30"
            x2="60"
            y2="90"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="60"
            x2="90"
            y2="60"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <button
        type="button"
        className="btn-detalles"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }}
      >
        CREAR PRODUCTO
      </button>
    </article>
  );
}

export default AddProductCard;
