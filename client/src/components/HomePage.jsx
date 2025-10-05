import React from "react";
import FeaturedProduct from "./FeaturedProduct.jsx";
import "../css/reset.css";
import "../css/variables.css";
import "../css/global.css";
import "../css/index.css";

// Página de inicio con hero principal y listado de destacados.
const HomePage = ({ onSelectProduct }) => {
  return (
    <div className="page-home">
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

        <FeaturedProduct onSelectProduct={onSelectProduct} />
      </section>
    </div>
  );
};

export default HomePage;
