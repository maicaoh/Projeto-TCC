
import { Request, Response } from "express";
import { findPlayerDesarmeStats, findPlayerDriblesStats, findPlayerFinalizacaoStats, findTorneioWithStats, findPlayerFaltasCartoesStats, findPlayerGolsStats, findPlayerAssistenciasStats, findPlayerParticipacaoGolsStats, findTournamentStandings, findTournamentTopScorers, findTournamentTopAssistants } from "../Services/estatisticaTorneioService";

export class EstatiscaController {
    async estatisticaTorneioGeral(req: Request, res: Response){
            const { id } = req.params;
                const resultado = await findTorneioWithStats(id);
        
                if (resultado.erro) {
                    if (resultado.status === 404) {
                        return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                    }
                    return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
                }
        
                return res.status(200).json(resultado); // 200 OK
    }


     async estatisticaTorneioFinalizacao(req: Request, res: Response){
        const { idJogador, idTorneio } = req.params;
            const resultado = await findPlayerFinalizacaoStats(idJogador,idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }


    async estatisticaTorneioDesarme(req: Request, res: Response){
        const { idJogador, idTorneio } = req.params;
            const resultado = await findPlayerDesarmeStats(idJogador,idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaTorneioDrible(req: Request, res: Response){
        const { idJogador, idTorneio } = req.params;
            const resultado = await findPlayerDriblesStats(idJogador,idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaTorneioFaltaCartao(req: Request, res: Response){
        const { idJogador, idTorneio } = req.params;
            const resultado = await findPlayerFaltasCartoesStats(idJogador,idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }
    
    async estatisticaTorneioGol(req: Request, res: Response){
        const { idJogador, idTorneio } = req.params;
            const resultado = await findPlayerGolsStats(idJogador,idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }
    
    async estatisticaTorneioAssistencia(req: Request, res: Response){
        const { idJogador, idTorneio } = req.params;
            const resultado = await findPlayerAssistenciasStats(idJogador,idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

        
    async estatisticaTorneioParticipacaoEmGols(req: Request, res: Response){
        const { idJogador, idTorneio } = req.params;
            const resultado = await findPlayerParticipacaoGolsStats(idJogador,idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }


    async estatisticaTorneioClassificacao(req: Request, res: Response){
        const { idTorneio } = req.params;
            const resultado = await findTournamentStandings(idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaTorneioArtilharia(req: Request, res: Response){
        const { idTorneio } = req.params;
            const resultado = await findTournamentTopScorers(idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaTorneioAssistenciaAll(req: Request, res: Response){
        const { idTorneio } = req.params;
            const resultado = await findTournamentTopAssistants(idTorneio);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }
    
    
    
    
    
}




