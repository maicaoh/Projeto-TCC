import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { Equipe } from '../EquipeContext/EquipeContext'

export interface Posicao {
  x: number
  y: number
}

export interface Drible {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  periodo: number
  posicaoCampo?: Posicao | null
  pe: 'D' | 'E'
  jogadorId?: string
  jogadorDefensorId?: string
  equipeId?: string
  equipeDefensorId?: string
  partidaId?: string,
  sucesso: boolean
}

export interface DribleList {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  periodo: number
  posicaoCampo?: Posicao | null
  pe: string
  jogadorAtacante?: Jogador
  jogadorDefensor?: Jogador
  equipe?: Equipe
  equipeDefensor?: Equipe
  sucesso: boolean
}

interface RespostaAPI<T = void> {
  sucesso: boolean
  data?: T
  erro?: any
}

interface DribleContextType {
  dribles: DribleList[]
  listarDribles: (id: string) => Promise<RespostaAPI<DribleList[]>>
  criarDrible: (
    idDrible: string,
    drible: Omit<Drible, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Drible>>
  editarDrible: (
    idDrible: string,
    drible: Omit<Drible, 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Drible>>
  removerDrible: (id: string) => Promise<RespostaAPI>
}

export const DribleContext = createContext<DribleContextType | undefined>(undefined)

export const useDrible = () => {
  const context = useContext(DribleContext)
  if (!context) {
    throw new Error('useDrible deve ser usado dentro de um DribleProvider')
  }
  return context
}
