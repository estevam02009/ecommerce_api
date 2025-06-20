require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Connect to Redis
const redisClient = new Redis(process.env.REDIS_URI);
redisClient.on('connect', () => console.log('Conectado ao Redis!'));
redisClient.on('error', (err) => console.error('Erro ao conectar ao Redis:', err));

// Exportar o cliente Redis para uso em outros módulos
app.set('redisClient', redisClient);

// Rotas serão importadas aqui futuramente
app.get('/', (req, res) => {
    res.send('Bem-vindo à API de E-commerce!');
}); 

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});