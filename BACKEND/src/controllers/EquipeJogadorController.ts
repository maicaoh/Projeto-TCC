import { Request, Response } from "express";
import { buscarEquipePorId, criarEquipe, atualizarEquipe, deletarEquipe, listarEquipes } from "../Services/equipeService";
import { desvincularEquipeJogador, dorsalEquipeJogador, gerenciarEquipe, listarJogadoresEquipe, vincularEquipeJogador } from "../Services/equipeJogadorService";
import { ValidationError } from "yup";



export class EquipeJogadorController {
    async vincularEquipeJogador(req: Request, res: Response) {

        const { idEquipe } = req.params;
        const {idsJogadores, dataContratacao} = req.body;

        const resultado = await vincularEquipeJogador(idEquipe,idsJogadores,dataContratacao);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async desvincularEquipeJogador(req: Request, res: Response) {

        const { idEquipe } = req.params;
        const {idsJogadores, dataDesligamento} = req.body;

        const resultado = await desvincularEquipeJogador(idEquipe,idsJogadores,dataDesligamento);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }


    async dorsalEquipeJogador(req: Request, res: Response) {

        const { idEquipe } = req.params;
        const {jogadores} = req.body;

        console.log(idEquipe)

        const resultado = await dorsalEquipeJogador(idEquipe,jogadores);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }


    async listarJogadoresEquipe(req: Request, res: Response) {

        const { idEquipe } = req.params;

        const resultado = await listarJogadoresEquipe(idEquipe);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }
    


    async gerenciarEquipe(req: Request, res: Response){


        const {capitaoId,desligados ,dorsaisEditadas} = req.body
        const resultado = await gerenciarEquipe({capitaoId,desligados ,dorsaisEditadas});

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }
    


    
}
