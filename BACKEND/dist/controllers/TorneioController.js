"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TorneioController = void 0;
const torneioService_1 = require("../Services/torneioService");
class TorneioController {
    async create(req, res) {
        const resultado = await (0, torneioService_1.criarTorneio)(req.body);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarTorneio(req, res) {
        const resultado = await (0, torneioService_1.listarTorneios)();
        return res.status(200).json(resultado); // 200 OK
    }
    async buscarTorneioPorId(req, res) {
        const { id } = req.params;
        const resultado = await (0, torneioService_1.buscarTorneioPorId)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async atualizarTorneio(req, res) {
        const { id } = req.params;
        const resultado = await (0, torneioService_1.atualizarTorneio)(id, req.body);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async deletarTorneio(req, res) {
        const { id } = req.params;
        const resultado = await (0, torneioService_1.deletarTorneio)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
}
exports.TorneioController = TorneioController;
