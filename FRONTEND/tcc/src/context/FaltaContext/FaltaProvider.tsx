import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Falta, FaltaContext, FaltaList } from './FaltaContext'

interface FaltaProviderProps {
  children: React.ReactNode
}

export const FaltaProvider: React.FC<FaltaProviderProps> = ({ children }) => {
  const [faltas, setFaltas] = useState<FaltaList[]>([])

  const listarFaltas = async (
    id: string,
  ): Promise<{ sucesso: boolean; data?: FaltaList[]; erro?: any }> => {
    try {
      const response = await api.get(`/falta/partida/${id}`)
      const data = response?.data?.falta || []

      // Adapta os dados recebidos para o formato que o front espera
      const faltasAdaptados: FaltaList[] = data.map((item: any) => ({
        ...item,
      }))

      setFaltas(faltasAdaptados)
      return { sucesso: true, data: faltasAdaptados }
    } catch (error: any) {
      console.error('Erro ao listar faltas:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const criarFalta = async (
    idPartida: string,
    falta: Omit<Falta, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Falta; erro?: any }> => {
    try {
      const response = await api.post(`/falta/${idPartida}`, falta)
      return { sucesso: true, data: response.data?.falta }
    } catch (error: any) {
      console.error('Erro ao criar falta:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const editarFalta = async (
    id: string,
    falta: Omit<Falta, 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Falta; erro?: any }> => {
    try {
      const response = await api.put(`/falta/${id}`, falta)
      return { sucesso: true, data: response.data?.falta }
    } catch (error: any) {
      console.error('Erro ao editar falta:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerFalta = async (id: string): Promise<{ sucesso: boolean; data?: Falta; erro?: any }> => {
    try {
      const response = await api.delete(`/falta/${id}`)
      return { sucesso: true, data: response.data?.falta }
    } catch (error: any) {
      console.error('Erro ao remover falta:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <FaltaContext.Provider
      value={{
        faltas,
        listarFaltas,
        criarFalta,
        editarFalta,
        removerFalta,
      }}
    >
      {children}
    </FaltaContext.Provider>
  )
}
