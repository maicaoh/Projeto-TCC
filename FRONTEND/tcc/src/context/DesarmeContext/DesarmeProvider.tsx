import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Desarme, DesarmeContext, DesarmeList } from './DesarmeContext'

interface DesarmeProviderProps {
  children: React.ReactNode
}

export const DesarmeProvider: React.FC<DesarmeProviderProps> = ({ children }) => {
  const [desarmes, setDesarmes] = useState<DesarmeList[]>([])

  const listarDesarmes = async (
    id: string,
  ): Promise<{ sucesso: boolean; data?: DesarmeList[]; erro?: any }> => {
    try {
      const response = await api.get(`/desarme/partida/${id}`)
      const data = response?.data?.desarme || []

      // Adapta os dados recebidos para o formato que o front espera
      const desarmeAdaptados: DesarmeList[] = data.map((item: any) => ({
        ...item,
      }))

      setDesarmes(desarmeAdaptados)
      return { sucesso: true, data: desarmeAdaptados }
    } catch (error: any) {
      console.error('Erro ao listar desarmes:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const criarDesarme = async (
    idPartida: string,
    desarme: Omit<Desarme, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Desarme; erro?: any }> => {
    try {
      const response = await api.post(`/desarme/${idPartida}`, desarme)
      return { sucesso: true, data: response.data?.desarme }
    } catch (error: any) {
      console.error('Erro ao criar desarme:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const editarDesarme = async (
    id: string,
    desarme: Omit<Desarme, 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Desarme; erro?: any }> => {
    try {
      const response = await api.put(`/desarme/${id}`, desarme)
      return { sucesso: true, data: response.data?.desarme }
    } catch (error: any) {
      console.error('Erro ao editar desarme:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerDesarme = async (id: string): Promise<{ sucesso: boolean; data?: Desarme; erro?: any }> => {
    try {
      const response = await api.delete(`/desarme/${id}`)
      return { sucesso: true, data: response.data?.desarme }
    } catch (error: any) {
      console.error('Erro ao remover desarme:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <DesarmeContext.Provider
      value={{
        desarmes,
        listarDesarmes,
        criarDesarme,
        editarDesarme,
        removerDesarme,
      }}
    >
      {children}
    </DesarmeContext.Provider>
  )
}
