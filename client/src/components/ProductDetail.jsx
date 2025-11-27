import React, { useState } from "react";
import { getImageUrl } from "../config/api.js";
import "../css/producto.css";

/**
 * Vista de detalle para un producto específico.
 * Controla selección de cantidad, feedback visual y agrega productos al carrito.
 */
const ProductDetail = ({
  producto,
  onBack = () => {},
  onAddToCart = () => {},
  onDelete = () => {},
  currentUser = null,
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!producto) {
    return (
      <div className="containerProd">
        <p>Seleccioná un producto para ver los detalles.</p>
      </div>
    );
  }

  const { nombre, descripcion, precio, features, imagenUrl } = producto;
  const titulo = nombre;
  const subtitulo = "Madera de autor · Hecho a mano";
  const stock = 10;

  // Mantiene la cantidad dentro del rango permitido por la UX.
  const handleCantidadChange = (e) => {
    const nuevaCantidad = Math.min(Math.max(1, parseInt(e.target.value)), 10);
    setCantidad(nuevaCantidad);
  };

  // Agrega al carrito y dispara animaciones transitorias.
  const handleAgregarCarrito = () => {
    onAddToCart(producto, cantidad);
    setFeedback("Agregado ✔");
    setIsAnimating(true);
    setTimeout(() => setFeedback(""), 2000);
    setTimeout(() => setIsAnimating(false), 150);
  };

  // Al mostrar feedback se realza la etiqueta de stock brevemente.
  const feedbackStyle = feedback
    ? {
        backgroundColor: "var(--sage-green)",
        color: "#fff",
        transition: "background-color 0.15s",
      }
    : {};

  // Maneja la confirmación de eliminación
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(producto);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="containerProd">
      <nav className="breadcrumbs" aria-label="migas">
        <button type="button" onClick={onBack} className="breadcrumb-back">
          ← Volver al catálogo
        </button>
      </nav>

      <article className="product">
        <section className="gallery" aria-label="Galería de producto">
          <div className="gallery-container">
            <img
              id="imgPrincipal"
              className="gallery-media"
              src={getImageUrl(imagenUrl)}
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

          {/* Modal de confirmación de eliminación */}
          {showDeleteConfirm && (
            <div className="delete-confirm-modal">
              <div className="delete-confirm-content">
                <p>¿Estás seguro de que deseas eliminar este producto?</p>
                <div className="delete-confirm-buttons">
                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelDelete}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          {currentUser?.roles?.includes("admin") && (
            <div className="admin-actions">
              <button
                className="btn-eliminar-producto"
                onClick={handleDeleteClick}
              >
                Eliminar Producto
              </button>
            </div>
          )}

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
    </div>
  );
};

export default ProductDetail;
