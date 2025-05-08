
import { Request, Response } from "express";
import { findGeralWithStats, findPlayerAssistenciaStatsGlobal, findPlayerDesarmeStatsGlobal, findPlayerDribleStatsGlobal, findPlayerFaltaCartaoStatsGlobal, findPlayerFinalizacaoStatsGlobal, findPlayerGolsStatsGlobal, findPlayerParticipacaoGolsStatsGlobal } from "../Services/estatisticaGeralService";

export class EstatiscaGeralController {
    async estatisticaGeral(req: Request, res: Response){
                const resultado = await findGeralWithStats();
                
                if (resultado.erro) {
                    if (resultado.status === 404) {
                        return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                    }
                    return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
                }
        
                return res.status(200).json(resultado); // 200 OK
    }


     async estatisticaGeralFinalizacao(req: Request, res: Response){
        const { idJogador } = req.params;
            const resultado = await findPlayerFinalizacaoStatsGlobal(idJogador);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }


    async estatisticaGeralDesarme(req: Request, res: Response){
        const { idJogador} = req.params;
            const resultado = await findPlayerDesarmeStatsGlobal(idJogador);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaGeralDrible(req: Request, res: Response){
        const { idJogador } = req.params;
            const resultado = await findPlayerDribleStatsGlobal(idJogador);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    
    async estatisticaGeralFaltaCartao(req: Request, res: Response){
        const { idJogador} = req.params;
            const resultado = await findPlayerFaltaCartaoStatsGlobal(idJogador);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaGeralGols(req: Request, res: Response){
        const { idJogador } = req.params;
            const resultado = await findPlayerGolsStatsGlobal(idJogador);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaGeralParticipacaoGol(req: Request, res: Response){
        const { idJogador} = req.params;
            const resultado = await findPlayerParticipacaoGolsStatsGlobal(idJogador);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }

    async estatisticaGeralAssistencia(req: Request, res: Response){
        const { idJogador } = req.params;
            const resultado = await findPlayerAssistenciaStatsGlobal(idJogador);
    
            if (resultado.erro) {
                if (resultado.status === 404) {
                    return res.status(404).json({ erro: resultado.erro }); // 404 Not Found
                }
                return res.status(400).json({ erro: resultado.erro }); // 400 Bad Request
            }
    
            return res.status(200).json(resultado); // 200 OK
    }
    
    
}




