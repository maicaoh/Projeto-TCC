import { AppDataSource } from "../data-source";
import { Desarme } from "../entities/Desarme";


export const desarmeRepository = AppDataSource.getRepository(Desarme)