import { createContext, useContext } from 'react'
import { Equipe } from '../EquipeContext/EquipeContext'

interface EquipeTecnico {
  coachId: string,
  data_contratacao: Date,
  data_desligamento: Date,
  equipe: Equipe,
  equipeId: string
}

export interface Tecnico {
  id?: string
  createAt?: Date;
  updateAt?: Date;
  isDeleted?: boolean
  name: string
  apelido?: string
  cpf?: string
  dataNascimento: Date;
  foto?: string | null;
  email?: string
  telefone?: string
  equipeTecnico?: EquipeTecnico[] | null
}

// Definição do tipo de resposta das funções assíncronas
interface RespostaAPI<T = void> {
  sucesso: boolean;
  data?: T;
  erro?: any;
}

// Interface do contexto
interface TreinadorContextType {
  treinadores: Tecnico[];
  adicionarTreinador: (tecnico: Tecnico) => Promise<RespostaAPI>;
  removerTreinador: (id: string) => Promise<RespostaAPI>;
  atualizarTreinador: (id: string, tecnico: Tecnico) => Promise<RespostaAPI>;
  buscarTreinadorPorId: (id: string) => Promise<RespostaAPI<Tecnico>>;
  tranferirTreinador: (idEquipe: string, idTreinador: string) => Promise<RespostaAPI>;
  desligarTreinador: (idEquipe: string, idTreinador: string) => Promise<RespostaAPI>;
}

// Criando contexto inicial
export const TreinadorContext = createContext<TreinadorContextType | undefined>(undefined)

// Hook para consumir o contexto
export const useTreinador = () => {
  const context = useContext(TreinadorContext)
  if (!context) {
    throw new Error('useTreinador deve ser usado dentro de um TreinadorProvider')
  }
  return context
}
