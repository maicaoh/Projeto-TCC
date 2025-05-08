import { AppDataSource } from "../data-source";
import { Finalizacao } from "../entities/Finalizacao";


export const finalizacaoRepository = AppDataSource.getRepository(Finalizacao)