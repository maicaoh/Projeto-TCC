import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";
import { atualizarFalta, buscarFaltaPorId, criarFalta, deletarFalta, listarFaltas } from "../Services/faltaService";

export class FaltaController {
    async create(req: Request, res: Response) {
        const {idPartida} = req.params
        const { jogadorAutorId, jogadorSofreuId, equipeAutorId, equipeSofreuId, idArbitro} = req.body
        const resultado = await criarFalta(idPartida,jogadorAutorId, jogadorSofreuId, equipeAutorId, equipeSofreuId, idArbitro,req.body);
        
        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarFalta(req: Request, res: Response) {
        const {idPartida} = req.params
        const resultado = await listarFaltas(idPartida);

        return res.status(200).json(resultado); // 200 OK
    }

    async buscaFaltaPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarFaltaPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarFalta(req: Request, res: Response) {
        const { id } = req.params;
        const { jogadorAutorId, jogadorSofreuId, equipeAutorId, equipeSofreuId, idArbitro,partidaId} = req.body

        const resultado = await atualizarFalta(id,partidaId,jogadorAutorId, jogadorSofreuId, equipeAutorId, equipeSofreuId, idArbitro,req.body);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarFalta(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarFalta(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
