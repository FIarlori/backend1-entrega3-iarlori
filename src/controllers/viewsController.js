const ProductsService = require('../services/productsService');
const CartsService = require('../services/cartsService');

class ViewsController {
    constructor() {
        this.productsService = new ProductsService();
        this.cartsService = new CartsService();
    }

async getHome(req, res) {
        try {
            const { limit = 10, page = 1, sort, available, category } = req.query;
            console.log('getHome - Parámetros:', { limit, page, sort, available, category });

            const filter = {};
            if (available === 'true') {
                filter.stock = { $gt: 0 };
            }
            if (category) {
                filter.category = category;
            }

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
            };

            const products = await this.productsService.getProducts({ filter, options });
            const plainProducts = {
                ...products,
                payload: products.payload.map(doc => doc.toObject())
            };

            let cartId = req.session.cartId;
            if (!cartId) {
                const newCart = await this.cartsService.createCart();
                cartId = newCart._id.toString();
                req.session.cartId = cartId;
                console.log('Nuevo carrito creado con ID:', cartId);
            }

            res.render('pages/home', { 
                title: 'Home', 
                ...plainProducts, 
                cartId,
                limit,
                page,
                available: available === 'true',
                category,
                sort
            });
        } catch (error) {
            console.error('Error en getHome:', error);
            res.render('pages/home', { 
                title: 'Home', 
                error: error.message, 
                payload: [], 
                totalPages: 0, 
                page: 1, 
                hasPrevPage: false, 
                hasNextPage: false, 
                prevLink: null, 
                nextLink: null, 
                cartId: null,
                limit: 10,
                available: false,
                category: '',
                sort: ''
            });
        }
    }

    async getRealTimeProducts(req, res) {
        try {
            const products = await this.productsService.getProducts({ limit: 100 });
            const plainProducts = products.payload.map(doc => doc.toObject());
            let cartId = req.session.cartId;
            if (!cartId) {
                const newCart = await this.cartsService.createCart();
                cartId = newCart._id.toString();
                req.session.cartId = cartId;
                console.log('Nuevo carrito creado en realTimeProducts con ID:', cartId);
            }
            res.render('pages/realTimeProducts', { title: 'Real-Time Products', products: plainProducts, cartId });
        } catch (error) {
            res.render('pages/realTimeProducts', { title: 'Real-Time Products', error: error.message, products: [] });
        }
    }

    async getProductDetail(req, res) {
        try {
            const product = await this.productsService.getProductById(req.params.pid);
            let cartId = req.session.cartId;
            if (!cartId) {
                const newCart = await this.cartsService.createCart();
                cartId = newCart._id.toString();
                req.session.cartId = cartId;
                console.log('Nuevo carrito creado en getProductDetail con ID:', cartId);
            }
            res.render('pages/productDetail', { title: product.title, product: product.toObject(), cartId });
        } catch (error) {
            console.error('Error en getProductDetail:', error);
            res.render('pages/productDetail', { title: 'Producto no encontrado', error: error.message, product: {}, cartId: null });
        }
    }

    async getCart(req, res) {
        try {
            const cartId = req.session.cartId;
            if (!cartId) throw new Error('No se encontró un carrito asociado a la sesión');

            const cart = await this.cartsService.getCart(cartId);
            const plainCart = {
                ...cart.toObject(),
                products: cart.products.map(item => ({
                    ...item.toObject(),
                    product: item.product.toObject()
                }))
            };
            console.log('Carrito renderizado:', plainCart);
            res.render('pages/cart', { title: `Carrito ${cartId}`, cart: plainCart });
        } catch (error) {
            console.error('Error en getCart:', error);
            res.render('pages/cart', { title: 'Carrito', error: error.message, cart: { products: [] } });
        }
    }
}

module.exports = ViewsController;