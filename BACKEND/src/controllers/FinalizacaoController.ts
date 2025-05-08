import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";
import { atualizarFinalizacao, buscarFinalizacaoPorId, criarFinalizacao, deletarFinalizacao, listarFinalizacoes } from "../Services/finalizacaoService";
import { listarDesarme } from "../Services/desarmeService";

export class FinalizacaoController {
    async create(req: Request, res: Response) {
        const {idPartida} = req.params
        const {idJogador, idDefensor, idEquipe, idEquipeDefensor} = req.body
        const resultado = await criarFinalizacao(idPartida,idJogador, idDefensor, idEquipe, idEquipeDefensor,req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarFinalizacoes(req: Request, res: Response) {
        const {idPartida} = req.params

        const resultado = await listarFinalizacoes(idPartida);

        return res.status(200).json(resultado); // 200 OK
    }

    async buscaFinalizacaoPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarFinalizacaoPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarFinalizacao(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarFinalizacao(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarFinalizacao(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarFinalizacao(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
