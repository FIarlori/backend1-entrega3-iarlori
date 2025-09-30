# Documentación de la API

## Endpoints de Productos (`/api/products`)
- **GET /api/products**: Lista todos los productos con paginación, filtros y ordenamiento.
- **GET /api/products/:pid**: Obtiene un producto por su ID.
- **POST /api/products**: Crea un nuevo producto.
- **PUT /api/products/:pid**: Actualiza un producto existente.
- **DELETE /api/products/:pid**: Elimina un producto por su ID.

## Endpoints de Carritos (`/api/carts`)
- **POST /api/carts**: Crea un nuevo carrito vacío.
- **GET /api/carts/:cid**: Obtiene un carrito por su ID con productos poblados.
- **POST /api/carts/:cid/product/:pid**: Agrega un producto a un carrito.
- **DELETE /api/carts/:cid/products/:pid**: Elimina un producto de un carrito.
- **PUT /api/carts/:cid**: Actualiza todos los productos de un carrito.
- **PUT /api/carts/:cid/products/:pid**: Actualiza la cantidad de un producto en un carrito.
- **DELETE /api/carts/:cid**: Vacia todos los productos de un carrito.