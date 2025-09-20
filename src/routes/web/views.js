const { Router } = require('express');
const ViewsController = require('../../controllers/viewsController');

const router = Router();
const viewsController = new ViewsController();

router.get('/', viewsController.getHome.bind(viewsController));
router.get('/realtimeproducts', viewsController.getRealTimeProducts.bind(viewsController));

module.exports = router;