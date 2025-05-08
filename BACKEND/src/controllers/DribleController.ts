import { Request, Response } from "express";
import { atualizarDrible, buscarDriblePorId, criarDrible, deletarDrible, listarDrible } from "../Services/dribleService";

export class DribleController {
    async create(req: Request, res: Response) {
        const {idPartida} = req.params
        const {idJogador, idDefensor, idEquipe, idEquipeDefensor} = req.body
        const resultado = await criarDrible(idPartida,idJogador, idDefensor, idEquipe, idEquipeDefensor,req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarDribles(req: Request, res: Response) {
        const {idPartida} = req.params
        const resultado = await listarDrible(idPartida);

        return res.status(200).json(resultado); // 200 OK
    }

    async buscaDriblePorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarDriblePorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarDrible(req: Request, res: Response) {
        const { id } = req.params;
        const {partidaId,idJogador, idDefensor, idEquipe, idEquipeDefensor} = req.body
        const resultado = await atualizarDrible(id, partidaId,idJogador, idDefensor, idEquipe, idEquipeDefensor,req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarDrible(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarDrible(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
