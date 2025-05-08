import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Gol, GolContext, GolList } from './GolContext'

interface GolProviderProps {
  children: React.ReactNode;
}

export const GolProvider: React.FC<GolProviderProps> = ({ children }) => {
  const [gols, setGols] = useState<GolList[]>([])

  const listarGols = async (id:string): Promise<{ sucesso: boolean; data?: Gol[]; erro?: any }> => {
    try {
      const response = await api.get(`/gol/partida/${id}`)
      const golsData = response?.data?.gol || []
      setGols(golsData)
      return { sucesso: true, data: golsData }
    } catch (error: any) {
      console.error('Erro ao listar gols:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const criarGol = async (
    idPartida: string,
    gol: Omit<Gol, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Gol; erro?: any }> => {
    try {
      const response = await api.post(`/gol/${idPartida}`, gol)
      return { sucesso: true, data: response.data?.gol }
    } catch (error: any) {
      console.error('Erro ao criar gol:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const editarGol = async (
    id: string,
    gol: Omit<Gol, 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Gol; erro?: any }> => {
    try {
      const response = await api.put(`/gol/${id}`, gol)
      return { sucesso: true, data: response.data?.gol }
    } catch (error: any) {
      console.error('Erro ao criar gol:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerGol = async (
    id: string,
  ): Promise<{ sucesso: boolean; data?: Gol; erro?: any }> => {
    try {
      const response = await api.delete(`/gol/${id}`)
      return { sucesso: true, data: response.data?.gol }
    } catch (error: any) {
      console.error('Erro ao deletar gol:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <GolContext.Provider value={{ gols, listarGols, criarGol, editarGol, removerGol }}>
      {children}
    </GolContext.Provider>
  )
}
