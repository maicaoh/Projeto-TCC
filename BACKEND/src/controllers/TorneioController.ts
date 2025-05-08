import { Request, Response } from "express";
import { buscarJogadorPorId, criarJogador, listarJogadores, atualizarJogador, deletarJogador } from "../Services/jogadorService";
import { atualizarTorneio, buscarTorneioPorId, criarTorneio, deletarTorneio, listarTorneios } from "../Services/torneioService";

export class TorneioController {
    async create(req: Request, res: Response) {
        const resultado = await criarTorneio(req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarTorneio(req: Request, res: Response) {
        const resultado = await listarTorneios();

        return res.status(200).json(resultado); // 200 OK
    }

    async buscarTorneioPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarTorneioPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarTorneio(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarTorneio(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarTorneio(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarTorneio(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
