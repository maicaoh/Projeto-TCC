import React, { useEffect, useState } from 'react'
import { Tecnico, TreinadorContext } from './TreinadorContext'
import { api } from '../../services/api'

interface TreinadorProviderProps {
  children: React.ReactNode;
}

export const TreinadorProvider: React.FC<TreinadorProviderProps> = ({ children }) => {
  const [treinadores, setTreinadores] = useState<Tecnico[]>([])

  useEffect(() => {
    fetchTreinadores()
  }, [])

  const fetchTreinadores = async () => {
    try {
      const response = await api.get('/treinador')
      const treinadoresFiltrados = response?.data?.coaches
        ?.map((coach:Tecnico) => ({
          ...coach,
          equipeTecnico: coach?.equipeTecnico
            ?.filter(eq => eq.data_desligamento === null),
        }))

      setTreinadores(treinadoresFiltrados || [])
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao buscar treinadores:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const adicionarTreinador = async (tecnico: Tecnico) => {
    try {
      await api.post('/treinador', tecnico)
      await fetchTreinadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao adicionar treinador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerTreinador = async (id: string) => {
    try {
      await api.delete(`/treinador/${id}`)
      await fetchTreinadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao remover treinador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const atualizarTreinador = async (id:string, tecnico: Tecnico) => {
    try {
      await api.put(`/treinador/${id}`, tecnico)
      await fetchTreinadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar treinador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarTreinadorPorId = async (id: string): Promise<{ sucesso: boolean, data?: Tecnico, erro?: any }> => {
    try {
      const response = await api.get(`/treinador/${id}`)
      return { sucesso: true, data: response.data.coach }
    } catch (error: any) {
      console.error(`Erro ao buscar treinador com ID ${id}:`, error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const tranferirTreinador = async (idEquipe: string, idTreinador: string) => {
    try {
      await api.post(`/equipe/${idEquipe}/treinadores`, { idsTreinadores: [idTreinador] })
      await fetchTreinadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao transferir treinador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const desligarTreinador = async (idEquipe: string, idTreinador: string) => {
    try {
      await api.put(`/equipe/${idEquipe}/treinadores`, { idsTreinadores: [idTreinador] })
      await fetchTreinadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao desligar treinador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <TreinadorContext.Provider value={{
      treinadores,
      adicionarTreinador,
      removerTreinador,
      atualizarTreinador,
      buscarTreinadorPorId,
      tranferirTreinador,
      desligarTreinador,
    }}
    >
      {children}
    </TreinadorContext.Provider>
  )
}
