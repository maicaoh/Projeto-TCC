"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarTreinadoresEquipe = exports.desvincularEquipeTreinador = exports.vincularEquipeCoach = void 0;
const equipeRepository_1 = require("../repositories/equipeRepository");
const typeorm_1 = require("typeorm");
const equipeJogadorSchema_1 = require("../validations/equipeJogadorSchema");
const equipeCoach_1 = require("../repositories/equipeCoach");
const Equipe_Tecnico_1 = require("../entities/Equipe_Tecnico");
const coachRepository_1 = require("../repositories/coachRepository");
const vincularEquipeCoach = async (idEquipe, idsTreinadores, dataContratacao) => {
    try {
        await equipeJogadorSchema_1.equipeJogadorCreateSchema.validate({ dataContratacao }, { abortEarly: false });
        // Se dataContratacao não for passada, define a data atual
        const dataContratacaoFinal = dataContratacao ? new Date(dataContratacao) : new Date();
        if (isNaN(dataContratacaoFinal.getTime())) {
            return { erro: "Data de contratação inválida.", status: 400 };
        }
        // Verifica se a equipe existe
        const equipe = await equipeRepository_1.equipeRepository.findOneBy({ id: idEquipe, isDeleted: false });
        if (!equipe) {
            return { erro: "Equipe não encontrada", status: 404 };
        }
        // Verifica se os jogadores existem
        const trinadores = await coachRepository_1.coachRepository.findBy({ id: (0, typeorm_1.In)(idsTreinadores), isDeleted: false });
        if (trinadores.length !== idsTreinadores.length) {
            return { erro: "Treinador(es) não encontrado(s)", status: 404 };
        }
        // Busca vínculos ativos já existentes
        const vinculosExistentes = await equipeCoach_1.equipeCoachRepository.find({
            where: { equipe: { id: idEquipe }, coach: (0, typeorm_1.In)(idsTreinadores), data_desligamento: (0, typeorm_1.IsNull)() },
        });
        // Filtra jogadores que ainda não estão vinculados
        const treinadoresParaVincular = trinadores.filter((treinador) => !vinculosExistentes.some((vinculo) => { var _a; return ((_a = vinculo.coach) === null || _a === void 0 ? void 0 : _a.id) === (treinador === null || treinador === void 0 ? void 0 : treinador.id); }));
        if (treinadoresParaVincular.length === 0) {
            return { erro: "Todos os trinadores já estão vinculados à equipe.", status: 400 };
        }
        // Criando novos vínculos
        const registros = treinadoresParaVincular.map((treinador, index) => {
            const equipeTreinador = new Equipe_Tecnico_1.Equipe_Tecnico();
            equipeTreinador.data_contratacao = dataContratacaoFinal;
            equipeTreinador.equipe = equipe;
            equipeTreinador.coach = treinador;
            equipeTreinador.data_desligamento = null; // Garantimos que seja NULL no momento da contratação
            return equipeTreinador;
        });
        await equipeCoach_1.equipeCoachRepository.save(registros);
        return { mensagem: "Treinadores vinculados à equipe com sucesso!", equipe: registros };
    }
    catch (erro) {
        console.log("fffffffffffffffffffffffffffffff");
        console.log(erro);
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};
exports.vincularEquipeCoach = vincularEquipeCoach;
const desvincularEquipeTreinador = async (idEquipe, idsTreinadores, dataDesligamento) => {
    try {
        await equipeJogadorSchema_1.equipeJogadorCreateSchema.validate({ dataContratacao: dataDesligamento }, { abortEarly: false });
        const dataDesligamentoFinal = dataDesligamento ? new Date(dataDesligamento) : new Date();
        if (isNaN(dataDesligamentoFinal.getTime())) {
            return { erro: "Data de desligamento inválida.", status: 400 };
        }
        const vinculosAtivos = await equipeCoach_1.equipeCoachRepository.find({
            where: { equipe: { id: idEquipe }, coach: (0, typeorm_1.In)(idsTreinadores), data_desligamento: (0, typeorm_1.IsNull)() },
        });
        if (vinculosAtivos.length !== idsTreinadores.length) {
            return { erro: "Jogador(es) não possui vínculo com a equipe.", status: 404 };
        }
        for (const vinculos of vinculosAtivos) {
            if (vinculos.data_contratacao.getTime() > dataDesligamentoFinal.getTime()) {
                return { erro: "Data de desligamento superior ao de contratação.", status: 404 };
            }
        }
        if (vinculosAtivos.length === 0) {
            return { erro: "Nenhum vínculo ativo encontrado para os treinadores informados.", status: 404 };
        }
        // Atualiza a dataDesligamento para a data atual
        vinculosAtivos.forEach((vinculo) => {
            vinculo.data_desligamento = dataDesligamentoFinal;
        });
        await equipeCoach_1.equipeCoachRepository.save(vinculosAtivos);
        return { mensagem: "Técnicos desvinculados da equipe com sucesso!", equipe: vinculosAtivos };
    }
    catch (erro) {
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.desvincularEquipeTreinador = desvincularEquipeTreinador;
const listarTreinadoresEquipe = async (idEquipe) => {
    try {
        const vinculosAtivos = await equipeRepository_1.equipeRepository.find({
            where: { id: idEquipe },
            relations: ["equipeTecnico", "equipeTecnico.coach"],
        });
        return { mensagem: "Equipe listada com sucesso!", equipe: vinculosAtivos };
    }
    catch (erro) {
        console.log(erro);
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.listarTreinadoresEquipe = listarTreinadoresEquipe;
