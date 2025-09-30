const Product = require('../models/Product');

class ProductsService {
    async getProducts({ filter = {}, options = {} } = {}) {
        const { limit = 10, page = 1, sort } = options;
        let finalFilter = { ...filter };

        const finalOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort && Object.keys(sort).length > 0 ? sort : undefined,
            customLabels: {
                docs: 'payload',
                totalDocs: 'totalDocs',
                limit: 'limit',
                page: 'page',
                nextPage: 'nextPage',
                prevPage: 'prevPage',
                totalPages: 'totalPages',
                hasNextPage: 'hasNextPage',
                hasPrevPage: 'hasPrevPage',
                pagingCounter: 'pagingCounter'
            }
        };

        const result = await Product.paginate(finalFilter, finalOptions);

        const baseUrl = `/products?limit=${limit}`;
        const availableStr = filter.available === 'true' ? '&available=true' : '';
        const categoryStr = filter.category ? `&category=${encodeURIComponent(filter.category)}` : '';
        const sortStr = sort && sort.price === 1 ? '&sort=asc' : sort && sort.price === -1 ? '&sort=desc' : '';

        return {
            status: 'success',
            payload: result.payload,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}${sortStr}${availableStr}${categoryStr}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}&page=${result.nextPage}${sortStr}${availableStr}${categoryStr}` : null
        };
    }

    async getAllProducts({ filter = {}, sort = {} } = {}) {
        const products = await Product.find(filter).sort(sort && Object.keys(sort).length > 0 ? sort : undefined);
        return {
            status: 'success',
            payload: products
        };
    }

    async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async addProduct(productData) {
        const { title, description, code, price, stock, category, thumbnails } = productData;
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            throw new Error('Todos los campos son obligatorios');
        }
        if (typeof price !== 'number' || isNaN(price) || price < 0) {
            throw new Error('El campo price debe ser un número mayor o igual a 0');
        }
        if (typeof stock !== 'number' || isNaN(stock) || stock < 0) {
            throw new Error('El campo stock debe ser un número mayor o igual a 0');
        }
        const codeExists = await Product.findOne({ code });
        if (codeExists) throw new Error('El código del producto ya existe');

        const product = new Product({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || []
        });
        await product.save();
        return product;
    }

    async updateProduct(id, updatedFields) {
        if ('id' in updatedFields) delete updatedFields.id;
        if ('price' in updatedFields && (typeof updatedFields.price !== 'number' || isNaN(updatedFields.price) || updatedFields.price < 0)) {
            throw new Error('El campo price debe ser un número mayor o igual a 0');
        }
        if ('stock' in updatedFields && (typeof updatedFields.stock !== 'number' || isNaN(updatedFields.stock) || updatedFields.stock < 0)) {
            throw new Error('El campo stock debe ser un número mayor o igual a 0');
        }

        const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async deleteProduct(id) {
        const product = await Product.findByIdAndDelete(id);
        if (!product) throw new Error('Producto no encontrado');
        return { message: 'Producto eliminado exitosamente' };
    }
}

module.exports = ProductsService;