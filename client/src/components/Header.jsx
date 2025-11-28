import React, { useState } from "react";
import "../css/header.css";

const Header = ({
  onNavigate = () => {},
  activeView = "home",
  cartCount = 0,
  onClearCart = () => {},
  currentUser = null,
  onLogout = () => {},
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

  const handleCheckout = (e) => {
    e.stopPropagation(); // Evita que se cierre el popup antes de tiempo

    if (onNavigate) {
      onNavigate("cart");
    } else {
      console.error("ERROR: La función onNavigate no está llegando al Header");
    }

    toggleCartPopup(false);
  };

  // Devuelve un handler parametrizable por vista.
  const handleNavClick = (view) => (e) => {
    e.preventDefault();
    onNavigate(view);
  };

  const handleLogoutClick = () => {
    onLogout();
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

          {currentUser ? (
            <>
              <button
                type="button"
                className={isActive("profile") ? "active" : ""}
                onClick={handleNavClick("profile")}
              >
                PERFIL
              </button>
              <button type="button" onClick={handleLogoutClick}>
                LOGOUT{" "}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={isActive("register") ? "active" : ""}
                onClick={handleNavClick("register")}
              >
                REGISTRO
              </button>
              <button
                type="button"
                className={isActive("login") ? "active" : ""}
                onClick={handleNavClick("login")}
              >
                ACCEDER
              </button>
            </>
          )}
        </nav>

        {/* Si quieres que el ícono del carrito también se ilumine cuando estás 
            en la página del carrito, puedes agregar la clase condicional aquí:
            className={`cart ${isPopupOpen ? "open" : ""} ${isActive("cart") ? "active" : ""}`}
            (Dependiendo de si tu CSS tiene estilos para .cart.active)
        */}
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
              Ver carrito
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
