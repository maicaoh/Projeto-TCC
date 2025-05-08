import { Request, Response } from "express";
import { buscarJogadorPorId, criarJogador, listarJogadores, atualizarJogador, deletarJogador } from "../Services/jogadorService";
import { vincularEquipeTorneio } from "../Services/equipeTorneioService";
import { listarJogadoresEquipe } from "../Services/equipeJogadorService";
import { desvincularPartidaArbitro, listarArbitros, vincularPartidaArbitro } from "../Services/partidaArbitroService";

export class PartidaArbitroController {
    async create(req: Request, res: Response) {
        const {idPartida} = req.params
        const {idsArbitros} = req.body

        const resultado = await vincularPartidaArbitro(idPartida,idsArbitros);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }

    async delete(req: Request, res: Response) {
        const {idPartida} = req.params
        const {idsArbitros} = req.body

        console.log(idPartida)
        console.log(idsArbitros)
        console.log("============================")

        const resultado = await desvincularPartidaArbitro(idPartida,idsArbitros);

        if (resultado.erro) {
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(201).json(resultado); // 201 Created
    }




    

    async listarArbditros(req: Request, res: Response) {
        const { idPartida } = req.params;

        const resultado = await listarArbitros(idPartida);

        if (resultado.erro) {
            if (resultado.status === 404) {
                return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
            }
            return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
        }

        return res.status(200).json(resultado); // 200 OK
    }






    



    
}
