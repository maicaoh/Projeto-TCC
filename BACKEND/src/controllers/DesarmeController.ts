import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";
import { atualizarGol, buscarGolPorId, criarGol, deletarGol, listarGol } from "../Services/golService";
import { atualizarDesarme, buscarDesarmePorId, criarDesarme, deletarDesarme, listarDesarme } from "../Services/desarmeService";

export class DesarmeController {
    async create(req: Request, res: Response) {
        const {idPartida} = req.params
        const {idJogador, idDefensor, idEquipe, idEquipeDefensor} = req.body
        const resultado = await criarDesarme(idPartida,idJogador, idDefensor, idEquipe, idEquipeDefensor,req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarDesarme(req: Request, res: Response) {
        const {idPartida} = req.params
        const resultado = await listarDesarme(idPartida);

        return res.status(200).json(resultado); // 200 OK
    }

    async buscaDesarmePorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarDesarmePorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarDesarme(req: Request, res: Response) {
        const { id } = req.params;
        const {idJogador, idDefensor, idEquipe, idEquipeDefensor} = req.body

        const resultado = await atualizarDesarme(id, idJogador, idDefensor, idEquipe, idEquipeDefensor,req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarDesarme(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarDesarme(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
