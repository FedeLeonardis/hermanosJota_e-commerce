import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const getCartCount = () => {
  const raw = localStorage.getItem("cart-count");
  const n = parseInt(raw || "0", 10);
  return Number.isNaN(n) ? 0 : n;
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCountState] = useState(getCartCount);

  const setCartCount = useCallback((newCount) => {
    const c = Math.max(0, Math.floor(Number(newCount) || 0));
    localStorage.setItem("cart-count", String(c));
    setCartCountState(c);
  }, []);

  const addToCart = useCallback(
    (quantity = 1) => {
      const quantityToAdd = Math.max(0, Math.floor(Number(quantity) || 0));

      const newCount = cartCount + quantityToAdd;

      setCartCount(newCount);
    },
    [cartCount, setCartCount]
  );

  const clearCart = useCallback(() => {
    localStorage.removeItem("cart-count");
    setCartCount(0);
  }, [setCartCount]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart-count") {
        setCartCountState(getCartCount());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
