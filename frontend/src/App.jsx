import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Catalogo from "./components/Catalogo.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import HomePage from "./components/HomePage.jsx";
import "./css/reset.css";
import "./css/variables.css";
import "./css/global.css";

const ContactPage = () => <h1>Formulario de Contacto 💬</h1>;

function App() {
  return (
    <CartProvider>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/productos" element={<Catalogo />} />

          <Route path="/productos/:id" element={<ProductDetail />} />

          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/" element={<HomePage />} />

          <Route path="*" element={<h2>Error 404: Página no encontrada</h2>} />
        </Routes>
      </main>

      <Footer />
    </CartProvider>
  );
}

export default App;
