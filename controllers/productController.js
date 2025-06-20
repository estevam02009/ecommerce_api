const Product = require('../models/Product');

// Criar produto (Apenas Admin)
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar produto' });
    }
};

// Obter todos os produtos (com paginação e filtro)
exports.getProducts = async (req, res) => {
    const { page = 1, limit = 10, categoria, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (categoria) {
        query.categoria = categoria;
    }
    if (search) {
        query.$or = [
            { nome: { $regex: search, $options: 'i' } },
            { descricao: { $regex: search, $options: 'i' } },
            { sku: { $regex: search, $options: 'i' } },
        ];
    }

    try {
        const products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit))

        const totalProduct = await Product.countDocuments(query);

        res.json({
            products,
            totalProduct,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProduct / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter produtos' });
    }
}

module.exports = productController;
