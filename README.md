# Mueblería Hermanos Jota

Proyecto full-stack de e-commerce para una mueblería. La solución consta de un backend en Express con MongoDB que gestiona el catálogo de productos, y un frontend en React + Vite que ofrece navegación multipágina (home, catálogo, detalle de producto, contacto y administración), buscador en tiempo real, carrito de compras visual y sistema CRUD completo de productos con características opcionales.

## Integrantes actuales del equipo

- Walter Arias Molino
- Tomás Sebastián Picco
- Federico Leonardis Ayala

#### Devs que pasaron por aqui: 
- Malena Zoe Blanco Di Beco

## Características principales

### Frontend
- **Navegación multipágina** con React Router (home, catálogo, detalle, contacto, admin)
- **Listado completo del catálogo** con búsqueda en tiempo real por nombre
- **Páginas de detalle dinámicas** que obtienen productos individuales desde la API
- **Carrito de compras** con contador visual en el header y opción de vaciar
- **Sistema de administración** para crear, ver y eliminar productos
- **Formulario de creación de productos** con features opcionales y dinámicas
- **Modal de confirmación** para acciones destructivas (eliminar productos)
- **Responsive design** con CSS modular organizado por secciones
- **Optimistic updates** para mejorar la experiencia de usuario

### Backend
- **API RESTful** con Express y MongoDB/Mongoose
- **CRUD completo** de productos (Create, Read, Update, Delete)
- **Modelo de datos flexible** con features opcionales (medidas, materiales, acabado, etc.)
- **Middleware de logging** personalizado para tracking de requests
- **CORS configurado** para desarrollo local y producción
- **Manejo centralizado de errores** con respuestas HTTP apropiadas
- **Variables de entorno** para configuración segura

## Tecnologías

### Frontend
- **React 19** - Librería de UI con hooks modernos
- **React Router 7** - Navegación y rutas dinámicas
- **Vite** - Build tool y dev server de alta velocidad
- **CSS Modular** - Estilos organizados por componentes y páginas
- **Fetch API** - Comunicación con el backend

### Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express 5** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **dotenv** - Gestión de variables de entorno
- **nodemon** - Recarga automática en desarrollo
- **CORS** - Middleware para cross-origin requests

## Estructura de carpetas

```
hermanosJota_e-commerce/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── logger.js           # Logging de requests HTTP
│   │   ├── models/
│   │   │   └── Product.js          # Modelo Mongoose de productos
│   │   └── routes/
│   │       └── productosRoutes.js  # Rutas de la API de productos
│   ├── data/
│   │   └── productos.js            # Datos de ejemplo (legacy)
│   ├── images/
│   │   └── productos/              # Imágenes de productos
│   ├── .env                        # Variables de entorno (no versionado)
│   ├── .env.example                # Plantilla de variables de entorno
│   ├── server.js                   # Punto de entrada del servidor
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeaturedProduct.jsx # Productos destacados en home
│   │   │   ├── Footer.jsx          # Footer del sitio
│   │   │   ├── Header.jsx          # Header con navegación y carrito
│   │   │   ├── ProductCard.jsx     # Tarjeta de producto en catálogo
│   │   │   ├── ProductDetail.jsx   # Vista detallada de producto
│   │   │   └── ProductosPage.jsx   # Página de catálogo
│   │   ├── pages/
│   │   │   ├── Catalogo.jsx        # Página del catálogo
│   │   │   ├── Contacto.jsx        # Formulario de contacto
│   │   │   ├── FormProductoNuevo.jsx # Formulario de creación de productos
│   │   │   └── HomePage.jsx        # Página de inicio
│   │   ├── hooks/
│   │   │   └── useProductos.js     # Hook personalizado (legacy)
│   │   ├── config/
│   │   │   └── api.js              # Configuración de URLs de API
│   │   ├── css/
│   │   │   ├── variables.css       # Variables CSS globales
│   │   │   ├── reset.css           # Reset de estilos
│   │   │   ├── global.css          # Estilos globales
│   │   │   ├── header.css          # Estilos del header
│   │   │   ├── footer.css          # Estilos del footer
│   │   │   ├── index.css           # Estilos de home
│   │   │   ├── productos.css       # Estilos del catálogo
│   │   │   ├── producto.css        # Estilos de detalle
│   │   │   ├── contacto.css        # Estilos de contacto
│   │   │   └── nuevo-producto.css  # Estilos del formulario admin
│   │   ├── App.jsx                 # Componente principal con rutas
│   │   └── main.jsx                # Punto de entrada React
│   ├── public/
│   │   └── assets/
│   │       └── img/                # Imágenes estáticas (logos, banners)
│   ├── .env.production             # Variables de entorno de producción
│   ├── netlify.toml                # Configuración de Netlify
│   ├── vite.config.js              # Configuración de Vite
│   └── package.json
│
├── .gitignore
├── package.json                     # Scripts raíz del proyecto
└── README.md                        # Este archivo
```

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm 9+ (incluido con Node)
- Cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o MongoDB local)

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/FedeLeonardis/hermanosJota_e-commerce.git
cd hermanosJota_e-commerce
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Puerto del servidor
PORT=5000

# URI de MongoDB Atlas (o local: mongodb://localhost:27017/muebleria)
DB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/muebleria

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Entorno
NODE_ENV=development
```

### 3. Configurar el Frontend

```bash
cd ../client
npm install
```

Crear archivo `.env.local` para desarrollo:

```bash
echo "VITE_API_URL=http://localhost:5000" > .env.local
```

Para producción, editar `.env.production`:

```env
VITE_API_URL=https://tu-backend.onrender.com
```

## Ejecución en desarrollo

Cada subproyecto debe ejecutarse en terminales separadas.

### Backend

```bash
cd backend
npm run dev
```

El servidor escucha en `http://localhost:5000` (o el puerto definido en `.env`)

### Frontend

```bash
cd client
npm run dev
```

La aplicación se abre en `http://localhost:5173`

## API Endpoints

El backend expone los siguientes endpoints:

| Método | Ruta                  | Descripción                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/api/productos`      | Obtiene todos los productos              |
| GET    | `/api/productos/:id`  | Obtiene un producto por ID               |
| POST   | `/api/productos`      | Crea un nuevo producto                   |
| PUT    | `/api/productos/:id`  | Actualiza un producto existente          |
| DELETE | `/api/productos/:id`  | Elimina un producto                      |

### Ejemplo de respuesta GET `/api/productos/:id`

```json
{
  "_id": "674567890abcdef123456789",
  "nombre": "Sofá Moderno",
  "descripcion": "Sofá de 3 plazas con diseño contemporáneo",
  "precio": 45000,
  "stock": 5,
  "imagenUrl": "https://example.com/sofa.jpg",
  "features": {
    "medidas": "200cm x 90cm x 85cm",
    "materiales": "Tela premium, estructura de madera",
    "tapizado": "Tapizado removible y lavable",
    "garantia": "2 años"
  }
}
```

### Ejemplo de request POST `/api/productos`

```json
{
  "nombre": "Mesa de Comedor",
  "descripcion": "Mesa extensible para 6-8 personas",
  "precio": 35000,
  "stock": 3,
  "imagenUrl": "https://example.com/mesa.jpg",
  "features": {
    "medidas": "160cm x 90cm (extensible a 240cm)",
    "materiales": "Madera maciza de roble",
    "acabado": "Barniz mate",
    "extension": "Sistema de extensión central"
  }
}
```

## Modelo de Datos

### Product Schema

```javascript
{
  nombre: String (required),
  descripcion: String (required),
  precio: Number (required, min: 0),
  stock: Number (required, min: 0),
  imagenUrl: String (required),
  features: {
    medidas: String,
    materiales: String,
    acabado: String,
    peso: String,
    capacidad: String,
    modulares: String,
    tapizado: String,
    confort: String,
    rotacion: String,
    garantia: String,
    almacenamiento: String,
    colchon: String,
    sostenibilidad: String,
    extension: String,
    apilables: String,
    incluye: String,
    cables: String,
    certificación: String,
    regulación: String,
    caracteristica: String
  }
}
```

Todos los campos de `features` son opcionales y pueden agregarse dinámicamente desde el formulario de administración.

## Funcionalidades principales

### Catálogo de productos
- Visualización en grid responsivo
- Búsqueda en tiempo real por nombre
- Navegación a detalle de cada producto

### Detalle de producto
- Carga dinámica desde API usando React Router params
- Visualización de features del producto
- Opción de agregar al carrito
- Botón de eliminación (solo admin) con modal de confirmación
- Manejo de estados de carga y error

### Administración
- Formulario de creación de productos
- Selector dinámico de features opcionales
- Validación de campos requeridos
- Navegación automática al producto creado
- Refetch automático de la lista de productos

### Carrito de compras
- Contador visual en el header
- Agregado de productos con cantidad
- Vaciar carrito completo

## Scripts disponibles

### Backend (`/backend`)

```bash
npm run dev      # Desarrollo con nodemon (recarga automática)
npm start        # Producción con Node estándar
```

### Frontend (`/client`)

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción en /dist
npm run preview  # Preview del build de producción
npm start        # Alias de preview --host (para red local)
```

## Deployment

### Backend (Render)

1. Crear nuevo Web Service en Render
2. Conectar repositorio de GitHub
3. Configurar build command: `cd backend && npm install`
4. Configurar start command: `cd backend && npm start`
5. Agregar variables de entorno:
   - `DB_URI`: URI de MongoDB Atlas
   - `FRONTEND_URL`: URL de Netlify
   - `NODE_ENV`: production

### Frontend (Netlify)

1. Crear nuevo site en Netlify
2. Conectar repositorio de GitHub
3. Configurar build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. Agregar variable de entorno:
   - `VITE_API_URL`: URL del backend en Render

### Enlaces de producción

- **Frontend**: https://hermanos-jota-muebleria.netlify.app/
- **Backend**: https://hermanosjota-e-commerce.onrender.com

## Arquitectura y decisiones clave

### Backend
- **MongoDB con Mongoose**: Permite esquemas flexibles y validación de datos
- **Modelo de features opcional**: El objeto `features` acepta cualquier combinación de propiedades, permitiendo productos con características diferentes
- **Middleware de logging**: Registra todas las peticiones HTTP para debugging
- **Manejo centralizado de errores**: Middleware global que captura errores y devuelve respuestas JSON consistentes
- **CORS configurado**: Permite requests desde el frontend tanto en desarrollo como producción

### Frontend
- **Estado global en App.jsx**: Usa `useState` para carrito, productos y búsqueda
- **React Router con rutas dinámicas**: `/productos/:id` carga productos individuales
- **Fetch con AbortController**: Cancela requests cuando el componente se desmonta
- **Optimistic updates**: Actualiza la UI antes de confirmar con el servidor (mejor UX)
- **Componentes reusables**: Separación clara entre componentes de presentación y lógica
- **CSS modular con variables**: Mantiene consistencia visual y facilita temas
- **Formularios controlados**: Todos los inputs manejan estado con React

## Licencia

Este proyecto es de uso académico para el curso de Desarrollo de Aplicaciones Web en ITBA.

## Contacto

Para consultas sobre el proyecto, contactar a los integrantes del equipo a través de GitHub.
