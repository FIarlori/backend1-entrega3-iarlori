module.exports = {
    notFound: (req, res, next) => {
        res.status(404).render('errors/404', { title: 'Página no encontrada' });
    },
    serverError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).render('errors/500', { title: 'Error del servidor', error: err.message });
    }
};