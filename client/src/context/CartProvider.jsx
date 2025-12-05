import { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "../../auth/AuthContext";

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  // Función para obtener la clave del carrito del usuario
  const getCartKey = (userId) => {
    return userId ? `cart_user_${userId}` : "cart_guest";
  };

  // Inicializamos el carrito vacío primero
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Efecto para cargar el carrito cuando el usuario cambia (login/logout/mount)
  useEffect(() => {
    const cartKey = getCartKey(user?.id);
    try {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        // Si no hay carrito guardado para este usuario, empezar vacío
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error al cargar carrito del usuario:", error);
      setCartItems([]);
    }
    setIsLoaded(true);
  }, [user?.id]);

  // Cada vez que cambie el carrito (después de cargado), guardamos en localStorage
  useEffect(() => {
    if (!isLoaded) return; // No guardar hasta que hayamos cargado el carrito inicial
    
    const cartKey = getCartKey(user?.id);
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, user?.id, isLoaded]);

  // Función para agregar al carrito
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
