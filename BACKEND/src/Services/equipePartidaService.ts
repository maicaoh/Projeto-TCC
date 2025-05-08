import { equipeRepository } from "../repositories/equipeRepository";
import { In, IsNull } from "typeorm";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { Equipe } from "../entities/Equipe";
import { Jogador } from "../entities/Jogador";
import { isDate } from "util/types";
import { equipeJogadorCreateSchema } from "../validations/equipeJogadorSchema";
import { equipeCoachRepository } from "../repositories/equipeCoach";
import { Equipe_Tecnico } from "../entities/Equipe_Tecnico";
import { coachRepository } from "../repositories/coachRepository";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { torneioRepository } from "../repositories/torneioRepository";
import { partidaRepository } from "../repositories/partidaRepository";





export const vincularEquipePartida = async (
    idPartida: string,
    idEquipeCasa: string,
    idEquipeVisitante: string,
    idTorneio: string
) => {
    try {

         // Verifica se a equipe existe
         const count = await equipeRepository.count({
            where: {
              id: In([idEquipeCasa,idEquipeVisitante]), // Verifica se os IDs das equipes estão associados
              torneios: { id: idTorneio,isDeleted:false }, // Verifica se pertencem ao torneio específico
              isDeleted: false
            }
          });
         if (count == 2) {
             return { erro: "Equipe(s) não registrada(s) no torneio", status: 404 };
         }

                 // Verifica se a equipe existe
        const partida = await partidaRepository.findOneBy({ id: idPartida, torneio:{id:idTorneio},isDeleted: false });
        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 };
        }

        const torneio = await torneioRepository.findOneBy({ id: idTorneio,isDeleted: false });
        if (!torneio) {
            return { erro: "Torneio não encontrado", status: 404 };
        }



        const equipePartida = equipePartidaRepository.create({
            casaId: idEquipeCasa,
            visitanteId: idEquipeVisitante,
            partidaId: idPartida
        })

        await equipePartidaRepository.save(equipePartida)


        return { mensagem: "Equipes registradas na partida!", partida: equipePartida };
    } catch (erro: unknown) {

        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};


