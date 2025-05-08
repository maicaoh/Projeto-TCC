import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { Equipe } from '../EquipeContext/EquipeContext'

export interface Posicao {
  x: number
  y: number
}

export interface Finalizacao {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  periodo: number
  posicaoCampo?: Posicao | null
  posicaoGol?: Posicao | null
  pe: 'D' | 'E'
  jogadorId?: string
  jogadorDefensorId?: string
  equipeId?: string
  equipeDefensorId?: string
  partidaId?: string

  // Nova relação com Gol, mantida internamente
  gol?: {
    id: string
    golContra?: boolean
    periodo?: number
    assistente?: Jogador | null
  } | null
}

export interface FinalizacaoList {
  id?: number
  tempo: string
  periodo: number
  posicaoCampo: Posicao
  posicaoGol: Posicao
  jogadorDefensor: Jogador
  jogadorAtacante: Jogador
  equipe: Equipe
  pe: string
  bloqueio: boolean
  defesa: boolean
  falta: boolean
  seteMetros: boolean
  penalti: boolean

  // Expõe apenas boolean para facilitar uso no front
  gol: boolean
}

interface RespostaAPI<T = void> {
  sucesso: boolean
  data?: T
  erro?: any
}

interface FinalizacaoContextType {
  finalizacoes: FinalizacaoList[]
  listarFinalizacoes: (id: string) => Promise<RespostaAPI<FinalizacaoList[]>>
  criarFinalizacao: (
    idPartida: string,
    finalizacao: Omit<Finalizacao, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Finalizacao>>
  editarFinalizacao: (
    idFinalizacao: string,
    finalizacao: Omit<Finalizacao, 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Finalizacao>>
  removerFinalizacao: (id: string) => Promise<RespostaAPI>
}

export const FinalizacaoContext = createContext<FinalizacaoContextType | undefined>(undefined)

export const useFinalizacao = () => {
  const context = useContext(FinalizacaoContext)
  if (!context) {
    throw new Error('useFinalizacao deve ser usado dentro de um FinalizacaoProvider')
  }
  return context
}
