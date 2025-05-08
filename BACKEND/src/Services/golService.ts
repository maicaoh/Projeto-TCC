import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";
import { golCreateSchema, golUpdateSchema } from "../validations/golSchema";
import { Gol } from "../entities/Gol";
import { golRepository } from "../repositories/golRepository";
import { partidaRepository } from "../repositories/partidaRepository";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { equipeRepository } from "../repositories/equipeRepository";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { Finalizacao } from "../entities/Finalizacao";
import { Pe } from "../Utils/enums/enums";
import { finalizacaoRepository } from "../repositories/finalizacaoRepository";

export const criarGol = async (
  idPartida: string,
  idJogador: string,
  idDefensor: string,
  idEquipe: string,
  idEquipeDefensor: string,
  golData: Partial<Gol> & { pe?: Pe; assistente?: { id: string } }
) => {
  try {
    await golCreateSchema.validate(golData, { abortEarly: false });

    // 1) Partida
    const partida = await partidaRepository.findOneBy({ id: idPartida, isDeleted: false });
    if (!partida) return { erro: "Partida não encontrada", status: 404 };

    // 2) Equipes na partida
    const equipePartida = await equipePartidaRepository.findOne({
      where: [
        { partidaId: idPartida, casaId: idEquipe, visitanteId: idEquipeDefensor },
        { partidaId: idPartida, casaId: idEquipeDefensor, visitanteId: idEquipe },
      ],
    });
    if (!equipePartida) return { erro: "Dados inválidos de equipe/partida", status: 404 };

    // 3) Vínculo dos jogadores
    const vinculoAutor = await equipeJogadorRepository.findOne({ where: { equipeId: idEquipe, jogadorId: idJogador } });
    if (!vinculoAutor || vinculoAutor.data_desligamento)
      return { erro: "Jogador atacante não vinculado ou desligado", status: 404 };

    const vinculoDef = await equipeJogadorRepository.findOne({ where: { equipeId: idEquipeDefensor, jogadorId: idDefensor } });
    if (!vinculoDef || vinculoDef.data_desligamento)
      return { erro: "Jogador defensor não vinculado ou desligado", status: 404 };

    // 4) Entidades de jogador
    const jogadorAtacante = await jogadorRepository.findOne({ where: { id: idJogador, isDeleted: false } });
    const jogadorDefensor = await jogadorRepository.findOne({ where: { id: idDefensor, isDeleted: false } });
    if (!jogadorAtacante || !jogadorDefensor)
      return { erro: "Jogador(es) não encontrados ou desligados", status: 404 };

    // 5) Equipe autora
    const equipeAutora = await equipeRepository.findOne({ where: { id: idEquipe, isDeleted: false } });
    if (!equipeAutora) return { erro: "Equipe não encontrada", status: 404 };

    // 6) Cria Finalizacao vinculada
    const novaFinalizacao = new Finalizacao();
    novaFinalizacao.createAt       = new Date();
    novaFinalizacao.updateAt       = new Date();
    novaFinalizacao.isDeleted      = false;
    novaFinalizacao.defesa         = false;
    novaFinalizacao.bloqueio       = false;
    novaFinalizacao.falta          = false;
    novaFinalizacao.seteMetros     = false;
    novaFinalizacao.penalti        = false;
    novaFinalizacao.gol            = true;
    novaFinalizacao.periodo        = golData.periodo!;
    // **Aqui**, se golData.pe vier undefined, usa Pe.DIREITA como default
    novaFinalizacao.pe             = golData.pe ?? Pe.DIREITA;
    novaFinalizacao.tempo          = golData.tempoGol!;
    novaFinalizacao.posicaoCampo   = golData.posicaoCampo ?? null;
    novaFinalizacao.posicaoGol     = golData.posicaoGol ?? null;
    novaFinalizacao.jogadorAtacante = jogadorAtacante;
    novaFinalizacao.jogadorDefensor = jogadorDefensor;
    novaFinalizacao.partida        = partida;
    novaFinalizacao.equipe         = equipeAutora;

    // 7) Cria Gol com cascade para Finalizacao
    const novoGol = golRepository.create({
      createAt:       new Date(),
      updateAt:       new Date(),
      isDeleted:      false,
      tempoGol:       golData.tempoGol!,
      golContra:      golData.golContra ?? false,
      periodo:        golData.periodo!,
      posicaoCampo:   golData.posicaoCampo ?? null,
      posicaoGol:     golData.posicaoGol ?? null,
      partida,
      equipe:         equipeAutora,
      jogador:        jogadorAtacante,
      jogadorDefensor: jogadorDefensor,
      finalizacao:    novaFinalizacao,
    });

    // 8) Assistente (opcional)
    if (golData.assistente?.id) {
      const assist = await jogadorRepository.findOne({ where: { id: golData.assistente.id, isDeleted: false } });
      if (!assist) return { erro: "Assistente inválido", status: 404 };
      novoGol.assistente = assist;
    }

    // 9) Salva em cascade
    await golRepository.save(novoGol);

    return { mensagem: "Gol e finalização cadastrados com sucesso!", gol: novoGol };
  } catch (erro: unknown) {
    if (erro instanceof ValidationError) return { erro: erro.errors, status: 400 };
    if (erro instanceof Error)           return { erro: erro.message, status: 500 };
    return { erro: "Erro interno no servidor", status: 500 };
  }
};
  
  

export const atualizarGol = async (
  idGol: string,
  idJogador: string,
  idDefensor: string,
  idEquipe: string,
  idEquipeDefensor: string,
  golData: Partial<Gol> & { pe?: Pe; assistente?: { id: string } }
) => {
  try {
    await golCreateSchema.validate(golData, { abortEarly: false });

    // Busca gol existente com finalizacao
    const golExistente = await golRepository.findOne({
      where: { id: idGol, isDeleted: false },
      relations: ["partida", "finalizacao"]
    });
    if (!golExistente) return { erro: "Gol não encontrado", status: 404 };

    const idPartida = golExistente.partida.id;

    // Valida equipes na partida
    const equipePartida = await equipePartidaRepository.findOne({
      where: [
        { partidaId: idPartida, casaId: idEquipe, visitanteId: idEquipeDefensor },
        { partidaId: idPartida, casaId: idEquipeDefensor, visitanteId: idEquipe },
      ],
    });
    if (!equipePartida) return { erro: "Dados inválidos de equipe/partida", status: 404 };

    // Valida vínculo dos jogadores
    const vinculoAutor = await equipeJogadorRepository.findOne({ where: { equipeId: idEquipe, jogadorId: idJogador } });
    if (!vinculoAutor || vinculoAutor.data_desligamento)
      return { erro: "Jogador atacante não vinculado ou desligado", status: 404 };

    const vinculoDef = await equipeJogadorRepository.findOne({ where: { equipeId: idEquipeDefensor, jogadorId: idDefensor } });
    if (!vinculoDef || vinculoDef.data_desligamento)
      return { erro: "Jogador defensor não vinculado ou desligado", status: 404 };

    // Busca entidades de jogador
    const atacante = await jogadorRepository.findOne({ where: { id: idJogador, isDeleted: false } });
    const defensor = await jogadorRepository.findOne({ where: { id: idDefensor, isDeleted: false } });
    if (!atacante || !defensor)
      return { erro: "Jogador(es) não encontrados ou desligados", status: 404 };

    // Busca equipe autora
    const equipeAutora = await equipeRepository.findOne({ where: { id: idEquipe, isDeleted: false } });
    if (!equipeAutora) return { erro: "Equipe não encontrada", status: 404 };

    // Atualiza campos do Gol
    golExistente.updateAt = new Date();
    golExistente.tempoGol = golData.tempoGol ?? golExistente.tempoGol;
    golExistente.golContra = golData.golContra ?? golExistente.golContra;
    golExistente.periodo = golData.periodo ?? golExistente.periodo;
    golExistente.equipe = equipeAutora;
    golExistente.jogador = atacante;
    golExistente.jogadorDefensor = defensor;

    if (golData.posicaoCampo) golExistente.posicaoCampo = golData.posicaoCampo;
    if (golData.posicaoGol) golExistente.posicaoGol = golData.posicaoGol;

    // Atualiza assistente
    if (golData.assistente?.id) {
      const assistente = await jogadorRepository.findOne({ where: { id: golData.assistente.id, isDeleted: false } });
      if (!assistente) return { erro: "Assistente inválido", status: 404 };
      golExistente.assistente = assistente;
    } else {
      golExistente.assistente = null;
    }

    // Atualiza ou cria finalização associada
    let finalEx = golExistente.finalizacao;
    if (!finalEx) {
      finalEx = new Finalizacao();
      finalEx.createAt = new Date();
      finalEx.isDeleted = false;
    }
    finalEx.updateAt = new Date();
    finalEx.tempo = golExistente.tempoGol;
    finalEx.periodo = golExistente.periodo;
    finalEx.posicaoCampo = golExistente.posicaoCampo;
    finalEx.posicaoGol = golExistente.posicaoGol;
    finalEx.gol = true;
    finalEx.defesa = false;
    finalEx.bloqueio = false;
    finalEx.falta = false;
    finalEx.seteMetros = false;
    finalEx.penalti = false;
    if (golData.pe) finalEx.pe = golData.pe;
    finalEx.jogadorAtacante = atacante;
    finalEx.jogadorDefensor = defensor;
    finalEx.partida = golExistente.partida;
    finalEx.equipe = equipeAutora;

    // Associa e salva em cascade
    golExistente.finalizacao = finalEx;
    await golRepository.save(golExistente);

    return { mensagem: "Gol atualizado com sucesso!", gol: golExistente };
  } catch (erro: unknown) {
    if (erro instanceof ValidationError) return { erro: erro.errors, status: 400 };
    if (erro instanceof Error) return { erro: erro.message, status: 500 };
    return { erro: "Erro interno no servidor", status: 500 };
  }
};

  
  


export const listarGol = async (id:string) => {
    try {
      console.log(id)
        const allGol = await golRepository.find({
            where: { isDeleted: false, partida:{id:id} },
            relations: [
                "assistente",
                "jogadorDefensor",
                "jogador",
                "partida",
                "equipe"
            ]
        });
        return { mensagem: "Gols listados com sucesso!", gol: allGol };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar gols", status: 500 }; // Corrigi a mensagem
    }
};

export const buscarGolPorId = async (id:string) => {
    try {
        const gol = await golRepository.find({where:{id:id,isDeleted:false}});
        return { mensagem: "Gol encontrado com sucesso!", gol: gol };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar treinadores", status: 500 }; // 500 Internal Server Error
    }
};

export const deletarGol = async (id: string) => {
  try {
    // Busca o gol existente junto à finalização
    const golExistente = await golRepository.findOne({
      where: { id, isDeleted: false },
      relations: ["finalizacao"]
    });
    if (!golExistente) {
      return { erro: "Gol não encontrado", status: 404 };
    }

    // Marca o gol como deletado
    golExistente.isDeleted = true;
    golExistente.updateAt = new Date();
    await golRepository.save(golExistente);

    // Se existir finalização associada, também marca como deletada
    const finalEx = golExistente.finalizacao;
    if (finalEx) {
      finalEx.isDeleted = true;
      finalEx.updateAt = new Date();
      await finalizacaoRepository.save(finalEx);
    }

    return { mensagem: "Gol e finalização deletados com sucesso!" };
  } catch (erro: unknown) {
    if (erro instanceof ValidationError) {
      return { erro: erro.errors, status: 400 };
    }
    if (erro instanceof Error) {
      return { erro: erro.message, status: 500 };
    }
    return { erro: "Erro interno no servidor", status: 500 };
  }
};