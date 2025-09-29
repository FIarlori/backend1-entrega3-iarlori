const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const session = require('express-session');

module.exports = () => {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);

    app.engine('handlebars', handlebars.engine({
        extname: '.handlebars',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, '../views/layouts'),
        partialsDir: path.join(__dirname, '../views/partials'),
        helpers: {
            multiply: (a, b) => (Number(a) || 0) * (Number(b) || 0),
            selectedSort: function (value, options) {
                return (options.data.root.sort === value) ? 'selected' : '';
            },
            reduce: function (array, priceField, qtyField) {
                if (!Array.isArray(array)) return 0;
                return array.reduce((sum, item) => {
                    const price = Number(item[priceField]?.price) || 0;
                    const qty = Number(item[qtyField]) || 0;
                    return sum + (price * qty);
                }, 0);
            },
            eq: function (a, b) {
                return a === b;
            }
        }
    }));
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, '../views'));

    app.use(session({
        secret: 'tu_secreto_aqui',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../../public')));

    app.set('io', io);

    return { app, httpServer, io };
};