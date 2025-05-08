import { AppDataSource } from "../data-source";
import { Arbitro } from "../entities/Arbitro";


export const arbitroRepository = AppDataSource.getRepository(Arbitro)