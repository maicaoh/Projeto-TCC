import { AppDataSource } from "../data-source";
import { Gol } from "../entities/Gol";


export const golRepository = AppDataSource.getRepository(Gol)