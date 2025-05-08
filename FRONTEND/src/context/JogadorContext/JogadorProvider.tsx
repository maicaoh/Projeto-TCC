import React, { useEffect, useState } from 'react'
import { Jogador, JogadorContext } from './JogadorContext'
import { api } from '../../services/api'

interface JogadorProviderProps {
  children: React.ReactNode;
}

export const JogadorProvider: React.FC<JogadorProviderProps> = ({ children }) => {
  const [jogadores, setJogadores] = useState<Jogador[]>([])

  useEffect(() => {
    fetchJogadores()
  }, [])

  const fetchJogadores = async () => {
    try {
      const response = await api.get('/jogador')
      const jogadoresFiltrados = response?.data?.jogadores
        ?.map((jogador:Jogador) => ({
          ...jogador,
          equipeJogador: jogador?.equipeJogador
            ?.filter(eq => eq.data_desligamento === null),
        }))

      setJogadores(jogadoresFiltrados || [])
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao buscar jogadores:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const adicionarJogador = async (jogador: Jogador) => {
    try {
      await api.post('/jogador', jogador)
      await fetchJogadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao adicionar jogador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerJogador = async (id: string) => {
    try {
      await api.delete(`/jogador/${id}`)
      await fetchJogadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao remover jogador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const atualizarJogador = async (id:string, jogador: Jogador) => {
    try {
      await api.put(`/jogador/${id}`, jogador)
      await fetchJogadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao atualizar jogador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarJogadorPorId = async (id: string): Promise<{ sucesso: boolean, data?: Jogador, erro?: any }> => {
    try {
      const response = await api.get(`/jogador/${id}`)
      return { sucesso: true, data: response.data.jogador }
    } catch (error: any) {
      console.error(`Erro ao buscar jogador com ID ${id}:`, error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const tranferirJogador = async (idEquipe: string, idJogador: string) => {
    try {
      await api.post(`/equipe/${idEquipe}/jogadores`, { idsJogadores: [idJogador] })
      await fetchJogadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao transferir jogador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const desligarJogador = async (idEquipe: string, idJogador: string) => {
    try {
      await api.put(`/equipe/${idEquipe}/jogadores`, { idsJogadores: [idJogador] })
      await fetchJogadores()
      return { sucesso: true }
    } catch (error: any) {
      console.error('Erro ao desligar jogador:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const buscarJogadorDisponiveis = async (): Promise<{ sucesso: boolean, data?: Jogador[], erro?: any }> => {
    try {
      const response = await api.get('/jogadores/disponiveis')
      return { sucesso: true, data: response.data.jogadores }
    } catch (error: any) {
      console.error('Erro ao buscar jogadores', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <JogadorContext.Provider value={{
      jogadores,
      adicionarJogador,
      removerJogador,
      atualizarJogador,
      buscarJogadorPorId,
      tranferirJogador,
      desligarJogador,
      buscarJogadorDisponiveis,
    }}
    >
      {children}
    </JogadorContext.Provider>
  )
}
