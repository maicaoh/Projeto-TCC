import { AppDataSource } from "../data-source";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";


export const equipeJogadorRepository = AppDataSource.getRepository(Equipe_Jogador)