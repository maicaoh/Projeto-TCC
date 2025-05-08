import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { Equipe } from '../EquipeContext/EquipeContext'

export interface Posicao {
  x: number
  y: number
}

export interface Desarme {
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

export interface DesarmeList {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  periodo: number
  posicaoCampo?: Posicao | null
  pe: string
  jogadorDesarme?: Jogador
  jogadorDesarmado?: Jogador
  equipe?: Equipe
  equipeDefensor?: Equipe
  sucesso: boolean
}

interface RespostaAPI<T = void> {
  sucesso: boolean
  data?: T
  erro?: any
}

interface DesarmeContextType {
  desarmes: DesarmeList[]
  listarDesarmes: (id: string) => Promise<RespostaAPI<DesarmeList[]>>
  criarDesarme: (
    idDesarme: string,
    desarme: Omit<Desarme, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Desarme>>
  editarDesarme: (
    idDesarme: string,
    desamre: Omit<Desarme, 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Desarme>>
  removerDesarme: (id: string) => Promise<RespostaAPI>
}

export const DesarmeContext = createContext<DesarmeContextType | undefined>(undefined)

export const useDesarme = () => {
  const context = useContext(DesarmeContext)
  if (!context) {
    throw new Error('useDesarme deve ser usado dentro de um DesarmeProvider')
  }
  return context
}
