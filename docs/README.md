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
- **socket.io**: Para actualizaciones en tiempo real vía WebSockets
- **dotenv**: Para cargar variables de entorno desde `.env`
- **mongoose**: ORM para MongoDB
- **mongoose-paginate-v2**: Paginación avanzada en MongoDB
- **nodemon** (dev): Para recarga automática en desarrollo

## 🌐 Endpoints disponibles

### API de Productos
| Método | Endpoint                     | Descripción                         |
|--------|------------------------------|-------------------------------------|
| GET    | `/api/products`              | Obtener todos los productos (paginación, filtros, ordenamiento) |
| GET    | `/api/products/:pid`         | Obtener producto por ID             |
| POST   | `/api/products`              | Crear nuevo producto                |
| PUT    | `/api/products/:pid`         | Actualizar producto                 |
| DELETE | `/api/products/:pid`         | Eliminar producto                   |

#### Parámetros de consulta para GET `/api/products`
- `limit`: cantidad de productos por página (default: 10)
- `page`: número de página (default: 1)
- `sort`: `asc` o `desc` (por precio)
- `query`: objeto JSON para filtrar por `category` o `stock > 0` (ejemplo: `{"category":"Electrónica"}`)

### API de Carritos
| Método | Endpoint                     | Descripción                         |
|--------|------------------------------|-------------------------------------|
| POST   | `/api/carts`                 | Crear nuevo carrito                 |
| GET    | `/api/carts/:cid`            | Obtener carrito por ID (con productos populados) |
| POST   | `/api/carts/:cid/product/:pid` | Agregar producto al carrito       |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito     |
| PUT    | `/api/carts/:cid`            | Actualizar todos los productos del carrito (array) |
| PUT    | `/api/carts/:cid/products/:pid` | Actualizar cantidad de un producto en el carrito |
| DELETE | `/api/carts/:cid`            | Vaciar el carrito                  |

### Vistas
| Método | Endpoint         | Descripción                         |
|--------|------------------|-------------------------------------|
| GET    | `/`              | Vista estática de bienvenida        |
| GET    | `/products`      | Vista paginada de productos         |
| GET    | `/products/:pid` | Vista de detalle de producto        |
| GET    | `/carts/:cid`    | Vista de carrito específico         |
| GET    | `/realtimeproducts` | Vista en tiempo real con WebSockets |

## 🖼️ Vistas
- **Inicio (`/`)**: Página estática de bienvenida con enlaces a otras vistas.
- **Productos (`/products`)**: Lista paginada de productos con filtros y ordenamiento.
- **Detalle de Producto (`/products/:pid`)**: Muestra detalles completos y botón para agregar al carrito.
- **Carrito (`/carts/:cid`)**: Lista los productos del carrito, permite eliminar productos.
- **RealTimeProducts (`/realtimeproducts`)**: Muestra productos en tiempo real usando WebSockets. Incluye formulario para agregar y botones para eliminar productos.
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
- Abre `/` para ver la página de bienvenida.
- Abre `/products` para ver la lista paginada de productos.
- Abre `/products/:pid` para ver el detalle y agregar al carrito.
- Abre `/carts/:cid` para ver el carrito y eliminar productos.
- Abre `/realtimeproducts` para interactuar con productos en tiempo real.

## 🚦 Flujo de prueba de la API

1. **Productos**
   - `GET /api/products`  
     → Devuelve lista paginada y filtrada de productos.
   - `GET /api/products/:pid`  
     → Devuelve el producto por ID.
   - `POST /api/products`  
     → Crea un producto.  
     Body ejemplo:
     ```json
     {
       "title": "Teclado Mecánico",
       "description": "Teclado RGB switches azules",
       "code": "TEC001",
       "price": 89.99,
       "stock": 30,
       "category": "Periféricos",
       "thumbnails": ["img/teclado1.jpg"]
     }
     ```
   - `PUT /api/products/:pid`  
     → Actualiza campos del producto.
   - `DELETE /api/products/:pid`  
     → Elimina el producto.

2. **Carritos**
   - `POST /api/carts`  
     → Crea un carrito vacío.
   - `GET /api/carts/:cid`  
     → Devuelve el carrito con productos populados.
   - `POST /api/carts/:cid/product/:pid`  
     → Agrega producto al carrito (incrementa cantidad si ya existe).
   - `DELETE /api/carts/:cid/products/:pid`  
     → Elimina producto del carrito.
   - `PUT /api/carts/:cid`  
     → Actualiza todos los productos del carrito.  
     Body ejemplo:
     ```json
     {
       "products": [
         { "product": "ID_DEL_PRODUCTO", "quantity": 2 }
       ]
     }
     ```
   - `PUT /api/carts/:cid/products/:pid`  
     → Actualiza cantidad de un producto en el carrito.  
     Body ejemplo:
     ```json
     { "quantity": 5 }
     ```
   - `DELETE /api/carts/:cid`  
     → Vacía el carrito.

3. **Vistas**
   - `/`  
     → Página de bienvenida estática.
   - `/products`  
     → Lista paginada de productos.
   - `/products/:pid`  
     → Detalle de producto y botón para agregar al carrito.
   - `/carts/:cid`  
     → Vista del carrito con productos y opción de eliminar.
   - `/realtimeproducts`  
     → Vista en tiempo real para agregar/eliminar productos (WebSockets).

4. **WebSockets**
   - Abre dos ventanas en `/realtimeproducts`.
   - Agrega o elimina productos en una ventana y verifica que la lista se actualiza en ambas.

5. **Manejo de errores**
   - Prueba rutas inexistentes para ver la vista 404.
   - Prueba errores en la API (por ejemplo, elimina un producto inexistente) para ver respuestas de error.

6. **Salud del backend**
   - Accede a `/health` para comprobar que el backend está funcionando.

---

**Tip:**  
Puedes seguir el orden:  
1. Crear productos  
2. Crear carrito  
3. Agregar productos al carrito  
4. Ver y modificar el carrito  
5. Probar vistas y WebSockets  
6. Probar manejo de errores

---

## 📂 Estructura del Proyecto
El proyecto sigue una arquitectura modular basada en el stack MEHN, separando responsabilidades en capas (configuraciones, controladores, servicios, rutas, vistas).

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
│   ├── 📁 views/
│   │   ├── 📁 errors/
│   │   │   ├── 404.handlebars    # Vista para error 404
│   │   │   ├── 500.handlebars    # Vista para error 500
│   │   ├── 📁 layouts/
│   │   │   ├── main.handlebars   # Layout principal para vistas
│   │   ├── 📁 pages/
│   │   │   ├── home.handlebars   # Vista estática de bienvenida
│   │   │   ├── products.handlebars # Vista paginada de productos
│   │   │   ├── productDetail.handlebars # Vista de detalle de producto
│   │   │   ├── cart.handlebars   # Vista de carrito
│   │   │   ├── realTimeProducts.handlebars # Vista en tiempo real
│   │   ├── 📁 partials/
│   │   │   ├── header.handlebars # Encabezado reutilizable
│   │   │   ├── footer.handlebars # Pie de página reutilizable
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
MONGO_URI=<TU_URI_DE_MONGODB>
```

## 📚 Documentación Adicional
- **API**: Consulta `docs/API.md` para detalles de los endpoints y ejemplos de uso.
- **Postman**: Usa `docs/postman/postman_collection.json` para pruebas automatizadas.
```