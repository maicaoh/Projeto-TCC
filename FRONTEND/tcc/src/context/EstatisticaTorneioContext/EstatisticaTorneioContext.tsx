import { createContext, useContext } from 'react'

/** Padrão de resposta para chamadas API */
export interface RespostaAPI<T = void> {
  sucesso: boolean
  data?: T
  erro?: any
}

export interface ClassificacaoTorneioEntry {
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

export interface ClassificacaoTorneioStatsResponse {
  mensagem: string
  torneioId: string
  classificacao: ClassificacaoTorneioEntry[]
}

export interface ArtilhariaEntry {
  posicao: number
  jogadorId: string
  jogadorNome: string
  gols: number
}

export interface ArtilhariaTorneioStatsResponse {
  mensagem: string
  torneioId: string
  artilharia: ArtilhariaEntry[]
}

export interface AssistenciaEntry {
  posicao: number
  jogadorId: string
  jogadorNome: string
  assistencias: number
}

export interface AssistenciaTorneioStatsResponse {
  mensagem: string
  torneioId: string
  assistencia: AssistenciaEntry[]
}

/** Interfaces de domínio existentes */
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

export interface EquipeStats {
  id: string
  name: string
  telefone?: string | null
  endereco?: string | null
  logo: string
  jogadores: JogadorStats[]
}

export interface TorneioStats {
  id: string
  name: string
  status: string
  tipo: string
  edicao: string
  foto?: string | null
  createAt?: string | null
  updateAt?: string | null
  isDeleted: boolean
  equipe: EquipeStats[]
}

export interface TorneioResponse {
  mensagem: string
  torneio: TorneioStats
}

/** Interfaces para finalizações */
export interface PosicaoPonto {
  x: number
  y: number
}

export interface FinalizacaoDetalhada {
  posicaoCampo: PosicaoPonto | null
  posicaoGol: PosicaoPonto | null
  gol: boolean
  defesa: boolean
}

export interface PartidaFinalizacaoStats {
  partidaId: string
  rodada: number | null
  finalizacoesCount: number
  finalizacoesCertasCount: number
  finalizacoes: FinalizacaoDetalhada[]
}

export interface PlayerFinalizacaoStatsResponse {
  mensagem: string
  jogadorId: string
  torneioId: string
  totalFinalizacoes: number
  totalFinalizacoesCertas: number
  partidas: PartidaFinalizacaoStats[]
}

/** Interfaces para desarmes */
export interface DesarmeDetalhado {
  posicaoCampo: PosicaoPonto | null
  sucesso: boolean
}

export interface PartidaDesarmeStats {
  partidaId: string
  rodada: number | null
  desarmesCount: number
  desarmesSucessoCount: number
  desarmes: DesarmeDetalhado[]
}

export interface PlayerDesarmeStatsResponse {
  mensagem: string
  jogadorId: string
  torneioId: string
  totalDesarmes: number
  totalDesarmesSucesso: number
  partidas: PartidaDesarmeStats[]
}

/** Interfaces para dribles */
export interface DribleDetalhado {
  posicaoCampo: PosicaoPonto | null
  sucesso: boolean
}

export interface PartidaDribleStats {
  partidaId: string
  rodada: number | null
  driblesCount: number
  driblesSucessoCount: number
  dribles: DribleDetalhado[]
}

export interface PlayerDribleStatsResponse {
  mensagem: string
  jogadorId: string
  torneioId: string
  totalDrible: number
  totalDribleSucesso: number
  partidas: PartidaDribleStats[]
}

/** Interfaces para faltas e cartões */
export interface FaltaDetalhada {
  posicaoCampo: PosicaoPonto | null
  periodo: number
  tempo: string
  tipo: number
}

export interface CartaoDetalhado {
  tipo: number
  periodo: number
  tempo: string
  descricao: string | null
}

export interface PartidaFaltaCartaoStats {
  partidaId: string
  rodada: number | null
  faltas: FaltaDetalhada[]
  cartoes: CartaoDetalhado[]
  totalFaltasPartida: number
  totalCartoesPartida: number
  totalCartaoAmareloPartida: number
  totalCartaoVermelhoPartida: number
}

export interface PlayerFaltaCartaoStatsResponse {
  mensagem: string
  jogadorId: string
  torneioId: string
  totalFaltas: number
  totalCartaoAmarelo: number
  totalCartaoVermelho: number
  partidas: PartidaFaltaCartaoStats[]
}

/** Interfaces para gols */
export interface GolDetalhado {
  tempoGol: string
  periodo: number
  posicaoCampo: PosicaoPonto | null
  posicaoGol: PosicaoPonto | null
  golContra: boolean
}

export interface PartidaGolStats {
  partidaId: string
  rodada: number | null
  gols: GolDetalhado[]
  totalGolsPartida: number
}

export interface PlayerGolStatsResponse {
  mensagem: string
  jogadorId: string
  torneioId: string
  totalGols: number
  partidas: PartidaGolStats[]
}

// Assistencia

/** Interfaces para assistências */
export interface AssistenciaDetalhada {
  tempoGol: string
  periodo: number
  posicaoCampo: PosicaoPonto | null
  posicaoGol: PosicaoPonto | null
}

export interface PartidaAssistenciaStats {
  partidaId: string
  rodada: number | null
  assistencias: AssistenciaDetalhada[]
  totalAssistenciasPartida: number
}

export interface PlayerAssistenciaStatsResponse {
  mensagem: string
  jogadorId: string
  torneioId: string
  totalAssistencias: number
  partidas: PartidaAssistenciaStats[]
}

/** Interfaces para participação em gols */
export interface PartidaParticipacaoGolsStats {
  partidaId: string
  rodada: number | null
  gols: number
  assistencias: number
  totalParticipacaoPartida: number
}

export interface PlayerParticipacaoGolsStatsResponse {
  mensagem: string
  jogadorId: string
  torneioId: string
  totalParticipacao: number
  partidas: PartidaParticipacaoGolsStats[]
}

/** Shape do contexto */
export interface TorneioContextType {
  torneioResponse: TorneioStats | null
  carregarTorneio: (id: string) => Promise<RespostaAPI<TorneioResponse>>

  finalizacaoStats: PlayerFinalizacaoStatsResponse | null
  carregarFinalizacaoStats: (
    jogadorId: string,
    torneioId: string
  ) => Promise<RespostaAPI<PlayerFinalizacaoStatsResponse>>

  desarmeStats: PlayerDesarmeStatsResponse | null
  carregarDesarmeStats: (
    jogadorId: string,
    torneioId: string
  ) => Promise<RespostaAPI<PlayerDesarmeStatsResponse>>

  dribleStats: PlayerDribleStatsResponse | null
  carregarDribleStats: (
    jogadorId: string,
    torneioId: string
  ) => Promise<RespostaAPI<PlayerDribleStatsResponse>>

  faltaCartaoStats: PlayerFaltaCartaoStatsResponse | null
  carregarFaltaCartaoStats: (
    jogadorId: string,
    torneioId: string
  ) => Promise<RespostaAPI<PlayerFaltaCartaoStatsResponse>>

  golStats: PlayerGolStatsResponse | null
  carregarGolStats: (
    jogadorId: string,
    torneioId: string
  ) => Promise<RespostaAPI<PlayerGolStatsResponse>>

  assistenciaStats: PlayerAssistenciaStatsResponse | null
  carregarAssistenciaStats: (
    jogadorId: string,
    torneioId: string
  ) => Promise<RespostaAPI<PlayerAssistenciaStatsResponse>>

  participacaoGolsStats: PlayerParticipacaoGolsStatsResponse | null
  carregarParticipacaoGolsStats: (
    jogadorId: string,
    torneioId: string
  ) => Promise<RespostaAPI<PlayerParticipacaoGolsStatsResponse>>
  classificacaoStats: ClassificacaoTorneioStatsResponse | null
  carregarClassificacaoStats: (
    torneioId: string
  ) => Promise<RespostaAPI<ClassificacaoTorneioStatsResponse>>

  artilhariaStats: ArtilhariaTorneioStatsResponse | null
  carregarArtilhariaStats: (
    torneioId: string
  ) => Promise<RespostaAPI<ArtilhariaTorneioStatsResponse>>

  assistenciaTorneioStats: AssistenciaTorneioStatsResponse | null
  carregarAssistenciaTorneioStats: (
    torneioId: string
  ) => Promise<RespostaAPI<AssistenciaTorneioStatsResponse>>

}

/** O próprio contexto */
export const TorneioContext = createContext<TorneioContextType | undefined>(
  undefined,
)

/** Hook para usar o contexto */
export const useTorneioEstatistica = (): TorneioContextType => {
  const context = useContext(TorneioContext)
  if (!context) {
    throw new Error(
      'useTorneioEstatistica deve ser usado dentro de um TorneioProvider',
    )
  }
  return context
}
