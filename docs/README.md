# Entrega Final – API de Productos y Carritos con Vistas y WebSockets

Servidor backend desarrollado con Node.js + Express para la gestión de un sistema de e-commerce, utilizando persistencia principal en **MongoDB** (Mongoose). Incluye vistas dinámicas con Handlebars, actualizaciones en tiempo real mediante WebSockets con Socket.io, y manejo de errores personalizado. Escucha en el puerto **8080** por defecto (configurable vía `.env`).

## 📋 Requisitos técnicos
- Node.js v18+ (Recomendado LTS)
- npm v9+
- MongoDB Atlas o local (ver `.env`)
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
- **socket.io**: Actualizaciones en tiempo real vía WebSockets
- **mongoose**: ORM para interactuar con MongoDB
- **mongoose-paginate-v2**: Paginación avanzada para consultas
- **express-session**: Manejo de sesiones para asociar carritos
- **dotenv**: Carga de variables de entorno desde `.env`
- **nodemon** (dev): Recarga automática en desarrollo

## 🌐 Endpoints disponibles

### API de Productos (`/api/products`)
| Método | Endpoint                     | Descripción                                    |
|--------|------------------------------|------------------------------------------------|
| GET    | `/`                          | Obtiene productos con paginación, filtros y ordenamiento |
| GET    | `/:pid`                      | Obtiene un producto por ID                     |
| POST   | `/`                          | Crea un nuevo producto                         |
| PUT    | `/:pid`                      | Actualiza un producto                          |
| DELETE | `/:pid`                      | Elimina un producto                            |

#### Parámetros de consulta para `GET /api/products`
- `limit`: Número de productos por página (default: 10)
- `page`: Página a consultar (default: 1)
- `sort`: Ordenamiento por precio (`asc` o `desc`, opcional)
- `query`: Filtro JSON, ej. `{"category":"Electrónica"}` (opcional)
- `available`: Filtra productos con stock > 0 (`true`, opcional)

### API de Carritos (`/api/carts`)
| Método | Endpoint                        | Descripción                                    |
|--------|---------------------------------|------------------------------------------------|
| POST   | `/`                             | Crea un carrito vacío                          |
| GET    | `/:cid`                         | Obtiene un carrito con productos populados     |
| POST   | `/:cid/product/:pid`            | Agrega un producto al carrito                  |
| DELETE | `/:cid/products/:pid`           | Elimina un producto del carrito                |
| PUT    | `/:cid`                         | Actualiza todos los productos del carrito      |
| PUT    | `/:cid/products/:pid`           | Actualiza la cantidad de un producto           |
| DELETE | `/:cid`                         | Vacia el carrito                               |

### Vistas
| Método | Endpoint            | Descripción                                             |
|--------|---------------------|---------------------------------------------------------|
| GET    | `/`                 | Lista paginada de productos (igual a `/products`)       |
| GET    | `/products`         | Lista paginada de productos con filtros                 |
| GET    | `/products/:pid`    | Detalle de un producto con opción de agregar al carrito |
| GET    | `/carts/:cid`       | Contenido de un carrito específico                      |
| GET    | `/realtimeproducts` | Gestión de productos en tiempo real (WebSockets)        |

**Nota**: Las rutas `/` y `/products` muestran la misma vista (`home.handlebars`), que incluye una lista paginada de productos con filtros y ordenamiento.

## 🖼️ Vistas
- **Inicio/Productos (`/` o `/products`)**: Lista paginada de productos con filtros por categoría, disponibilidad y ordenamiento por precio. Cada producto tiene un enlace a su detalle y un botón para agregar al carrito.
- **Detalle de Producto (`/products/:pid`)**: Muestra título, descripción, precio, stock, categoría e imágenes, con un botón para agregar al carrito.
- **Carrito (`/carts/:cid`)**: Muestra los productos del carrito con detalles completos (populados), botones para eliminar productos y vaciar el carrito, y el total calculado.
- **RealTimeProducts (`/realtimeproducts`)**: Permite agregar y eliminar productos en tiempo real mediante WebSockets, con actualización automática en todos los clientes conectados.
- **Errores**:
  - `404`: Renderiza `errors/404.handlebars` para rutas no encontradas.
  - `500`: Renderiza `errors/500.handlebars` para errores del servidor.

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
    "thumbnails": ["http://example.com/image.jpg"]
  }
  ```
- Ejemplo de cuerpo para `PUT /api/carts/:cid`:
  ```json
  {
    "products": [
      { "product": "ID_DEL_PRODUCTO", "quantity": 2 }
    ]
  }
  ```
- Ejemplo de cuerpo para `PUT /api/carts/:cid/products/:pid`:
  ```json
  {
    "quantity": 5
  }
  ```

### Con Navegador
1. Abre `http://localhost:8080/` o `/products` para ver la lista de productos.
2. Usa los filtros (categoría, disponibilidad, ordenamiento) y navega entre páginas.
3. Haz clic en "Ver Detalles" para ver `/products/:pid` y agregar al carrito.
4. Accede a `/carts/:cid` para ver y gestionar el carrito.
5. Abre `/realtimeproducts` en varias pestañas para probar actualizaciones en tiempo real.

## 🚦 Flujo de Prueba Completo
1. **Configura el entorno**:
   - Inicia el servidor (`npm start` o `npm run dev`).
   - Asegúrate de que MongoDB esté accesible.
2. **Productos**:
   - Crea un producto: `POST /api/products` con el cuerpo de ejemplo.
   - Lista productos: `GET /api/products?limit=5&page=1&sort=asc&query={"category":"Electrónica"}`.
   - Obtén un producto: `GET /api/products/:pid`.
   - Actualiza un producto: `PUT /api/products/:pid`.
   - Elimina un producto: `DELETE /api/products/:pid`.
3. **Carritos**:
   - Crea un carrito: `POST /api/carts`.
   - Agrega un producto: `POST /api/carts/:cid/product/:pid`.
   - Verifica el carrito: `GET /api/carts/:cid` (verifica `populate`).
   - Actualiza productos: `PUT /api/carts/:cid` o `PUT /api/carts/:cid/products/:pid`.
   - Elimina un producto: `DELETE /api/carts/:cid/products/:pid`.
   - Vacia el carrito: `DELETE /api/carts/:cid`.
4. **Vistas**:
   - Navega a `/products` y prueba filtros/paginación.
   - Visita `/products/:pid` y agrega al carrito.
   - Revisa el carrito en `/carts/:cid`.
   - Usa `/realtimeproducts` para agregar/eliminar productos.
5. **Errores**:
   - Prueba un ID inválido (`GET /api/products/invalid_id`) para verificar el error 400.
   - Accede a una ruta inexistente (`/ruta_inexistente`) para ver el error 404.
---

## 📂 Estructura del Proyecto
```
├── 📁 docs/
│   ├── 📁 postman/
│   │   ├── postman_collection.json # Colección de pruebas para la API
│   ├── API.md                      # Documentación detallada de la API
│   ├── README.md                   # Documentación del proyecto
├── 📁 public/
│   ├── 📁 css/
│   │   ├── main.css                # Estilos para vistas
│   ├── 📁 js/
│   │   ├── cart.js                 # Scripts para la vista de carrito
│   │   ├── home.js                 # Scripts para la vista de productos
│   │   ├── productDetail.js        # Scripts para la vista de detalle de producto
│   │   ├── realTimeProducts.js     # Scripts para WebSockets
├── 📁 src/
│   ├── 📁 config/
│   │   ├── database.js             # Conexión a MongoDB
│   │   ├── environment.js          # Variables de entorno
│   │   ├── handlebars.js           # Configuración de Handlebars
│   │   ├── server.js               # Configuración de Express y Socket.io
│   ├── 📁 controllers/
│   │   ├── cartsController.js      # Controlador para carritos
│   │   ├── productsController.js   # Controlador para productos
│   │   ├── viewsController.js      # Controlador para vistas
│   ├── 📁 middleware/
│   │   ├── errorHandler.js         # Manejo de errores
│   ├── 📁 models/
│   │   ├── Cart.js                 # Modelo de carrito
│   │   ├── Product.js              # Modelo de producto
│   ├── 📁 routes/
│   │   ├── 📁 api/
│   │   │   ├── carts.js            # Rutas de carritos
│   │   │   ├── products.js         # Rutas de productos
│   │   ├── 📁 web/
│   │   │   ├── views.js            # Rutas de vistas
│   │   ├── index.js                # Registro de rutas
│   ├── 📁 services/
│   │   ├── cartsService.js         # Lógica de negocio para carritos
│   │   ├── productsService.js      # Lógica de negocio para productos
│   ├── 📁 views/
│   │   ├── 📁 errors/
│   │   │   ├── 404.handlebars      # Vista de error 404
│   │   │   ├── 500.handlebars      # Vista de error 500
│   │   ├── 📁 layouts/
│   │   │   ├── main.handlebars     # Layout principal
│   │   ├── 📁 pages/
│   │   │   ├── cart.handlebars     # Vista de carrito
│   │   │   ├── home.handlebars     # Vista de productos
│   │   │   ├── productDetail.handlebars # Vista de detalle de producto
│   │   │   ├── realTimeProducts.handlebars # Vista en tiempo real
│   │   ├── 📁 partials/
│   │   │   ├── footer.handlebars   # Pie de página
│   │   │   ├── header.handlebars   # Encabezado
│   ├── app.js                      # Punto de entrada
├── .env                            # Variables de entorno
├── .env.example                    # Ejemplo de .env
├── .gitignore                      # Archivos ignorados por Git
├── package.json                    # Configuración del proyecto
├── package-lock.json               # Dependencias fijadas
```

## ⚙️ Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con:
```
PORT=8080
NODE_ENV=development
MONGO_URI=<TU_URI_DE_MONGODB>
```

## 📚 Documentación Adicional
- **API**: Consulta `docs/API.md` para detalles de los endpoints y ejemplos de uso.
- **Postman**: Usa `docs/postman/postman_collection.json` para pruebas automatizadas.
```