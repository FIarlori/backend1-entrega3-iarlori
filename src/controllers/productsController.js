const ProductsService = require('../services/productsService');

class ProductsController {
    constructor() {
        this.productsService = new ProductsService();
    }

    async getProducts(req, res) {
        try {
            const { limit, page, sort, query, available } = req.query;
            const parsedQuery = query ? JSON.parse(query) : {};
            let filter = { ...parsedQuery };

            if (available === 'true') {
                filter.stock = { $gt: 0 };
            }

            const products = await this.productsService.getProducts({
                filter,
                options: {
                    limit: limit ? parseInt(limit) : 10,
                    page: page ? parseInt(page) : 1,
                    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
                }
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await this.productsService.getProductById(req.params.pid);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async addProduct(req, res) {
        try {
            const product = await this.productsService.addProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await this.productsService.updateProduct(req.params.pid, req.body);
            res.json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const result = await this.productsService.deleteProduct(req.params.pid);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = ProductsController;