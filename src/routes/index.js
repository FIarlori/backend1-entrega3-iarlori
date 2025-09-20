const { Router } = require('express');
const apiCartsRouter = require('./api/carts');
const apiProductsRouter = require('./api/products');
const webViewsRouter = require('./web/views');

module.exports = (app) => {
    app.use('/api/carts', apiCartsRouter);
    app.use('/api/products', apiProductsRouter);
    app.use('/', webViewsRouter);
};