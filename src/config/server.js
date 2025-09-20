const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

module.exports = () => {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);

    app.engine('handlebars', handlebars.engine({
        extname: '.handlebars',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, '../views/layouts'),
        partialsDir: path.join(__dirname, '../views/partials')
    }));
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, '../views'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../../public')));

    app.set('io', io);

    return { app, httpServer, io };
};