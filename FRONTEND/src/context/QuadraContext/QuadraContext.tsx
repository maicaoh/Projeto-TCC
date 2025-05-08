import { createContext, useContext } from 'react'

export interface Quadra {
  id?: string;
  name: string;
  comprimento: number;
  largura: number;
  endereco?: string;
  telefone?: string;
  piso?: string;
  responsavel?: string;
}

// Definição do tipo de resposta das funções assíncronas
interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

// Interface do contexto
interface QuadraContextType {
  quadras: Quadra[];
  adicionarQuadra: (quadra: Quadra) => Promise<RespostaAPI>;
  removerQuadra: (id: string) => Promise<RespostaAPI>;
  atualizarQuadra: (id: string, quadra: Quadra) => Promise<RespostaAPI>;
  buscarQuadraPorId: (id: string) => Promise<RespostaAPI<Quadra>>;
}

// Criando contexto inicial
export const QuadraContext = createContext<QuadraContextType | undefined>(undefined)

// Hook para consumir o contexto
export const useQuadra = () => {
  const context = useContext(QuadraContext)
  if (!context) {
    throw new Error('useQuadra deve ser usado dentro de um QuadraProvider')
  }
  return context
}
