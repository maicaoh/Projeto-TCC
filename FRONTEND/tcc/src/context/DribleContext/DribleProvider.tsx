import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Drible, DribleContext, DribleList } from './DribleContext'

interface DribleProviderProps {
  children: React.ReactNode
}

export const DribleProvider: React.FC<DribleProviderProps> = ({ children }) => {
  const [dribles, setDribles] = useState<DribleList[]>([])

  const listarDribles = async (
    id: string,
  ): Promise<{ sucesso: boolean; data?: DribleList[]; erro?: any }> => {
    try {
      const response = await api.get(`/drible/partida/${id}`)
      const data = response?.data?.drible || []

      // Adapta os dados recebidos para o formato que o front espera
      const driblesAdaptados: FinalizacaoList[] = data.map((item: any) => ({
        ...item,
      }))

      setDribles(driblesAdaptados)
      return { sucesso: true, data: driblesAdaptados }
    } catch (error: any) {
      console.error('Erro ao listar dribles:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const criarDrible = async (
    idPartida: string,
    drible: Omit<Drible, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Drible; erro?: any }> => {
    try {
      const response = await api.post(`/drible/${idPartida}`, drible)
      return { sucesso: true, data: response.data?.drible }
    } catch (error: any) {
      console.error('Erro ao criar drible:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const editarDrible = async (
    id: string,
    drible: Omit<Drible, 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Drible; erro?: any }> => {
    try {
      const response = await api.put(`/drible/${id}`, drible)
      return { sucesso: true, data: response.data?.drible }
    } catch (error: any) {
      console.error('Erro ao editar drible:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerDrible = async (id: string): Promise<{ sucesso: boolean; data?: Drible; erro?: any }> => {
    try {
      const response = await api.delete(`/drible/${id}`)
      return { sucesso: true, data: response.data?.deible }
    } catch (error: any) {
      console.error('Erro ao remover drible:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <DribleContext.Provider
      value={{
        dribles,
        listarDribles,
        criarDrible,
        editarDrible,
        removerDrible,
      }}
    >
      {children}
    </DribleContext.Provider>
  )
}
