"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarArbitro = exports.buscarArbitroPorId = exports.listarArbitros = exports.atualizarArbitro = exports.criarArbitro = void 0;
const yup_1 = require("yup");
const arbitroSchema_1 = require("../validations/arbitroSchema");
const arbitroRepository_1 = require("../repositories/arbitroRepository");
const criarArbitro = async (arbitro) => {
    try {
        await arbitroSchema_1.arbitroCreateSchema.validate(arbitro, { abortEarly: false });
        arbitro.createAt = new Date();
        arbitro.isDeleted = false;
        arbitro.updateAt = new Date();
        const newArbitro = arbitroRepository_1.arbitroRepository.create(arbitro);
        await arbitroRepository_1.arbitroRepository.save(newArbitro);
        return { mensagem: "Arbitro cadastrado com sucesso!", arbitro: newArbitro };
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
exports.criarArbitro = criarArbitro;
const atualizarArbitro = async (id, arbitro) => {
    try {
        const arbitroUpdate = await arbitroRepository_1.arbitroRepository.findOneBy({ id, isDeleted: false });
        if (!arbitroUpdate) {
            return { erro: "Arbitro não encontrado", status: 404 }; // 404 Not Found
        }
        await arbitroSchema_1.arbitroUpdateSchema.validate(arbitro, { abortEarly: false });
        await arbitroRepository_1.arbitroRepository.update(id, {
            ...arbitro,
            updateAt: new Date()
        });
        const arbitroAtualizado = await arbitroRepository_1.arbitroRepository.findOneBy({ id });
        return { mensagem: "Arbitro d com sucesso!", coach: arbitroAtualizado };
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
exports.atualizarArbitro = atualizarArbitro;
const listarArbitros = async () => {
    try {
        const allArbitros = await arbitroRepository_1.arbitroRepository.find({ where: { isDeleted: false } });
        return { mensagem: "Arbitros 444444444444 com sucesso!", arbitros: allArbitros };
    }
    catch (erro) {
        return { erro: "Erro ao listar árbitros", status: 500 }; // 500 Internal Server Error
    }
};
exports.listarArbitros = listarArbitros;
const buscarArbitroPorId = async (id) => {
    try {
        const arbitro = await arbitroRepository_1.arbitroRepository.findOneBy({ id, isDeleted: false });
        if (!arbitro) {
            return { erro: "Arbitro não encontrado", status: 404 }; // 404 Not Found
        }
        return { mensagem: "Arbitro encontrado com sucesso!", arbitro };
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
exports.buscarArbitroPorId = buscarArbitroPorId;
const deletarArbitro = async (id) => {
    try {
        const arbitroUpdate = await arbitroRepository_1.arbitroRepository.findOneBy({ id, isDeleted: false });
        if (!arbitroUpdate) {
            return { erro: "Arbitro não encontrado", status: 404 }; // 404 Not Found
        }
        await arbitroRepository_1.arbitroRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        });
        const arbitroDeletado = await arbitroRepository_1.arbitroRepository.findOneBy({ id });
        return { mensagem: "Arbitro deletado com sucesso!", arbitro: arbitroDeletado };
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
exports.deletarArbitro = deletarArbitro;
