import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";
import { atualizarPartida, buscarPartidaFormatadaPorId, buscarPartidaPorId, criarPartida, deletarPartida, listarPartidas } from "../Services/partidaService";

export class PartidaController {
    async create(req: Request, res: Response) {
        const {idTorneio} = req.params
        const resultado = await criarPartida(idTorneio,req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarPartida(req: Request, res: Response) {
        const resultado = await listarPartidas();


        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async buscarPartidaPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarPartidaPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarPartida(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarPartida(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarPartida(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarPartida(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }


    async buscarPartidaFormatadaPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarPartidaFormatadaPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    



    
}
