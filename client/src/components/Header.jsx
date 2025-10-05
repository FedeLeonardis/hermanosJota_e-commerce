import React, { useState } from "react";
import "../css/header.css";

/**
 * Encabezado principal con navegación básica y popup del carrito.
 * Las acciones se delegan al componente padre mediante callbacks.
 */
const Header = ({
  onNavigate = () => {},
  activeView = "home",
  cartCount = 0,
  onClearCart = () => {},
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Permite abrir/cerrar el popup manualmente o en modo toggle.
  const toggleCartPopup = (open) => {
    if (typeof open === "boolean") {
      setIsPopupOpen(open);
      return;
    }
    setIsPopupOpen((prev) => !prev);
  };

  // Vacía el carrito sin cerrar el menú abruptamente por propagación del click.
  const handleClearCart = (e) => {
    e.stopPropagation();
    onClearCart();
    toggleCartPopup(false);
  };

  // Placeholder para futura integración con checkout real.
  const handleCheckout = (e) => {
    e.stopPropagation();
    console.log("Finalizar compra - funcionalidad pendiente");
    toggleCartPopup(false);
  };

  // Devuelve un handler parametrizable por vista.
  const handleNavClick = (view) => (e) => {
    e.preventDefault();
    onNavigate(view);
  };

  const isActive = (view) => activeView === view;

  return (
    <div className="main-header-wrapper">
      <header className="main-header">
      <button
        type="button"
        className="recuadro-logo"
        onClick={handleNavClick("home")}
      >
        <img
          className="logo"
          src="/assets/img/logo/logo.svg"
          alt="logo Hnos Jota"
        />
      </button>

      <nav className="menu-navegacion">
        <button
          type="button"
          className={isActive("home") ? "active" : ""}
          onClick={handleNavClick("home")}
        >
          INICIO
        </button>
        <button
          type="button"
          className={isActive("catalog") ? "active" : ""}
          onClick={handleNavClick("catalog")}
        >
          PRODUCTOS
        </button>
        <button
          type="button"
          className={isActive("contact") ? "active" : ""}
          onClick={handleNavClick("contact")}
        >
          CONTACTO
        </button>
      </nav>

      <div
        className={`cart ${isPopupOpen ? "open" : ""}`}
        onClick={() => toggleCartPopup()}
      >
        <img
          className="icono-carro"
          src="/assets/img/icons/carrito.svg"
          alt="Carrito"
        />

        <span id="cart-count">{cartCount}</span>

        <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
          <button
            id="clear-cart"
            type="button"
            className="popup-btn"
            onClick={handleClearCart}
          >
            Vaciar carrito
          </button>
          <button
            id="checkout"
            type="button"
            className="popup-btn"
            onClick={handleCheckout}
          >
            Finalizar compra
          </button>
        </div>
      </div>
      </header>
    </div>
  );
};

export default Header;
