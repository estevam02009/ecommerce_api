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
};

// Obter produto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter produto' });
    }
};

// Atualizar produto (Apenas Admin)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true  });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
};

// Excluir produto (Apenas Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto excluído com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir produto' });
    }
};

// Atualizar estoque  (Ação transacional, geralmente parte de um fluxo de pedido)
// Este é um exemplo simplificado. Em um sistema real, seria parte de uma transação de pedido.
exports.updateStock = async (req, res) => {
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantidade inválida' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        if (product.estoque < quantity) {
            return res.status(400).json({ message: 'Estoque insuficiente' });
        }

        // Atualização atomica do estoque
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $inc: { estoque: -quantity } }, // $inc é um operador que incrementa o valor de um campo
            { new: true }
        );

        res.json({ message: 'Estoque atualizado com sucesso', newStock: updatedProduct.estoque });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar estoque' });
    }
}

module.exports = productController;
