import { Request, Response } from "express";
import { buscarEquipePorId, criarEquipe, atualizarEquipe, deletarEquipe, listarEquipes } from "../Services/equipeService";
import { desvincularEquipeJogador, dorsalEquipeJogador, listarJogadoresEquipe, vincularEquipeJogador } from "../Services/equipeJogadorService";
import { desvincularEquipeTreinador, listarTreinadoresEquipe, vincularEquipeCoach } from "../Services/equipeCoachService";
export class EquipeTreinadorController {
    async vincularEquipeTreinado(req: Request, res: Response) {

        const { idEquipe } = req.params;
        const {idsTreinadores, dataContratacao} = req.body;

        const resultado = await vincularEquipeCoach(idEquipe,idsTreinadores,dataContratacao);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async desvincularEquipeTreiandor(req: Request, res: Response) {

        const { idEquipe } = req.params;
        const {idsTreinadores, dataDesligamento} = req.body;

        const resultado = await desvincularEquipeTreinador(idEquipe,idsTreinadores,dataDesligamento);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }




    async listarTreinadoresEquipe(req: Request, res: Response) {

        const { idEquipe } = req.params;

        const resultado = await listarTreinadoresEquipe(idEquipe);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    


    
}
