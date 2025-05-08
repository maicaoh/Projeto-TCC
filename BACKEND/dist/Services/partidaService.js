"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarPartida = exports.buscarPartidaPorId = exports.listarPartidas = exports.atualizarPartida = exports.criarPartida = void 0;
const yup_1 = require("yup");
const partidaSchema_1 = require("../validations/partidaSchema");
const partidaRepository_1 = require("../repositories/partidaRepository");
const torneioRepository_1 = require("../repositories/torneioRepository");
const quadraRepository_1 = require("../repositories/quadraRepository");
const criarPartida = async (idTorneio, data) => {
    try {
        const { idQuadra, publicoPresente } = data;
        await partidaSchema_1.partidaCreateSchema.validate(data, { abortEarly: false });
        const torneio = await torneioRepository_1.torneioRepository.findOneBy({ id: idTorneio, isDeleted: false });
        const quadra = await quadraRepository_1.quadraRepository.findOneBy({ id: idQuadra, isDeleted: false });
        if (!torneio) {
            return { erro: "Torneio não encontrado", status: 404 }; // 404 Not Found 
        }
        if (!quadra && idQuadra) {
            return { erro: "Quadra não encontrada", status: 404 }; // 404 Not Found 
        }
        const newPartida = partidaRepository_1.partidaRepository.create(data);
        newPartida.createAt = new Date();
        newPartida.isDeleted = false;
        newPartida.updateAt = new Date();
        newPartida.torneio = torneio;
        newPartida.publicoPresente = publicoPresente;
        if (quadra) {
            newPartida.quadra = quadra;
        }
        await partidaRepository_1.partidaRepository.save(newPartida);
        return { mensagem: "Partida cadastrada com sucesso!", partida: newPartida };
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
exports.criarPartida = criarPartida;
const atualizarPartida = async (id, data) => {
    try {
        await partidaSchema_1.partidaUpdateSchema.validate(data, { abortEarly: false });
        const { idQuadra, publicoPresente } = data;
        const partidaUpdate = await partidaRepository_1.partidaRepository.findOneBy({ id, isDeleted: false });
        if (!partidaUpdate) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }
        let quadra = partidaUpdate.quadra;
        if (idQuadra) {
            const quadraEncontrada = await quadraRepository_1.quadraRepository.findOneBy({ id: idQuadra, isDeleted: false });
            if (!quadraEncontrada) {
                return { erro: "Quadra não encontrada", status: 404 }; // 404 Not Found 
            }
            quadra = quadraEncontrada;
        }
        await partidaRepository_1.partidaRepository.update(id, {
            publicoPresente: publicoPresente,
            quadra: quadra,
            updateAt: new Date()
        });
        const partidaAtualizado = await partidaRepository_1.partidaRepository.findOneBy({ id });
        return { mensagem: "Partida atualizada com sucesso!", partida: partidaAtualizado };
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
exports.atualizarPartida = atualizarPartida;
const listarPartidas = async () => {
    try {
        const allPartidas = await partidaRepository_1.partidaRepository.find({ where: { isDeleted: false } });
        return { mensagem: "Partidas listadas com sucesso!", partidas: allPartidas };
    }
    catch (erro) {
        console.log(erro);
        return { erro: "Erro ao listar partidas", status: 500 }; // 500 Internal Server Error
    }
};
exports.listarPartidas = listarPartidas;
const buscarPartidaPorId = async (id) => {
    try {
        const partida = await partidaRepository_1.partidaRepository.findOne({ where: { id: id, isDeleted: false }, relations: ["torneio"] });
        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }
        return { mensagem: "Partida encontrada com sucesso!", partida };
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
exports.buscarPartidaPorId = buscarPartidaPorId;
const deletarPartida = async (id) => {
    try {
        const partidaUpdate = await partidaRepository_1.partidaRepository.findOneBy({ id, isDeleted: false });
        if (!partidaUpdate) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }
        await partidaRepository_1.partidaRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        });
        const partidaDeletada = await partidaRepository_1.partidaRepository.findOneBy({ id });
        return { mensagem: "Partida deletada com sucesso!", partida: partidaDeletada };
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
exports.deletarPartida = deletarPartida;
