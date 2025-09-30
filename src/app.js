const express = require('express');
const serverConfig = require('./config/server')();
const app = serverConfig.app;
const httpServer = serverConfig.httpServer;
const io = serverConfig.io;
const { port } = require('./config/environment');
const registerRoutes = require('./routes');
const { notFound, serverError } = require('./middleware/errorHandler');
const ProductsService = require('./services/productsService');
const CartsService = require('./services/cartsService');
const connectDB = require('./config/database');
const path = require('path');
const Cart = require('./models/Cart');

connectDB();

registerRoutes(app); 

app.get('/health', (req, res) => {
    res.json({ status: 'Backend en funcionamiento', timestamp: new Date().toISOString() });
});

const productService = new ProductsService();
const cartsService = new CartsService();
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    
    try {
        const products = await productService.getAllProducts();
        socket.emit('updateProducts', products.payload);
    } catch (error) {
        socket.emit('error', error.message);
    }

    socket.on('addProduct', async (productData) => {
        try {
            await productService.addProduct(productData);
            const products = await productService.getAllProducts();
            io.emit('updateProducts', products.payload);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            const carts = await Cart.find({ 'products.product': id });
            for (const cart of carts) {
                cart.products = cart.products.filter(p => p.product.toString() !== id);
                await cart.save();
            }
            await productService.deleteProduct(id);
            const products = await productService.getAllProducts();
            io.emit('updateProducts', products.payload);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

app.use(notFound);
app.use(serverError);

httpServer.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});