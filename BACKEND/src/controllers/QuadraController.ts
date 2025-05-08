import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";
import { atualizarQuadra, buscarQuadraPorId, criarQuarta, deletarQuadra, listarQuadras } from "../Services/quadraService";

export class QuadraController {
    async create(req: Request, res: Response) {
        const resultado = await criarQuarta(req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarQuadra(req: Request, res: Response) {
        const resultado = await listarQuadras();

        return res.status(200).json(resultado); // 200 OK
    }

    async buscarQuadraPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarQuadraPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarQuadra(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarQuadra(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarQuadra(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarQuadra(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
