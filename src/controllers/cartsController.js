const CartsService = require('../services/cartsService');

class CartsController {
    constructor() {
        this.cartsService = new CartsService();
    }

    async createCart(req, res) {
        try {
            const newCart = await this.cartsService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCart(req, res) {
        try {
            const cart = await this.cartsService.getCart(req.params.cid);
            res.json(cart);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cart = await this.cartsService.addProductToCart(req.params.cid, req.params.pid);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = CartsController;