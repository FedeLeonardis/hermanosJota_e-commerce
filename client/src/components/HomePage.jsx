import React from "react";
import FeaturedProduct from "./FeaturedProduct.jsx";

import "../css/reset.css";
import "../css/variables.css";
import "../css/global.css";
import "../css/index.css";

// Página de inicio con hero principal y listado de destacados.
const HomePage = ({
  onSelectProduct,
  productos = [],
  isLoading = false,
  error = null,
}) => {
  return (
    <div className="page-home">
      {/* Hero introductorio con claim de marca */}
      <section className="hero-banner" aria-label="Taller Hermanos Jota">
        <div className="hero-banner__overlay">
          <div className="hero-banner__quote-box">
            <h1 className="hero-banner__quote">
              “Cada pieza cuenta la historia de manos expertas y materiales nobles”
            </h1>
            <p className="hero-banner__author">— Hnos Jota</p>
          </div>
        </div>
      </section>

      <hr />

      <section className="productos-destacados">
        <h2 className="subtitulo">Productos Destacados</h2>

        {/* Mensajes de estado según el resultado del fetch */}
        {isLoading && (
          <p className="state-message">Cargando productos destacados...</p>
        )}

        {!isLoading && error && (
          <p className="state-message state-error">{error}</p>
        )}

        {/* Renderiza las tarjetas sólo cuando hay productos disponibles */}
        {!isLoading && !error && (
          <FeaturedProduct
            productos={productos}
            onSelectProduct={onSelectProduct}
          />
        )}
      </section>
    </div>
  );
};

export default HomePage;
