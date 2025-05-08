import { In } from "typeorm";
import { Equipe } from "../entities/Equipe";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { golRepository } from "../repositories/golRepository";
import { torneioRepository } from "../repositories/torneioRepository";
import { cartaoRepository } from "../repositories/cartaoRepository";
import { StatusPartida, TipoCartao } from "../Utils/enums/enums";
import { partidaRepository } from "../repositories/partidaRepository";
import { finalizacaoRepository } from "../repositories/finalizacaoRepository";
import { desarmeRepository } from "../repositories/desarmeRepository";
import { dribleRepository } from "../repositories/dribleRepository";
import { faltaRepository } from "../repositories/faltaRepository";

export const findTorneioWithStats = async (
    id: string
  ): Promise<any> => {
    try {
      // 1) Carrega torneio + equipes + vínculos
      const torneio = await torneioRepository.findOne({
        where: { id, isDeleted: false },
        relations: [
          'equipes',
          'equipes.equipeJogador',
          'equipes.equipeJogador.jogador',
        ],
      })
      if (!torneio) {
        return { erro: `Torneio com id "${id}" não encontrado`, status: 404 }
      }
  
      // 2) Só equipes ativas
      const activeEquipes = torneio.equipes.filter(eq => !eq.isDeleted)
  
      // 3) Lista de todos os jogadores ativos (vínculo.data_desligamento == null)
      const allJogIds = activeEquipes
        .flatMap(eq => eq.equipeJogador as Equipe_Jogador[])
        .filter(link => link.data_desligamento == null && !link.jogador.isDeleted)
        .map(link => link.jogador.id)
  
      // 4) Busca Gols (não conta contra) e Assistências
      const gols = await golRepository.find({
        where: { partida: { torneio: { id } }, isDeleted: false },
        relations: ['jogador', 'assistente'],
      })
  
      const golsMap   = new Map<string, number>()
      const assistMap = new Map<string, number>()
      gols.forEach(g => {
        // conta gols
        if (!g.golContra && allJogIds.includes(g.jogador.id)) {
          golsMap.set(g.jogador.id, (golsMap.get(g.jogador.id) ?? 0) + 1)
        }
        // conta assistências
        if (g.assistente?.id && allJogIds.includes(g.assistente.id)) {
          assistMap.set(
            g.assistente.id,
            (assistMap.get(g.assistente.id) ?? 0) + 1
          )
        }
      })
  
      // 5) Busca Cartões
      const cartoes = await cartaoRepository.find({
        where: { partida: { torneio: { id } }, isDeleted: false },
        relations: ['jogador'],
      })
  
      const cartoesMap = new Map<string, { amarelo: number; vermelho: number }>()
      cartoes.forEach(c => {
        const jid = c.jogador.id
        if (!allJogIds.includes(jid)) return
        const prev = cartoesMap.get(jid) ?? { amarelo: 0, vermelho: 0 }
        if (c.tipo === TipoCartao.AMARELO)  prev.amarelo++
        if (c.tipo === TipoCartao.VERMELHO) prev.vermelho++
        cartoesMap.set(jid, prev)
      })
  
      // 6) Busca Partidas (status 1 ou 2) e relações via Equipe_Partida
      const partidas = await partidaRepository.find({
        where: { torneio: { id }, status: In([1, 2]), isDeleted: false },
        relations: [
          'equipePartida',
          'equipePartida.casa',
          'equipePartida.visitante',
        ],
      })
  
      // 7) Monte um mapa equipeId → [jogadorId…]
      const equipeJogMap = new Map<string, string[]>()
      activeEquipes.forEach(eq => {
        const ids = (eq.equipeJogador as Equipe_Jogador[])
          .filter(link => link.data_desligamento == null && !link.jogador.isDeleted)
          .map(link => link.jogador.id)
        equipeJogMap.set(eq.id, ids)
      })
  
      // 8) Conta número de jogos por jogador
      const jogosMap = new Map<string, number>()
      partidas.forEach(p => {
        p.equipePartida.forEach(ep => {
          const casa = equipeJogMap.get(ep.casa.id)     ?? []
          const visit = equipeJogMap.get(ep.visitante.id) ?? []
          casa.concat(visit).forEach(jid => {
            jogosMap.set(jid, (jogosMap.get(jid) ?? 0) + 1)
          })
        })
      })
  
      // 9) Monta estatísticas de cada equipe
      const equipesWithStats = activeEquipes.map(eq => {
        // para cada vínculo ativo, mesmo sem eventos, incluímos o jogador
        const links = (eq.equipeJogador as Equipe_Jogador[])
          .filter(link => link.data_desligamento == null && !link.jogador.isDeleted)
  
        const jogadores = links.map(link => {
          const pid = link.jogador.id
          const cart = cartoesMap.get(pid) ?? { amarelo: 0, vermelho: 0 }
          return {
            ...link.jogador,
            dorsal:            link.dorsal,
            capitao:           link.capitao,
            golsCount:         golsMap.get(pid)   ?? 0,
            assistenciasCount: assistMap.get(pid) ?? 0,
            jogosCount:        jogosMap.get(pid)  ?? 0,
            cartoesAmarelos:   cart.amarelo,
            cartoesVermelhos:  cart.vermelho,
          }
        })
  
        // remove apenas a relação de vínculo
        const { equipeJogador, ...eqRest } = eq
        return { ...eqRest, jogadores }
      })
  
      // 10) Retorno final
      const { equipes, ...torRest } = torneio
      return {
        mensagem: 'Torneio e estatísticas carregados com sucesso!',
        torneio: {
          ...torRest,
          equipe: equipesWithStats,
        },
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 }
      }
      return { erro: 'Erro interno no servidor', status: 500 }
    }
  }



  export const findPlayerFinalizacaoStats = async (
    jogadorId: string,
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      });
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        };
      }
  
      // 2) Busca todas as finalizações desse jogador no torneio (inclui partida com rodada)
      const finalizacoes = await finalizacaoRepository.find({
        where: {
          jogadorAtacante: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ["partida"],
      });
  
      // 3) Agrupa por partida e conta totais, certas (gol OU defesa) e armazena rodada
      const statsPorPartida = new Map<
        string,
        {
          rodada: number | null;
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
  
      finalizacoes.forEach((f) => {
        const pid = f.partida.id;
        // iniciar com rodada da partida
        const entry =
          statsPorPartida.get(pid) ??
          {
            rodada: f.partida.rodada ?? null,
            total: 0,
            certas: 0,
            itens: [],
          };
  
        entry.total++;
        if (f.gol || f.defesa) {
          entry.certas++;
          totalCertas++;
        }
  
        entry.itens.push({
          posicaoCampo: f.posicaoCampo,
          posicaoGol: f.posicaoGol,
          gol: !!f.gol,
          defesa: !!f.defesa,
        });
  
        statsPorPartida.set(pid, entry);
      });
  
      // 4) Prepara array de resultados por partida, incluindo rodada
      const partidas = Array.from(statsPorPartida.entries()).map(
        ([partidaId, { rodada, total, certas, itens }]) => ({
          partidaId,
          rodada,
          finalizacoesCount: total,
          finalizacoesCertasCount: certas,
          finalizacoes: itens,
        })
      );
  
      // 5) Monta retorno
      return {
        mensagem: "Estatísticas de finalizações carregadas com sucesso!",
        jogadorId,
        torneioId,
        totalFinalizacoes: finalizacoes.length,
        totalFinalizacoesCertas: totalCertas,
        partidas,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };


  export const findPlayerDesarmeStats = async (
    jogadorId: string,
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      });
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        };
      }
  
      // 2) Busca todos os desarmes desse jogador no torneio (inclui partida com rodada)
      const desarmes = await desarmeRepository.find({
        where: {
          jogadorDesarme: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ["partida"],
      });
  
      // 3) Agrupa por partida, conta totais, sucessos e armazena rodada
      const statsPorPartida = new Map<
        string,
        {
          rodada: number | null;
          total: number;
          sucessos: number;
          itens: Array<{
            posicaoCampo: { x: number; y: number } | null;
            sucesso: boolean;
          }>;
        }
      >();
      let totalSucessos = 0;
  
      desarmes.forEach(d => {
        const pid = d.partida.id;
        const entry =
          statsPorPartida.get(pid) ??
          {
            rodada: d.partida.rodada ?? null,
            total: 0,
            sucessos: 0,
            itens: [],
          };
  
        entry.total++;
        if (d.sucesso) {
          entry.sucessos++;
          totalSucessos++;
        }
  
        entry.itens.push({
          posicaoCampo: d.posicaoCampo,
          sucesso: !!d.sucesso,
        });
  
        statsPorPartida.set(pid, entry);
      });
  
      // 4) Prepara array de resultados por partida
      const partidas = Array.from(statsPorPartida.entries()).map(
        ([partidaId, { rodada, total, sucessos, itens }]) => ({
          partidaId,
          rodada,
          desarmesCount: total,
          desarmesSucessoCount: sucessos,
          desarmes: itens,
        })
      )?.sort((a, b) => {
        if (a.rodada === null) return 1;
        if (b.rodada === null) return -1;
        return a.rodada - b.rodada;
      });
  
      // 5) Monta retorno
      return {
        mensagem: "Estatísticas de desarmes carregadas com sucesso!",
        jogadorId,
        torneioId,
        totalDesarmes: desarmes.length,
        totalDesarmesSucesso: totalSucessos,
        partidas,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };

  export const findPlayerDriblesStats = async (
    jogadorId: string,
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      });
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        };
      }
  
      // 2) Busca todos os desarmes desse jogador no torneio (inclui partida com rodada)
      const dribles = await dribleRepository.find({
        where: {
          jogadorAtacante: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ["partida"],
      });
  
      // 3) Agrupa por partida, conta totais, sucessos e armazena rodada
      const statsPorPartida = new Map<
        string,
        {
          rodada: number | null;
          total: number;
          sucessos: number;
          itens: Array<{
            posicaoCampo: { x: number; y: number } | null;
            sucesso: boolean;
          }>;
        }
      >();
      let totalSucessos = 0;
  
      dribles.forEach(d => {
        const pid = d.partida.id;
        const entry =
          statsPorPartida.get(pid) ??
          {
            rodada: d.partida.rodada ?? null,
            total: 0,
            sucessos: 0,
            itens: [],
          };
  
        entry.total++;
        if (d.sucesso) {
          entry.sucessos++;
          totalSucessos++;
        }
  
        entry.itens.push({
          posicaoCampo: d.posicaoCampo,
          sucesso: !!d.sucesso,
        });
  
        statsPorPartida.set(pid, entry);
      });
  
      // 4) Prepara array de resultados por partida
      const partidas = Array.from(statsPorPartida.entries()).map(
        ([partidaId, { rodada, total, sucessos, itens }]) => ({
          partidaId,
          rodada,
          driblesCount: total,
          driblesSucessoCount: sucessos,
          dribles: itens,
        })
      )?.sort((a, b) => {
        if (a.rodada === null) return 1;
        if (b.rodada === null) return -1;
        return a.rodada - b.rodada;
      });
  
      // 5) Monta retorno
      return {
        mensagem: "Estatísticas de dribles carregadas com sucesso!",
        jogadorId,
        torneioId,
        totalDrible: dribles.length,
        totalDribleSucesso: totalSucessos,
        partidas,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };

  export const findPlayerFaltasCartoesStats = async (
    jogadorId: string,
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      });
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        };
      }
  
      // 2) Busca todas as faltas e cartões do jogador nesse torneio
      const faltas = await faltaRepository.find({
        where: {
          jogadorAutor: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ["partida"],
      });
  
      const cartoes = await cartaoRepository.find({
        where: {
          jogador: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ["partida"],
      });
  
      // 3) Agrupa estatísticas por partida
      const statsPorPartida = new Map<
        string,
        {
          rodada: number | null;
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
  
      faltas.forEach(falta => {
        const pid = falta.partida.id;
        const entry =
          statsPorPartida.get(pid) ??
          {
            rodada: falta.partida.rodada ?? null,
            faltas: [],
            cartoes: [],
          };
  
        entry.faltas.push({
          posicaoCampo: falta.posicaoCampo,
          periodo: falta.periodo,
          tempo: falta.tempo,
          tipo: falta.tipo,
        });
  
        totalFaltas++;
        statsPorPartida.set(pid, entry);
      });
  
      cartoes.forEach(cartao => {
        const pid = cartao.partida.id;
        const entry =
          statsPorPartida.get(pid) ??
          {
            rodada: cartao.partida.rodada ?? null,
            faltas: [],
            cartoes: [],
          };
  
        entry.cartoes.push({
          tipo: cartao.tipo,
          periodo: cartao.periodo,
          tempo: cartao.tempo,
          descricao: cartao.descricao ?? null,
        });
  
        if (cartao.tipo === 0) {
          totalCartaoAmarelo++;
        } else if (cartao.tipo === 1) {
          totalCartaoVermelho++;
        }
  
        // 🎯 Incrementa o total de faltas também para cada cartão
        totalFaltas++;
  
        statsPorPartida.set(pid, entry);
      });
  
      // 4) Prepara array de resultados por partida
      const partidas = Array.from(statsPorPartida.entries()).map(
        ([partidaId, { rodada, faltas, cartoes }]) => ({
          partidaId,
          rodada,
          faltas,
          cartoes,
          totalFaltasPartida: faltas.length + cartoes.length, // 🎯 falta + cartão conta como falta
          totalCartoesPartida: cartoes.length,
          totalCartaoAmareloPartida: cartoes.filter(c => c.tipo === 0).length,
          totalCartaoVermelhoPartida: cartoes.filter(c => c.tipo === 1).length,
        })
      );
  
      // 5) Monta retorno
      return {
        mensagem: "Estatísticas de faltas e cartões carregadas com sucesso!",
        jogadorId,
        torneioId,
        totalFaltas,
        totalCartaoAmarelo,
        totalCartaoVermelho,
        partidas,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };


  export const findPlayerGolsStats = async (
    jogadorId: string,
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      });
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        };
      }
  
      // 2) Busca todos os gols do jogador nesse torneio
      const gols = await golRepository.find({
        where: {
          jogador: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ["partida"],
      });
  
      // 3) Agrupa estatísticas por partida
      const statsPorPartida = new Map<
        string,
        {
          rodada: number | null;
          gols: Array<{
            tempoGol: string;
            periodo: number;
            posicaoCampo: { x: number; y: number } | null;
            posicaoGol: { x: number; y: number } | null;
            golContra: Boolean;
          }>;
        }
      >();
  
      let totalGols = 0;
  
      gols.forEach(gol => {
        const pid = gol.partida.id;
        const entry =
          statsPorPartida.get(pid) ??
          {
            rodada: gol.partida.rodada ?? null,
            gols: [],
          };
  
        entry.gols.push({
          tempoGol: gol.tempoGol,
          periodo: gol.periodo,
          posicaoCampo: gol.posicaoCampo,
          posicaoGol: gol.posicaoGol,
          golContra: gol.golContra,
        });
  
        // 🎯 Só conta no total se NÃO for gol contra
        if (!gol.golContra) {
          totalGols++;
        }
  
        statsPorPartida.set(pid, entry);
      });
  
      // 4) Prepara array de resultados por partida
      const partidas = Array.from(statsPorPartida.entries()).map(
        ([partidaId, { rodada, gols }]) => {
          const totalGolsValidosPartida = gols.filter(g => !g.golContra).length; // 🎯 Apenas gols normais
  
          return {
            partidaId,
            rodada,
            gols,
            totalGolsPartida: totalGolsValidosPartida,
          };
        }
      );
  
      // 5) Monta retorno
      return {
        mensagem: "Estatísticas de gols carregadas com sucesso!",
        jogadorId,
        torneioId,
        totalGols,
        partidas,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };

  export const findPlayerAssistenciasStats = async (
    jogadorId: string,
    torneioId: string
  ): Promise<any> => {
    try {
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      });
  
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        };
      }
  
      const gols = await golRepository.find({
        where: {
          assistente: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ['partida'],
      });
  
      const statsPorPartida = new Map<
        string,
        {
          rodada: number | null;
          assistencias: any[];
        }
      >();
  
      let total = 0;
  
      gols.forEach(gol => {
        if (gol.golContra) return;
  
        const pid = gol.partida.id;
        const entry = statsPorPartida.get(pid) ?? {
          rodada: gol.partida.rodada ?? null,
          assistencias: [],
        };
  
        entry.assistencias.push({
          tempoGol: gol.tempoGol,
          periodo: gol.periodo,
          posicaoCampo: gol.posicaoCampo,
          posicaoGol: gol.posicaoGol,
        });
  
        total++;
        statsPorPartida.set(pid, entry);
      });
  
      const partidas = Array.from(statsPorPartida.entries()).map(
        ([partidaId, { rodada, assistencias }]) => ({
          partidaId,
          rodada,
          assistencias,
          totalAssistenciasPartida: assistencias.length,
        })
      )?.sort((a, b) => {
        if (a.rodada === null) return 1;
        if (b.rodada === null) return -1;
        return a.rodada - b.rodada;
      });;
  
      return {
        mensagem: "Assistências carregadas com sucesso.",
        jogadorId,
        torneioId,
        totalAssistencias: total,
        partidas,
      };
    } catch (error: any) {
      return {
        erro: error?.message || "Erro interno.",
        status: 500,
      };
    }
  };
  
  
  export const findPlayerParticipacaoGolsStats = async (
    jogadorId: string,
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      });
  
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        };
      }
  
      // 2) Busca os gols marcados pelo jogador
      const golsFeitos = await golRepository.find({
        where: {
          jogador: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ['partida'],
      });
  
      // 3) Busca os gols assistidos pelo jogador
      const assistenciasDadas = await golRepository.find({
        where: {
          assistente: { id: jogadorId },
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
        },
        relations: ['partida'],
      });
  
      // 4) Mapa de participações por partida
      const statsPorPartida = new Map<
        string,
        {
          rodada: number | null;
          gols: number;
          assistencias: number;
        }
      >();
  
      // Processar gols
      golsFeitos.forEach(gol => {
        if (gol.golContra) return; // 🎯 Ignora gols contra
  
        const pid = gol.partida.id;
        const entry = statsPorPartida.get(pid) ?? {
          rodada: gol.partida.rodada ?? null,
          gols: 0,
          assistencias: 0,
        };
  
        entry.gols += 1;
        statsPorPartida.set(pid, entry);
      });
  
      // Processar assistências
      assistenciasDadas.forEach(gol => {
        if (gol.golContra) return; // 🎯 Não considera assistência para gol contra
  
        const pid = gol.partida.id;
        const entry = statsPorPartida.get(pid) ?? {
          rodada: gol.partida.rodada ?? null,
          gols: 0,
          assistencias: 0,
        };
  
        entry.assistencias += 1;
        statsPorPartida.set(pid, entry);
      });
  
      // 5) Prepara array de resultados por partida
      const partidas = Array.from(statsPorPartida.entries()).map(
        ([partidaId, { rodada, gols, assistencias }]) => ({
          partidaId,
          rodada,
          gols,
          assistencias,
          totalParticipacaoPartida: gols + assistencias,
        })
      )?.sort((a, b) => {
        if (a.rodada === null) return 1;
        if (b.rodada === null) return -1;
        return a.rodada - b.rodada;
      });
  
      // 6) Soma total geral
      const totalParticipacao = partidas.reduce((sum, p) => sum + p.totalParticipacaoPartida, 0);
  
      return {
        mensagem: "Estatísticas de participação em gols carregadas com sucesso!",
        jogadorId,
        torneioId,
        totalParticipacao,
        partidas,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };


  
  /** Item de classificação para cada equipe */
  export interface ClassificacaoEquipe {
    posicao: number
    equipeId: string
    equipeNome: string
    jogos: number
    pontos: number
    vitorias: number
    empates: number
    derrotas: number
    golsFeitos: number
    golsSofridos: number
    saldoGols: number
  }
  
  /** Resposta do service */
  export interface ClassificacaoResponse {
    mensagem: string
    torneioId: string
    classificacao: ClassificacaoEquipe[]
    erro?: any
  }


  
  export const findTournamentStandings = async (
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      })
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        }
      }
  
      // 2) Busca todas as partidas válidas (status 1 ou 2), inclui equipes e gols
      const partidas = await partidaRepository.find({
        where: {
          torneio: { id: torneioId },
          status: In([StatusPartida.EM_ANDAMENTO, StatusPartida.ENCERRADO]),
          isDeleted: false,
        },
        relations: [
          'equipePartida',
          'equipePartida.casa',
          'equipePartida.visitante',
          'gol',
          'gol.equipe',
        ],
      })
  
      // 3) Mapa temporário de estatísticas por equipe
      const mapa = new Map<string, Omit<ClassificacaoEquipe, 'posicao' | 'saldoGols'>>()
  
      partidas.forEach(partida => {
        // em nossa modelagem, cada partida tem exatamente um registro equipePartida
        const ep = partida.equipePartida[0]
        const casa = ep.casa
        const visitante = ep.visitante
  
        // conta gols (isDeleted = false) feitos por cada equipe nesta partida
        const golsCasa = partida.gol
          .filter(g => !g.isDeleted && g.equipe.id === casa.id).length
        const golsVisitante = partida.gol
          .filter(g => !g.isDeleted && g.equipe.id === visitante.id).length
  
        // atualiza estatísticas para cada lado
        ;[
          { team: casa, gf: golsCasa, ga: golsVisitante },
          { team: visitante, gf: golsVisitante, ga: golsCasa },
        ].forEach(({ team, gf, ga }) => {
          const id = team.id
          const nome = team.name
          let e = mapa.get(id)
          if (!e) {
            e = {
              equipeId: id,
              equipeNome: nome,
              jogos: 0,
              pontos: 0,
              vitorias: 0,
              empates: 0,
              derrotas: 0,
              golsFeitos: 0,
              golsSofridos: 0,
            }
          }
          e.jogos++
          e.golsFeitos += gf
          e.golsSofridos += ga
          if (gf > ga) {
            e.vitorias++
            e.pontos += 3
          } else if (gf === ga) {
            e.empates++
            e.pontos += 1
          } else {
            e.derrotas++
          }
          mapa.set(id, e)
        })
      })
  
      // 4) Converte para array, adiciona saldo e ordena
      const classificacao = Array.from(mapa.values())
        .map(e => ({
          ...e,
          saldoGols: e.golsFeitos - e.golsSofridos,
        }))
        .sort((a, b) =>
          b.pontos - a.pontos ||
          b.saldoGols - a.saldoGols ||
          b.golsFeitos - a.golsFeitos
        )
        .map((e, idx) => ({ posicao: idx + 1, ...e }))
  
      // 5) Retorna no formato esperado
      return {
        mensagem: 'Classificação carregada com sucesso!',
        torneioId,
        classificacao,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 }
      }
      return { erro: 'Erro interno no servidor', status: 500 }
    }
  }
  

  export interface Artilheiro {
    posicao: number        // 1, 2, 3, ...
    jogadorId: string
    jogadorNome: string
    equipeId: string
    equipeNome: string
    gols: number
  }
  
  /** Resposta do service de artilharia */
  export interface ArtilhariaResponse {
    mensagem: string
    torneioId: string
    artilheiros: Artilheiro[]
  }
  
  export const findTournamentTopScorers = async (
    torneioId: string
  ): Promise<any> => {
    try {
      // 1) Verifica existência do torneio
      const torneio = await torneioRepository.findOne({
        where: { id: torneioId, isDeleted: false },
      })
      if (!torneio) {
        return {
          erro: `Torneio com id "${torneioId}" não encontrado`,
          status: 404,
        }
      }
  
      // 2) Busca todos os gols válidos (não contra-gol) daquele torneio
      const gols = await golRepository.find({
        where: {
          partida: { torneio: { id: torneioId } },
          isDeleted: false,
          golContra: false,
        },
        relations: ['jogador', 'equipe'],
      })
  
      // 3) Agrupa por jogador
      const mapArtilheiro = new Map<
        string,
        { jogadorNome: string; equipeId: string; equipeNome: string; gols: number }
      >()
  
      gols.forEach(g => {
        const jid = g.jogador.id
        const entry =
          mapArtilheiro.get(jid) ?? {
            jogadorNome: g.jogador.name,
            equipeId: g.equipe.id,
            equipeNome: g.equipe.name,
            gols: 0,
          }
        entry.gols++
        mapArtilheiro.set(jid, entry)
      })
  
      // 4) Converte para array, ordena e atribui posição
      const artilheiros = Array.from(mapArtilheiro.entries())
        .map(([jogadorId, { jogadorNome, equipeId, equipeNome, gols }]) => ({
          jogadorId,
          jogadorNome,
          equipeId,
          equipeNome,
          gols,
        }))
        .sort((a, b) => b.gols - a.gols)
        .map((item, index) => ({
          posicao: index + 1,
          ...item,
        }))
  
      return {
        mensagem: 'Lista de artilheiros carregada com sucesso!',
        torneioId,
        artilheiros,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { erro: error.message, status: 500 }
      }
      return { erro: 'Erro interno no servidor', status: 500 }
    }
  }
  


/** Item de assistente com ranking */
export interface Assistencia {
  posicao: number        // 1, 2, 3, ...
  jogadorId: string
  jogadorNome: string
  equipeId: string
  equipeNome: string
  assistencias: number
}

/** Resposta do service de assistências */
export interface AssistenciaResponse {
  mensagem: string
  torneioId: string
  assistentes: Assistencia[]
}

export const findTournamentTopAssistants = async (
  torneioId: string
): Promise<any> => {
  try {
    // 1) Verifica existência do torneio
    const torneio = await torneioRepository.findOne({
      where: { id: torneioId, isDeleted: false },
    })
    if (!torneio) {
      return {
        erro: `Torneio com id "${torneioId}" não encontrado`,
        status: 404,
      }
    }

    // 2) Busca todos os gols válidos (não contra-gol), incluindo assistentes
    const gols = await golRepository.find({
      where: {
        partida: { torneio: { id: torneioId } },
        isDeleted: false,
        golContra: false,
      },
      relations: ['assistente', 'equipe'],
    })

    // 3) Agrupa por assistente
    const mapAssist = new Map<
      string,
      { jogadorNome: string; equipeId: string; equipeNome: string; assistencias: number }
    >()

    gols.forEach(g => {
      // ignora gols sem assistente
      if (!g.assistente) return

      const aid = g.assistente.id
      const entry =
        mapAssist.get(aid) ?? {
          jogadorNome: g.assistente.name,
          equipeId: g.equipe.id,
          equipeNome: g.equipe.name,
          assistencias: 0,
        }
      entry.assistencias++
      mapAssist.set(aid, entry)
    })

    // 4) Converte para array, ordena e atribui posição
    const assistentes = Array.from(mapAssist.entries())
      .map(([jogadorId, { jogadorNome, equipeId, equipeNome, assistencias }]) => ({
        jogadorId,
        jogadorNome,
        equipeId,
        equipeNome,
        assistencias,
      }))
      .sort((a, b) => b.assistencias - a.assistencias)
      .map((item, index) => ({
        posicao: index + 1,
        ...item,
      }))

    return {
      mensagem: 'Lista de assistentes carregada com sucesso!',
      torneioId,
      assistentes,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { erro: error.message, status: 500 }
    }
    return { erro: 'Erro interno no servidor', status: 500 }
  }
}
