const fs = require('fs/promises');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.lastId = 0;
        this.init();
    }

    async init() {
        try {
            const dir = path.dirname(this.path);
            await fs.mkdir(dir, { recursive: true });
            
            try {
                await fs.access(this.path);
            } catch (error) {
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
            }

            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.lastId = Math.max(...this.products.map(p => typeof p.id === 'number' ? p.id : 0));
            }
        } catch (error) {
            console.error('Error inicializando ProductManager:', error);
            throw error;
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error guardando productos:', error);
            throw error;
        }
    }

    generateId() {
        this.lastId += 1;
        return this.lastId;
    }

    async getProducts() {
        await this.init();
        return this.products;
    }

    async getProductById(id) {
        await this.init();
        const product = this.products.find(p => p.id == id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async addProduct(productData) {
        const { title, description, code, price, stock, category } = productData;
        let thumbnails = productData.thumbnails;
        if (!thumbnails && Array.isArray(productData.thumbnails) && productData.thumbnails.length > 0) {
            thumbnails = productData.thumbnails[0];
        }

        if (!title || !description || !code || price === undefined || stock === undefined || !category || !thumbnails) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (typeof price !== 'number' || isNaN(price) || price < 0) {
            throw new Error('El campo price debe ser un número mayor o igual a 0');
        }
        if (typeof stock !== 'number' || isNaN(stock) || stock < 0) {
            throw new Error('El campo stock debe ser un número mayor o igual a 0');
        }

        const codeExists = this.products.some(p => p.code === code);
        if (codeExists) throw new Error('El código del producto ya existe');

        const newProduct = {
            id: this.generateId(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(p => p.id == id);
        if (productIndex === -1) throw new Error('Producto no encontrado');

        if ('id' in updatedFields) delete updatedFields.id;

        if ('price' in updatedFields) {
            if (typeof updatedFields.price !== 'number' || isNaN(updatedFields.price) || updatedFields.price < 0) {
                throw new Error('El campo price debe ser un número mayor o igual a 0');
            }
        }
        if ('stock' in updatedFields) {
            if (typeof updatedFields.stock !== 'number' || isNaN(updatedFields.stock) || updatedFields.stock < 0) {
                throw new Error('El campo stock debe ser un número mayor o igual a 0');
            }
        }

        if ('thumbnails' in updatedFields && Array.isArray(updatedFields.thumbnails) && updatedFields.thumbnails.length > 0) {
            updatedFields.thumbnails = updatedFields.thumbnails[0];
            delete updatedFields.thumbnails;
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields
        };

        await this.saveProducts();
        return this.products[productIndex];
    }

    async deleteProduct(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id != id);

        if (this.products.length === initialLength) {
            throw new Error('Producto no encontrado');
        }

        await this.saveProducts();
        return { message: 'Producto eliminado exitosamente' };
    }
}

module.exports = { ProductManager };