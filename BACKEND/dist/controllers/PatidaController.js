"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartidaController = void 0;
const partidaService_1 = require("../Services/partidaService");
class PartidaController {
    async create(req, res) {
        const { idTorneio } = req.params;
        const resultado = await (0, partidaService_1.criarPartida)(idTorneio, req.body);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarPartida(req, res) {
        const resultado = await (0, partidaService_1.listarPartidas)();
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async buscarPartidaPorId(req, res) {
        const { id } = req.params;
        const resultado = await (0, partidaService_1.buscarPartidaPorId)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async atualizarPartida(req, res) {
        const { id } = req.params;
        const resultado = await (0, partidaService_1.atualizarPartida)(id, req.body);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async deletarPartida(req, res) {
        const { id } = req.params;
        const resultado = await (0, partidaService_1.deletarPartida)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
}
exports.PartidaController = PartidaController;
