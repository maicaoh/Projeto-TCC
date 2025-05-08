"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeController = void 0;
const equipeService_1 = require("../Services/equipeService");
class EquipeController {
    async create(req, res) {
        const resultado = await (0, equipeService_1.criarEquipe)(req.body);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarEquipes(req, res) {
        const resultado = await (0, equipeService_1.listarEquipes)();
        return res.status(200).json(resultado); // 200 OK
    }
    async buscarEquipePorId(req, res) {
        const { id } = req.params;
        const resultado = await (0, equipeService_1.buscarEquipePorId)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async atualizarEquipe(req, res) {
        const { id } = req.params;
        const resultado = await (0, equipeService_1.atualizarEquipe)(id, req.body);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async deletarEquipe(req, res) {
        const { id } = req.params;
        const resultado = await (0, equipeService_1.deletarEquipe)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
}
exports.EquipeController = EquipeController;
