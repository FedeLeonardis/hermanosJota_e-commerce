import { useState, useEffect, useRef } from "react";
// 🛠️ Importamos useParams de React Router para obtener el ID de la URL
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";

// Componentes de alto nivel que componen cada vista de la aplicación.
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Contacto from "./pages/Contacto.jsx";
import HomePage from "./pages/HomePage.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import FormProductoNuevo from "./pages/FormProductoNuevo.jsx";

// Configuración de la API
import { API_CONFIG } from "./config/api.js";

// Endpoint base del backend que expone el catálogo.
const PRODUCTS_URL = API_CONFIG.ENDPOINTS.PRODUCTOS;

/**
 * Función para cargar productos. Usa el estado de React internamente.
 */
const fetchProducts = async (setProductsState, productsRequestStatus) => {
  if (productsRequestStatus.current === "loading") {
    return;
  }

  productsRequestStatus.current = "loading";

  setProductsState((prev) => ({
    ...prev,
    status: "loading",
    error: null,
  }));

  try {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
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
      error:
        "Error al cargar los productos. Intenta nuevamente en unos minutos.",
    }));
  }
};


function App() {
  // Estado derivado del fetch de productos.
  const [productsState, setProductsState] = useState({
    status: "idle",
    list: [],
    error: null,
  });
  // Controla el texto del buscador de catálogo.
  const [searchQuery, setSearchQuery] = useState("");
  // Items agregados al carrito.
  const [cartItems, setCartItems] = useState([]);

  // Usamos useRef para mantener el estado de la request sin re-renderizar
  const productsRequestStatus = useRef("idle");

  const navigate = useNavigate();
  const location = useLocation();

  // ------------------------------------------------------------------
  // useEffects para Carga y Side Effects (Scroll/Título/Buscador)
  // ------------------------------------------------------------------

  // 1. Carga inicial de productos
  useEffect(() => {
    if (productsRequestStatus.current === "idle") {
      fetchProducts(setProductsState, productsRequestStatus);
    }
  }, []);

  // 2. Control de scroll y título/buscador al cambiar de ruta
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Limpiamos el título base
      if (!location.pathname.startsWith("/productos/")) {
        document.title = "Hermanos Jota";
      }

      // Limpiamos el buscador si navegamos fuera del catálogo
      if (!location.pathname.startsWith("/productos")) {
        setSearchQuery("");
      }
    }
  }, [location.pathname]);

  // ------------------------------------------------------------------
  // Derivados de estado
  // ------------------------------------------------------------------
  const products = productsState.list;
  const isLoading =
    productsState.status === "loading" || productsState.status === "idle";
  const fetchError = productsState.error;
  const cartCount = cartItems.length;

  // Filtrado por nombre (se mantiene)
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((producto) =>
        producto?.nombre?.toLowerCase().includes(normalizedSearch)
      )
    : products;

  // ------------------------------------------------------------------
  // Funciones de Navegación (usan useNavigate)
  // -----------------------------------------------------------------

  // Navegación principal del Header
  const handleNavigate = (view) => {
    let path;
    switch (view) {
      case "catalog":
        path = "/productos";
        break;
      case "contact":
        path = "/contacto";
        break;
      default:
        path = "/";
        break;
    }
    navigate(path);
  };

  /**
   * Navega al detalle del producto.
   * Usa el nombre del producto para generar el SLUG y la URL.
   */
  const showProductDetail = (producto) => {
    //Usamos el ID de la base de datos (producto._id)
    if (!producto || !producto._id) return;

    // Actualizamos el título inmediatamente (opcional)
    if (typeof document !== "undefined") {
      document.title = `HJ — ${producto.nombre}`;
    }
    // Navegamos usando el ID
    navigate(`/productos/${producto._id}`);
  };

  /**
   *  Vuelve a la vista de catálogo.
   */
  const handleBackToCatalog = () => {
    navigate("/productos");
  };

  // ------------------------------------------------------------------
  // Lógica del Carrito (Se mantiene)
  // ------------------------------------------------------------------

  const handleAddToCart = (producto, quantity = 1) => {
    if (!producto) {
      return;
    }

    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const newEntries = [];
    for (let i = 0; i < safeQuantity; i += 1) {
      newEntries.push({ ...producto });
    }

    setCartItems((prev) => [...prev, ...newEntries]);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // ------------------------------------------------------------------
  // Lógica de Eliminación de Productos
  // ------------------------------------------------------------------

  const handleDeleteProduct = async (producto) => {
    if (!producto || !producto._id) {
      console.error("Producto inválido para eliminar");
      return;
    }

    try {
      // Actualizar la lista PRIMERO (optimistic update)
      setProductsState((prev) => ({
        ...prev,
        list: prev.list.filter((p) => p._id !== producto._id),
      }));

      // Navegar inmediatamente al catálogo
      navigate("/productos", { replace: true });

      // Hacer el DELETE después (el producto ya no está en la UI)
      const response = await fetch(`${PRODUCTS_URL}/${producto._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Si falla, restaurar el producto
        setProductsState((prev) => ({
          ...prev,
          list: [...prev.list, producto].sort((a, b) => a._id.localeCompare(b._id)),
        }));
        throw new Error(`Error ${response.status} al eliminar el producto`);
      }

    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Hubo un error al eliminar el producto. Se ha restaurado en la lista.");
    }
  };

  // ------------------------------------------------------------------
  //  Componente Wrapper para Detalle (Usa useParams) 
  // ------------------------------------------------------------------

  /**
   * Wrapper que extrae el ID de la URL, hace fetch al endpoint individual y muestra el detalle.
   */
  const ProductDetailWrapper = () => {
    // Hook para obtener el parámetro dinámico 'id' de la URL: /productos/:id
    const { id } = useParams();
    
    console.log('ProductDetailWrapper RENDER - ID:', id);
    
    // Estado local para el producto individual
    const [productDetail, setProductDetail] = useState({
      status: "idle",
      data: null,
      error: null,
    });

    // useEffect para hacer fetch del producto individual cuando cambia el ID
    useEffect(() => {
      if (!id) return;

      console.log('🔍 ProductDetailWrapper - Iniciando fetch para ID:', id);

      // AbortController para cancelar el fetch si el componente se desmonta
      const abortController = new AbortController();

      const fetchProductDetail = async () => {
        setProductDetail({
          status: "loading",
          data: null,
          error: null,
        });

        try {
          console.log('📡 Haciendo fetch a:', `${PRODUCTS_URL}/${id}`);
          const response = await fetch(`${PRODUCTS_URL}/${id}`, {
            signal: abortController.signal, // Pasar la señal de abort
          });
          
          if (!response.ok) {
            throw new Error(`Error ${response.status}`);
          }
          const data = await response.json();

          console.log('✅ Fetch exitoso para producto:', data.nombre);
          setProductDetail({
            status: "success",
            data: data,
            error: null,
          });
        } catch (error) {
          // Ignorar errores de abort
          if (error.name === 'AbortError') {
            console.log('❌ Fetch cancelado para producto:', id);
            return;
          }
          
          console.error("Error al cargar el producto:", error);
          setProductDetail({
            status: "error",
            data: null,
            error: "Error al cargar el producto. Intenta nuevamente.",
          });
        }
      };

      fetchProductDetail();

      // Función de limpieza: abortar el fetch cuando el componente se desmonte
      return () => {
        console.log('🧹 Cleanup: Abortando fetch para ID:', id);
        abortController.abort();
      };
    }, [id]);

    // Estados de carga
    if (productDetail.status === "loading" || productDetail.status === "idle") {
      return (
        <div className="state-message">Cargando detalles del producto...</div>
      );
    }

    if (productDetail.error) {
      return (
        <div className="state-message state-error">
          {productDetail.error}
        </div>
      );
    }

    if (!productDetail.data) {
      return (
        <div className="state-message">
          Producto con ID "{id}" no disponible.
        </div>
      );
    }

    // Si se encuentra el producto, renderizamos el detalle
    return (
      <ProductDetail
        key={productDetail.data._id}
        producto={productDetail.data}
        onBack={handleBackToCatalog}
        onAddToCart={handleAddToCart}
        onDelete={handleDeleteProduct}
      />
    );
  };

  // ------------------------------------------------------------------
  // Renderizado Principal con React Router
  // ------------------------------------------------------------------

  return (
    <>
      <Header
        onNavigate={handleNavigate}
        // La lógica para determinar la vista activa en el Header se mantiene
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
        onClearCart={handleClearCart}
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

          {/* RUTA DE DETALLE MODIFICADA: Ahora espera el ID del producto */}
          <Route path="/productos/:id" element={<ProductDetailWrapper />} />

          <Route path="/contacto" element={<Contacto />} />

          <Route path="/admin/crear-producto" element={<FormProductoNuevo />} />
                      
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

/**
 * Exportamos el componente App directamente,
 * ya que el entorno Canvas proporciona el Router.
 */
export default App;
