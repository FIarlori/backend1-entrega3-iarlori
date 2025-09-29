const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartsService {
    async createCart() {
        const cart = new Cart({ products: [] });
        await cart.save();
        return cart;
    }

    async getCart(id) {
        const cart = await Cart.findById(id).populate('products.product');
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    async addProductToCart(cartId, productId) {
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
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        return this.getCart(cartId);
    }

    async updateCart(cartId, products) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = products.map(p => ({
            product: p.product,
            quantity: p.quantity
        }));
        await cart.save();
        return this.getCart(cartId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = cart.products.find(p => p.product.toString() === productId);
        if (!product) throw new Error('Producto no encontrado en el carrito');

        product.quantity = quantity;
        await cart.save();
        return this.getCart(cartId);
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        await cart.save();
        return this.getCart(cartId);
    }
}

module.exports = CartsService;