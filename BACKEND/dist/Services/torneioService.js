"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarTorneio = exports.buscarTorneioPorId = exports.listarTorneios = exports.atualizarTorneio = exports.criarTorneio = void 0;
const yup_1 = require("yup");
const torneioSchema_1 = require("../validations/torneioSchema");
const torneioRepository_1 = require("../repositories/torneioRepository");
const criarTorneio = async (torneio) => {
    try {
        await torneioSchema_1.torneioCreateSchema.validate(torneio, { abortEarly: false });
        torneio.createAt = new Date();
        torneio.isDeleted = false;
        torneio.updateAt = new Date();
        const newJogador = torneioRepository_1.torneioRepository.create(torneio);
        await torneioRepository_1.torneioRepository.save(newJogador);
        return { mensagem: "O torneio cadastrado com sucesso!", jogador: newJogador };
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
exports.criarTorneio = criarTorneio;
const atualizarTorneio = async (id, torneio) => {
    try {
        const torneioUpdate = await torneioRepository_1.torneioRepository.findOneBy({ id, isDeleted: false });
        if (!torneioUpdate) {
            return { erro: "Torneio não encontrado", status: 404 }; // 404 Not Found
        }
        await torneioSchema_1.atualizarTorneioSchema.validate(torneio, { abortEarly: false });
        await torneioRepository_1.torneioRepository.update(id, {
            ...torneio,
            updateAt: new Date()
        });
        const torneioAtualizado = await torneioRepository_1.torneioRepository.findOneBy({ id });
        return { mensagem: "Torneio atualizado com sucesso!", torneio: torneioAtualizado };
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
exports.atualizarTorneio = atualizarTorneio;
const listarTorneios = async () => {
    try {
        const allTorneio = await torneioRepository_1.torneioRepository.find({ where: { isDeleted: false } });
        return { mensagem: "Torneio listado com sucesso!", torneios: allTorneio };
    }
    catch (erro) {
        return { erro: "Erro ao listar torneio", status: 500 }; // 500 Internal Server Error
    }
};
exports.listarTorneios = listarTorneios;
const buscarTorneioPorId = async (id) => {
    try {
        const torneio = await torneioRepository_1.torneioRepository.find({ where: { id, isDeleted: false }, relations: ['equipes'] });
        if (!torneio) {
            return { erro: "Torneio não encontrado", status: 404 }; // 404 Not Found
        }
        return { mensagem: "Torneio encontrado com sucesso!", torneio };
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
exports.buscarTorneioPorId = buscarTorneioPorId;
const deletarTorneio = async (id) => {
    try {
        const torneioUpdate = await torneioRepository_1.torneioRepository.findOneBy({ id, isDeleted: false });
        if (!torneioUpdate) {
            return { erro: "Torneio não encontrado", status: 404 }; // 404 Not Found
        }
        await torneioRepository_1.torneioRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        });
        const torneioDeletado = await torneioRepository_1.torneioRepository.findOneBy({ id });
        return { mensagem: "Torneio deletado com sucesso!", jogador: torneioDeletado };
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
exports.deletarTorneio = deletarTorneio;
