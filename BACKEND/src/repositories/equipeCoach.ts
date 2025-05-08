import { AppDataSource } from "../data-source";
import { Equipe_Tecnico } from "../entities/Equipe_Tecnico";


export const equipeCoachRepository = AppDataSource.getRepository(Equipe_Tecnico)