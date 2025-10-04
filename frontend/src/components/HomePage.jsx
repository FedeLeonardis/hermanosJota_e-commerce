import React from "react";
import FeaturedProduct from "./FeaturedProduct.jsx";
import "../css/reset.css";
import "../css/variables.css";
import "../css/global.css";
import "../css/index.css";

const HomePage = () => {
  return (
    <main>
      <div className="hero-banner">
        <div className="texto-banner">
          <h1>
            “cxzcCada pieza cuenta la historia de manos expertas y materiales
            nobles”
          </h1>
          <p>-Hnos Jota</p>
        </div>
      </div>

      <hr />

      <section className="productos-destacados">
        <h2 className="subtitulo">Productos Destacados</h2>

        <FeaturedProduct />
      </section>
    </main>
  );
};

export default HomePage;
