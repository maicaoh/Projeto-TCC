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
import { arbitroRepository } from "../repositories/arbitroRepository";
import { partidaRepository } from "../repositories/partidaRepository";




export const vincularPartidaArbitro = async (
    idPartida: string,
    idsArbitros: string[]
) => {
    try {



        // Verifica se a equipe existe
        const arbitros = await arbitroRepository.findBy({ id: In(idsArbitros), isDeleted: false });
        console.log(arbitros)
        if (arbitros.length != idsArbitros.length) {
            return { erro: "Partida(s) não encontrada(s)", status: 404 };
        }

        // Verifica se a equipe existe
        const partida = await partidaRepository.findOne({ where: { id: idPartida, isDeleted: false }, relations: ["arbitro"] });

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 };
        }

        const arbitrosJaAssociadas = partida?.arbitro.map(elemento => elemento.id)

        const algumaJaExiste = idsArbitros.some(elemento => arbitrosJaAssociadas?.includes(elemento))



        if (algumaJaExiste) {
            return { erro: "Arbitro(s) ja estão cadastrada(s) na partida", status: 404 };
        }

        partida?.arbitro.push(...arbitros)

        await partidaRepository.save(partida)


        return { mensagem: "Arbitro(s) vinculada(s) à competição com sucesso!", equipe: partida };
    } catch (erro: unknown) {

        console.log(erro)
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};


export const desvincularPartidaArbitro = async (
    idPartida: string,
    idsArbitros: string[]
) => {
    try {


        // Busca a partida com os árbitros vinculados
        const partida = await partidaRepository.findOne({
            where: { id: idPartida, isDeleted: false },
            relations: ["arbitro"],
        });

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 };
        }

        // Filtra os árbitros para remover apenas os especificados
        const novosArbitros = partida.arbitro.filter(
            (arbitro) => !idsArbitros.includes(arbitro.id)
        );

          // Filtra os árbitros para remover apenas os especificados
          const removeArbitros = partida.arbitro.filter(
            (arbitro) => idsArbitros.includes(arbitro.id)
        );


        // Se a quantidade de árbitros não mudou, significa que nenhum dos informados estava vinculado
        if (removeArbitros.length != idsArbitros.length) {
            return { erro: "Árbitro(s) não vinculados á partida", status: 404 };
        }

        // Atualiza a relação
        partida.arbitro = novosArbitros;
        await partidaRepository.save(partida);

        return { mensagem: "Árbitro(s) desvinculado(s) da partida com sucesso!", partida };
    } catch (erro: unknown) {

        console.log(erro)
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};



export const listarArbitros = async (
    idPartida: string
) => {
    try {
        // Verifica se a equipe existe
        const partida = await partidaRepository.findOne({ where: { id: idPartida, isDeleted: false }, relations: ["arbitro"] });

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 };
        }

        return { mensagem: "Arbitro(s) vinculada(s) à competição com sucesso!", partida: partida };
    } catch (erro: unknown) {

        console.log(erro)
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};





