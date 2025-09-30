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
        console.log('addProductToCart - cartId:', req.params.cid, 'productId:', req.params.pid);
        try {
            const cart = await this.cartsService.addProductToCart(req.params.cid, req.params.pid);
            res.json(cart);
        } catch (error) {
            console.error('Error en addProductToCart:', error);
            res.status(400).json({ error: error.message });
        }
    }

async deleteProductFromCart(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const result = await this.cartsService.deleteProductFromCart(cartId, productId);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

    async updateCart(req, res) {
        try {
            const cart = await this.cartsService.updateCart(req.params.cid, req.body.products);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { quantity } = req.body;
            if (typeof quantity !== 'number' || quantity < 1) {
                throw new Error('La cantidad debe ser un número mayor o igual a 1');
            }
            const cart = await this.cartsService.updateProductQuantity(req.params.cid, req.params.pid, quantity);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const cart = await this.cartsService.clearCart(req.params.cid);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = CartsController;