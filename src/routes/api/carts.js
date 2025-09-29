const { Router } = require('express');
const CartsController = require('../../controllers/cartsController');

const router = Router();
const cartsController = new CartsController();

router.post('/', cartsController.createCart.bind(cartsController));
router.get('/:cid', cartsController.getCart.bind(cartsController));
router.post('/:cid/product/:pid', cartsController.addProductToCart.bind(cartsController));
router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart.bind(cartsController));
router.put('/:cid', cartsController.updateCart.bind(cartsController));
router.put('/:cid/products/:pid', cartsController.updateProductQuantity.bind(cartsController));
router.delete('/:cid', cartsController.clearCart.bind(cartsController));

module.exports = router;