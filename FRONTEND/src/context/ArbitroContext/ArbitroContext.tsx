import { createContext, useContext } from 'react'

export interface Arbitro {
  id?: string,
  name: string,
  apelido?: string,
  cpf?: string,
  dataNascimento: Date,
  foto?: string,
  email?: string,
  telefone?: string
}

// Definição do tipo de resposta das funções assíncronas
interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

// Interface do contexto
interface ArbitroContextType {
  arbitros: Arbitro[];
  adicionarArbitro: (arbitro: Arbitro) => Promise<RespostaAPI>;
  removerArbitro: (id: string) => Promise<RespostaAPI>;
  atualizarArbitro: (id: string, arbitro: Arbitro) => Promise<RespostaAPI>;
  buscarArbitroPorId: (id: string) => Promise<RespostaAPI<Arbitro>>;
}

// Criando contexto inicial
export const ArbitroContext = createContext<ArbitroContextType | undefined>(undefined)

// Hook para consumir o contexto
export const useArbitro = () => {
  const context = useContext(ArbitroContext)
  if (!context) {
    throw new Error('useArbitro deve ser usado dentro de um ArbitroProvider')
  }
  return context
}
