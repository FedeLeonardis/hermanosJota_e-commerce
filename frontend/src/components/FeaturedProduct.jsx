import React from "react";
import ProductCard from "./ProductCard.jsx";
import { productos } from "../data.js";

const FeaturedProducts = () => {
  const featuredIds = [12, 9, 4];

  const featuredItems = productos.filter((producto) =>
    featuredIds.includes(producto.id)
  );

  return (
    <div className="productos-grid-destacados">
      {featuredItems.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
};

export default FeaturedProducts;
