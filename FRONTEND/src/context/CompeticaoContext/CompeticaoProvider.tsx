import React, { useEffect, useState } from 'react'
import { Competicao, CompeticaoContext, Equipe } from './CompeticaoContext'
import { api } from '../../services/api'

interface CompeticaoProviderProps {
  children: React.ReactNode;
}

export interface TorneioSave {
  confrontos : {
    data?: Date | null,
    mandante: Equipe,
    quadra?: string | null,
    visitante: Equipe
  }[],
  name: string
  status: string;
  tipo: string;
  foto?: string;
  edicao: string;
  equipes: Equipe[]
}

export const CompeticaoProvider: React.FC<CompeticaoProviderProps> = ({ children }) => {
  const [competicoes, setCompeticoes] = useState<Competicao[]>([])

  useEffect(() => {
    fetchCompeticoes()
  }, [])

  const fetchCompeticoes = async () => {
    try {
      const response = await api.get('/torneio')
      const competicoesFiltrados = response?.data?.torneios?.map((competicao: Competicao) => ({
        ...competicao,
      }))
      setCompeticoes(competicoesFiltrados || [])
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao buscar competições:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const adicionarCompeticao = async (competicao: TorneioSave) => {
    try {
      await api.post('/torneio', competicao)
      await fetchCompeticoes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao adicionar competição:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerCompeticao = async (id: string) => {
    try {
      await api.delete(`/torneio/${id}`)
      await fetchCompeticoes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao remover competição:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const atualizarCompeticao = async (id: string, competicao: Competicao) => {
    try {
      await api.put(`/torneio/${id}`, competicao)
      await fetchCompeticoes()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar competição:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarCompeticaoPorId = async (id: string): Promise<{ sucesso: boolean, data?: Arbitro, erro?: any }> => {
    try {
      const response = await api.get(`/torneio/${id}`)
      return { sucesso: true, data: response.data?.torneio }
    } catch (error: any) {
      console.error(`Erro ao buscar torneio com ID ${id}:`, error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <CompeticaoContext.Provider
      value={{
        competicoes,
        adicionarCompeticao,
        removerCompeticao,
        atualizarCompeticao,
        buscarCompeticaoPorId,
        fetchCompeticoes,
      }}
    >
      {children}
    </CompeticaoContext.Provider>
  )
}
