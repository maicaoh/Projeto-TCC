"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbitroController = void 0;
const arbitroService_1 = require("../Services/arbitroService");
class ArbitroController {
    async create(req, res) {
        const resultado = await (0, arbitroService_1.criarArbitro)(req.body);
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(201).json(resultado); // 201 Created
    }
    async listarArbitro(req, res) {
        const resultado = await (0, arbitroService_1.listarArbitros)();
        return res.status(200).json(resultado); // 200 OK
    }
    async buscarArbitroPorId(req, res) {
        const { id } = req.params;
        const resultado = await (0, arbitroService_1.buscarArbitroPorId)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async atualizarArbitro(req, res) {
        const { id } = req.params;
        const resultado = await (0, arbitroService_1.atualizarArbitro)(id, req.body);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
    async deletarArbitro(req, res) {
        const { id } = req.params;
        const resultado = await (0, arbitroService_1.deletarArbitro)(id);
        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }
        return res.status(200).json(resultado); // 200 OK
    }
}
exports.ArbitroController = ArbitroController;
