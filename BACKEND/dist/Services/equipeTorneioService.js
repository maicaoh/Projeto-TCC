"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vincularEquipeTorneio = void 0;
const equipeRepository_1 = require("../repositories/equipeRepository");
const typeorm_1 = require("typeorm");
const torneioRepository_1 = require("../repositories/torneioRepository");
const vincularEquipeTorneio = async (idTorneio, idsEquipes) => {
    try {
        // Verifica se a equipe existe
        const equipes = await equipeRepository_1.equipeRepository.findBy({ id: (0, typeorm_1.In)(idsEquipes), isDeleted: false });
        console.log(equipes);
        if (equipes.length != idsEquipes.length) {
            return { erro: "Equipe(s) não encontrada(s)", status: 404 };
        }
        // Verifica se a equipe existe
        const torneio = await torneioRepository_1.torneioRepository.findOne({ where: { id: idTorneio, isDeleted: false }, relations: ["equipes"] });
        if (!torneio) {
            return { erro: "Torneio não encontrado", status: 404 };
        }
        const equipesJaAssociadas = torneio === null || torneio === void 0 ? void 0 : torneio.equipes.map(elemento => elemento.id);
        const algumaJaExiste = idsEquipes.some(elemento => equipesJaAssociadas === null || equipesJaAssociadas === void 0 ? void 0 : equipesJaAssociadas.includes(elemento));
        if (algumaJaExiste) {
            return { erro: "Equipe(s) ja estão cadastrada(s) na competição", status: 404 };
        }
        torneio === null || torneio === void 0 ? void 0 : torneio.equipes.push(...equipes);
        await torneioRepository_1.torneioRepository.save(torneio);
        return { mensagem: "Equipe(s) vinculada(s) à competição com sucesso!", equipe: torneio };
    }
    catch (erro) {
        console.log(erro);
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};
exports.vincularEquipeTorneio = vincularEquipeTorneio;
