import { AppDataSource } from "../data-source";
import { Jogador } from "../entities/Jogador";


export const jogadorRepository = AppDataSource.getRepository(Jogador)