import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api.js";

const useProductos = (searchQuery) => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductosFromAPI = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 🚨 AQUÍ se usa tu URL del backend 🚨
        const BASE_URL = API_CONFIG.ENDPOINTS.PRODUCTOS;

        // Construye la URL completa con el parámetro de búsqueda (query string)
        // Ejemplo: api/productos?q=silla
        const url = `${BASE_URL}?q=${encodeURIComponent(searchQuery)}`;

        const response = await fetch(url);

        if (!response.ok) {
          // Lanza un error si la respuesta HTTP no es 2xx
          throw new Error(
            `Error ${response.status}: No se pudo cargar la data.`
          );
        }

        const data = await response.json();

        setProductos(data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError(err.message);
        setProductos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductosFromAPI();
  }, [searchQuery]);

  return { productos, isLoading, error };
};

export default useProductos;
