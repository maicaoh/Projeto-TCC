"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarJogadoresEquipe = exports.dorsalEquipeJogador = exports.desvincularEquipeJogador = exports.vincularEquipeJogador = void 0;
const equipeRepository_1 = require("../repositories/equipeRepository");
const typeorm_1 = require("typeorm");
const Equipe_Jogador_1 = require("../entities/Equipe_Jogador");
const jogadorRepository_1 = require("../repositories/jogadorRepository");
const equipeJogadorRepository_1 = require("../repositories/equipeJogadorRepository");
const equipeJogadorSchema_1 = require("../validations/equipeJogadorSchema");
const vincularEquipeJogador = async (idEquipe, idsJogadores, dataContratacao) => {
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
        const jogadores = await jogadorRepository_1.jogadorRepository.findBy({ id: (0, typeorm_1.In)(idsJogadores), isDeleted: false });
        console.log(idsJogadores);
        console.log(jogadores);
        if (jogadores.length !== idsJogadores.length) {
            return { erro: "Jogador(es) não encontrado(s)", status: 404 };
        }
        // Busca vínculos ativos já existentes
        const vinculosExistentes = await equipeJogadorRepository_1.equipeJogadorRepository.find({
            where: { equipe: { id: idEquipe }, jogador: (0, typeorm_1.In)(idsJogadores), data_desligamento: (0, typeorm_1.IsNull)() },
        });
        // Filtra jogadores que ainda não estão vinculados
        const jogadoresParaVincular = jogadores.filter((jogador) => !vinculosExistentes.some((vinculo) => { var _a; return ((_a = vinculo.jogador) === null || _a === void 0 ? void 0 : _a.id) === (jogador === null || jogador === void 0 ? void 0 : jogador.id); }));
        if (jogadoresParaVincular.length === 0) {
            return { erro: "Todos os jogadores já estão vinculados à equipe.", status: 400 };
        }
        // Criando novos vínculos
        const registros = jogadoresParaVincular.map((jogador, index) => {
            const equipeJogador = new Equipe_Jogador_1.Equipe_Jogador();
            equipeJogador.data_contratacao = dataContratacaoFinal;
            equipeJogador.equipe = equipe;
            equipeJogador.jogador = jogador;
            equipeJogador.data_desligamento = null; // Garantimos que seja NULL no momento da contratação
            return equipeJogador;
        });
        await equipeJogadorRepository_1.equipeJogadorRepository.save(registros);
        return { mensagem: "Jogadores vinculados à equipe com sucesso!", equipe: registros };
    }
    catch (erro) {
        console.log(erro);
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};
exports.vincularEquipeJogador = vincularEquipeJogador;
const desvincularEquipeJogador = async (idEquipe, idsJogadores, dataDesligamento) => {
    try {
        await equipeJogadorSchema_1.equipeJogadorCreateSchema.validate({ dataContratacao: dataDesligamento }, { abortEarly: false });
        const dataDesligamentoFinal = dataDesligamento ? new Date(dataDesligamento) : new Date();
        if (isNaN(dataDesligamentoFinal.getTime())) {
            return { erro: "Data de desligamento inválida.", status: 400 };
        }
        const vinculosAtivos = await equipeJogadorRepository_1.equipeJogadorRepository.find({
            where: { equipe: { id: idEquipe }, jogador: (0, typeorm_1.In)(idsJogadores), data_desligamento: (0, typeorm_1.IsNull)() },
        });
        if (vinculosAtivos.length !== idsJogadores.length) {
            return { erro: "Jogador(es) não possui vínculo com a equipe.", status: 404 };
        }
        for (const vinculos of vinculosAtivos) {
            if (vinculos.data_contratacao.getTime() > dataDesligamentoFinal.getTime()) {
                return { erro: "Data de desligamento superior ao de contratação.", status: 404 };
            }
        }
        if (vinculosAtivos.length === 0) {
            return { erro: "Nenhum vínculo ativo encontrado para os jogadores informados.", status: 404 };
        }
        // Atualiza a dataDesligamento para a data atual
        vinculosAtivos.forEach((vinculo) => {
            vinculo.data_desligamento = dataDesligamentoFinal;
        });
        await equipeJogadorRepository_1.equipeJogadorRepository.save(vinculosAtivos);
        return { mensagem: "Jogadores desvinculados da equipe com sucesso!", equipe: vinculosAtivos };
    }
    catch (erro) {
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.desvincularEquipeJogador = desvincularEquipeJogador;
const dorsalEquipeJogador = async (idEquipe, jogadores) => {
    try {
        if (!Array.isArray(jogadores)) {
            return { erro: "Formato de entrada inválido!", status: 404 };
        }
        const vinculosAtivos = await equipeJogadorRepository_1.equipeJogadorRepository.find({
            where: { equipe: { id: idEquipe }, jogador: (0, typeorm_1.In)(jogadores.map(jogador => jogador.id)), data_desligamento: (0, typeorm_1.IsNull)() },
        });
        if (vinculosAtivos.length !== jogadores.length) {
            return { erro: "Jogador(es) não possui vínculo com a equipe.", status: 404 };
        }
        if (vinculosAtivos.length === 0) {
            return { erro: "Nenhum vínculo ativo encontrado para os jogadores informados.", status: 404 };
        }
        // Atualiza a dataDesligamento para a data atual
        vinculosAtivos.forEach((vinculo) => {
            const jogadorNewDorsal = jogadores.find(jogador => jogador.id == String(vinculo.jogadorId) && idEquipe == String(vinculo.equipeId));
            vinculo.dorsal = (jogadorNewDorsal === null || jogadorNewDorsal === void 0 ? void 0 : jogadorNewDorsal.dorsal) || null;
        });
        await equipeJogadorRepository_1.equipeJogadorRepository.save(vinculosAtivos);
        return { mensagem: "doaral(s) da equipe salva com sucesso!", equipe: vinculosAtivos };
    }
    catch (erro) {
        console.log(erro);
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }
        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
exports.dorsalEquipeJogador = dorsalEquipeJogador;
const listarJogadoresEquipe = async (idEquipe) => {
    try {
        const vinculosAtivos = await equipeRepository_1.equipeRepository.find({
            where: { id: idEquipe },
            relations: ["equipeJogador", "equipeJogador.jogador"],
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
exports.listarJogadoresEquipe = listarJogadoresEquipe;
