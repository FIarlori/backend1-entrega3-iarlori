const serverConfig = require('./config/server')();
const app = serverConfig.app;
const httpServer = serverConfig.httpServer;
const io = serverConfig.io;
const { port } = require('./config/environment');
const registerRoutes = require('./routes');
const { notFound, serverError } = require('./middleware/errorHandler');
const ProductsService = require('./services/productsService');

registerRoutes(app);

app.get('/health', (req, res) => {
    res.json({ status: 'Backend en funcionamiento', timestamp: new Date().toISOString() });
});

const productService = new ProductsService();
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    
    try {
        const products = await productService.getProducts();
        socket.emit('updateProducts', products);
    } catch (error) {
        socket.emit('error', error.message);
    }

    socket.on('addProduct', async (productData) => {
        try {
            await productService.addProduct(productData);
            const products = await productService.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productService.deleteProduct(id);
            const products = await productService.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.use(notFound);
app.use(serverError);

httpServer.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});