import { Request, Response } from "express";
import { buscarJogadorPorId, criarJogador, listarJogadores, atualizarJogador, deletarJogador } from "../Services/jogadorService";
import { atualizarArbitro, buscarArbitroPorId, criarArbitro, deletarArbitro, listarArbitros } from "../Services/arbitroService";

export class ArbitroController {
    async create(req: Request, res: Response) {
        const resultado = await criarArbitro(req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarArbitro(req: Request, res: Response) {
        const resultado = await listarArbitros();

        return res.status(200).json(resultado); // 200 OK
    }

    async buscarArbitroPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarArbitroPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarArbitro(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarArbitro(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarArbitro(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarArbitro(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        
        return res.status(200).json(resultado); // 200 OK
    }



    
}
