import React from "react";
import ProductCard from "./ProductCard.jsx";
import { productos } from "../data.js";

/**
 * Muestra una selección fija de productos destacados.
 * Utiliza la fuente de datos local como fallback para no depender del backend en el home.
 */
const FeaturedProducts = ({ onSelectProduct = () => {} }) => {
  // IDs elegidos para destacar productos de distintas categorías.
  const featuredIds = [12, 9, 4];

  const featuredItems = productos.filter((producto) =>
    featuredIds.includes(producto.id)
  );

  return (
    <div className="productos-grid-destacados">
      {featuredItems.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
};

export default FeaturedProducts;
