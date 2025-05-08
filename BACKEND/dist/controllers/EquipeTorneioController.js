"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeTorneioController = void 0;
const jogadorService_1 = require("../Services/jogadorService");
const equipeTorneioService_1 = require("../Services/equipeTorneioService");
const equipeJogadorService_1 = require("../Services/equipeJogadorService");
class EquipeTorneioController {
    async create(req, res) {
        const { idTorneio } = req.params;
        const { idsEquipes } = req.body;
        const resultado = await (0, equipeTorneioService_1.vincularEquipeTorneio)(idTorneio, idsEquipes);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarJogadores(req, res) {
        const resultado = await (0, jogadorService_1.listarJogadores)();
        return res.status(200).json(resultado); // 200 OK
    }
    async listarTorneioEquipePorId(req, res) {
        const { idTorneio } = req.params;
        const resultado = await (0, equipeJogadorService_1.listarJogadoresEquipe)(idTorneio);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
}
exports.EquipeTorneioController = EquipeTorneioController;
