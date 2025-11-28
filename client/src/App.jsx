// import { useState, useEffect, useRef, useContext } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
//   useParams,
//   Navigate,
// } from "react-router-dom";

// // IMPORTACIONES DEL CONTEXTO
// import { AuthProvider } from "../auth/AuthProvider"; // Asegúrate que la ruta sea correcta
// import { AuthContext } from "../auth/AuthContext";

// // Componentes
// import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";
// import ProductDetail from "./components/ProductDetail.jsx";
// import Contacto from "./pages/Contacto.jsx";
// import HomePage from "./pages/HomePage.jsx";
// import Catalogo from "./pages/Catalogo.jsx";
// import FormProductoNuevo from "./pages/FormProductoNuevo.jsx";
// import RegisterPage from "./pages/RegisterPage.jsx";
// import LoginPage from "./pages/LoginPage.jsx";
// import UserProfile from "./pages/UserProfile.jsx";

// // Configuración de la API
// import { API_CONFIG } from "./config/api.js";

// const PRODUCTS_URL = API_CONFIG.ENDPOINTS.PRODUCTOS;

// // --- FUNCIÓN DE FETCH (Se mantiene igual, fuera del componente) ---
// const fetchProducts = async (setProductsState, productsRequestStatus) => {
//   if (productsRequestStatus.current === "loading") return;
//   productsRequestStatus.current = "loading";
//   setProductsState((prev) => ({ ...prev, status: "loading", error: null }));

//   try {
//     const response = await fetch(PRODUCTS_URL);
//     if (!response.ok) throw new Error(`Error ${response.status}`);
//     const data = await response.json();
//     productsRequestStatus.current = "done";
//     setProductsState((prev) => ({
//       ...prev,
//       status: "success",
//       list: Array.isArray(data) ? data : [],
//       error: null,
//     }));
//   } catch (error) {
//     console.error("Error al cargar productos:", error);
//     productsRequestStatus.current = "idle";
//     setProductsState((prev) => ({
//       ...prev,
//       status: "error",
//       list: [],
//       error: "Error al cargar los productos.",
//     }));
//   }
// };

// // ==================================================================
// // 1. COMPONENTE INTERNO: Contiene toda la lógica de tu aplicación
// // ==================================================================
// function AppContent() {
//   const { user, logout, login } = useContext(AuthContext);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Estados de productos y carrito
//   const [productsState, setProductsState] = useState({
//     status: "idle",
//     list: [],
//     error: null,
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [cartItems, setCartItems] = useState([]);
//   const productsRequestStatus = useRef("idle");

//   // ------------------------------------------------------------------
//   // Efectos de Carga
//   // ------------------------------------------------------------------

//   // 1. Carga inicial de productos
//   useEffect(() => {
//     if (productsRequestStatus.current === "idle") {
//       fetchProducts(setProductsState, productsRequestStatus);
//     }
//   }, []);

//   // 2. Control de scroll y título
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       if (!location.pathname.startsWith("/productos/")) {
//         document.title = "Hermanos Jota";
//       }
//       if (!location.pathname.startsWith("/productos")) {
//         setSearchQuery("");
//       }
//     }
//   }, [location.pathname]);

//   // ⚠️ NOTA SOBRE SESIÓN:
//   // Como ya tienes un AuthProvider, la lógica de 'useEffect' para check-session
//   // debería moverse idealmente DENTRO del AuthProvider en el futuro.
//   // Por ahora, si tu backend devuelve un token en check-session, podrías hacer:
//   /*
//   useEffect(() => {
//      // Lógica para recuperar sesión si refrescas la página
//      // Si usas cookies, el backend debe validar y quizás devolver el token de nuevo
//   }, []);
//   */

//   // ------------------------------------------------------------------
//   // Lógica de UI y Navegación
//   // ------------------------------------------------------------------
//   const products = productsState.list;
//   const isLoading =
//     productsState.status === "loading" || productsState.status === "idle";
//   const fetchError = productsState.error;
//   const cartCount = cartItems.length;

//   const normalizedSearch = searchQuery.trim().toLowerCase();
//   const filteredProducts = normalizedSearch
//     ? products.filter((producto) =>
//         producto?.nombre?.toLowerCase().includes(normalizedSearch)
//       )
//     : products;

//   const handleNavigate = (view) => {
//     let path;
//     switch (view) {
//       case "catalog":
//         path = "/productos";
//         break;
//       case "contact":
//         path = "/contacto";
//         break;
//       case "register":
//         path = "/registro";
//         break;
//       case "login":
//         path = "/iniciar-sesion";
//         break;
//       case "profile":
//         path = "/profile";
//         break;
//       default:
//         path = "/";
//         break;
//     }
//     navigate(path);
//   };

//   const showProductDetail = (producto) => {
//     if (!producto || !producto._id) return;
//     navigate(`/productos/${producto._id}`);
//   };

//   const handleBackToCatalog = () => navigate("/productos");

//   // Lógica Carrito
//   const handleAddToCart = (producto, quantity = 1) => {
//     if (!producto) return;
//     const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
//     const newEntries = Array(safeQuantity).fill({ ...producto });
//     setCartItems((prev) => [...prev, ...newEntries]);
//   };

//   const handleClearCart = () => setCartItems([]);

//   // Refrescar y Eliminar
//   const handleRefreshProducts = () => {
//     productsRequestStatus.current = "idle";
//     fetchProducts(setProductsState, productsRequestStatus);
//   };

//   const handleDeleteProduct = async (producto) => {
//     // ... (Tu lógica de borrado se mantiene igual, omitida por brevedad) ...
//     // Asegúrate de copiar tu lógica completa aquí si la modificaste
//   };

//   // Wrapper para Detalle
//   const ProductDetailWrapper = () => {
//     const { id } = useParams();
//     const [productDetail, setProductDetail] = useState({
//       status: "idle",
//       data: null,
//       error: null,
//     });

//     useEffect(() => {
//       if (!id) return;
//       const abortController = new AbortController();
//       const fetchProductDetail = async () => {
//         setProductDetail({ status: "loading", data: null, error: null });
//         try {
//           const response = await fetch(`${PRODUCTS_URL}/${id}`, {
//             signal: abortController.signal,
//           });
//           if (!response.ok) throw new Error(`Error ${response.status}`);
//           const data = await response.json();
//           setProductDetail({ status: "success", data: data, error: null });
//         } catch (error) {
//           if (error.name !== "AbortError") {
//             setProductDetail({
//               status: "error",
//               data: null,
//               error: "Error al cargar.",
//             });
//           }
//         }
//       };
//       fetchProductDetail();
//       return () => abortController.abort();
//     }, [id]);

//     if (productDetail.status === "loading")
//       return <div className="state-message">Cargando...</div>;
//     if (productDetail.error)
//       return (
//         <div className="state-message state-error">{productDetail.error}</div>
//       );
//     if (!productDetail.data)
//       return <div className="state-message">Producto no encontrado.</div>;

//     return (
//       <ProductDetail
//         key={productDetail.data._id}
//         producto={productDetail.data}
//         onBack={handleBackToCatalog}
//         onAddToCart={handleAddToCart}
//         onDelete={handleDeleteProduct}
//         currentUser={user} // 👈 Pasamos 'user' del contexto
//       />
//     );
//   };

//   // Manejo de Login y Logout
//   const onLoginSuccess = (tokenData) => {
//     // Aquí asumimos que tu LoginPage devuelve el token o los datos que login() espera
//     login(tokenData);
//     navigate("/");
//   };

//   const handleLogoutClick = () => {
//     logout(); // Usamos la función del contexto
//     navigate("/iniciar-sesion");
//   };

//   // ------------------------------------------------------------------
//   // RENDERIZADO (RUTAS)
//   // ------------------------------------------------------------------
//   return (
//     <>
//       <Header
//         onNavigate={handleNavigate}
//         activeView={
//           location.pathname === "/"
//             ? "home"
//             : location.pathname === "/contacto"
//             ? "contact"
//             : location.pathname.startsWith("/productos")
//             ? "catalog"
//             : ""
//         }
//         cartCount={cartCount}
//         onClearCart={handleClearCart}
//         currentUser={user} // 👈 Del contexto
//         onLogout={handleLogoutClick}
//       />
//       <div className="page-shell">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <HomePage
//                 onSelectProduct={showProductDetail}
//                 productos={products}
//                 isLoading={isLoading}
//                 error={fetchError}
//               />
//             }
//           />
//           <Route
//             path="/productos"
//             element={
//               <Catalogo
//                 productos={filteredProducts}
//                 isLoading={isLoading}
//                 error={fetchError}
//                 onSelectProduct={showProductDetail}
//                 searchQuery={searchQuery}
//                 onSearchChange={setSearchQuery}
//               />
//             }
//           />
//           <Route path="/productos/:id" element={<ProductDetailWrapper />} />
//           <Route path="/contacto" element={<Contacto />} />

//           {/* RUTAS PROTEGIDAS USANDO 'user' */}
//           <Route
//             path="/admin/crear-producto"
//             element={
//               user ? ( // Si hay usuario logueado, redirigir (o permitir si es admin)
//                 // Aquí parece que querías que si ESTÁ logueado NO pueda crear?
//                 // O quizás es al revés: solo si es admin. Asumo protección básica:
//                 <Navigate to="/" />
//               ) : (
//                 <FormProductoNuevo onProductCreated={handleRefreshProducts} />
//               )
//             }
//           />

//           <Route
//             path="/registro"
//             element={user ? <Navigate to="/" replace /> : <RegisterPage />}
//           />

//           <Route
//             path="/iniciar-sesion"
//             element={
//               user ? (
//                 <Navigate to="/" replace />
//               ) : (
//                 <LoginPage onLoginSuccess={onLoginSuccess} />
//               )
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               user ? (
//                 <UserProfile currentUser={user} />
//               ) : (
//                 <Navigate to="/iniciar-sesion" />
//               )
//             }
//           />

//           <Route
//             path="*"
//             element={
//               <div className="state-message">404 | Página no encontrada.</div>
//             }
//           />
//         </Routes>
//       </div>
//       <Footer />
//     </>
//   );
// }

// // ==================================================================
// // 2. COMPONENTE APP PRINCIPAL (WRAPPER)
// // ==================================================================
// function App() {
//   return (
//     <AuthProvider>
//       {/* Si tu entorno Canvas ya provee Router, usa solo AppContent.
//            Si no, descomenta BrowserRouter */}
//       {/* <BrowserRouter> */}
//       <AppContent />
//       {/* </BrowserRouter> */}
//     </AuthProvider>
//   );
// }

// export default App;

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

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Contacto from "./pages/Contacto.jsx";
import HomePage from "./pages/HomePage.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import FormProductoNuevo from "./pages/FormProductoNuevo.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UserProfile from "./pages/UserProfile.jsx";

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
  const { user, logout, login } = useContext(AuthContext);
  // Consumimos el contexto del carrito
  const { cartCount, addToCart, clearCart } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  // Estados de productos (Data fetching se mantiene local)
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

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((producto) =>
        producto?.nombre?.toLowerCase().includes(normalizedSearch)
      )
    : products;

  const handleNavigate = (view) => {
    let path;
    switch (view) {
      case "catalog":
        path = "/productos";
        break;
      case "contact":
        path = "/contacto";
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

    return (
      <ProductDetail
        key={productDetail.data._id}
        producto={productDetail.data}
        onBack={handleBackToCatalog}
        onAddToCart={addToCart}
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
              />
            }
          />
          <Route path="/productos/:id" element={<ProductDetailWrapper />} />
          <Route path="/contacto" element={<Contacto />} />

          <Route
            path="/admin/crear-producto"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <FormProductoNuevo onProductCreated={handleRefreshProducts} />
              )
            }
          />

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

          <Route
            path="/profile"
            element={
              user ? (
                <UserProfile currentUser={user} />
              ) : (
                <Navigate to="/iniciar-sesion" />
              )
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
