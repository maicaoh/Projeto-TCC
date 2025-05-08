"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeJogadorController = void 0;
const equipeJogadorService_1 = require("../Services/equipeJogadorService");
class EquipeJogadorController {
    async vincularEquipeJogador(req, res) {
        const { idEquipe } = req.params;
        const { idsJogadores, dataContratacao } = req.body;
        const resultado = await (0, equipeJogadorService_1.vincularEquipeJogador)(idEquipe, idsJogadores, dataContratacao);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async desvincularEquipeJogador(req, res) {
        const { idEquipe } = req.params;
        const { idsJogadores, dataDesligamento } = req.body;
        const resultado = await (0, equipeJogadorService_1.desvincularEquipeJogador)(idEquipe, idsJogadores, dataDesligamento);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async dorsalEquipeJogador(req, res) {
        const { idEquipe } = req.params;
        const { jogadores } = req.body;
        console.log(idEquipe);
        const resultado = await (0, equipeJogadorService_1.dorsalEquipeJogador)(idEquipe, jogadores);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarJogadoresEquipe(req, res) {
        const { idEquipe } = req.params;
        const resultado = await (0, equipeJogadorService_1.listarJogadoresEquipe)(idEquipe);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
}
exports.EquipeJogadorController = EquipeJogadorController;
