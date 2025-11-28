import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  // Inicializamos el carrito leyendo del localStorage si existe
  // Esto hace que el carrito no se borre si recargas la página 😉
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Cada vez que cambie el carrito, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para agregar al carrito (Tu lógica original mejorada)
  const addToCart = (producto, quantity = 1) => {
    if (!producto) return;

    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    // Creamos X copias del producto según la cantidad
    const newEntries = Array(safeQuantity).fill({ ...producto });

    setCartItems((prev) => [...prev, ...newEntries]);

    // Opcional: Un pequeño log para saber que funcionó
    console.log(`🛒 Agregado: ${safeQuantity} x ${producto.nombre}`);
  };

  // Función para vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Función para remover un ítem específico (por si la necesitas a futuro)
  // Elimina la primera coincidencia de ese ID (si tienes 3 sillas, borra 1)
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item._id === productId);
      if (index === -1) return prev; // No encontrado

      const newCart = [...prev];
      newCart.splice(index, 1); // Elimina 1 elemento en el índice encontrado
      return newCart;
    });
  };

  // Datos derivados útiles
  const cartCount = cartItems.length;

  // Calcular total (asumiendo que tus productos tienen campo 'precio')
  const cartTotal = cartItems.reduce(
    (total, item) => total + (Number(item.precio) || 0),
    0
  );

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
