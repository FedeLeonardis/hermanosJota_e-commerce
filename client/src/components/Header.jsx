import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 👈 CRUCIAL: Importar el hook
import "../css/header.css";

const Header = () => {
  const { cartCount, clearCart } = useCart();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const cartRef = useRef(null);

  const toggleCartPopup = useCallback((open) => {
    if (typeof open === "boolean") {
      setIsPopupOpen(open);
    } else {
      setIsPopupOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isPopupOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        toggleCartPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen, toggleCartPopup]);

  const handleClearCart = (e) => {
    e.stopPropagation();
    clearCart();
    toggleCartPopup(false);
  };

  const handleCheckout = (e) => {
    e.stopPropagation();
    console.log("Finalizar compra - funcionalidad pendiente");
    toggleCartPopup(false);
  };

  return (
    <header className="main-header">
      <Link to="/" className="recuadro-logo">
        <img
          className="logo"
          src="/assets/img/logo/logo.svg"
          alt="logo Hnos Jota"
        />
      </Link>

      <nav className="menu-navegacion">
        <Link to="/">INICIO</Link>
        <Link to="/productos">PRODUCTOS</Link>
        <Link to="/contacto">CONTACTO</Link>

        <div
          ref={cartRef}
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
      </nav>
    </header>
  );
};

export default Header;
