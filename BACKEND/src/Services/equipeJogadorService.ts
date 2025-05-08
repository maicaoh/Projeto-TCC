import { equipeRepository } from "../repositories/equipeRepository";
import { In, IsNull } from "typeorm";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { Equipe } from "../entities/Equipe";
import { Jogador } from "../entities/Jogador";
import { isDate } from "util/types";
import { equipeJogadorCreateSchema } from "../validations/equipeJogadorSchema";

interface equipeJogadorDorsal {
    dorsal: number | null,
    id: string
}

interface configurarDorsal {
    id: string,
    dorsal: number;
  }
  
  interface gerenciarEquipe {
    capitaoId: string,
    desligados : string[],
    dorsaisEditadas: configurarDorsal[]
  }

export const vincularEquipeJogador = async (
    idEquipe: string,
    idsJogadores: string[],
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
        const jogadores = await jogadorRepository.findBy({ id: In(idsJogadores), isDeleted: false });
        console.log(idsJogadores)
        console.log(jogadores)
        if (jogadores.length !== idsJogadores.length) {
            return { erro: "Jogador(es) não encontrado(s)", status: 404 };
        }

        // Busca vínculos ativos já existentes
        const vinculosExistentes = await equipeJogadorRepository.find({
            where: { equipe: { id: idEquipe }, jogador: In(idsJogadores), data_desligamento: IsNull() },
        });

        // Filtra jogadores que ainda não estão vinculados
        const jogadoresParaVincular = jogadores.filter(
            (jogador) => !vinculosExistentes.some((vinculo) => vinculo.jogador?.id === jogador?.id)
        );

        if (jogadoresParaVincular.length === 0) {
            return { erro: "Todos os jogadores já estão vinculados à equipe.", status: 400 };
        }

        // Criando novos vínculos
        const registros = jogadoresParaVincular.map((jogador, index) => {
            const equipeJogador = new Equipe_Jogador();
            equipeJogador.data_contratacao = dataContratacaoFinal;
            equipeJogador.equipe = equipe;
            equipeJogador.jogador = jogador;
            equipeJogador.data_desligamento = null; // Garantimos que seja NULL no momento da contratação
            return equipeJogador;
        });

        await equipeJogadorRepository.save(registros);

        return { mensagem: "Jogadores vinculados à equipe com sucesso!", equipe: registros };
    } catch (erro: unknown) {

        console.log(erro)
        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 };
        }
        return { erro: "Erro interno no servidor", status: 500 };
    }
};


export const desvincularEquipeJogador = async (idEquipe: string, idsJogadores: string[], dataDesligamento: Date | undefined) => {
    try {


        await equipeJogadorCreateSchema.validate({ dataContratacao:dataDesligamento }, { abortEarly: false });


        const dataDesligamentoFinal = dataDesligamento ? new Date(dataDesligamento) : new Date();


        if (isNaN(dataDesligamentoFinal.getTime())) {
            return { erro: "Data de desligamento inválida.", status: 400 };
        }


        const vinculosAtivos = await equipeJogadorRepository.find({
            where: { equipe: { id: idEquipe }, jogador: In(idsJogadores), data_desligamento: IsNull() },
        });



        if (vinculosAtivos.length !== idsJogadores.length) {
            return { erro: "Jogador(es) não possui vínculo com a equipe.", status: 404 };
        }



        for (const vinculos of vinculosAtivos) {
            if (vinculos.data_contratacao.getTime() > dataDesligamentoFinal.getTime()) {
                return { erro: "Data de desligamento superior ao de contratação.", status: 404 };

            }
        }



        if (vinculosAtivos.length === 0) {
            return { erro: "Nenhum vínculo ativo encontrado para os jogadores informados.", status: 404 };
        }

        // Atualiza a dataDesligamento para a data atual
        vinculosAtivos.forEach((vinculo) => {
            vinculo.data_desligamento = dataDesligamentoFinal;
        });

        await equipeJogadorRepository.save(vinculosAtivos);

        return { mensagem: "Jogadores desvinculados da equipe com sucesso!", equipe: vinculosAtivos };

    } catch (erro: unknown) {


        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }

        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};


export const dorsalEquipeJogador = async (idEquipe: string, jogadores: equipeJogadorDorsal[]) => {
    try {


        if (!Array.isArray(jogadores)) {
            return { erro: "Formato de entrada inválido!", status: 404 };

        }

        const vinculosAtivos = await equipeJogadorRepository.find({
            where: { equipe: { id: idEquipe }, jogador: In(jogadores.map(jogador => jogador.id)), data_desligamento: IsNull() },
        });



        if (vinculosAtivos.length !== jogadores.length) {
            return { erro: "Jogador(es) não possui vínculo com a equipe.", status: 404 };
        }


        if (vinculosAtivos.length === 0) {
            return { erro: "Nenhum vínculo ativo encontrado para os jogadores informados.", status: 404 };
        }

        // Atualiza a dataDesligamento para a data atual
        vinculosAtivos.forEach((vinculo) => {
            const jogadorNewDorsal = jogadores.find(jogador => jogador.id == String(vinculo.jogadorId) && idEquipe == String(vinculo.equipeId))
            vinculo.dorsal = jogadorNewDorsal?.dorsal || null
        });

        await equipeJogadorRepository.save(vinculosAtivos);

        return { mensagem: "doaral(s) da equipe salva com sucesso!", equipe: vinculosAtivos };

    } catch (erro: unknown) {

        console.log(erro)

        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }

        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};


export const listarJogadoresEquipe = async (idEquipe: string) => {
    try {


        const vinculosAtivos = await equipeRepository.find({
            where: { id: idEquipe },
            relations: ["equipeJogador", "equipeJogador.jogador"],
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


export const gerenciarEquipe = async (data: gerenciarEquipe) => {
  try {


    const { capitaoId, desligados , dorsaisEditadas } = data
    console.log(dorsaisEditadas)

    let ids: string[] = []

    if (capitaoId?.length > 0) {
      ids.push(capitaoId)
    }

    if (desligados ?.length > 0) {
      ids.push(...desligados )
    }

    if (dorsaisEditadas?.length > 0) {
      ids.push(...dorsaisEditadas.map(el => el.id))
    }

    // Remover duplicatas
    ids = [...new Set(ids)]

    // Buscar todos os vínculos (equipe_jogador) ativos
    const vinculos = await equipeJogadorRepository.find({
      where: {
        id: In(ids),
        data_desligamento: IsNull()
      }
    })

    if (vinculos.length !== ids.length) {
      return { erro: "Algum vínculo com a equipe está inativo ou não existe.", status: 404 }
    }

    // Atualizar cada vínculo
    for (const vinculo of vinculos) {
      // Atualizar dorsal, se existir
      const dorsal = dorsaisEditadas?.find(d => d.id === vinculo.id)
      if (dorsal) {
        vinculo.dorsal = dorsal.dorsal
      }

      // Atualizar capitão
      vinculo.capitao = vinculo.id === capitaoId

      // Marcar desligamento, se for o caso
      if (desligados ?.includes(vinculo.id)) {
        vinculo.data_desligamento = new Date()
      }
    }

    // Salvar alterações
    await equipeJogadorRepository.save(vinculos)

    return { mensagem: "Equipe atualizada com sucesso!", status: 200 }
  } catch (erro: unknown) {
    console.log(erro)
    if (erro instanceof Error) {
      return { erro: erro.message, status: 500 }
    }

    return { erro: "Erro interno no servidor", status: 500 }
  }
}
