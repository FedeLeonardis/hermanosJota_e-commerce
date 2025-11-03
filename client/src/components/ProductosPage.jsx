import React, { useState } from "react";
import Catalogo from "./Catalogo";
import useProductos from "./useProductos"; // Importa el hook

function ProductosPage() {
  // Estado para manejar la entrada de texto del usuario
  const [searchQuery, setSearchQuery] = useState("");

  // **UTILIZA EL HOOK PARA OBTENER LOS DATOS Y ESTADOS**
  const { productos, isLoading, error } = useProductos(searchQuery);

  const handleSearchChange = (value) => {
    setSearchQuery(value); // Actualiza el estado de búsqueda
  };

  const handleSelectProduct = (product) => {
    // Lógica para navegar o mostrar detalles
    console.log("Producto seleccionado:", product.nombre);
  };

  return (
    <Catalogo
      // Pasa el estado (productos, loading, error) como props al componente de presentación
      productos={productos}
      isLoading={isLoading}
      error={error}
      // Pasa el estado de búsqueda y el manejador de cambios
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange} // Pasa la función para actualizar la query
      onSelectProduct={handleSelectProduct}
    />
  );
}

export default ProductosPage;
