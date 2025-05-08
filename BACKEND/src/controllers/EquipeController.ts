import { Request, Response } from "express";
import { buscarEquipePorId, criarEquipe, atualizarEquipe, deletarEquipe, listarEquipes } from "../Services/equipeService";
export class EquipeController {
    async create(req: Request, res: Response) {
        const resultado = await criarEquipe(req.body);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarEquipes(req: Request, res: Response) {
        const resultado = await listarEquipes();

        return res.status(200).json(resultado); // 200 OK
    }

    async buscarEquipePorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarEquipePorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarEquipe(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await atualizarEquipe(id, req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarEquipe(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarEquipe(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
