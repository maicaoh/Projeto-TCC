"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarEquipe = exports.buscarEquipePorId = exports.listarEquipes = exports.atualizarEquipe = exports.criarEquipe = void 0;
const yup_1 = require("yup");
const equipeRepository_1 = require("../repositories/equipeRepository");
const equipeSchema_1 = require("../validations/equipeSchema");
const criarEquipe = async (equipe) => {
    try {
        await equipeSchema_1.equipeCreateSchema.validate(equipe, { abortEarly: false });
        equipe.createAt = new Date();
        equipe.isDeleted = false;
        equipe.updateAt = new Date();
        const newEquipe = equipeRepository_1.equipeRepository.create(equipe);
        await equipeRepository_1.equipeRepository.save(newEquipe);
        return { mensagem: "equipe cadastrada com sucesso!", equipe: newEquipe };
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
exports.criarEquipe = criarEquipe;
const atualizarEquipe = async (id, equipe) => {
    try {
        const equipeUpdate = await equipeRepository_1.equipeRepository.findOneBy({ id, isDeleted: false });
        if (!equipeUpdate) {
            return { erro: "equipe não encontrada", status: 404 }; // 404 Not Found
        }
        await equipeSchema_1.equipeUpdateSchema.validate(equipe, { abortEarly: false });
        await equipeRepository_1.equipeRepository.update(id, {
            ...equipe,
            updateAt: new Date()
        });
        const equipeAtualizado = await equipeRepository_1.equipeRepository.findOneBy({ id });
        return { mensagem: "equipe atualizada com sucesso!", equipe: equipeAtualizado };
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
exports.atualizarEquipe = atualizarEquipe;
const listarEquipes = async () => {
    try {
        const allEquipe = await equipeRepository_1.equipeRepository.find({ where: { isDeleted: false } });
        return { mensagem: "equipes listadas com sucesso!", equipes: allEquipe };
    }
    catch (erro) {
        return { erro: "Erro ao listar equipes", status: 500 }; // 500 Internal Server Error
    }
};
exports.listarEquipes = listarEquipes;
const buscarEquipePorId = async (id) => {
    try {
        const equipe = await equipeRepository_1.equipeRepository.findOneBy({ id, isDeleted: false });
        if (!equipe) {
            return { erro: "equipe não encontrada", status: 404 }; // 404 Not Found
        }
        return { mensagem: "equipe encontrado com sucesso!", equipe };
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
exports.buscarEquipePorId = buscarEquipePorId;
const deletarEquipe = async (id) => {
    try {
        const equipeUpdate = await equipeRepository_1.equipeRepository.findOneBy({ id, isDeleted: false });
        if (!equipeUpdate) {
            return { erro: "equipe não encontrado", status: 404 }; // 404 Not Found
        }
        await equipeRepository_1.equipeRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        });
        const equipeDeletado = await equipeRepository_1.equipeRepository.findOneBy({ id });
        return { mensagem: "equipe deletado com sucesso!", equipe: equipeDeletado };
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
exports.deletarEquipe = deletarEquipe;
