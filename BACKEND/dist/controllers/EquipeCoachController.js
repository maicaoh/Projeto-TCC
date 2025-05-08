"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeTreinadorController = void 0;
const equipeCoachService_1 = require("../Services/equipeCoachService");
class EquipeTreinadorController {
    async vincularEquipeTreinado(req, res) {
        const { idEquipe } = req.params;
        const { idsTreinadores, dataContratacao } = req.body;
        const resultado = await (0, equipeCoachService_1.vincularEquipeCoach)(idEquipe, idsTreinadores, dataContratacao);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async desvincularEquipeTreiandor(req, res) {
        const { idEquipe } = req.params;
        const { idsTreinadores, dataDesligamento } = req.body;
        const resultado = await (0, equipeCoachService_1.desvincularEquipeTreinador)(idEquipe, idsTreinadores, dataDesligamento);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarTreinadoresEquipe(req, res) {
        const { idEquipe } = req.params;
        const resultado = await (0, equipeCoachService_1.listarTreinadoresEquipe)(idEquipe);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
}
exports.EquipeTreinadorController = EquipeTreinadorController;
