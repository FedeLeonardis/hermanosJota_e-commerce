// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    PRODUCTOS: `${API_BASE_URL}/api/productos`,
  }
};

/**
 * Convierte una URL de imagen relativa o con localhost a una URL absoluta correcta
 * @param {string} imageUrl - URL de la imagen (puede ser relativa o absoluta)
 * @returns {string} - URL absoluta de la imagen
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // Si ya es una URL completa de internet (http/https pero no localhost)
  if (imageUrl.startsWith('http') && !imageUrl.includes('localhost')) {
    return imageUrl;
  }
  
  // Si es una URL de localhost o relativa, construir con el backend correcto
  if (imageUrl.includes('localhost') || imageUrl.startsWith('/images/')) {
    // Extraer solo la parte de /images/productos/...
    const imagePath = imageUrl.includes('/images/') 
      ? imageUrl.substring(imageUrl.indexOf('/images/'))
      : `/images/productos/${imageUrl}`;
    
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Si es solo el nombre del archivo
  return `${API_BASE_URL}/images/productos/${imageUrl}`;
};

export default API_CONFIG;
