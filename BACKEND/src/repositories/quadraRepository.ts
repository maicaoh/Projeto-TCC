import { AppDataSource } from "../data-source";
import { Quadra } from "../entities/Quadra";


export const quadraRepository = AppDataSource.getRepository(Quadra)