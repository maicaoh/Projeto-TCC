"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarCoach = exports.buscarCoachPorId = exports.listarCoaches = exports.atualizarCoach = exports.criarCoach = void 0;
const yup_1 = require("yup");
const coachRepository_1 = require("../repositories/coachRepository");
const coachSchema_1 = require("../validations/coachSchema");
const criarCoach = async (coach) => {
    try {
        await coachSchema_1.coachCreateSchema.validate(coach, { abortEarly: false });
        coach.createAt = new Date();
        coach.isDeleted = false;
        coach.updateAt = new Date();
        const newCoach = coachRepository_1.coachRepository.create(coach);
        await coachRepository_1.coachRepository.save(newCoach);
        return { mensagem: "Treinador cadastrado com sucesso!", coach: newCoach };
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
exports.criarCoach = criarCoach;
const atualizarCoach = async (id, coach) => {
    try {
        const coachUpdate = await coachRepository_1.coachRepository.findOneBy({ id, isDeleted: false });
        if (!coachUpdate) {
            return { erro: "Treinador não encontrado", status: 404 }; // 404 Not Found
        }
        await coachSchema_1.coachUpdateSchema.validate(coach, { abortEarly: false });
        await coachRepository_1.coachRepository.update(id, {
            ...coach,
            updateAt: new Date()
        });
        const coachAtualizado = await coachRepository_1.coachRepository.findOneBy({ id });
        return { mensagem: "Treinador atualizado com sucesso!", coach: coachAtualizado };
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
exports.atualizarCoach = atualizarCoach;
const listarCoaches = async () => {
    try {
        const allCoach = await coachRepository_1.coachRepository.find({ where: { isDeleted: false } });
        return { mensagem: "Treinadores listados com sucesso!", coaches: allCoach };
    }
    catch (erro) {
        return { erro: "Erro ao listar treinadores", status: 500 }; // 500 Internal Server Error
    }
};
exports.listarCoaches = listarCoaches;
const buscarCoachPorId = async (id) => {
    try {
        const coach = await coachRepository_1.coachRepository.findOneBy({ id, isDeleted: false });
        if (!coach) {
            return { erro: "Treinador não encontrado", status: 404 }; // 404 Not Found
        }
        return { mensagem: "Treinador encontrado com sucesso!", coach };
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
exports.buscarCoachPorId = buscarCoachPorId;
const deletarCoach = async (id) => {
    try {
        const coachUpdate = await coachRepository_1.coachRepository.findOneBy({ id, isDeleted: false });
        if (!coachUpdate) {
            return { erro: "Treinador não encontrado", status: 404 }; // 404 Not Found
        }
        await coachRepository_1.coachRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        });
        const coachDeletado = await coachRepository_1.coachRepository.findOneBy({ id });
        return { mensagem: "Treinador deletado com sucesso!", coach: coachDeletado };
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
exports.deletarCoach = deletarCoach;
