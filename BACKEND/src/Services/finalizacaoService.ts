import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";
import { Gol } from "../entities/Gol";
import { golRepository } from "../repositories/golRepository";
import { partidaRepository } from "../repositories/partidaRepository";
import { Finalizacao } from "../entities/Finalizacao";
import { finalizacaoCreateSchema } from "../validations/finalizacaoSchema";
import { finalizacaoRepository } from "../repositories/finalizacaoRepository";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { equipeRepository } from "../repositories/equipeRepository";

export const criarFinalizacao = async (
  idPartida: string,
  idJogador: string,
  idDefensor: string,
  idEquipe: string,
  idEquipeDefensor: string,
  finalizacaoData: Partial<Finalizacao> & { gol?: boolean; periodo?: number; golContra?: boolean; assistente?: { id: string } }
) => {
  try {
    await finalizacaoCreateSchema.validate(finalizacaoData, { abortEarly: false });

    const partida = await partidaRepository.findOneBy({ id: idPartida, isDeleted: false });
    if (!partida) return { erro: "Partida não encontrada", status: 404 };

    const equipePartida = await equipePartidaRepository.findOne({
      where: [
        { partidaId: idPartida, casaId: idEquipe, visitanteId: idEquipeDefensor },
        { partidaId: idPartida, casaId: idEquipeDefensor, visitanteId: idEquipe },
      ],
    });
    if (!equipePartida) return { erro: "Dados inválidos de equipe/partida", status: 404 };

    const equipeJogadorAutor = await equipeJogadorRepository.findOne({
      where: { equipeId: idEquipe, jogadorId: idJogador },
    });
    if (!equipeJogadorAutor || equipeJogadorAutor.data_desligamento) {
      return { erro: "Jogador atacante não vinculado ou desligado", status: 404 };
    }

    const equipeJogadorDefensor = await equipeJogadorRepository.findOne({
      where: { equipeId: idEquipeDefensor, jogadorId: idDefensor },
    });
    if (!equipeJogadorDefensor || equipeJogadorDefensor.data_desligamento) {
      return { erro: "Jogador defensor não vinculado ou desligado", status: 404 };
    }

    const jogadorAtacante = await jogadorRepository.findOne({ where: { id: idJogador, isDeleted: false } });
    const jogadorDefensor = await jogadorRepository.findOne({ where: { id: idDefensor, isDeleted: false } });

    if (!jogadorAtacante || !jogadorDefensor) {
      return { erro: "Um ou mais jogadores não encontrados ou estão desligados", status: 404 };
    }

    const equipeAutora = await equipeRepository.findOne({ where: { id: idEquipe, isDeleted: false } });
    if (!equipeAutora) {
      return { erro: "Equipe não encontrada", status: 404 };
    }

    const novaFinalizacao = new Finalizacao();
    novaFinalizacao.createAt = new Date();
    novaFinalizacao.updateAt = new Date();
    novaFinalizacao.isDeleted = false;
    novaFinalizacao.defesa = finalizacaoData.defesa ?? false;
    novaFinalizacao.bloqueio = finalizacaoData.bloqueio ?? false;
    novaFinalizacao.falta = finalizacaoData.falta ?? false;
    novaFinalizacao.seteMetros = finalizacaoData.seteMetros ?? false;
    novaFinalizacao.penalti = finalizacaoData.penalti ?? false;
    novaFinalizacao.seteMetros = finalizacaoData.seteMetros ?? false;
    novaFinalizacao.periodo = finalizacaoData.periodo!;
    novaFinalizacao.pe = finalizacaoData.pe!;
    novaFinalizacao.gol = finalizacaoData.gol!;

    novaFinalizacao.tempo = finalizacaoData.tempo!;
    novaFinalizacao.posicaoCampo = finalizacaoData.posicaoCampo ?? null;
    novaFinalizacao.posicaoGol = finalizacaoData.posicaoGol ?? null;
    novaFinalizacao.jogadorAtacante = jogadorAtacante;
    novaFinalizacao.jogadorDefensor = jogadorDefensor;
    novaFinalizacao.partida = partida;
    novaFinalizacao.equipe = equipeAutora;

    if (finalizacaoData.gol) {
      const novoGol = new Gol();
      novoGol.createAt = new Date();
      novoGol.updateAt = new Date();
      novoGol.isDeleted = false;
      novoGol.tempoGol = finalizacaoData.tempo!;
      novoGol.golContra = finalizacaoData.golContra ?? false;
      novoGol.periodo = finalizacaoData.periodo!;
      novoGol.equipe = equipeAutora;
      novoGol.posicaoCampo = finalizacaoData.posicaoCampo ?? null;
      novoGol.posicaoGol = finalizacaoData.posicaoGol ?? null;
      novoGol.partida = partida;
      novoGol.jogador = jogadorAtacante;
      novoGol.jogadorDefensor = jogadorDefensor;
      novoGol.finalizacao = novaFinalizacao;

      if (finalizacaoData.assistente?.id) {
        const assistente = await jogadorRepository.findOne({
          where: { id: finalizacaoData.assistente.id, isDeleted: false },
        });
        if (!assistente) return { erro: "Assistente inválido", status: 404 };
        novoGol.assistente = assistente;
      }

      await golRepository.save(novoGol);
      return { mensagem: "Finalização e gol cadastrados com sucesso!", gol: novoGol };
    } else {
      await finalizacaoRepository.save(novaFinalizacao);
      return { mensagem: "Finalização cadastrada com sucesso!", finalizacao: novaFinalizacao };
    }

  } catch (erro: unknown) {
    if (erro instanceof ValidationError) return { erro: erro.errors, status: 400 };
    if (erro instanceof Error) return { erro: erro.message, status: 500 };
    return { erro: "Erro interno no servidor", status: 500 };
  }
};
  
  




export const atualizarFinalizacao = async (
  id: string,
  finalizacaoData: Partial<Finalizacao> & {
    gol?: boolean;
    periodo?: number;
    golContra?: boolean;
    assistente?: { id: string };
    idEquipe?: string;
    idJogador?: string;
    idDefensor?: string;
    partidaId?: string;
  }
) => {
  try {
    // Busca a finalização existente com possíveis relações
    const finalEx = await finalizacaoRepository.findOne({ where: { id, isDeleted: false } });
    if (!finalEx) {
      return { erro: "Finalização não encontrada", status: 404 };
    }

    // Atualiza relacionamento de partida
    if (finalizacaoData.partidaId && finalizacaoData.partidaId !== finalEx.partida?.id) {
      const partida = await partidaRepository.findOne({ where: { id: finalizacaoData.partidaId, isDeleted: false } });
      if (!partida) return { erro: "Partida inválida", status: 404 };
      finalEx.partida = partida;
    }

    // Atualiza relacionamento de equipe autora
    if (finalizacaoData.idEquipe && finalizacaoData.idEquipe !== finalEx.equipe?.id) {
      const novaEquipe = await equipeRepository.findOne({ where: { id: finalizacaoData.idEquipe, isDeleted: false } });
      if (!novaEquipe) return { erro: "Equipe inválida", status: 404 };
      finalEx.equipe = novaEquipe;
    }

    // Atualiza relacionamento de jogador atacante e defensor
    if (finalizacaoData.idJogador && finalizacaoData.idJogador !== finalEx.jogadorAtacante?.id) {
      const atacante = await jogadorRepository.findOne({ where: { id: finalizacaoData.idJogador, isDeleted: false } });
      if (!atacante) return { erro: "Jogador atacante inválido", status: 404 };
      finalEx.jogadorAtacante = atacante;
    }
    if (finalizacaoData.idDefensor && finalizacaoData.idDefensor !== finalEx.jogadorDefensor?.id) {
      const defensor = await jogadorRepository.findOne({ where: { id: finalizacaoData.idDefensor, isDeleted: false } });
      if (!defensor) return { erro: "Jogador defensor inválido", status: 404 };
      finalEx.jogadorDefensor = defensor;
    }

    // Atualiza campos simples da finalização
    finalEx.defesa       = finalizacaoData.defesa      ?? finalEx.defesa;
    finalEx.bloqueio     = finalizacaoData.bloqueio    ?? finalEx.bloqueio;
    finalEx.falta        = finalizacaoData.falta       ?? finalEx.falta;
    finalEx.penalti      = finalizacaoData.penalti    ?? finalEx.penalti;
    finalEx.seteMetros   = finalizacaoData.seteMetros  ?? finalEx.seteMetros;
    finalEx.tempo        = finalizacaoData.tempo       ?? finalEx.tempo;
    finalEx.posicaoCampo = finalizacaoData.posicaoCampo ?? finalEx.posicaoCampo;
    finalEx.posicaoGol   = finalizacaoData.posicaoGol  ?? finalEx.posicaoGol;
    finalEx.periodo      = finalizacaoData.periodo     ?? finalEx.periodo;
    finalEx.gol          = finalizacaoData.gol         ?? finalEx.gol;
    finalEx.updateAt     = new Date();

    // Persiste alterações na finalização
    await finalizacaoRepository.save(finalEx);

    // Busca gol relacionado (se existir)
    let golExistente = await golRepository.findOne({
      where: { finalizacao: { id: finalEx.id }, isDeleted: false },
      relations: ["assistente", "jogador", "jogadorDefensor", "partida", "equipe"],
    });

    // Se gol foi marcado como false e existir, marca como deletado
    if (finalizacaoData.gol === false && golExistente) {
      golExistente.isDeleted = true;
      golExistente.updateAt = new Date();
      await golRepository.save(golExistente);
      golExistente = null;
    }

    // Se gol verdadeiro, atualiza ou cria registro de gol
    if (finalEx.gol) {
      if (golExistente) {
        // Atualiza campos do gol existente
        golExistente.tempoGol     = finalEx.tempo;
        golExistente.periodo      = finalEx.periodo;
        golExistente.golContra    = finalizacaoData.golContra ?? golExistente.golContra;
        golExistente.posicaoCampo = finalEx.posicaoCampo;
        golExistente.posicaoGol   = finalEx.posicaoGol;
        golExistente.equipe       = finalEx.equipe;
        golExistente.jogador      = finalEx.jogadorAtacante;
        golExistente.jogadorDefensor = finalEx.jogadorDefensor;
        golExistente.partida      = finalEx.partida;
        golExistente.isDeleted    = false;
        golExistente.updateAt     = new Date();

        // Atualiza assistente, se fornecido
        if (finalizacaoData.assistente?.id) {
          const assistente = await jogadorRepository.findOne({ where: { id: finalizacaoData.assistente.id, isDeleted: false } });
          if (!assistente) return { erro: "Assistente inválido", status: 404 };
          golExistente.assistente = assistente;
        }

        await golRepository.save(golExistente);
      } else {
        // Cria novo gol
        const novoGol = golRepository.create({
          createAt:        new Date(),
          updateAt:        new Date(),
          isDeleted:       false,
          tempoGol:        finalEx.tempo,
          periodo:         finalEx.periodo,
          golContra:       finalizacaoData.golContra ?? false,
          posicaoCampo:    finalEx.posicaoCampo,
          posicaoGol:      finalEx.posicaoGol,
          partida:         finalEx.partida,
          equipe:          finalEx.equipe,
          jogador:         finalEx.jogadorAtacante,
          jogadorDefensor: finalEx.jogadorDefensor,
          finalizacao:     finalEx,
        });

        if (finalizacaoData.assistente?.id) {
          const assistente = await jogadorRepository.findOne({ where: { id: finalizacaoData.assistente.id, isDeleted: false } });
          if (!assistente) return { erro: "Assistente inválido", status: 404 };
          novoGol.assistente = assistente;
        }

        await golRepository.save(novoGol);
        golExistente = novoGol;
      }
    }

    // Retorna a finalização atualizada e gol (se existir)
    return {
      mensagem: "Finalização atualizada com sucesso!",
      finalizacao: finalEx,
      gol: golExistente,
    };
  } catch (erro: unknown) {
    if (erro instanceof ValidationError) {
      return { erro: (erro as ValidationError).errors, status: 400 };
    }
    if (erro instanceof Error) {
      return { erro: erro.message, status: 500 };
    }
    return { erro: "Erro interno no servidor", status: 500 };
  }
};



  
  
  





export const listarFinalizacoes = async (id:string) => {
    try {
      const todasFinalizacoes = await finalizacaoRepository.find({
        where: { isDeleted: false,partida:{id:id} },
        relations: [
          "jogadorAtacante",
          "jogadorDefensor",
          "partida",
          "equipe"
        ],
      });
  
      return { mensagem: "Finalizações listadas com sucesso!", finalizacoes: todasFinalizacoes };
    } catch (erro: unknown) {
      return { erro: "Erro ao listar finalizações", status: 500 };
    }
  };
  

export const buscarFinalizacaoPorId = async (id: string) => {
    try {
        const finalizacao = await finalizacaoRepository.find({ where: { id: id, isDeleted: false } });
        return { mensagem: "Finalização encontrada com sucesso!", finalizacao: finalizacao };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar finalizações", status: 500 }; // 500 Internal Server Error
    }
};


export const deletarFinalizacao = async (id: string) => {
  try {
    // Busca finalização e marca como deletada
    const finalEx = await finalizacaoRepository.findOne({ where: { id, isDeleted: false } });
    if (!finalEx) return { erro: "Finalização não encontrada", status: 404 };

    finalEx.isDeleted = true;
    finalEx.updateAt = new Date();
    await finalizacaoRepository.save(finalEx);

    // Busca gol associado e marca como deletado, se existir
    const golAssociado = await golRepository.findOne({
      where: { finalizacao: { id: finalEx.id }, isDeleted: false }
    });
    if (golAssociado) {
      golAssociado.isDeleted = true;
      golAssociado.updateAt = new Date();
      await golRepository.save(golAssociado);
    }

    return { mensagem: "Finalização e gol (se existia) deletados com sucesso!" };
  } catch (erro: unknown) {
    if (erro instanceof ValidationError) return { erro: erro.errors, status: 400 };
    if (erro instanceof Error) return { erro: erro.message, status: 500 };
    return { erro: "Erro interno no servidor", status: 500 };
  }
};