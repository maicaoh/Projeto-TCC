import { AppDataSource } from "../data-source";
import { Partida } from "../entities/Partida";


export const partidaRepository = AppDataSource.getRepository(Partida)