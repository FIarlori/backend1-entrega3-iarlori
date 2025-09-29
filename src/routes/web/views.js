const { Router } = require('express');
const ViewsController = require('../../controllers/viewsController');

const router = Router();
const viewsController = new ViewsController();

router.get('/', viewsController.getHome.bind(viewsController));
router.get('/products', viewsController.getHome.bind(viewsController));
router.get('/realtimeproducts', viewsController.getRealTimeProducts.bind(viewsController));
router.get('/products/:pid', viewsController.getProductDetail.bind(viewsController));
router.get('/carts/:cid', viewsController.getCart.bind(viewsController));
router.get('/cart', (req, res) => {
    const cartId = req.session.cartId;
    if (cartId) {
        res.redirect(`/carts/${cartId}`);
    } else {
        res.redirect('/products');
    }
});

module.exports = router;