import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { gerenciarEquipeType } from './PartidaProvider'
import { Quadra } from '../QuadraContext/QuadraContext'
import { Equipe } from '../EquipeContext/EquipeContext'
import { Arbitro } from '../ArbitroContext/ArbitroContext'

export interface Partida {
  id: string
  publicoPresente: number
  data: Date | null ;
  idQuadra: string | null;
  status: number | null;
  arbitros: Arbitro[]
}

export interface PartidaFormatada {
  id?: string,
  data: Date,
  rodada: number,
  publicoPresente: number,
  status: number;
  quadra: Quadra | null,
  arbitros: Arbitro[]

  equipeCasa: {
    id: string,
    name: string,
    logo: string,
    telefone: string,
    endereco: string,
    jogadores: Jogador[]
    golsMarcados: number | null

  } | null,
  equipeVisitante: {
    id: string,
    name: string,
    logo: string,
    telefone: string,
    endereco: string,
    jogadores: Jogador[]
    golsMarcados: number | null

  } | null,

}

// Definição do tipo de resposta das funções assíncronas
interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

// Interface do contexto
interface PartidaContextType {
  atualizarPartida: (id: string, partida: Partida) => Promise<RespostaAPI>;
  buscarPartidaPorId: (id: string) => Promise<RespostaAPI<PartidaFormatada>>;

}

// Criando contexto inicial
export const PartidaContext = createContext<PartidaContextType | undefined>(undefined)

// Hook para consumir o contexto
export const usePartida = () => {
  const context = useContext(PartidaContext)
  if (!context) {
    throw new Error('usePartida deve ser usado dentro de um PartidaProvider')
  }
  return context
}
