// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    PRODUCTOS: `${API_BASE_URL}/api/productos`,
  }
};

export default API_CONFIG;
