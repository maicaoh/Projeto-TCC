import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { gerenciarEquipeType } from './CompeticaoProvider'
import { Equipe } from '../EquipeContext/EquipeContext'
import { Arbitro } from '../ArbitroContext/ArbitroContext'

export interface Confronto {
  mandante: Equipe;
  visitante: Equipe;
  data: string; // formato 'dd/MM/yyyy'
  quadra: string;
  rodada?: number;
  arbitros?: Arbitro[]
  id: string
}

// Tipo da competição completa com equipes e confrontos
export interface Competicao {
  id?: string;
  name: string;
  status: string;
  tipo: string;
  edicao: string;
  foto?: string;
  equipes: Equipe[]; // apenas os ids das equipes
  confrontos: Confronto[];
}

// Definição do tipo de resposta das funções assíncronas
interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

// Interface do contexto
interface CompeticaoContextType {
  competicoes: Competicao[];
  adicionarCompeticao: (competicao: Competicao) => Promise<RespostaAPI>;
  removerCompeticao: (id: string) => Promise<RespostaAPI>;
  atualizarCompeticao: (id: string, competicao: Competicao) => Promise<RespostaAPI>;
  buscarCompeticaoPorId: (id: string) => Promise<RespostaAPI<Competicao>>;
  fetchCompeticoes: ()=> Promise<RespostaAPI<Competicao[]>>
}

// Criando contexto inicial
export const CompeticaoContext = createContext<CompeticaoContextType | undefined>(undefined)

// Hook para consumir o contexto
export const useCompeticao = () => {
  const context = useContext(CompeticaoContext)
  if (!context) {
    throw new Error('useCompeticao deve ser usado dentro de um CompeticaoProvider')
  }
  return context
}
