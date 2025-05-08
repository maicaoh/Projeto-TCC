import { In } from "typeorm";
import { Equipe } from "../entities/Equipe";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { golRepository } from "../repositories/golRepository";
import { torneioRepository } from "../repositories/torneioRepository";
import { cartaoRepository } from "../repositories/cartaoRepository";
import { TipoCartao } from "../Utils/enums/enums";
import { partidaRepository } from "../repositories/partidaRepository";
import { finalizacaoRepository } from "../repositories/finalizacaoRepository";
import { desarmeRepository } from "../repositories/desarmeRepository";
import { dribleRepository } from "../repositories/dribleRepository";
import { faltaRepository } from "../repositories/faltaRepository";
import { equipeRepository } from "../repositories/equipeRepository";

export const findGeralWithStats = async (): Promise<any> => {
  try {
    // 1) Carrega todas as equipes + vínculos + jogadores
    const equipes = await equipeRepository.find({
      where: { isDeleted: false },
      relations: ['equipeJogador', 'equipeJogador.jogador'],
    });

    // 2) Só equipes ativas
    const activeEquipes = equipes.filter(eq => !eq.isDeleted);

    // 3) Lista de todos os jogadores ativos (vínculo.data_desligamento == null)
    const allJogIds = activeEquipes
      .flatMap(eq => eq.equipeJogador as Equipe_Jogador[])
      .filter(link => link.data_desligamento == null && !link.jogador.isDeleted)
      .map(link => link.jogador.id);

    // 4) Busca todos os gols e assistências
    const gols = await golRepository.find({
      where: { isDeleted: false },
      relations: ['jogador', 'assistente'],
    });

    const golsMap = new Map<string, number>();
    const assistMap = new Map<string, number>();
    gols.forEach(g => {
      if (!g.golContra && allJogIds.includes(g.jogador.id)) {
        golsMap.set(g.jogador.id, (golsMap.get(g.jogador.id) ?? 0) + 1);
      }
      if (g.assistente?.id && allJogIds.includes(g.assistente.id)) {
        assistMap.set(
          g.assistente.id,
          (assistMap.get(g.assistente.id) ?? 0) + 1
        );
      }
    });

    // 5) Busca todos os cartões
    const cartoes = await cartaoRepository.find({
      where: { isDeleted: false },
      relations: ['jogador'],
    });

    const cartoesMap = new Map<string, { amarelo: number; vermelho: number }>();
    cartoes.forEach(c => {
      const jid = c.jogador.id;
      if (!allJogIds.includes(jid)) return;
      const prev = cartoesMap.get(jid) ?? { amarelo: 0, vermelho: 0 };
      if (c.tipo === TipoCartao.AMARELO) prev.amarelo++;
      if (c.tipo === TipoCartao.VERMELHO) prev.vermelho++;
      cartoesMap.set(jid, prev);
    });

    // 6) Busca todas as partidas status 1 ou 2
    const partidas = await partidaRepository.find({
      where: { status: In([1, 2]), isDeleted: false },
      relations: [
        'equipePartida',
        'equipePartida.casa',
        'equipePartida.visitante',
      ],
    });

    // 7) Monte um mapa equipeId → [jogadorId…]
    const equipeJogMap = new Map<string, string[]>();
    activeEquipes.forEach(eq => {
      const ids = (eq.equipeJogador as Equipe_Jogador[])
        .filter(link => link.data_desligamento == null && !link.jogador.isDeleted)
        .map(link => link.jogador.id);
      equipeJogMap.set(eq.id, ids);
    });

    // 8) Conta número de jogos por jogador
    const jogosMap = new Map<string, number>();
    partidas.forEach(p => {
      p.equipePartida.forEach(ep => {
        const casa = equipeJogMap.get(ep.casa.id) ?? [];
        const visit = equipeJogMap.get(ep.visitante.id) ?? [];
        casa.concat(visit).forEach(jid => {
          jogosMap.set(jid, (jogosMap.get(jid) ?? 0) + 1);
        });
      });
    });

    // 9) Monta estatísticas de cada equipe
    const equipesWithStats = activeEquipes.map(eq => {
      const links = (eq.equipeJogador as Equipe_Jogador[])
        .filter(link => link.data_desligamento == null && !link.jogador.isDeleted);

      const jogadores = links.map(link => {
        const pid = link.jogador.id;
        const cart = cartoesMap.get(pid) ?? { amarelo: 0, vermelho: 0 };
        return {
          ...link.jogador,
          dorsal: link.dorsal,
          capitao: link.capitao,
          golsCount: golsMap.get(pid) ?? 0,
          assistenciasCount: assistMap.get(pid) ?? 0,
          jogosCount: jogosMap.get(pid) ?? 0,
          cartoesAmarelos: cart.amarelo,
          cartoesVermelhos: cart.vermelho,
        };
      });

      const { equipeJogador, ...eqRest } = eq;
      return { ...eqRest, jogadores };
    });

    // 10) Retorno final
    return {
      mensagem: 'Estatísticas gerais carregadas com sucesso!',
      equipes: equipesWithStats,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 };
    }
    return { erro: 'Erro interno no servidor', status: 500 };
  }
};


export const findPlayerFinalizacaoStatsGlobal = async (
  jogadorId: string
): Promise<any> => {
  try {
    // 1) Busca todas as finalizações desse jogador em qualquer torneio
    const finalizacoes = await finalizacaoRepository.find({
      where: {
        jogadorAtacante: { id: jogadorId },
        isDeleted: false,
      },
      relations: ['partida', 'partida.torneio'],
    });

    // 2) Agrupa por torneio (substituindo agrupamento por partida)
    const statsPorTorneio = new Map<
      string,
      {
        torneioNome: string;
        total: number;
        certas: number;
        itens: Array<{
          posicaoCampo: { x: number; y: number } | null;
          posicaoGol: { x: number; y: number } | null;
          gol: boolean;
          defesa: boolean;
        }>;
      }
    >();
    let totalCertas = 0;

    finalizacoes.forEach(f => {
      const torneio = f.partida.torneio;
      const tid = torneio.id;
      const entry = statsPorTorneio.get(tid) ?? {
        torneioNome: torneio.name,
        total: 0,
        certas: 0,
        itens: [],
      };

      // incrementa totais
      entry.total++;
      if (f.gol || f.defesa) {
        entry.certas++;
        totalCertas++;
      }

      entry.itens.push({
        posicaoCampo: f.posicaoCampo,
        posicaoGol: f.posicaoGol,
        gol: Boolean(f.gol),
        defesa: Boolean(f.defesa),
      });

      statsPorTorneio.set(tid, entry);
    });

    // 3) Prepara array de resultados por torneio
    const torneios = Array.from(statsPorTorneio.entries()).map(
      ([torneioId, { torneioNome, total, certas, itens }]) => ({
        torneioId,
        torneioNome,
        finalizacoesCount: total,
        finalizacoesCertasCount: certas,
        finalizacoes: itens,
      })
    );

    // 4) Monta retorno no formato original, trocando partidas por torneios e geral global
    return {
      mensagem: 'Estatísticas de finalizações globais carregadas com sucesso!',
      jogadorId,
      totalFinalizacoes: finalizacoes.length,
      totalFinalizacoesCertas: totalCertas,
      torneios,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 };
    }
    return { erro: 'Erro interno no servidor', status: 500 };
  }
};


/**
 * Estatísticas globais de dribles por torneio (inclui posições de campo para heatmap)
 */
export const findPlayerDribleStatsGlobal = async (
  jogadorId: string
): Promise<any> => {
  try {
    const dribles = await dribleRepository.find({
      where: { jogadorAtacante: { id: jogadorId }, isDeleted: false },
      relations: ['partida', 'partida.torneio'],
    })

    const statsPorTorneio = new Map<
      string,
      {
        nomeTorneio: string;
        total: number;
        sucesso: number;
        itens: Array<{ posicaoCampo: { x: number; y: number } | null; sucesso: boolean }>;
      }
    >()
    let totalDribles = 0
    let totalSucesso = 0

    dribles.forEach(d => {
      const torneio = d.partida.torneio
      const tid = torneio.id
      const nome = torneio.name
      const entry = statsPorTorneio.get(tid) ?? { nomeTorneio: nome, total: 0, sucesso: 0, itens: [] }

      entry.total++
      if (d.sucesso) {
        entry.sucesso++
        totalSucesso++
      }
      entry.itens.push({ posicaoCampo: d.posicaoCampo, sucesso: !!d.sucesso })

      totalDribles++
      statsPorTorneio.set(tid, entry)
    })

    const torneios = Array.from(statsPorTorneio.entries()).map(
      ([torneioId, { nomeTorneio, total, sucesso, itens }]) => ({
        torneioId,
        nomeTorneio,
        driblesCount: total,
        driblesSucessoCount: sucesso,
        dribles: itens,
      })
    )

    return {
      mensagem: 'Estatísticas globais de dribles carregadas com sucesso!',
      jogadorId,
      totalDrible: totalDribles,
      totalDribleSucesso: totalSucesso,
      torneios,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 }
    }
    return { erro: 'Erro interno no servidor', status: 500 }
  }
}

/**
 * Estatísticas globais de desarmes por torneio (inclui posições de campo para heatmap)
 */
export const findPlayerDesarmeStatsGlobal = async (
  jogadorId: string
): Promise<any> => {
  try {
    const desarmes = await desarmeRepository.find({
      where: { jogadorDesarme: { id: jogadorId }, isDeleted: false },
      relations: ['partida', 'partida.torneio'],
    })

    const statsPorTorneio = new Map<
      string,
      {
        nomeTorneio: string;
        total: number;
        sucesso: number;
        itens: Array<{ posicaoCampo: { x: number; y: number } | null; sucesso: boolean }>;
      }
    >()
    let totalDesarmes = 0
    let totalSucesso = 0

    desarmes.forEach(d => {
      const torneio = d.partida.torneio
      const tid = torneio.id
      const nome = torneio.name
      const entry = statsPorTorneio.get(tid) ?? { nomeTorneio: nome, total: 0, sucesso: 0, itens: [] }

      entry.total++
      if (d.sucesso) {
        entry.sucesso++
        totalSucesso++
      }
      entry.itens.push({ posicaoCampo: d.posicaoCampo, sucesso: !!d.sucesso })

      totalDesarmes++
      statsPorTorneio.set(tid, entry)
    })

    const torneios = Array.from(statsPorTorneio.entries()).map(
      ([torneioId, { nomeTorneio, total, sucesso, itens }]) => ({
        torneioId,
        nomeTorneio,
        desarmesCount: total,
        desarmesSucessoCount: sucesso,
        desarmes: itens,
      })
    )

    return {
      mensagem: 'Estatísticas globais de desarmes carregadas com sucesso!',
      jogadorId,
      totalDesarmes,
      totalDesarmesSucesso: totalSucesso,
      torneios,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 }
    }
    return { erro: 'Erro interno no servidor', status: 500 }
  }
}



// src/services/estatisticasService.ts

// 1) Faltas e Cartões — estatísticas globais por torneio
export const findPlayerFaltaCartaoStatsGlobal = async (
  jogadorId: string
): Promise<any> => {
  try {
    // Busca todas as faltas do jogador em todos os torneios
    const faltas = await faltaRepository.find({
      where: { jogadorAutor: { id: jogadorId }, isDeleted: false },
      relations: ['partida', 'partida.torneio'],
    });
    // Busca todos os cartões do jogador em todos os torneios
    const cartoes = await cartaoRepository.find({
      where: { jogador: { id: jogadorId }, isDeleted: false },
      relations: ['partida', 'partida.torneio'],
    });

    // Agrupamento por torneio
    const statsPorTorneio = new Map<
      string,
      {
        nomeTorneio: string;
        totalFaltas: number;
        totalCartoes: number;
        totalCartaoAmarelo: number;
        totalCartaoVermelho: number;
        faltas: Array<{
          posicaoCampo: { x: number; y: number } | null;
          periodo: number;
          tempo: string;
          tipo: number;
        }>;
        cartoes: Array<{
          tipo: number;
          periodo: number;
          tempo: string;
          descricao: string | null;
        }>;
      }
    >();

    let totalFaltas = 0;
    let totalCartaoAmarelo = 0;
    let totalCartaoVermelho = 0;

    // Processa faltas
    for (const f of faltas) {
      const tid = f.partida.torneio.id;
      const nome = f.partida.torneio.name;
      const entry = statsPorTorneio.get(tid) ?? {
        nomeTorneio: nome,
        totalFaltas: 0,
        totalCartoes: 0,
        totalCartaoAmarelo: 0,
        totalCartaoVermelho: 0,
        faltas: [],
        cartoes: [],
      };
      entry.totalFaltas++;
      totalFaltas++;
      entry.faltas.push({
        posicaoCampo: f.posicaoCampo,
        periodo: f.periodo,
        tempo: f.tempo,
        tipo: f.tipo,
      });
      statsPorTorneio.set(tid, entry);
    }

    // Processa cartões
    for (const c of cartoes) {
      const tid = c.partida.torneio.id;
      const nome = c.partida.torneio.name;
      const entry = statsPorTorneio.get(tid) ?? {
        nomeTorneio: nome,
        totalFaltas: 0,
        totalCartoes: 0,
        totalCartaoAmarelo: 0,
        totalCartaoVermelho: 0,
        faltas: [],
        cartoes: [],
      };
      entry.totalCartoes++;
      // cartao.tipo: 0 = amarelo, 1 = vermelho
      if (c.tipo === 0) {
        entry.totalCartaoAmarelo++;
        totalCartaoAmarelo++;
      } else if (c.tipo === 1) {
        entry.totalCartaoVermelho++;
        totalCartaoVermelho++;
      }
      // (opcional) contar cartão também como falta
      entry.totalFaltas++;
      totalFaltas++;

      entry.cartoes.push({
        tipo: c.tipo,
        periodo: c.periodo,
        tempo: c.tempo,
        descricao: c.descricao ?? null,
      });
      statsPorTorneio.set(tid, entry);
    }

    // Monta array final
    const torneios = Array.from(statsPorTorneio.entries()).map(
      ([torneioId, e]) => ({
        torneioId,
        nomeTorneio: e.nomeTorneio,
        totalFaltas: e.totalFaltas,
        totalCartoes: e.totalCartoes,
        totalCartaoAmarelo: e.totalCartaoAmarelo,
        totalCartaoVermelho: e.totalCartaoVermelho,
        faltas: e.faltas,
        cartoes: e.cartoes,
      })
    );

    return {
      mensagem: 'Estatísticas globais de faltas e cartões carregadas com sucesso!',
      jogadorId,
      totalFaltas,
      totalCartaoAmarelo,
      totalCartaoVermelho,
      torneios,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 };
    }
    return { erro: 'Erro interno no servidor', status: 500 };
  }
};

// 2) Gols — estatísticas globais por torneio
export const findPlayerGolsStatsGlobal = async (
  jogadorId: string
): Promise<any> => {
  try {
    const gols = await golRepository.find({
      where: { jogador: { id: jogadorId }, isDeleted: false },
      relations: ['partida', 'partida.torneio'],
    });

    const statsPorTorneio = new Map<
      string,
      {
        nomeTorneio: string;
        totalGols: number;
        itens: Array<{
          tempoGol: string;
          periodo: number;
          posicaoCampo: { x: number; y: number } | null;
          posicaoGol: { x: number; y: number } | null;
          golContra: boolean;
        }>;
      }
    >();

    let totalGols = 0;
    for (const g of gols) {
      const tid = g.partida.torneio.id;
      const nome = g.partida.torneio.name;
      const entry = statsPorTorneio.get(tid) ?? {
        nomeTorneio: nome,
        totalGols: 0,
        itens: [],
      };
      entry.itens.push({
        tempoGol: g.tempoGol,
        periodo: g.periodo,
        posicaoCampo: g.posicaoCampo,
        posicaoGol: g.posicaoGol,
        golContra: Boolean(g.golContra),
      });
      // conta apenas gols normais
      if (!g.golContra) {
        entry.totalGols++;
        totalGols++;
      }
      statsPorTorneio.set(tid, entry);
    }

    const torneios = Array.from(statsPorTorneio.entries()).map(
      ([torneioId, e]) => ({
        torneioId,
        nomeTorneio: e.nomeTorneio,
        totalGols: e.totalGols,
        gols: e.itens,
      })
    );

    return {
      mensagem: 'Estatísticas globais de gols carregadas com sucesso!',
      jogadorId,
      totalGols,
      torneios,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 };
    }
    return { erro: 'Erro interno no servidor', status: 500 };
  }
};


// src/services/estatisticas.service.ts

/**
 * Estatísticas globais de assistências por torneio
 */
export const findPlayerAssistenciaStatsGlobal = async (
  jogadorId: string
): Promise<any> => {
  try {
    // 1) Busca todas as assistências desse jogador em qualquer torneio
    const assistencias = await golRepository.find({
      where: {
        assistente: { id: jogadorId },
        isDeleted: false,
      },
      relations: ['partida', 'partida.torneio'],
    });

    // 2) Agrupa por torneio
    const statsPorTorneio = new Map<
      string,
      {
        nomeTorneio: string;
        totalAssistencias: number;
        itens: Array<{
          tempoGol: string;
          periodo: number;
          posicaoCampo: { x: number; y: number } | null;
          posicaoGol: { x: number; y: number } | null;
        }>;
      }
    >();
    let totalAssistencias = 0;

    assistencias.forEach(a => {
      const torneio = a.partida.torneio!;
      const tid = torneio.id;
      const entry = statsPorTorneio.get(tid) ?? {
        nomeTorneio: torneio.name,
        totalAssistencias: 0,
        itens: [],
      };

      entry.totalAssistencias++;
      entry.itens.push({
        tempoGol: a.tempoGol,
        periodo: a.periodo,
        posicaoCampo: a.posicaoCampo,
        posicaoGol: a.posicaoGol,
      });

      statsPorTorneio.set(tid, entry);
      totalAssistencias++;
    });

    // 3) Monta array de torneios
    const torneios = Array.from(statsPorTorneio.entries()).map(
      ([torneioId, { nomeTorneio, totalAssistencias, itens }]) => ({
        torneioId,
        nomeTorneio,
        totalAssistencias,
        assistencias: itens,
      })
    );

    // 4) Retorno
    return {
      mensagem: 'Estatísticas globais de assistências carregadas com sucesso!',
      jogadorId,
      totalAssistencias,
      torneios,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 };
    }
    return { erro: 'Erro interno no servidor', status: 500 };
  }
};

/**
 * Estatísticas globais de participação em gols (gols + assistências) por torneio
 */
export const findPlayerParticipacaoGolsStatsGlobal = async (
  jogadorId: string
): Promise<any> => {
  try {
    // 1) Busca gols feitos e assistências, em qualquer torneio
    const [golsFeitos, assistenciasDadas] = await Promise.all([
      golRepository.find({
        where: { jogador: { id: jogadorId }, isDeleted: false },
        relations: ['partida', 'partida.torneio'],
      }),
      golRepository.find({
        where: { assistente: { id: jogadorId }, isDeleted: false },
        relations: ['partida', 'partida.torneio'],
      }),
    ]);

    // 2) Agrupa por torneio
    const statsPorTorneio = new Map<
      string,
      {
        nomeTorneio: string;
        gols: number;
        assistencias: number;
      }
    >();

    const addEntry = (
      partida: { partida: { id: string; rodada: number | null; torneio: any } },
      field: 'gols' | 'assistencias'
    ) => {
      const t = partida.partida.torneio;
      const tid = t.id;
      const entry = statsPorTorneio.get(tid) ?? {
        nomeTorneio: t.name,
        gols: 0,
        assistencias: 0,
      };
      entry[field]++;
      statsPorTorneio.set(tid, entry);
    };

    golsFeitos.forEach(g => {
      if (!g.golContra) addEntry(g, 'gols');
    });
    assistenciasDadas.forEach(a => {
      if (!a.golContra) addEntry(a, 'assistencias');
    });

    // 3) Monta array de torneios
    const torneios = Array.from(statsPorTorneio.entries()).map(
      ([torneioId, { nomeTorneio, gols, assistencias }]) => ({
        torneioId,
        nomeTorneio,
        golsCount: gols,
        assistenciasCount: assistencias,
        totalParticipacao: gols + assistencias,
      })
    );

    // 4) Soma total geral
    const totalParticipacao = torneios.reduce(
      (sum, t) => sum + t.totalParticipacao,
      0
    );

    // 5) Retorno
    return {
      mensagem: 'Estatísticas globais de participação em gols carregadas com sucesso!',
      jogadorId,
      totalParticipacao,
      torneios,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 };
    }
    return { erro: 'Erro interno no servidor', status: 500 };
  }
};
