import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { Equipe } from '../EquipeContext/EquipeContext'
import { Arbitro } from '../ArbitroContext/ArbitroContext'

export interface Posicao {
  x: number
  y: number
}

export interface Falta {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  periodo: number
  posicaoCampo?: Posicao | null
  jogadorAutorId?: string
  jogadorSofreuId?: string
  equipeAutorId?: string
  equipeSofreuId?: string
  partidaId?: string,
  idArbitro?: string;
  tipo: number
}

export interface FaltaList {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  periodo: number
  posicaoCampo?: Posicao | null
  jogadorAutor?: Jogador
  jogadorSofreu?: Jogador
  equipeAutor?: Equipe
  equipeSofreu?: Equipe
  arbitro?: Arbitro,
  tipo?: number
}

interface RespostaAPI<T = void> {
  sucesso: boolean
  data?: T
  erro?: any
}

interface FaltaContextType {
  faltas: FaltaList[]
  listarFaltas: (id: string) => Promise<RespostaAPI<FaltaList[]>>
  criarFalta: (
    idFalta: string,
    falta: Omit<Falta, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Falta>>
  editarFalta: (
    idFalta: string,
    falta: Omit<Falta, 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Falta>>
  removerFalta: (id: string) => Promise<RespostaAPI>
}

export const FaltaContext = createContext<FaltaContextType | undefined>(undefined)

export const useFalta = () => {
  const context = useContext(FaltaContext)
  if (!context) {
    throw new Error('useFalta deve ser usado dentro de um FaltaProvider')
  }
  return context
}
