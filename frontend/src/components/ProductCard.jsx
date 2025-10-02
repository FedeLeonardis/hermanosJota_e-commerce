import React from "react";
import { Link } from "react-router-dom";

import "../css/productos.css";
import "../css/variables.css";
import "../css/global.css";

function ProductCard({ producto }) {
  const productDetailPath = `/productos/${producto.id}`;

  return (
    <Link className="link-producto" to={productDetailPath}>
      <img className="img-producto" src={producto.img} alt={producto.nombre} />
      <h2 className="nombre-producto">{producto.nombre}</h2>
      <h3 className="precio-producto">
        ${producto.precio.toLocaleString("es-AR")}
      </h3>
      <button className="btn-detalles">VER DETALLES</button>
    </Link>
  );
}

export default ProductCard;
