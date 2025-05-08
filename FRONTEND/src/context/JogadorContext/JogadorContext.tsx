import { createContext, useContext } from 'react'
import { Equipe } from '../EquipeContext/EquipeContext'

interface EquipeJogador {
  jogadorId: string,
  data_contratacao: Date,
  data_desligamento: Date,
  equipe: Equipe,
  equipeId: string
}

export interface Jogador {
  id?: string,
  createAt?: Date,
  updateAt?: Date,
  name: string
  peDominante: number;// 1 = Direito, 0 = Esquerdo
  apelido?: string,
  dataNascimento: Date,
  posicao: number,
  foto?: string,
  altura: number, // Exemplo: 1.89
  cpf?: string,
  telefone?: string,
  cidadeNatal?: string,
  equipeJogador: EquipeJogador[] | null,
}

// Definição do tipo de resposta das funções assíncronas
interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

// Interface do contexto
interface JogadorContextType {
  jogadores: Jogador[];
  adicionarJogador: (tecnico: Jogador) => Promise<RespostaAPI>;
  removerJogador: (id: string) => Promise<RespostaAPI>;
  atualizarJogador: (id: string, jogador: Jogador) => Promise<RespostaAPI>;
  buscarJogadorPorId: (id: string) => Promise<RespostaAPI<Jogador>>;
  tranferirJogador: (idEquipe: string, idJogador: string) => Promise<RespostaAPI>;
  desligarJogador: (idEquipe: string, idJogador: string) => Promise<RespostaAPI>;
  buscarJogadorDisponiveis: () => Promise<RespostaAPI<Jogador[]>>;

}

// Criando contexto inicial
export const JogadorContext = createContext<JogadorContextType | undefined>(undefined)

// Hook para consumir o contexto
export const useJogador = () => {
  const context = useContext(JogadorContext)
  if (!context) {
    throw new Error('useJogador deve ser usado dentro de um JogadorProvider')
  }
  return context
}
