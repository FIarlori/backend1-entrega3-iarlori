const path = require('path');
const { CartManager } = require('../utils/fileManager');

class CartsService {
    constructor() {
        const cartsPath = path.join(__dirname, '../data/carts.json');
        const productsPath = path.join(__dirname, '../data/products.json');
        this.cartManager = new CartManager(cartsPath, productsPath);
    }

    async createCart() {
        return await this.cartManager.createCart();
    }

    async getCart(id) {
        return await this.cartManager.getCartById(id);
    }

    async addProductToCart(cartId, productId) {
        return await this.cartManager.addProductToCart(cartId, productId);
    }
}

module.exports = CartsService;