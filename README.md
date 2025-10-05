# Mueblería Hermanos Jota

Proyecto full-stack que recrea el e-commerce de una mueblería. La solución consta de un backend en Express que expone el catálogo de productos y un frontend en React + Vite que ofrece navegación multipágina (home, catálogo, detalle y contacto), buscador, carrito visual y componentes destacados.

## Integrantes del equipo

- Walter Arias Molino
- Tomás Sebastián Picco
- Malena Zoe Blanco Di Beco
- Federico Leonardis Ayala

## Características principales

- Listado completo del catálogo con búsqueda por nombre y secciones destacadas.
- Contador de carrito ubicado en el header y opción de vaciar la selección.
- Formulario de contacto estático listo para integrarse con un backend real.
- Backend Express con dos endpoints y manejo básico de errores/logs.

## Tecnologías

- **Frontend:** React 19, Vite, CSS modular organizado por secciones.
- **Backend:** Node.js 18, Express 5, middleware personalizado de logging y CORS habilitado.
- **Herramientas:** npm, nodemon para desarrollo, Vite preview para simulación productiva.

## Estructura de carpetas

```
hermanosJota_e-commerce/
├── backend/
│   ├── data/productos.js
│   ├── middleware/logger.js
│   ├── routes/productosRoutes.js
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/*.jsx
│   │   ├── css/*.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/assets/...
└── README.md
```

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm 9+ (incluido con Node)

## Instalación y ejecución

Cada subproyecto maneja sus dependencias en forma independiente. Desde la raíz del repositorio:

### Backend (`/backend`)

```bash
cd backend
npm install

# desarrollo con recarga automática
npm run dev

# ejecución estándar (por ejemplo, en producción)
npm start
```

El servidor escucha en `http://localhost:5000` por defecto y expone:

| Método | Ruta              | Descripción                          |
| ------ | ----------------- | ------------------------------------ |
| GET    | `/api/productos`  | Devuelve la lista completa del catálogo |
| GET    | `/api/productos/:id` | Obtiene un producto por identificador |

Podés redefinir el puerto con la variable de entorno `PORT`.

### Frontend (`/client`)

En una terminal separada, también desde la raíz:

```bash
cd client
npm install

# entorno de desarrollo con hot reload
npm run dev

# build y servidor de previsualización (simula producción)
npm run build
npm start
```

Vite abre la aplicación en `http://localhost:5173` apuntando al backend local.

## Arquitectura y decisiones clave

- **Backend desacoplado del almacenamiento:** los productos se cargan desde un módulo JS estático (`data/productos.js`), lo que simplifica las pruebas iniciales. El enrutador (`routes/productosRoutes.js`) se encargará de las rutas del dominio.
- **Manejo centralizado de errores:** `server.js` incluye middlewares para logging y respuestas uniformes ante rutas inexistentes o fallos internos.
- **Estado global ligero en el frontend:** el carrito, la vista activa y la data del catálogo se administran con `useState` en `App.jsx`.
- **Componentes reusables:** los componentes en `src/components` encapsulan secciones de UI (header, catálogo, tarjetas de producto, formulario de contacto) y reciben callbacks desde `App.jsx` para navegar o agregar al carrito.
- **Estilos modulares:** `src/css` agrupa estilos por dominio (header, footer, productos, etc.) con un archivo de variables compartidas para mantener consistencia.

## Scripts útiles

- `npm run dev` (en `/backend`): inicia el servidor Express con recarga automática gracias a `nodemon`.
- `npm start` (en `/backend`): ejecuta el backend con Node estándar.
- `npm run dev` (en `/client`): levanta el servidor de desarrollo de Vite.
- `npm run build` (en `/client`): genera el bundle de producción en `dist/`.
- `npm run preview` (en `/client`): sirve el build estático (sin forzar modo host).
- `npm start` (en `/client`): alias de `vite preview --host` para probar el build en red local.
