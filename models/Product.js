const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    categoria: { type: String, required: true },
    marca: { type: String },
    imagens: [{ type: String }], // Array de URLs de imagens
    atributos: [{
        nome: { type: String, required: true },
        valor: { type: String, required: true },
    }],
    estoque: { type: Number, required: true, min: 0, default: 0 },
    ativo: { type: Boolean, default: true },
    createsAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware para atualizar o campo updatedAt antes de salvar
productSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model("Product", productSchema);