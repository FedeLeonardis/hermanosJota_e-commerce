import { useState, useEffect, useRef, useContext } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "../auth/AuthProvider";
import { AuthContext } from "../auth/AuthContext";
import { CartProvider } from "./context/CartProvider";
import { CartContext } from "./context/CartContext";

// Componentes
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Contacto from "./pages/Contacto.jsx";
import HomePage from "./pages/HomePage.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import FormProductoNuevo from "./pages/FormProductoNuevo.jsx";
import FormProductoEdit from "./pages/FormProductoEdit.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import CartPage from "./pages/CartPage.jsx";

import { API_CONFIG } from "./config/api.js";

const PRODUCTS_URL = API_CONFIG.ENDPOINTS.PRODUCTOS;

const fetchProducts = async (setProductsState, productsRequestStatus) => {
  if (productsRequestStatus.current === "loading") return;
  productsRequestStatus.current = "loading";
  setProductsState((prev) => ({ ...prev, status: "loading", error: null }));

  try {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    productsRequestStatus.current = "done";
    setProductsState((prev) => ({
      ...prev,
      status: "success",
      list: Array.isArray(data) ? data : [],
      error: null,
    }));
  } catch (error) {
    console.error("Error al cargar productos:", error);
    productsRequestStatus.current = "idle";
    setProductsState((prev) => ({
      ...prev,
      status: "error",
      list: [],
      error: "Error al cargar los productos.",
    }));
  }
};

function AppContent() {
  const { user, logout, login, token } = useContext(AuthContext);
  const { cartCount, addToCart, clearCart } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [productsState, setProductsState] = useState({
    status: "idle",
    list: [],
    error: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const productsRequestStatus = useRef("idle");

  useEffect(() => {
    if (productsRequestStatus.current === "idle") {
      fetchProducts(setProductsState, productsRequestStatus);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (!location.pathname.startsWith("/productos/")) {
        document.title = "Hermanos Jota";
      }
      if (!location.pathname.startsWith("/productos")) {
        setSearchQuery("");
      }
    }
  }, [location.pathname]);

  const products = productsState.list;
  const isLoading =
    productsState.status === "loading" || productsState.status === "idle";
  const fetchError = productsState.error;

  // Función para forzar recarga de productos
  const refetchProducts = () => {
    productsRequestStatus.current = "idle";
    fetchProducts(setProductsState, productsRequestStatus);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((producto) =>
        producto?.nombre?.toLowerCase().includes(normalizedSearch)
      )
    : products;

  const handleNavigate = (view) => {
    console.log("Navegando a:", view); // <--- AGREGA ESTO
    let path;
    switch (view) {
      case "catalog":
        path = "/productos";
        break;
      case "contact":
        path = "/contacto";
        break;
      // 2. CASO DE NAVEGACIÓN AGREGADO
      case "cart":
        console.log("Entró en el case CART"); // <--- AGREGA ESTO
        path = "/carrito";
        break;
      case "register":
        path = "/registro";
        break;
      case "login":
        path = "/iniciar-sesion";
        break;
      case "profile":
        path = "/profile";
        break;
      default:
        path = "/";
        break;
    }
    navigate(path);
  };

  const showProductDetail = (producto) => {
    if (!producto || !producto._id) return;
    navigate(`/productos/${producto._id}`);
  };

  const handleBackToCatalog = () => navigate("/productos");

  const handleRefreshProducts = () => {
    productsRequestStatus.current = "idle";
    fetchProducts(setProductsState, productsRequestStatus);
  };

  const ProductDetailWrapper = () => {
    const { id } = useParams();
    const [productDetail, setProductDetail] = useState({
      status: "idle",
      data: null,
      error: null,
    });

    useEffect(() => {
      if (!id) return;
      const abortController = new AbortController();
      const fetchProductDetail = async () => {
        setProductDetail({ status: "loading", data: null, error: null });
        try {
          const response = await fetch(`${PRODUCTS_URL}/${id}`, {
            signal: abortController.signal,
          });
          if (!response.ok) throw new Error(`Error ${response.status}`);
          const data = await response.json();
          setProductDetail({ status: "success", data: data, error: null });
        } catch (error) {
          if (error.name !== "AbortError") {
            setProductDetail({
              status: "error",
              data: null,
              error: "Error al cargar.",
            });
          }
        }
      };
      fetchProductDetail();
      return () => abortController.abort();
    }, [id]);

    if (productDetail.status === "loading")
      return <div className="state-message">Cargando...</div>;
    if (productDetail.error)
      return (
        <div className="state-message state-error">{productDetail.error}</div>
      );
    if (!productDetail.data)
      return <div className="state-message">Producto no encontrado.</div>;

    const handleDeleteProduct = async (producto) => {
      if (!token) {
        alert("Debes iniciar sesión para eliminar productos");
        return;
      }

      try {
        const response = await fetch(`${PRODUCTS_URL}/${producto._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }

        alert(`Producto "${producto.nombre}" eliminado exitosamente`);
        // Forzar recarga de productos antes de navegar
        refetchProducts();
        navigate("/productos");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar el producto");
      }
    };

    return (
      <ProductDetail
        key={productDetail.data._id}
        producto={productDetail.data}
        onBack={handleBackToCatalog}
        onAddToCart={addToCart}
        onDelete={handleDeleteProduct}
        onEdit={(producto) => navigate(`/productos/${producto._id}/editar`)}
        currentUser={user}
      />
    );
  };

  const onLoginSuccess = (tokenData) => {
    login(tokenData);
    navigate("/");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  return (
    <>
      <Header
        onNavigate={handleNavigate}
        activeView={
          location.pathname === "/"
            ? "home"
            : location.pathname === "/contacto"
            ? "contact"
            : location.pathname.startsWith("/productos")
            ? "catalog"
            : location.pathname === "/carrito"
            ? "cart" // Se asegura de marcar activo el carrito si la ruta coincide
            : ""
        }
        cartCount={cartCount}
        onClearCart={clearCart}
        currentUser={user}
        onLogout={handleLogoutClick}
      />
      <div className="page-shell">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onSelectProduct={showProductDetail}
                productos={products}
                isLoading={isLoading}
                error={fetchError}
              />
            }
          />
          <Route
            path="/productos"
            element={
              <Catalogo
                productos={filteredProducts}
                isLoading={isLoading}
                error={fetchError}
                onSelectProduct={showProductDetail}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentUser={user}
                onAddProduct={() => navigate("/nuevo-producto")}
              />
            }
          />
          <Route path="/productos/:id" element={<ProductDetailWrapper />} />

          {/* Ruta protegida - Editar producto (solo admin) */}
          <Route
            path="/productos/:id/editar"
            element={
              <ProtectedRoute>
                <FormProductoEdit onProductUpdated={handleRefreshProducts} />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida - Crear producto (solo admin) */}
          <Route
            path="/nuevo-producto"
            element={
              <ProtectedRoute>
                <FormProductoNuevo onProductCreated={handleRefreshProducts} />
              </ProtectedRoute>
            }
          />

          {/* Ruta del carrito */}
          <Route path="/carrito" element={<CartPage />} />

          <Route path="/contacto" element={<Contacto />} />

          <Route
            path="/registro"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />

          <Route
            path="/iniciar-sesion"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLoginSuccess={onLoginSuccess} />
              )
            }
          />

          {/* Ruta protegida - Perfil de usuario */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile currentUser={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="state-message">404 | Página no encontrada.</div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
