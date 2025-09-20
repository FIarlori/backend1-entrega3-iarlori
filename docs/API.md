# API Documentation

## Products Endpoints
- **GET /api/products**: List all products.
- **GET /api/products/:pid**: Get a product by ID.
- **POST /api/products**: Create a new product.
- **PUT /api/products/:pid**: Update a product.
- **DELETE /api/products/:pid**: Delete a product.

## Carts Endpoints
- **POST /api/carts**: Create a new cart.
- **GET /api/carts/:cid**: Get a cart by ID.
- **POST /api/carts/:cid/product/:pid**: Add a product to a cart.