import React, { useEffect, useState } from 'react'
import { Partida, PartidaContext } from './PartidaContext'
import { useCompeticao } from '../CompeticaoContext/CompeticaoContext'
import { api } from '../../services/api'
import { Equipe } from '../EquipeContext/EquipeContext'
import { Quadra } from '../QuadraContext/QuadraContext'
import { PartidaFormatada } from './PartidaContext'

interface PartidaProviderProps {
  children: React.ReactNode;
}

export const PartidaProvider: React.FC<PartidaProviderProps> = ({ children }) => {
  const { fetchCompeticoes } = useCompeticao()

  const atualizarPartida = async (id: string, partida: Partial<Partida>) => {
    try {
      await api.put(`/partida/${id}`, partida)
      await fetchCompeticoes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar competicao:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarPartidaPorId = async (id: string): Promise<{ sucesso: boolean, data?: PartidaFormatada, erro?: any }> => {
    try {
      const response = await api.get(`/paridaformatado/${id}`)
      return { sucesso: true, data: response.data?.partida }
    } catch (error: any) {
      console.error(`Erro ao buscar torneio com ID ${id}:`, error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <PartidaContext.Provider value={{
      atualizarPartida,
      buscarPartidaPorId,
    }}
    >
      {children}
    </PartidaContext.Provider>
  )
}
