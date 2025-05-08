// src/context/EstatisticaGeralContext/EstatisticaGeralContext.ts

import { createContext, useContext } from 'react'

/** Padrão de resposta para chamadas API */
export interface RespostaAPI<T = void> {
  sucesso: boolean
  data?: T
  erro?: any
}

/** Representa uma posição no campo */
export interface PosicaoPonto {
  x: number
  y: number
}

/** Interface de jogador com estatísticas */
export interface JogadorStats {
  id: string
  name: string
  peDominante: number
  apelido?: string | null
  dataNascimento: string
  posicao: number
  foto?: string | null
  altura: number
  cpf?: string | null
  telefone?: string | null
  cidadeNatal?: string | null
  dorsal?: number | null
  capitao?: boolean | null
  golsCount: number
  assistenciasCount: number
  jogosCount: number
  cartoesAmarelos: number
  cartoesVermelhos: number
}

/** Interface de equipe com estatísticas */
export interface EquipeStats {
  id: string
  name: string
  telefone?: string | null
  endereco?: string | null
  logo: string
  jogadores: JogadorStats[]
}

/** Resposta de estatísticas gerais */
export interface GeralStatsResponse {
  mensagem: string
  equipes: EquipeStats[]
}

/** Interfaces de finalização por torneio */
export interface FinalizacaoTorneioStats {
  torneioId: string
  torneioNome: string
  finalizacoesCount: number
  finalizacoesCertasCount: number
  finalizacoes: Array<{
    posicaoCampo: PosicaoPonto | null
    posicaoGol: PosicaoPonto | null
    gol: boolean
    defesa: boolean
  }>
}

/** Resposta de estatísticas globais de finalizações */
export interface PlayerFinalizacaoGlobalStatsResponse {
  mensagem: string
  jogadorId: string
  totalFinalizacoes: number
  totalFinalizacoesCertas: number
  torneios: FinalizacaoTorneioStats[]
}

/** Interfaces de drible por torneio */
export interface DribleTorneioStats {
  torneioId: string
  nomeTorneio: string
  driblesCount: number
  driblesSucessoCount: number
  dribles: Array<{ posicaoCampo: PosicaoPonto | null; sucesso: boolean }>
}

/** Resposta de estatísticas globais de dribles */
export interface PlayerDribleGlobalStatsResponse {
  mensagem: string
  jogadorId: string
  totalDrible: number
  totalDribleSucesso: number
  torneios: DribleTorneioStats[]
}

/** Interfaces de desarme por torneio */
export interface DesarmeTorneioStats {
  torneioId: string
  nomeTorneio: string
  desarmesCount: number
  desarmesSucessoCount: number
  desarmes: Array<{ posicaoCampo: PosicaoPonto | null; sucesso: boolean }>
}

/** Resposta de estatísticas globais de desarmes */
export interface PlayerDesarmeGlobalStatsResponse {
  mensagem: string
  jogadorId: string
  totalDesarmes: number
  totalDesarmesSucesso: number
  torneios: DesarmeTorneioStats[]
}

/** Interfaces de faltas/cartões por torneio */
export interface FaltaCartaoTorneioStats {
  torneioId: string
  nomeTorneio: string
  totalFaltas: number
  totalCartoes: number
  totalCartaoAmarelo: number
  totalCartaoVermelho: number
  faltas: Array<{
    posicaoCampo: PosicaoPonto | null
    periodo: number
    tempo: string
    tipo: number
  }>
  cartoes: Array<{
    tipo: number
    periodo: number
    tempo: string
    descricao: string | null
  }>
}

/** Resposta de estatísticas globais de faltas/cartões */
export interface PlayerFaltaCartaoGlobalStatsResponse {
  mensagem: string
  jogadorId: string
  totalFaltas: number
  totalCartaoAmarelo: number
  totalCartaoVermelho: number
  totalCartoes: number
  torneios: FaltaCartaoTorneioStats[]
}

/** Interfaces de gols por torneio */
export interface GolTorneioStats {
  torneioId: string
  nomeTorneio: string
  totalGols: number
  gols: Array<{
    tempoGol: string
    periodo: number
    posicaoCampo: PosicaoPonto | null
    posicaoGol: PosicaoPonto | null
    golContra: boolean
  }>
}

/** Resposta de estatísticas globais de gols */
export interface PlayerGolGlobalStatsResponse {
  mensagem: string
  jogadorId: string
  totalGols: number
  torneios: GolTorneioStats[]
}

/** Interfaces de assistências por torneio */
export interface AssistenciaTorneioStats {
  torneioId: string
  nomeTorneio: string
  totalAssistencias: number
  assistencias: Array<{
    tempoGol: string
    periodo: number
    posicaoCampo: PosicaoPonto | null
    posicaoGol: PosicaoPonto | null
  }>
}

/** Resposta de estatísticas globais de assistências */
export interface PlayerAssistenciaGlobalStatsResponse {
  mensagem: string
  jogadorId: string
  totalAssistencias: number
  torneios: AssistenciaTorneioStats[]
}

/** Interfaces de participação em gols por torneio */
export interface ParticipacaoGolsTorneioStats {
  torneioId: string
  nomeTorneio: string
  golsCount: number
  assistenciasCount: number
  totalParticipacao: number
}

/** Resposta de estatísticas globais de participação em gols */
export interface PlayerParticipacaoGolsGlobalStatsResponse {
  mensagem: string
  jogadorId: string
  totalParticipacao: number
  torneios: ParticipacaoGolsTorneioStats[]
}

/** Shape do contexto para estatísticas gerais */
export interface EstatisticaGeralContextType {
  geralStats: GeralStatsResponse | null
  carregarGeralStats: () => Promise<RespostaAPI<GeralStatsResponse>>

  finalizacaoGlobalStats: PlayerFinalizacaoGlobalStatsResponse | null
  carregarFinalizacaoGlobalStats: (
    jogadorId: string
  ) => Promise<RespostaAPI<PlayerFinalizacaoGlobalStatsResponse>>

  dribleGlobalStats: PlayerDribleGlobalStatsResponse | null
  carregarDribleGlobalStats: (
    jogadorId: string
  ) => Promise<RespostaAPI<PlayerDribleGlobalStatsResponse>>

  desarmeGlobalStats: PlayerDesarmeGlobalStatsResponse | null
  carregarDesarmeGlobalStats: (
    jogadorId: string
  ) => Promise<RespostaAPI<PlayerDesarmeGlobalStatsResponse>>

  faltaCartaoGlobalStats: PlayerFaltaCartaoGlobalStatsResponse | null
  carregarFaltaCartaoGlobalStats: (
    jogadorId: string
  ) => Promise<RespostaAPI<PlayerFaltaCartaoGlobalStatsResponse>>

  golGlobalStats: PlayerGolGlobalStatsResponse | null
  carregarGolGlobalStats: (
    jogadorId: string
  ) => Promise<RespostaAPI<PlayerGolGlobalStatsResponse>>

  assistenciaGlobalStats: PlayerAssistenciaGlobalStatsResponse | null
  carregarAssistenciaGlobalStats: (
    jogadorId: string
  ) => Promise<RespostaAPI<PlayerAssistenciaGlobalStatsResponse>>

  participacaoGolsGlobalStats: PlayerParticipacaoGolsGlobalStatsResponse | null
  carregarParticipacaoGolsGlobalStats: (
    jogadorId: string
  ) => Promise<RespostaAPI<PlayerParticipacaoGolsGlobalStatsResponse>>
}

/** Contexto e hook */
export const EstatisticaGeralContext = createContext<
  EstatisticaGeralContextType | undefined
>(undefined)

export const useEstatisticaGeralEstatistica = (): EstatisticaGeralContextType => {
  const context = useContext(EstatisticaGeralContext)
  if (!context) {
    throw new Error(
      'useEstatisticaGeralEstatistica deve ser usado dentro de um EstatisticaGeralProvider',
    )
  }
  return context
}
