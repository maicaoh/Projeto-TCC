import { Request, Response } from "express";
import { buscarJogadorPorId, criarJogador, listarJogadores, atualizarJogador, deletarJogador } from "../Services/jogadorService";
import { vincularEquipeTorneio } from "../Services/equipeTorneioService";
import { listarJogadoresEquipe } from "../Services/equipeJogadorService";

export class EquipeTorneioController {
    async create(req: Request, res: Response) {
        const {idTorneio} = req.params
        const {idsEquipes} = req.body

        const resultado = await vincularEquipeTorneio(idTorneio,idsEquipes);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async listarJogadores(req: Request, res: Response) {
        const resultado = await listarJogadores();

        return res.status(200).json(resultado); // 200 OK
    }

    async listarTorneioEquipePorId(req: Request, res: Response) {
        const { idTorneio } = req.params;
        const resultado = await listarJogadoresEquipe(idTorneio );

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }

    



    
}
