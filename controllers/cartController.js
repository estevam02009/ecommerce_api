const Product = require('./models/product');

exports.getCart = async (req, res) => {
    const redisClient = req.app.get('redisClient');
    const userId = req.user.id; // Supondo que você tenha um middleware de autenticação

    try {
        const cartItemJson = await redisClient.get(`cart:${userId}`);

        if (!cartItemJson) {
            return res.json({ message: 'Carrinho vazio.', items: [] });
        }

        const cartItems = JSON.parse(cartItemJson);
        // Opcional: Buscar os produtos no banco de dados para obter informações detalhadas
        const productIds = cartItems.map(item => item.productId);
        const productsDetails = await Product.find({ _id: { $in: productIds } }).select('nome preco imagens');

        const detailedCart = cartItems.map(item => {
            const product = productsDetails.find(p => p._id.toString() === item.productId);
            return product ? { ...item, nome: product.nome, preco: product.preco, imagem: product.imagens[0] } : item;
        });

        res.json({ message: 'Carrinho obtido com sucesso.', items: detailedCart });
    } catch (error) {
        console.error('Erro ao obter o carrinho:', error);
        res.status(500).json({ error: 'Erro ao obter o carrinho' });
    }
}