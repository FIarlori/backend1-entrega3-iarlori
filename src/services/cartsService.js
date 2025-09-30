const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

class CartsService {
    async createCart() {
        const cart = new Cart({ products: [] });
        await cart.save();
        return cart;
    }

    async getCart(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Carrito no encontrado');
        }

        const cart = await Cart.findById(id).populate('products.product');
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    async addProductToCart(cartId, productId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Carrito no encontrado');
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('El producto no existe');
        }

        const product = await Product.findById(productId);
        if (!product) throw new Error('El producto no existe');
        if (product.stock <= 0) throw new Error('No hay stock disponible para este producto');

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        let newQuantity = 1;
        if (existingProduct) {
            newQuantity = existingProduct.quantity + 1;
            if (newQuantity > product.stock) {
                throw new Error('No puedes agregar más unidades, has alcanzado el stock disponible');
            }
            existingProduct.quantity = newQuantity;
        } else {
            if (newQuantity > product.stock) {
                throw new Error('No puedes agregar más unidades, has alcanzado el stock disponible');
            }
            cart.products.push({ product: productId, quantity: newQuantity });
        }

        await cart.save();
        return this.getCart(cartId);
    }

async deleteProductFromCart(cartId, productId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Carrito no encontrado');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (existingProductIndex === -1) throw new Error('Producto no encontrado en el carrito');

    cart.products.splice(existingProductIndex, 1);
    await cart.save();
    return await Cart.findById(cartId).populate('products.product');
}

    async updateCart(cartId, products) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Carrito no encontrado');
        }

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('El cuerpo de la solicitud debe contener un array de productos válido');
        }

        const invalidProducts = products.filter(p => !mongoose.Types.ObjectId.isValid(p.product));
        if (invalidProducts.length > 0) {
            throw new Error('Productos inválidos: los IDs de producto deben ser válidos');
        }

        const invalidQuantities = products.filter(p => typeof p.quantity !== 'number' || isNaN(p.quantity) || p.quantity < 1);
        if (invalidQuantities.length > 0) {
            throw new Error('Las cantidades deben ser números válidos mayores o iguales a 1');
        }

        cart.products = products.map(p => ({
            product: p.product,
            quantity: p.quantity
        }));
        await cart.save();
        return this.getCart(cartId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Carrito no encontrado');
        }

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = cart.products.find(p => p.product.toString() === productId);
        if (!product) throw new Error('Producto no encontrado en el carrito');

        product.quantity = quantity;
        await cart.save();
        return this.getCart(cartId);
    }

    async clearCart(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Carrito no encontrado');
        }

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        await cart.save();
        return this.getCart(cartId);
    }
}

module.exports = CartsService;