"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarJogador = exports.buscarJogadorPorId = exports.listarJogadores = exports.atualizarJogador = exports.criarJogador = void 0;
const yup_1 = require("yup");
const jogadorRepository_1 = require("../repositories/jogadorRepository");
const jogadorSchema_1 = require("../validations/jogadorSchema");
const criarJogador = async (jogador) => {
    try {
        await jogadorSchema_1.jogadorCreateSchema.validate(jogador, { abortEarly: false });
        jogador.createAt = new Date();
        jogador.isDeleted = false;
        jogador.updateAt = new Date();
        const newJogador = jogadorRepository_1.jogadorRepository.create(jogador);
        await jogadorRepository_1.jogadorRepository.save(newJogador);
        return { mensagem: "Jogador cadastrado com sucesso!", jogador: newJogador };
    }
    catch (erro) {
        if (erro instanceof yup_1.ValidationError) {
            return { erro: erro.errors, status: 400 }; // 400 Bad Request
        }
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.criarJogador = criarJogador;
const atualizarJogador = async (id, jogador) => {
    try {
        const jogadorUpdate = await jogadorRepository_1.jogadorRepository.findOneBy({ id, isDeleted: false });
        if (!jogadorUpdate) {
            return { erro: "Jogador não encontrado", status: 404 }; // 404 Not Found
        }
        await jogadorSchema_1.jogadorUpdateSchema.validate(jogador, { abortEarly: false });
        await jogadorRepository_1.jogadorRepository.update(id, {
            ...jogador,
            updateAt: new Date()
        });
        const jogadorAtualizado = await jogadorRepository_1.jogadorRepository.findOneBy({ id });
        return { mensagem: "Jogador atualizado com sucesso!", jogador: jogadorAtualizado };
    }
    catch (erro) {
        if (erro instanceof yup_1.ValidationError) {
            return { erro: erro.errors, status: 400 }; // 400 Bad Request
        }
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.atualizarJogador = atualizarJogador;
const listarJogadores = async () => {
    try {
        const allJogador = await jogadorRepository_1.jogadorRepository.find({ where: { isDeleted: false } });
        return { mensagem: "Jogadores listados com sucesso!", jogadores: allJogador };
    }
    catch (erro) {
        return { erro: "Erro ao listar jogadores", status: 500 }; // 500 Internal Server Error
    }
};
exports.listarJogadores = listarJogadores;
const buscarJogadorPorId = async (id) => {
    try {
        const jogador = await jogadorRepository_1.jogadorRepository.findOneBy({ id, isDeleted: false });
        if (!jogador) {
            return { erro: "Jogador não encontrado", status: 404 }; // 404 Not Found
        }
        return { mensagem: "Jogador encontrado com sucesso!", jogador };
    }
    catch (erro) {
        if (erro instanceof yup_1.ValidationError) {
            return { erro: erro.errors, status: 400 }; // 400 Bad Request
        }
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.buscarJogadorPorId = buscarJogadorPorId;
const deletarJogador = async (id) => {
    try {
        const jogadorUpdate = await jogadorRepository_1.jogadorRepository.findOneBy({ id, isDeleted: false });
        if (!jogadorUpdate) {
            return { erro: "Jogador não encontrado", status: 404 }; // 404 Not Found
        }
        await jogadorRepository_1.jogadorRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        });
        const jogadorDeletado = await jogadorRepository_1.jogadorRepository.findOneBy({ id });
        return { mensagem: "Jogador deletado com sucesso!", jogador: jogadorDeletado };
    }
    catch (erro) {
        if (erro instanceof yup_1.ValidationError) {
            return { erro: erro.errors, status: 400 }; // 400 Bad Request
        }
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.deletarJogador = deletarJogador;
