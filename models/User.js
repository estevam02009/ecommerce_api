const mogoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mogoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    senha: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ["cliente", "admin"], default: "cliente" },
    createdAt: { type: Date, default: Date.now }
});

// Pré-save hook para criptografar a senha antes de salvar no banco de dados
UserSchema.pre("save", async function (next) {
    if (!this.isModified("senha")) {
        return next();
    }

    const salt  =await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Metodo para comparar a senha fornecida com a senha criptografada no banco de dados
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.senha);
};

module.exports = mogoose.model("User", UserSchema);