import React from "react";
import ProductCard from "./ProductCard.jsx";

/**
 * Muestra una selección fija de productos destacados basada en los datos del backend.
 * Recibe el listado completo y filtra por IDs definidos en `featuredIds`.
 */
const FeaturedProducts = ({ productos = [], onSelectProduct = () => {} }) => {
  // IDs elegidos para destacar productos de distintas categorías.
  const featuredIds = [12, 8, 4];

  const featuredItems = productos.filter((producto) =>
    featuredIds.includes(producto.id)
  );

  // Si el backend no devuelve los IDs deseados mostramos estado vacío en el home.
  if (featuredItems.length === 0) {
    return (
      <p className="state-message">
        Aún no hay productos destacados disponibles.
      </p>
    );
  }

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
