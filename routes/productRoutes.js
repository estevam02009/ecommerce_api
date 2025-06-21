const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateStock
} = require('../controllers/productController');

const router = express.Router();

// Rotas publicas para leitura
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Rotas protegidas para criação, atualização e exclusão
router.post('/products', protect, authorizeRoles('admin'), createProduct);
router.put('/products/:id', protect, authorizeRoles('admin'), updateProduct);
router.delete('/products/:id', protect, authorizeRoles('admin'), deleteProduct);

// Rota protegida para atualizar o estoque
router.put('/stock', protect, authorizeRoles('admin'), updateStock); // Ou 'cliente' se for para reserva no carrinho, mas controlado pelo pedido

module.exports = router;
