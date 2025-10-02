import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productos } from "../data.js";
import { useCart } from "../context/CartContext";
import "../css/producto.css";

const ProductDetail = () => {
  const { id } = useParams();

  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const productoEncontrado = productos.find((p) => p.id === parseInt(id));

    if (productoEncontrado) {
      setProducto(productoEncontrado);
      document.title = `HJ — ${productoEncontrado.nombre}`;
    } else {
      console.error(`Producto con ID ${id} no encontrado.`);
    }
    setFeedback("");
    setCantidad(1);
  }, [id]);

  if (!producto) {
    return <main className="container">Cargando detalles del producto...</main>;
  }

  const { nombre, descripcion, precio, features, img } = producto;

  const titulo = nombre;
  const subtitulo = "Madera de autor · Hecho a mano";
  const stock = 10;

  const handleCantidadChange = (e) => {
    const nuevaCantidad = Math.min(Math.max(1, parseInt(e.target.value)), 10);
    setCantidad(nuevaCantidad);
  };

  const handleAgregarCarrito = () => {
    addToCart(cantidad);

    setFeedback("Agregado ✔");

    setIsAnimating(true);

    setTimeout(() => {
      setFeedback("");
    }, 2000);

    setTimeout(() => {
      setIsAnimating(false);
    }, 150);
  };

  const feedbackStyle = feedback
    ? {
        backgroundColor: "var(--sage-green)",
        color: "#fff",
        transition: "background-color 0.15s",
      }
    : {};

  return (
    <main className="container">
      <nav className="breadcrumbs" aria-label="migas">
        <Link to="/">Inicio</Link> · <Link to="/productos">Catálogo</Link> ·
        <span id="bcProducto">{titulo}</span>
      </nav>

      <article className="product">
        <section className="gallery" aria-label="Galería de producto">
          <div className="gallery-container">
            <img
              id="imgPrincipal"
              className="gallery-media"
              src={img}
              alt={titulo}
              loading="lazy"
            />
          </div>
          <div className="thumbs" aria-hidden="true">
            <div className="thumb"></div>
            <div className="thumb"></div>
            <div className="thumb"></div>
          </div>
        </section>

        <aside className="panel">
          <h1 className="title" id="titulo">
            {titulo}
          </h1>
          <p className="subtitle" id="subtitulo">
            {subtitulo}
          </p>
          <div className="price-row">
            <div className="price" id="precio">
              <span>$</span>
              <span id="precioVal">{precio.toFixed(2)}</span>
            </div>
            <span
              className={`badge ${stock > 0 ? "stock-ok" : "stock-cero"}`}
              id="estadoStock"
              style={feedbackStyle}
            >
              {feedback || (stock > 0 ? "Stock disponible" : "Sin stock")}
            </span>
          </div>

          <p id="descripcion">{descripcion}</p>

          <div className="cta">
            <div className="quantity-selector">
              <label htmlFor="cantidad" className="quantity-label">
                Cantidad:
              </label>
              <input
                type="number"
                id="cantidad"
                className="quantity-input"
                min="1"
                max="10"
                value={cantidad}
                onChange={handleCantidadChange}
                disabled={stock === 0}
              />
            </div>
            <button
              className={`btn btn-primary ${isAnimating ? "btn-adding" : ""}`}
              id="btnAgregar"
              onClick={handleAgregarCarrito}
              disabled={stock === 0}
            >
              Añadir al carrito
            </button>
          </div>

          <div className="divider"></div>

          <div className="features" id="features">
            {features && (
              <table className="features-table">
                <tbody>
                  {Object.entries(features).map(([key, value]) => (
                    <tr key={key}>
                      <td className="feature-label">{key.toUpperCase()}</td>
                      <td className="feature-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </aside>
      </article>
    </main>
  );
};

export default ProductDetail;
