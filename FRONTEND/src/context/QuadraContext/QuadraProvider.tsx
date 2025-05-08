import React, { useEffect, useState } from 'react'
import { Quadra, QuadraContext } from './QuadraContext'
import { api } from '../../services/api'

interface QuadraProviderProps {
  children: React.ReactNode;
}

export const QuadraProvider: React.FC<QuadraProviderProps> = ({ children }) => {
  const [quadras, setQuadras] = useState<Quadra[]>([])

  useEffect(() => {
    fetchQuadras()
  }, [])

  const fetchQuadras = async () => {
    try {
      const response = await api.get('/quadra')
      const quadras = response?.data?.quadra

      setQuadras(quadras || [])
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao buscar quadras:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const adicionarQuadra = async (quadra: Quadra) => {
    try {
      await api.post('/quadra', quadra)
      await fetchQuadras()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao adicionar quadra:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerQuadra = async (id: string) => {
    try {
      await api.delete(`/quadra/${id}`)
      await fetchQuadras()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao remover quadra:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const atualizarQuadra = async (id:string, quadra: Quadra) => {
    try {
      await api.put(`/quadra/${id}`, quadra)
      await fetchQuadras()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar quadra:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarQuadraPorId = async (id: string): Promise<{ sucesso: boolean, data?: Quadra, erro?: any }> => {
    try {
      const response = await api.get(`/quadra/${id}`)
      return { sucesso: true, data: response.data.quadra }
    } catch (error: any) {
      console.error(`Erro ao buscar quadra com ID ${id}:`, error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <QuadraContext.Provider value={{
      quadras,
      adicionarQuadra,
      removerQuadra,
      atualizarQuadra,
      buscarQuadraPorId,
    }}
    >
      {children}
    </QuadraContext.Provider>
  )
}
