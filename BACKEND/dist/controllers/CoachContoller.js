"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachController = void 0;
const coachService_1 = require("../Services/coachService");
class CoachController {
    async create(req, res) {
        const resultado = await (0, coachService_1.criarCoach)(req.body);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarCoaches(req, res) {
        const resultado = await (0, coachService_1.listarCoaches)();
        return res.status(200).json(resultado); // 200 OK
    }
    async buscarCoachPorId(req, res) {
        const { id } = req.params;
        const resultado = await (0, coachService_1.buscarCoachPorId)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async atualizarCoach(req, res) {
        const { id } = req.params;
        const resultado = await (0, coachService_1.atualizarCoach)(id, req.body);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async deletarCoach(req, res) {
        const { id } = req.params;
        const resultado = await (0, coachService_1.deletarCoach)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
}
exports.CoachController = CoachController;
