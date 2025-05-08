import { equipeRepository } from "../repositories/equipeRepository";
import { In, IsNull } from "typeorm";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { Equipe } from "../entities/Equipe";
import { Jogador } from "../entities/Jogador";
import { isDate } from "util/types";
import { equipeJogadorCreateSchema } from "../validations/equipeJogadorSchema";
import { torneioRepository } from "../repositories/torneioRepository";




export const vincularEquipeTorneio = async (
    idTorneio: string,
    idsEquipes: string[]
) => {
    try {



        // Verifica se a equipe existe
        const equipes = await equipeRepository.findBy({ id: In(idsEquipes), isDeleted: false });
        console.log(equipes)
        if (equipes.length != idsEquipes.length) {
            return { erro: "Equipe(s) não encontrada(s)", status: 404 };
        }

        // Verifica se a equipe existe
        const torneio = await torneioRepository.findOne({where:{ id: idTorneio, isDeleted: false}, relations:["equipes"]});
       
        if (!torneio) {
            return { erro: "Torneio não encontrado", status: 404 };
        }

        const equipesJaAssociadas = torneio?.equipes.map(elemento => elemento.id)

        const algumaJaExiste = idsEquipes.some(elemento=>equipesJaAssociadas?.includes(elemento))

        

        if (algumaJaExiste) {
            return { erro: "Equipe(s) ja estão cadastrada(s) na competição", status: 404 };
        }

        torneio?.equipes.push(...equipes)

        await torneioRepository.save(torneio)

    
        return { mensagem: "Equipe(s) vinculada(s) à competição com sucesso!", equipe: torneio };
    } catch (erro: unknown) {

        console.log(erro)
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};






