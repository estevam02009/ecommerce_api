const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Gerar token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token expira em 1 hora
    });
};

// Registrar usuário
const registerUser = async (req, res) => {
    const { nome, email, senha, role } = req.body;

    try {
        // Verificar se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Usuário já existe com este email." });
        }

        const user = await User.create({  // Corrigido de 'user.create' para 'User.create'
            nome,
            email,
            senha,
            role,
        });

        res.status(201).json({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

// Login de usuário
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado. Email ou senhas inválidos." });
        }

        const isMatch = await user.matchPassword(senha);
        if (!isMatch) {
            return res.status(401).json({ message: "Usuário não encontrado. Email ou senhas inválidos." });
        }

        res.json({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

module.exports = { registerUser, loginUser };