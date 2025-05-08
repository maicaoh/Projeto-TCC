import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";

export class CoachController {
    async create(req: Request, res: Response) {
        const resultado = await criarCoach(req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarCoaches(req: Request, res: Response) {
        const resultado = await listarCoaches();

        return res.status(200).json(resultado); // 200 OK
    }

    async buscarCoachPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarCoachPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarCoach(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarCoach(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarCoach(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarCoach(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
