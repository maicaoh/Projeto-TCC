import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { gerenciarEquipeType } from './EquipeProvider'

interface EquipeJogador {
  id: string,
  jogadorId: string,
  data_contratacao: Date,
  data_desligamento: Date,
  jogador: Jogador,
  dorsal: number,
  equipeId: string
  capitao: boolean
}

export interface Equipe {
  id?: string;
  createAt?: Date;
  updateAt?: Date;
  isDeleted: boolean
  name: string
  responsavel: string,
  telefone?: string
  endereco?: string
  logo: string;
  equipeJogador: EquipeJogador [] | null
}

// Definição do tipo de resposta das funções assíncronas
interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

// Interface do contexto
interface EquipeContextType {
  equipes: Equipe[];
  adicionarEquipe: (equipe: Equipe, idsJogadores: string[]) => Promise<RespostaAPI>;
  removerEquipe: (id: string) => Promise<RespostaAPI>;
  atualizarEquipe: (id: string, equipe: Equipe) => Promise<RespostaAPI>;
  buscarEquipePorId: (id: string) => Promise<RespostaAPI<Equipe>>;
  tranferirJogadores: (idEquipe: string, idsJogador: string[]) => Promise<RespostaAPI>;
  gerenciarEquipe: (data:gerenciarEquipeType) => Promise<RespostaAPI>;

}

// Criando contexto inicial
export const EquipeContext = createContext<EquipeContextType | undefined>(undefined)

// Hook para consumir o contexto
export const useEquipe = () => {
  const context = useContext(EquipeContext)
  if (!context) {
    throw new Error('useEquipe deve ser usado dentro de um TreinadorProvider')
  }
  return context
}
