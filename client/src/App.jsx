import { useState } from "react";

// Componentes de alto nivel que componen cada vista de la aplicación.
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./components/HomePage.jsx";
import Catalogo from "./components/Catalogo.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Contacto from "./components/Contacto.jsx";

// Diccionario centralizado para controlar las vistas disponibles en la aplicación.
const VIEWS = {
  home: "home",
  catalog: "catalog",
  detail: "detail",
  contact: "contact",
};

// Endpoint base del backend que expone el catálogo.
const PRODUCTS_URL = "http://localhost:5000/api/productos";

// Estado compartido entre renders para evitar múltiples llamadas simultáneas a la API.
let productsRequestStatus = "idle";

/**
 * Lanza una carga de productos y sincroniza el estado externo cuando la promesa resuelve.
 * Se extrae para poder reutilizarlo desde distintos puntos sin duplicar la lógica de fetch.
 */
const startProductsRequest = (updateProductsState) => {
  if (productsRequestStatus === "loading") {
    return;
  }

  productsRequestStatus = "loading";

  fetch(PRODUCTS_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      productsRequestStatus = "done";
      // Persistimos el listado actualizado y limpiamos mensajes previos.
      updateProductsState((prev) => ({
        ...prev,
        status: "success",
        list: Array.isArray(data) ? data : [],
        error: null,
      }));
    })
    .catch((error) => {
      console.error("Error al cargar productos:", error);
      productsRequestStatus = "idle";
      // Al fallar dejamos el estado listo para reintentar desde la UI.
      updateProductsState((prev) => ({
        ...prev,
        status: "error",
        list: [],
        error:
          "Error al cargar los productos. Intenta nuevamente en unos minutos.",
      }));
    });
};

function App() {
  // Vista activa (home, catálogo, detalle o contacto).
  const [currentView, setCurrentView] = useState(VIEWS.home);
  // Estado derivado del fetch de productos.
  const [productsState, setProductsState] = useState({
    status: "loading",
    list: [],
    error: null,
  });
  // Identificador del producto seleccionado en el detalle.
  const [selectedProductId, setSelectedProductId] = useState(null);
  // Copia del producto seleccionada para evitar parpadeos al navegar.
  const [selectedProductData, setSelectedProductData] = useState(null);
  // Items agregados al carrito (se agregan como copias para mostrar cantidad total).
  const [cartItems, setCartItems] = useState([]);
  // Controla el texto del buscador de catálogo.
  const [searchQuery, setSearchQuery] = useState("");

  // Cuando el estado global indica inactividad se dispara la carga inicial.
  if (productsRequestStatus === "idle") {
    startProductsRequest(setProductsState);
  }

  // Derivados que simplifican el render.
  const products = productsState.list;
  const isLoading = productsState.status === "loading";
  const fetchError = productsState.error;
  const cartCount = cartItems.length;

  // Filtrado por nombre según el texto de búsqueda actual.
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((producto) =>
        producto?.nombre?.toLowerCase().includes(normalizedSearch)
      )
    : products;

  // Si existe un id seleccionado buscamos la entidad en el listado actual,
  // en caso contrario usamos la copia almacenada durante la navegación.
  const selectedProduct = selectedProductId
    ? products.find((producto) => producto.id === selectedProductId) ||
      selectedProductData
    : null;

  /**
   * Navega al detalle del producto guardando una copia local para evitar parpadeos.
   * También actualiza título y posición del scroll para mejor UX.
   */
  const showProductDetail = (producto) => {
    if (!producto) return;

    setSelectedProductId(producto.id);
    setSelectedProductData(producto);
    setCurrentView(VIEWS.detail);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.title = `HJ — ${producto.nombre}`;
    }
  };

  // Restablece el estado al listado y limpia la selección previa.
  const handleBackToCatalog = () => {
    setCurrentView(VIEWS.catalog);
    setSelectedProductId(null);
    setSelectedProductData(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.title = "HJ";
    }
  };

  /**
   * Cambia la vista actual y dispara la carga de productos si corresponde.
   * Se usa tanto desde el header como desde botones internos.
   */
  const handleNavigate = (view) => {
    if (view === VIEWS.catalog && productsRequestStatus === "idle") {
      setProductsState((prev) => ({
        ...prev,
        status: "loading",
        error: null,
      }));
      startProductsRequest(setProductsState);
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    switch (view) {
      case VIEWS.catalog:
        setCurrentView(VIEWS.catalog);
        break;
      case VIEWS.contact:
        setCurrentView(VIEWS.contact);
        break;
      default:
        setCurrentView(VIEWS.home);
        break;
    }

    if (view !== VIEWS.detail) {
      setSelectedProductId(null);
      setSelectedProductData(null);
      if (view !== VIEWS.catalog) {
        // Limpiamos el buscador al navegar fuera del catálogo.
        setSearchQuery("");
      }
      if (typeof document !== "undefined") {
        document.title = "HJ";
      }
    }
  };

  /**
   * Agrega un producto al carrito replicándolo tantas veces como indique quantity.
   * El array resultante sirve para mostrar conteos individuales sin lógica adicional.
   */
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

  // Limpia el carrito actual. Se expone al header para resetear la visualización.
  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      <Header
        onNavigate={handleNavigate}
        activeView={currentView}
        cartCount={cartCount}
        onClearCart={handleClearCart}
      />
      <div className="page-shell">
        {currentView === VIEWS.home && (
          <HomePage
            onSelectProduct={showProductDetail}
            productos={products}
            isLoading={isLoading}
            error={fetchError}
          />
        )}

        {currentView === VIEWS.catalog && (
          <Catalogo
            productos={filteredProducts}
            isLoading={isLoading}
            error={fetchError}
            onSelectProduct={showProductDetail}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {currentView === VIEWS.detail && selectedProduct && (
          <ProductDetail
            key={selectedProduct.id}
            producto={selectedProduct}
            onBack={handleBackToCatalog}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === VIEWS.detail && !selectedProduct && isLoading && (
          <div className="state-message">Cargando detalles del producto...</div>
        )}

        {currentView === VIEWS.contact && <Contacto />}

        {currentView === VIEWS.detail && !selectedProduct && !isLoading && (
          <div className="state-message">Producto no disponible.</div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default App;
