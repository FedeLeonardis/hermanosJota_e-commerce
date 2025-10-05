# Mueblería Hermanos Jota

Proyecto full-stack monolitico de un sitio web de comercio electrónico para una mueblería ficticia. Implementa catálogo de productos, páginas de detalle de producto, búsqueda y filtrado básicos, carrito de compras (interfaz), y un formulario de contacto. Incluye un backend en Express que expone el catálogo de productos y un frontend en React + Vite encargado de la experiencia de usuario, navegación y carrito.

## Integrantes del equipo

- Walter Arias Molino
- Tomás Sebastián Picco
- Malena Zoe Blanco Di Beco
- Federico Leonardis Ayala

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm 9+ (incluido con Node)

## Instalación y ejecución

Cada parte del proyecto mantiene sus dependencias en carpetas independientes. Ejecutá los siguientes pasos desde la raíz del repositorio.

### Backend (`/backend`)

```bash
cd backend
npm install
npm run dev
# modo producción / sin recarga en caliente
npm start
```

### Frontend (`/client`)

En una nueva terminal, desde la raíz del repo:

```bash
cd client
npm install
npm run dev
# modo producción / sirviendo el build estático
npm run build
npm start
```

## Arquitectura y decisiones clave

- **Backend Express modularizado:** se utiliza Express 5 con middlewares para CORS, parsing JSON y logging personalizado (`logger.js`). Las rutas del dominio productos están separadas en `routes/productosRoutes.js` y consumen una fuente de datos estática en `data/productos.js`, lo que simplifica las pruebas sin una base de datos real.
- **API limpia y versionable:** todas las operaciones actuales se agrupan bajo `/api/productos`, permitiendo crecer con nuevos recursos sin romper compatibilidad.
- **Frontend React + Vite:** la aplicación cliente se construyó con Vite para obtener recarga rápida en desarrollo y un bundle optimizado. Los componentes se organizan en `src/components` siguiendo la UI del catálogo y se centraliza el estado global del carrito en `context/CartContext.jsx`.
- **Estilos escalables:** la carpeta `src/css` contiene hojas modulares con variables CSS reutilizables (`variables.css`) y estilos globales (`global.css`) para mantener consistencia visual.
- **Comunicación desacoplada:** el frontend consume el backend mediante fetch/axios (según integración) apuntando a la ruta base configurada, lo que facilita reemplazar el origen de datos en un futuro despliegue.

## Scripts útiles

- `npm run dev` (en `/backend`): inicia el servidor Express con `nodemon` para recarga automática.
- `npm start` (en `/backend`): inicia el servidor Express en modo producción usando Node.
- `npm run dev` (en `/client`): inicia el servidor de desarrollo de Vite.
- `npm run build` (en `/client`): genera el build estático listo para deploy.
- `npm run preview` (en `/client`): sirve el build estático para validaciones manuales.
- `npm start` (en `/client`): alias de `vite preview --host` para simular producción local.