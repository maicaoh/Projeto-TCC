import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";
import { atualizarCartao, buscarCartaoPorId, criarCartao, deletarCartao, listarCartao } from "../Services/cartaoService";

export class CartaoController {
    async create(req: Request, res: Response) {
        const {idPartida} = req.params
        const { jogadorId,equipeJogadorId,idArbitro} = req.body
        const resultado = await criarCartao(idPartida,jogadorId,equipeJogadorId,idArbitro,req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarCartao(req: Request, res: Response) {
        const {idPartida} = req.params
        const resultado = await listarCartao(idPartida);

        return res.status(200).json(resultado); // 200 OK
    }

    async buscaCartaoPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarCartaoPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarCartao(req: Request, res: Response) {
        const { id } = req.params;
        const { partidaId,jogadorId,equipeJogadorId,idArbitro} = req.body

        const resultado = await atualizarCartao(id,partidaId,jogadorId,equipeJogadorId,idArbitro,req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarCartao(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarCartao(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
