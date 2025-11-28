import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../../auth/AuthContext";
import { API_CONFIG, getImageUrl } from "../config/api";
import "../css/nuevo-producto.css";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, addToCart } =
    useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Agrupar productos (Si agregaste 3 veces la misma silla, mostramos "Silla x3")
  const cartGrouped = useMemo(() => {
    const groups = {};
    cartItems.forEach((item) => {
      if (!groups[item._id]) {
        groups[item._id] = { ...item, cantidad: 0 };
      }
      groups[item._id].cantidad += 1;
    });
    return Object.values(groups);
  }, [cartItems]);

  // 2. Calcular Total
  const total = cartItems.reduce(
    (acc, item) => acc + (Number(item.precio) || 0),
    0
  );

  // 3. Función para finalizar compra
  const handleCheckout = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar un pedido.");
      navigate("/iniciar-sesion");
      return;
    }

    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      // Preparamos los datos del pedido para el backend
      const orderData = {
        items: cartGrouped.map((p) => ({
          productoId: p._id,
          cantidad: p.cantidad,
          precioUnitario: p.precio,
        })),
        total: total,
      };

      // PETICIÓN PROTEGIDA CON JWT
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 Aquí va la seguridad
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("¡Pedido realizado con éxito! Gracias por tu compra.");
        clearCart(); // Vaciamos el carrito automáticamente
        navigate("/"); // Volvemos al inicio o a una página de "Mis Pedidos"
      } else {
        const errorData = await response.json();
        alert(
          `Error al procesar pedido: ${
            errorData.message || "Intente nuevamente"
          }`
        );
      }
    } catch (error) {
      console.error("Error checkout:", error);
      alert("Hubo un problema de conexión al procesar tu pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div
        className="container-global"
        style={{
          textAlign: "center",
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          minHeight: "60vh",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            margin: 0,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Tu carrito está vacío 🛒
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#666",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ¡Agrega algunos productos increíbles de nuestro catálogo!
        </p>
        <button
          className="btn"
          onClick={() => navigate("/productos")}
          style={{ marginTop: "10px", padding: "10px 30px", width: "20%" }}
        >
          Ir al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="container-global">
      <div className="container">
        <h1>Tu Carrito de Compras</h1>

        <div className="cart-list" style={{ marginTop: "20px" }}>
          {cartGrouped.map((producto) => (
            <div
              key={producto._id}
              className="cart-item"
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                padding: "15px 0",
                gap: "20px",
              }}
            >
              {/* Imagen */}
              <div style={{ width: "80px", height: "80px", flexShrink: 0 }}>
                {/* NUEVO BLOQUE CORREGIDO */}
                <img
                  // CAMBIO AQUÍ: Usamos 'imagenUrl' que es como viene de tu MongoDB
                  src={getImageUrl(producto.imagenUrl || producto.imagen)}
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Error";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "1.2rem",
                  }}
                >
                  {producto.nombre}
                </h3>
                <p style={{ margin: 0, color: "#666" }}>
                  Precio unitario: ${producto.precio}
                </p>
              </div>

              {/* Controles de Cantidad */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <button
                  className="btn-secondary"
                  style={{ padding: "5px 10px" }}
                  onClick={() => removeFromCart(producto._id)}
                  title="Eliminar uno"
                >
                  -
                </button>
                <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  {producto.cantidad}
                </span>
                <button
                  className="btn-secondary"
                  style={{ padding: "5px 10px" }}
                  onClick={() => addToCart(producto)}
                  title="Agregar uno"
                >
                  +
                </button>
              </div>

              {/* Subtotal Item */}
              <div
                style={{
                  fontWeight: "bold",
                  minWidth: "80px",
                  textAlign: "right",
                }}
              >
                ${(producto.precio * producto.cantidad).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen Final */}
        <div
          className="cart-summary"
          style={{
            marginTop: "30px",
            textAlign: "right",
            borderTop: "2px solid #333",
            paddingTop: "20px",
          }}
        >
          <h2
            style={{ fontFamily: "Inter, sans-serif", fontSize: "1.5rem" }}
          >{`Total a Pagar: $${total.toFixed(2)}`}</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <button
              className="btn btn-danger"
              style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
              onClick={clearCart}
            >
              Vaciar Carrito
            </button>

            {user ? (
              <button
                className="btn"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Finalizar Compra"}
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <button
                  className="btn"
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                >
                  Finalizar Compra
                </button>
                <small style={{ color: "red", marginTop: "5px" }}>
                  * Inicia sesión para comprar
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
