import ProductCard from "./ProductCard";
import "../css/reset.css";
import "../css/productos.css";
import "../css/variables.css";
import "../css/global.css";
import "../css/index.css";

/**
 * Renderiza la grilla de productos del catálogo.
 * Recibe un listado filtrado y delega la selección individual a `ProductCard`.
 */
function Catalogo({
  productos = [],
  isLoading,
  error,
  onSelectProduct = () => {},
  searchQuery = "",
  onSearchChange = () => {},
}) {
  if (isLoading) {
    return <div className="state-message">Cargando...</div>;
  }

  if (error) {
    return <div className="state-message state-error">{error}</div>;
  }

  // Determina si mostrar mensajes de búsqueda vacía o sin resultados.
  const trimmedQuery = searchQuery.trim();
  const hasResults = productos.length > 0;

  return (
    <section className="catalogo-page">
      <header className="catalogo-page__header">
        <p className="catalogo-page__eyebrow">Colección permanente</p>
        <h1 className="catalogo-page__title">Nuestros productos</h1>
      </header>
      <div className="catalogo-page__search" role="search">
        <label className="catalogo-page__search-label" htmlFor="catalog-search">
          Buscar por nombre
        </label>
        <input
          id="catalog-search"
          type="search"
          className="catalogo-page__search-input"
          placeholder="Ej: sofá, mesa, silla"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="catalogo grid-container">
        {!hasResults && !trimmedQuery && (
          <p className="state-message">
            No hay productos disponibles por ahora.
          </p>
        )}

        {!hasResults && trimmedQuery && (
          <p className="state-message">
            No encontramos coincidencias para "{trimmedQuery}".
          </p>
        )}

        {productos.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            onSelect={onSelectProduct} // ✅ Esto ya estaba correcto
          />
        ))}
      </div>
    </section>
  );
}

export default Catalogo;
