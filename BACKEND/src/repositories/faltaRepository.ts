import { AppDataSource } from "../data-source";
import { Falta } from "../entities/Falta";


export const faltaRepository = AppDataSource.getRepository(Falta)