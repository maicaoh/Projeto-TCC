import React, { useEffect, useState } from 'react'
import { Equipe, EquipeContext } from './EquipeContext'
import { api } from '../../services/api'

interface EquipeProviderProps {
  children: React.ReactNode;
}

interface configurarDorsal {
  id: string,
  dorsal: number;
}

export interface gerenciarEquipeType {
  capitaoId: string,
  desligados: string[],
  dorsaisEditadas: configurarDorsal[]
}

export const EquipeProvider: React.FC<EquipeProviderProps> = ({ children }) => {
  const [equipes, setEquipes] = useState<Equipe[]>([])

  // Buscar treinadores na API
  useEffect(() => {
    fetchEquipes()
  }, [])

  const fetchEquipes = async () => {
    try {
      const response = await api.get('/equipe')
      const equipesFiltrados = response?.data?.equipes
        ?.map((equipe:Equipe) => ({
          ...equipe,
          equipeJogador: equipe?.equipeJogador
            ?.filter(eq => eq.data_desligamento === null),
        }))
      setEquipes(equipesFiltrados || [])
      return { sucesso: true }
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const adicionarEquipe = async (equipe: Equipe, idsJogadores:string[] = []) => {
    try {
      // Remover pos migration
      const { responsavel, ...equipeSemResponsavel } = equipe

      await api.post('/equipe', { equipe: equipeSemResponsavel, idsJogadores })
      await fetchEquipes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao adicionar equipe:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerEquipe = async (id: string) => {
    try {
      await api.delete(`/equipe/${id}`)
      await fetchEquipes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao remover equipe:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const atualizarEquipe = async (id: string, equipe: Equipe, idsJogadores:string[] = []) => {
    try {
      // Remover pos migration
      const { responsavel, ...equipeSemResponsavel } = equipe

      await api.put(`/equipe/${id}`, { equipe: equipeSemResponsavel, idsJogadores })
      await fetchEquipes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar equipe:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarEquipePorId = async (id: string): Promise<{ sucesso: boolean, data?: Equipe, erro?: any }> => {
    try {
      const response = await api.get(`/equipe/${id}`)
      console.log(response.data?.equipe)
      return { sucesso: true, data: response.data?.equipe }
    } catch (error: any) {
      console.error(`Erro ao buscar equipe com ID ${id}:`, error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const tranferirJogadores = async (idEquipe: string, idJogador: string[]) => {
    try {
      await api.post(`/equipe/${idEquipe}/jogadores`, { idsJogadores: idJogador })
      await fetchEquipes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao transferir jogador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const gerenciarEquipe = async (data:gerenciarEquipeType) => {
    try {
      // Remover pos migration
      const { capitaoId, desligados, dorsaisEditadas } = data

      await api.post('/equipe/gerenciar',
        { capitaoId, desligados, dorsaisEditadas })
      await fetchEquipes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar equipe:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <EquipeContext.Provider value={{
      equipes,
      adicionarEquipe,
      removerEquipe,
      atualizarEquipe,
      buscarEquipePorId,
      tranferirJogadores,
      gerenciarEquipe,
    }}
    >
      {children}
    </EquipeContext.Provider>
  )
}
