const mongoose = require('mongoose');
const { mongoUri } = require('./environment');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;