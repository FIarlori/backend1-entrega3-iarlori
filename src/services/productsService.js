const path = require('path');
const { ProductManager } = require('../utils/fileManager');

class ProductsService {
    constructor() {
        const productsPath = path.join(__dirname, '../data/products.json');
        this.productManager = new ProductManager(productsPath);
    }

    async getProducts() {
        return await this.productManager.getProducts();
    }

    async getProductById(id) {
        return await this.productManager.getProductById(id);
    }

    async addProduct(productData) {
        return await this.productManager.addProduct(productData);
    }

    async updateProduct(id, updatedFields) {
        return await this.productManager.updateProduct(id, updatedFields);
    }

    async deleteProduct(id) {
        return await this.productManager.deleteProduct(id);
    }
}

module.exports = ProductsService;