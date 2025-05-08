import { AppDataSource } from "../data-source";
import { Equipe } from "../entities/Equipe";


export const equipeRepository = AppDataSource.getRepository(Equipe)