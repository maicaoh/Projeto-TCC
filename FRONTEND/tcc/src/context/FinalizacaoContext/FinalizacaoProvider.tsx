import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Finalizacao, FinalizacaoContext, FinalizacaoList } from './FinalizacaoContext'

interface FinalizacaoProviderProps {
  children: React.ReactNode
}

export const FinalizacaoProvider: React.FC<FinalizacaoProviderProps> = ({ children }) => {
  const [finalizacoes, setFinalizacoes] = useState<FinalizacaoList[]>([])

  const listarFinalizacoes = async (
    id: string,
  ): Promise<{ sucesso: boolean; data?: FinalizacaoList[]; erro?: any }> => {
    try {
      const response = await api.get(`/finalizacao/partida/${id}`)
      const data = response?.data?.finalizacoes || []

      // Adapta os dados recebidos para o formato que o front espera
      const finalizacoesAdaptadas: FinalizacaoList[] = data.map((item: any) => ({
        ...item,
        gol: !!item.gol, // transforma a relação (obj ou null) em boolean
      }))

      setFinalizacoes(finalizacoesAdaptadas)
      return { sucesso: true, data: finalizacoesAdaptadas }
    } catch (error: any) {
      console.error('Erro ao listar finalizações:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const criarFinalizacao = async (
    idPartida: string,
    finalizacao: Omit<Finalizacao, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Finalizacao; erro?: any }> => {
    try {
      const response = await api.post(`/finalizacao/${idPartida}`, finalizacao)
      return { sucesso: true, data: response.data?.finalizacao }
    } catch (error: any) {
      console.error('Erro ao criar finalização:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const editarFinalizacao = async (
    id: string,
    finalizacao: Omit<Finalizacao, 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Finalizacao; erro?: any }> => {
    try {
      const response = await api.put(`/finalizacao/${id}`, finalizacao)
      return { sucesso: true, data: response.data?.finalizacao }
    } catch (error: any) {
      console.error('Erro ao editar finalização:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerFinalizacao = async (id: string): Promise<{ sucesso: boolean; data?: Finalizacao; erro?: any }> => {
    try {
      const response = await api.delete(`/finalizacao/${id}`)
      return { sucesso: true, data: response.data?.finalizacao }
    } catch (error: any) {
      console.error('Erro ao remover finalização:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <FinalizacaoContext.Provider
      value={{
        finalizacoes,
        listarFinalizacoes,
        criarFinalizacao,
        editarFinalizacao,
        removerFinalizacao,
      }}
    >
      {children}
    </FinalizacaoContext.Provider>
  )
}
