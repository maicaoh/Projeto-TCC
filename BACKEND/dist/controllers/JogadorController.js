"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JogadorController = void 0;
const jogadorService_1 = require("../Services/jogadorService");
class JogadorController {
    async create(req, res) {
        const resultado = await (0, jogadorService_1.criarJogador)(req.body);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarJogadores(req, res) {
        const resultado = await (0, jogadorService_1.listarJogadores)();
        return res.status(200).json(resultado); // 200 OK
    }
    async buscarJogadorPorId(req, res) {
        const { id } = req.params;
        const resultado = await (0, jogadorService_1.buscarJogadorPorId)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async atualizarJogador(req, res) {
        const { id } = req.params;
        const resultado = await (0, jogadorService_1.atualizarJogador)(id, req.body);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async deletarJogador(req, res) {
        const { id } = req.params;
        const resultado = await (0, jogadorService_1.deletarJogador)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
}
exports.JogadorController = JogadorController;
