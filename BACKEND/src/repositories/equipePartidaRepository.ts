import { AppDataSource } from "../data-source";
import { Equipe_Partida } from "../entities/Equipe_Partida";

export const equipePartidaRepository = AppDataSource.getRepository(Equipe_Partida)