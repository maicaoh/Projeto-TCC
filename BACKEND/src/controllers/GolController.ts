import { Request, Response } from "express";
import { buscarCoachPorId, criarCoach, listarCoaches, atualizarCoach, deletarCoach } from "../Services/coachService";
import { atualizarGol, buscarGolPorId, criarGol, deletarGol, listarGol } from "../Services/golService";

export class GolController {
    async create(req: Request, res: Response) {
        const { idPartida } = req.params;
        const { idJogador, idDefensor, idEquipe, idEquipeDefensor, ...golData } = req.body;
      
        if (!idJogador || !idDefensor || !idEquipe || !idEquipeDefensor) {
          return res.status(400).json({ erro: "Campos obrigatórios ausentes no body" });
        }
      
        const resultado = await criarGol(idPartida, idJogador, idDefensor, idEquipe, idEquipeDefensor, golData);
      
        if (resultado.erro) {
          return res.status(resultado.status || 400).json({ erro: resultado.erro });
        }
      
        return res.status(201).json(resultado);
      }

    async listarGol(req: Request, res: Response) {
        const {idPartida} = req.params
        console.log('=====>'+idPartida)
        const resultado = await listarGol(idPartida);

        return res.status(200).json(resultado); // 200 OK
    }

    async buscaGolPorId(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await buscarGolPorId(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    
    async atualizarGol(req: Request, res: Response) {


        const { idGol } = req.params;
        const { idJogador, idDefensor, idEquipe, idEquipeDefensor, ...golData } = req.body;
      
        if (!idJogador || !idDefensor || !idEquipe || !idEquipeDefensor) {
          return res.status(400).json({ erro: "Campos obrigatórios ausentes no body" });
        }
      
        const resultado = await atualizarGol(idGol, idJogador, idDefensor, idEquipe, idEquipeDefensor, golData);
      

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    async deletarGol(req: Request, res: Response) {
        const { id } = req.params;
        const resultado = await deletarGol(id);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }



    
}
