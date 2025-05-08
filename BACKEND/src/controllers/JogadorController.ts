import { Request, Response } from "express";
import { buscarJogadorPorId, criarJogador, listarJogadores, atualizarJogador, deletarJogador, listarJogadoresDisponiveis } from "../Services/jogadorService";

export class JogadorController {
    async create(req: Request, res: Response) {
        const resultado = await criarJogador(req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarJogadores(req: Request, res: Response) {
        const resultado = await listarJogadores();

        return res.status(200).json(resultado); // 200 OK
    }

    async buscarJogadorPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarJogadorPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarJogador(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarJogador(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarJogador(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarJogador(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async listarJogadoresDisponiveis(req: Request, res: Response) {
        const resultado = await listarJogadoresDisponiveis();

        return res.status(200).json(resultado); // 200 OK
    }



    
}
