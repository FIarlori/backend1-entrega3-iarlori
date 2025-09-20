const ProductsService = require('../services/productsService');

class ViewsController {
    constructor() {
        this.productsService = new ProductsService();
    }

    async getHome(req, res) {
        try {
            const products = await this.productsService.getProducts();
            res.render('pages/home', { title: 'Home', products });
        } catch (error) {
            res.render('pages/home', { title: 'Home', error: error.message, products: [] });
        }
    }

    async getRealTimeProducts(req, res) {
        try {
            const products = await this.productsService.getProducts();
            res.render('pages/realTimeProducts', { title: 'Real-Time Products', products });
        } catch (error) {
            res.render('pages/realTimeProducts', { title: 'Real-Time Products', error: error.message, products: [] });
        }
    }
}

module.exports = ViewsController;