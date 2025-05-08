import React, { useEffect, useState } from 'react'
import {
  Arbitro,
  ArbitroContext,
} from './ArbitroContext'
import { api } from '../../services/api'

interface ArbitroProviderProps {
  children: React.ReactNode;
}

export const ArbitroProvider: React.FC<ArbitroProviderProps> = ({ children }) => {
  const [arbitros, setArbitros] = useState<Arbitro[]>([])

  useEffect(() => {
    fetchArbitros()
  }, [])

  const fetchArbitros = async () => {
    try {
      const response = await api.get('/arbitro')
      const arbitros = response?.data?.arbitros
      console.log('============>')
      console.log(arbitros)
      setArbitros(arbitros || [])
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao buscar arbitros:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const adicionarArbitro = async (arbitro: Arbitro) => {
    try {
      await api.post('/arbitro', arbitro)
      await fetchArbitros()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao adicionar arbitro:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerArbitro = async (id: string) => {
    try {
      await api.delete(`/arbitro/${id}`)
      await fetchArbitros()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao remover arbitro:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const atualizarArbitro = async (id:string, arbitro: Arbitro) => {
    try {
      await api.put(`/arbitro/${id}`, arbitro)
      await fetchArbitros()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar arbitro:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarArbitroPorId = async (id: string): Promise<{ sucesso: boolean, data?: Arbitro, erro?: any }> => {
    try {
      const response = await api.get(`/arbitro/${id}`)
      return { sucesso: true, data: response.data.arbitro }
    } catch (error: any) {
      console.error(`Erro ao buscar arbitro com ID ${id}:`, error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <ArbitroContext.Provider value={{
      arbitros,
      adicionarArbitro,
      removerArbitro,
      atualizarArbitro,
      buscarArbitroPorId,
    }}
    >
      {children}
    </ArbitroContext.Provider>
  )
}
