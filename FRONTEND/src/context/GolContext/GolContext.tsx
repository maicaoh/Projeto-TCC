import { createContext, useContext } from 'react'
import { Jogador } from '../JogadorContext/JogadorContext'
import { Equipe } from '../EquipeContext/EquipeContext'

export interface Posicao {
  x: number;
  y: number;
}

export interface Gol {
  id?: string;
  createAt?: Date;
  updateAt?: Date;
  isDeleted: boolean;
  tempoGol: string;
  golContra: boolean;
  periodo: number;
  posicaoCampo?: Posicao | null;
  posicaoGol?: Posicao | null;
  assistente?: {
    id: string;
    nome?: string;
  } | null;
  jogadorId?: string;
  jogadorDefensorId?: string;
  equipeId?: string;
  equipeDefensorId?: string;
  partidaId?: string;
}

export interface GolList {
  id?: number,
  tempoGol: string,
  golContra: false,
  periodo: number,
  posicaoCampo: {
    x: number,
    y: number
  },
  posicaoGol: {
    x: number,
    y: number
  },
  assistente: Jogador,
  jogadorDefensor: Jogador,
  jogador: Jogador,
  equipe: Equipe
}

interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

interface GolContextType {
  gols: GolList[];
  removerGol: (id: string) => Promise<RespostaAPI>

  listarGols: (id:string) => Promise<RespostaAPI<GolList[]>>;
  editarGol: (
    idGol: string,
    gol: Omit<Gol, 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Gol>>;

  criarGol: (
    idPartida: string,
    gol: Omit<Gol, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>
  ) => Promise<RespostaAPI<Gol>>;
}

export const GolContext = createContext<GolContextType | undefined>(undefined)

export const useGol = () => {
  const context = useContext(GolContext)
  if (!context) {
    throw new Error('useGol deve ser usado dentro de um GolProvider')
  }
  return context
}
