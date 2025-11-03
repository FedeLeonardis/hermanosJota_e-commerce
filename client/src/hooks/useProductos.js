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
        // 🚨 Ajuste para producción/Netlify: usar variable de entorno VITE_API_URL
        // En desarrollo se sigue soportando el proxy de Vite (/api -> localhost:5000)
        const rawBase = import.meta.env.VITE_API_URL ?? "/api"; // puede ser '/api' o 'https://mi-backend.onrender.com'
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
