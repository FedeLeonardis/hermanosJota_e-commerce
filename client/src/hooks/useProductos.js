import { useState, useEffect } from "react";

// ... (otros imports)

const useProductos = (searchQuery) => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductosFromAPI = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Prioridad para decidir la base URL del API:
        // 1) Si VITE_API_URL fue definida en tiempo de build, usarla (producción).
        // 2) Si estamos en modo desarrollo de Vite, usar el proxy local '/api' (dev proxy -> localhost:5000).
        // 3) Si nada de lo anterior aplica, usar un fallback absoluto apuntando al backend en Render.
        const viteApiUrl = import.meta.env.VITE_API_URL;
        const isDev = import.meta.env.DEV === true;

        const rawBase = viteApiUrl ?? (isDev ? "/api" : "https://hermanos-jota-e-commerce.onrender.com/api");
        const base = rawBase.replace(/\/+$/, ""); // quitar slash final si existe

        // Construye la URL completa con el parámetro de búsqueda
        // Resultado esperado: '<base>/productos?q=...' o '/api/productos?q=...'
        const url = `${base}/productos?q=${encodeURIComponent(searchQuery)}`;

        const response = await fetch(url, { credentials: 'same-origin' });

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
