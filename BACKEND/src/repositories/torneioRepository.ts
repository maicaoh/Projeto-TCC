import { AppDataSource } from "../data-source";
import { Torneio } from "../entities/Torneio";

export const torneioRepository = AppDataSource.getRepository(Torneio)