const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rotas (requer autenticação)
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Obetr o token do cabeçalho

            const decoder = jwt.verify(token, process.env.JWT_SECRET); // Verificar e decodificar o token

            req.user = await User.findById(decoder.id).select('-senha'); // Obter o usuário do token e excluir a senha
            req.user.role = decoder.role; // Garantir que a role seja atualizada

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Não autorizado. Token inválido.' });
        }

        if (!token) {
            res.status(401).json({ message: 'Não autorizado. Token ausente.' });
        }
    }
};

// Autorização de roles específicas
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Acesso negado: Usuário com role '${req.user.role}' não tem permissão para acessar esta rota.` });
        }
        next();
    };
};