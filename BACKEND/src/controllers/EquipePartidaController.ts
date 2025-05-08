import { Request, Response } from "express";
import { buscarEquipePorId, criarEquipe, atualizarEquipe, deletarEquipe, listarEquipes } from "../Services/equipeService";
import { desvincularEquipeJogador, dorsalEquipeJogador, listarJogadoresEquipe, vincularEquipeJogador } from "../Services/equipeJogadorService";
import { vincularEquipePartida } from "../Services/equipePartidaService";
export class EquipePartidaController {
    async vincularEquipePartida(req: Request, res: Response) {

        const { idPartida } = req.params;
        const {idEquipeCasa, idEquipeVisitante,idTorneio} = req.body;
        const resultado = await vincularEquipePartida(idPartida,idEquipeCasa,idEquipeVisitante,idTorneio);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }    
}
