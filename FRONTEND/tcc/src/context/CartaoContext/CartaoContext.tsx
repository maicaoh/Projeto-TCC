import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { Equipe } from '../EquipeContext/EquipeContext'
import { Arbitro } from '../ArbitroContext/ArbitroContext'

export interface Posicao {
  x: number
  y: number
}

export interface Cartao {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  periodo: number
  jogadorId?: string
  descricao?: string
  equipeJogadorId?: string
  partidaId?: string,
  idArbitro?: string;
  tipo: number
}

export interface CartaoList {
  id?: string
  createAt?: Date
  updateAt?: Date
  isDeleted: boolean
  tempo: string
  descricao?: string
  periodo: number
  jogador?: Jogador
  equipe?: Equipe
  arbitro?: Arbitro,
  tipo?: number
}

interface RespostaAPI<T = void> {
  sucesso: boolean
  data?: T
  erro?: any
}

interface CartaoContextType {
  cartoes: CartaoList[]
  listarCartoes: (id: string) => Promise<RespostaAPI<CartaoList[]>>
  criarCartao: (
    idCartao: string,
    cartao: Omit<Cartao, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Cartao>>
  editarCartao: (
    idCartao: string,
    cartao: Omit<Cartao, 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Cartao>>
  removerCartao: (id: string) => Promise<RespostaAPI>
}

export const CartaoContext = createContext<CartaoContextType | undefined>(undefined)

export const useCartao = () => {
  const context = useContext(CartaoContext)
  if (!context) {
    throw new Error('useCartao deve ser usado dentro de um CartaoProvider')
  }
  return context
}
