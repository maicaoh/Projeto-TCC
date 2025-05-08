import { equipeRepository } from "../repositories/equipeRepository";
import { In, IsNull } from "typeorm";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { Equipe } from "../entities/Equipe";
import { Jogador } from "../entities/Jogador";
import { isDate } from "util/types";
import { equipeJogadorCreateSchema } from "../validations/equipeJogadorSchema";
import { equipeCoachRepository } from "../repositories/equipeCoach";
import { Equipe_Tecnico } from "../entities/Equipe_Tecnico";
import { coachRepository } from "../repositories/coachRepository";





export const vincularEquipeCoach = async (
    idEquipe: string,
    idsTreinadores: string[],
    dataContratacao?: Date | undefined
) => {
    try {

 

        await equipeJogadorCreateSchema.validate({ dataContratacao }, { abortEarly: false });


        // Se dataContratacao não for passada, define a data atual
        const dataContratacaoFinal = dataContratacao ? new Date(dataContratacao) : new Date();

        if (isNaN(dataContratacaoFinal.getTime())) {
            return { erro: "Data de contratação inválida.", status: 400 };
        }

        // Verifica se a equipe existe
        const equipe = await equipeRepository.findOneBy({ id: idEquipe, isDeleted: false });
        if (!equipe) {
            return { erro: "Equipe não encontrada", status: 404 };
        }

        // Verifica se os jogadores existem
        const trinadores = await coachRepository.findBy({ id: In(idsTreinadores), isDeleted: false });
 
        if (trinadores.length !== idsTreinadores.length) {
            return { erro: "Treinador(es) não encontrado(s)", status: 404 };
        }

        // Busca vínculos ativos já existentes
        const vinculosExistentes = await equipeCoachRepository.find({
            where: { equipe: { id: idEquipe }, coach: In(idsTreinadores), data_desligamento: IsNull() },
        });

        // Filtra jogadores que ainda não estão vinculados
        const treinadoresParaVincular = trinadores.filter(
            (treinador) => !vinculosExistentes.some((vinculo) => vinculo.coach?.id === treinador?.id)
        );

        if (treinadoresParaVincular.length === 0) {
            return { erro: "Todos os trinadores já estão vinculados à equipe.", status: 400 };
        }

        // Criando novos vínculos
        const registros = treinadoresParaVincular.map((treinador, index) => {
            const equipeTreinador = new Equipe_Tecnico();
            equipeTreinador.data_contratacao = dataContratacaoFinal;
            equipeTreinador.equipe = equipe;
            equipeTreinador.coach = treinador;
            equipeTreinador.data_desligamento = null; // Garantimos que seja NULL no momento da contratação
            return equipeTreinador;
        });

        await equipeCoachRepository.save(registros);

        return { mensagem: "Treinadores vinculados à equipe com sucesso!", equipe: registros };
    } catch (erro: unknown) {
        console.log("fffffffffffffffffffffffffffffff")

        console.log(erro)
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};


export const desvincularEquipeTreinador = async (idEquipe: string, idsTreinadores: string[], dataDesligamento: Date | undefined) => {
    try {


        await equipeJogadorCreateSchema.validate({ dataContratacao:dataDesligamento }, { abortEarly: false });


        const dataDesligamentoFinal = dataDesligamento ? new Date(dataDesligamento) : new Date();


        if (isNaN(dataDesligamentoFinal.getTime())) {
            return { erro: "Data de desligamento inválida.", status: 400 };
        }


        const vinculosAtivos = await equipeCoachRepository.find({
            where: { equipe: { id: idEquipe }, coach: In(idsTreinadores), data_desligamento: IsNull() },
        });



        if (vinculosAtivos.length !== idsTreinadores.length) {
            return { erro: "Jogador(es) não possui vínculo com a equipe.", status: 404 };
        }



        for (const vinculos of vinculosAtivos) {
            if (vinculos.data_contratacao.getTime() > dataDesligamentoFinal.getTime()) {
                return { erro: "Data de desligamento superior ao de contratação.", status: 404 };

            }
        }



        if (vinculosAtivos.length === 0) {
            return { erro: "Nenhum vínculo ativo encontrado para os treinadores informados.", status: 404 };
        }

        // Atualiza a dataDesligamento para a data atual
        vinculosAtivos.forEach((vinculo) => {
            vinculo.data_desligamento = dataDesligamentoFinal;
        });

        await equipeCoachRepository.save(vinculosAtivos);

        return { mensagem: "Técnicos desvinculados da equipe com sucesso!", equipe: vinculosAtivos };

    } catch (erro: unknown) {


        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }

        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};





export const listarTreinadoresEquipe = async (idEquipe: string) => {
    try {


        const vinculosAtivos = await equipeRepository.find({
            where: { id: idEquipe},
            relations: ["equipeTecnico", "equipeTecnico.coach"],
        });






        return { mensagem: "Equipe listada com sucesso!", equipe: vinculosAtivos };

    } catch (erro: unknown) {

        console.log(erro)
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }

        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};
