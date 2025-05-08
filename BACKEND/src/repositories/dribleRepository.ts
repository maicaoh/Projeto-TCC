import { AppDataSource } from "../data-source";
import { Drible } from "../entities/Drible";


export const dribleRepository = AppDataSource.getRepository(Drible)