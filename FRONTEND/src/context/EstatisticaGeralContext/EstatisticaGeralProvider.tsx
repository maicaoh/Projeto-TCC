import React, { ReactNode, useState } from 'react'
import { api } from '../../services/api'
import {
  EstatisticaGeralContext,
  RespostaAPI,
  GeralStatsResponse,
  PlayerFinalizacaoGlobalStatsResponse,
  PlayerDribleGlobalStatsResponse,
  PlayerDesarmeGlobalStatsResponse,
  PlayerFaltaCartaoGlobalStatsResponse,
  PlayerGolGlobalStatsResponse,
  PlayerAssistenciaGlobalStatsResponse,
  PlayerParticipacaoGolsGlobalStatsResponse,
} from './EstatisticaGeralContext'

interface EstatisticasGeraisProviderProps {
  children: ReactNode
}

export const EstatisticasGeraisProvider: React.FC<EstatisticasGeraisProviderProps> = ({ children }) => {
  const [geralStats, setGeralStats] = useState<GeralStatsResponse | null>(null)
  const [finalizacaoGlobalStats, setFinalizacaoGlobalStats] =
    useState<PlayerFinalizacaoGlobalStatsResponse | null>(null)
  const [dribleGlobalStats, setDribleGlobalStats] =
    useState<PlayerDribleGlobalStatsResponse | null>(null)
  const [desarmeGlobalStats, setDesarmeGlobalStats] =
    useState<PlayerDesarmeGlobalStatsResponse | null>(null)
  const [faltaCartaoGlobalStats, setFaltaCartaoGlobalStats] =
    useState<PlayerFaltaCartaoGlobalStatsResponse | null>(null)
  const [golGlobalStats, setGolGlobalStats] =
    useState<PlayerGolGlobalStatsResponse | null>(null)
  const [assistenciaGlobalStats, setAssistenciaGlobalStats] = useState<PlayerAssistenciaGlobalStatsResponse | null>(null)
  const [participacaoGolsGlobalStats, setParticipacaoGolsGlobalStats] = useState<PlayerParticipacaoGolsGlobalStatsResponse | null>(null)

  const carregarGeralStats = async (): Promise<RespostaAPI<GeralStatsResponse>> => {
    try {
      const response = await api.get<GeralStatsResponse>('/estatisticas')
      setGeralStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas gerais:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarFinalizacaoGlobalStats = async (
    jogadorId: string,
  ): Promise<RespostaAPI<PlayerFinalizacaoGlobalStatsResponse>> => {
    try {
      const response = await api.get<PlayerFinalizacaoGlobalStatsResponse>(
        `/estatisticas/finalizacao/${jogadorId}`,
      )
      setFinalizacaoGlobalStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar finalizações globais:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarDribleGlobalStats = async (
    jogadorId: string,
  ): Promise<RespostaAPI<PlayerDribleGlobalStatsResponse>> => {
    try {
      const response = await api.get<PlayerDribleGlobalStatsResponse>(
        `/estatisticas/drible/${jogadorId}`,
      )
      setDribleGlobalStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar dribles globais:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarDesarmeGlobalStats = async (
    jogadorId: string,
  ): Promise<RespostaAPI<PlayerDesarmeGlobalStatsResponse>> => {
    try {
      const response = await api.get<PlayerDesarmeGlobalStatsResponse>(
        `/estatisticas/desarme/${jogadorId}`,
      )
      setDesarmeGlobalStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar desarmes globais:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarFaltaCartaoGlobalStats = async (
    jogadorId: string,
  ): Promise<RespostaAPI<PlayerFaltaCartaoGlobalStatsResponse>> => {
    try {
      const response = await api.get<PlayerFaltaCartaoGlobalStatsResponse>(
        `/estatisticas/falta-cartao/${jogadorId}`,
      )
      setFaltaCartaoGlobalStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar faltas e cartões globais:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarGolGlobalStats = async (
    jogadorId: string,
  ): Promise<RespostaAPI<PlayerGolGlobalStatsResponse>> => {
    try {
      const response = await api.get<PlayerGolGlobalStatsResponse>(
        `/estatisticas/gol/${jogadorId}`,
      )
      setGolGlobalStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar gols globais:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarAssistenciaGlobalStats = async (jogadorId: string) => {
    try {
      const res = await api.get<PlayerAssistenciaGlobalStatsResponse>(`/estatisticas/assistencia/${jogadorId}`)
      setAssistenciaGlobalStats(res.data)
      return { sucesso: true, data: res.data }
    } catch (error: any) {
      console.error(error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }
  const carregarParticipacaoGolsGlobalStats = async (jogadorId: string) => {
    try {
      const res = await api.get<PlayerParticipacaoGolsGlobalStatsResponse>(`/estatisticas/participacaogol/${jogadorId}`)
      setParticipacaoGolsGlobalStats(res.data)
      return { sucesso: true, data: res.data }
    } catch (error: any) {
      console.error(error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <EstatisticaGeralContext.Provider
      value={{
        geralStats,
        carregarGeralStats,
        finalizacaoGlobalStats,
        carregarFinalizacaoGlobalStats,
        dribleGlobalStats,
        carregarDribleGlobalStats,
        desarmeGlobalStats,
        carregarDesarmeGlobalStats,
        faltaCartaoGlobalStats,
        carregarFaltaCartaoGlobalStats,
        golGlobalStats,
        carregarGolGlobalStats,
        assistenciaGlobalStats,
        carregarAssistenciaGlobalStats,
        participacaoGolsGlobalStats,
        carregarParticipacaoGolsGlobalStats,
      }}
    >
      {children}
    </EstatisticaGeralContext.Provider>
  )
}
