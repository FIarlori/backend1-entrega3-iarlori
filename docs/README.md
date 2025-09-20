# Entrega 2 – API de Productos y Carritos con Vistas y WebSockets

Servidor backend desarrollado con Node.js + Express para la gestión de un sistema de e-commerce, utilizando persistencia en archivos JSON (fs). Incluye vistas dinámicas con Handlebars, actualizaciones en tiempo real mediante WebSockets con Socket.io, y manejo de errores personalizado. Escucha en el puerto **8080** por defecto (configurable vía `.env`).

## 📋 Requisitos técnicos
- Node.js v18+ (Recomendado LTS)
- npm v9+
- Postman o similar para probar endpoints de la API
- Navegador web para probar las vistas

## 📦 Instalación
1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## 🚀 Ejecución
Para iniciar el servidor en modo producción:
```bash
npm start
```
Para desarrollo con recarga automática:
```bash
npm run dev
```

## 🛠️ Dependencias
- **express**: Framework para el servidor HTTP
- **express-handlebars**: Motor de plantillas para vistas dinámicas
- **socket.io**: Para actualizaciones en tiempo real vía WebSockets
- **dotenv**: Para cargar variables de entorno desde `.env`
- **nodemon** (dev): Para recarga automática en desarrollo

## 🌐 Endpoints disponibles

### API de Productos
| Método | Endpoint                     | Descripción                         |
|--------|------------------------------|-------------------------------------|
| GET    | `/api/products`              | Obtener todos los productos         |
| GET    | `/api/products/:pid`         | Obtener producto por ID             |
| POST   | `/api/products`              | Crear nuevo producto                |
| PUT    | `/api/products/:pid`         | Actualizar producto                 |
| DELETE | `/api/products/:pid`         | Eliminar producto                   |

### API de Carritos
| Método | Endpoint                     | Descripción                         |
|--------|------------------------------|-------------------------------------|
| POST   | `/api/carts`                 | Crear nuevo carrito                 |
| GET    | `/api/carts/:cid`            | Obtener carrito por ID              |
| POST   | `/api/carts/:cid/product/:pid` | Agregar producto al carrito       |

### Vistas
| Método | Endpoint                     | Descripción                         |
|--------|------------------------------|-------------------------------------|
| GET    | `/`                          | Vista estática de productos (home)  |
| GET    | `/realtimeproducts`          | Vista en tiempo real con WebSockets |

## 🖼️ Vistas
- **Home (`/`)**: Renderiza una lista estática de productos cargada desde `data/products.json`. Se actualiza al recargar la página tras modificaciones en la API.
- **RealTimeProducts (`/realtimeproducts`)**: Muestra productos en tiempo real usando WebSockets. Incluye un formulario para agregar productos y botones para eliminarlos. Las actualizaciones se reflejan automáticamente en todos los clientes conectados sin necesidad de recargar la página.
- **Errores**:
  - **404**: Renderiza `errors/404.handlebars` para rutas no encontradas.
  - **500**: Renderiza `errors/500.handlebars` para errores del servidor.

## 📡 WebSockets
La vista `/realtimeproducts` utiliza Socket.io para:
- Cargar la lista de productos al conectar un cliente (`updateProducts`).
- Agregar nuevos productos desde un formulario (emite evento `addProduct`).
- Eliminar productos con un botón (emite evento `deleteProduct`).
- Actualizar la lista en todos los clientes conectados tras cada acción (`updateProducts`).

## 🧪 Pruebas
### Con Postman
- Importa la colección ubicada en `docs/postman/postman_collection.json`.
- Usa `http://localhost:8080` como base para todos los endpoints.
- Prueba los endpoints de `/api/products` y `/api/carts` para gestionar productos y carritos.
- Ejemplo de cuerpo para `POST /api/products`:
  ```json
  {
    "title": "Producto Ejemplo",
    "description": "Descripción del producto",
    "code": "ABC123",
    "price": 99.99,
    "stock": 10,
    "category": "Electrónica",
    "thumbnails": "http://example.com/image.jpg"
  }
  ```

### Con Navegador
- Abre `http://localhost:8080/` para ver la lista estática de productos.
- Abre `http://localhost:8080/realtimeproducts` para interactuar con productos en tiempo real (agregar/eliminar).
- Las modificaciones realizadas vía API (`/api/products`) se reflejan en la vista `/` al recargar la página.
- Las modificaciones en `/realtimeproducts` (formulario o botones) actualizan la lista en tiempo real en todos los clientes conectados.

## 📂 Estructura del Proyecto
El proyecto sigue una arquitectura modular basada en el stack MEHN, separando responsabilidades en capas (configuraciones, controladores, servicios, rutas, vistas, utilidades).

```
├── 📁 src/
│   ├── 📁 config/
│   │   ├── environment.js        # Configuración de variables de entorno (dotenv)
│   │   ├── server.js             # Configuración de Express, Handlebars y Socket.io
│   ├── 📁 controllers/
│   │   ├── cartsController.js    # Controlador para carritos
│   │   ├── productsController.js # Controlador para productos
│   │   ├── viewsController.js    # Controlador para vistas
│   ├── 📁 middleware/
│   │   ├── errorHandler.js       # Middleware para manejo de errores (404, 500)
│   ├── 📁 routes/
│   │   ├── 📁 api/
│   │   │   ├── carts.js          # Rutas de la API para carritos
│   │   │   ├── products.js       # Rutas de la API para productos
│   │   ├── 📁 web/
│   │   │   ├── views.js          # Rutas para vistas dinámicas
│   │   ├── index.js              # Registro centralizado de rutas
│   ├── 📁 services/
│   │   ├── cartsService.js       # Lógica de negocio para carritos
│   │   ├── productsService.js    # Lógica de negocio para productos
│   ├── 📁 utils/
│   │   ├── CartManager.js        # Manejo de persistencia de carritos (fs)
│   │   ├── ProductManager.js     # Manejo de persistencia de productos (fs)
│   │   ├── fileManager.js        # Exporta CartManager y ProductManager
│   ├── 📁 views/
│   │   ├── 📁 errors/
│   │   │   ├── 404.handlebars    # Vista para error 404
│   │   │   ├── 500.handlebars    # Vista para error 500
│   │   ├── 📁 layouts/
│   │   │   ├── main.handlebars   # Layout principal para vistas
│   │   ├── 📁 pages/
│   │   │   ├── home.handlebars   # Vista estática de productos
│   │   │   ├── realTimeProducts.handlebars # Vista en tiempo real
│   │   ├── 📁 partials/
│   │   │   ├── header.handlebars # Encabezado reutilizable
│   │   │   ├── footer.handlebars # Pie de página reutilizable
│   ├── 📁 data/
│   │   ├── carts.json           # Persistencia de carritos
│   │   ├── products.json        # Persistencia de productos
│   ├── app.js                    # Punto de entrada principal
├── 📁 public/
│   ├── 📁 css/
│   │   ├── main.css             # Estilos para vistas
│   ├── 📁 js/
│   │   ├── realTimeProducts.js  # Scripts para WebSockets
├── 📁 docs/
│   ├── 📁 postman/
│   │   ├── postman_collection.json # Colección para pruebas de API
│   ├── API.md                   # Documentación detallada de la API
│   ├── README.md                # Documentación del proyecto
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos ignorados por git
├── package.json                 # Configuración del proyecto
├── package-lock.json            # Dependencias fijadas
```

## ⚙️ Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con:
```
PORT=8080
NODE_ENV=development
```
Consulta `.env.example` para más detalles.

## 📝 Notas
- Los datos de productos y carritos se persisten en `data/products.json` y `data/carts.json`.
- La vista `/realtimeproducts` permite agregar y eliminar productos con actualizaciones en tiempo real.
- Los errores de la API devuelven códigos de estado HTTP apropiados (400, 404, 500).
- Los errores en las vistas renderizan plantillas específicas (`errors/404.handlebars`, `errors/500.handlebars`).
- La arquitectura modular (controladores, servicios, rutas) facilita la escalabilidad y el mantenimiento.

## 📚 Documentación Adicional
- **API**: Consulta `docs/API.md` para detalles de los endpoints y ejemplos de uso.
- **Postman**: Usa `docs/postman/postman_collection.json` para pruebas automatizadas.