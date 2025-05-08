import React, { useState, ReactNode } from 'react'
import { api } from '../../services/api'
import {
  TorneioContext,
  RespostaAPI,
  TorneioResponse,
  PlayerFinalizacaoStatsResponse,
  PlayerDesarmeStatsResponse,
  PlayerDribleStatsResponse,
  PlayerFaltaCartaoStatsResponse,
  PlayerGolStatsResponse,
  PlayerAssistenciaStatsResponse,
  PlayerParticipacaoGolsStatsResponse,
  ClassificacaoTorneioStatsResponse,
  ArtilhariaTorneioStatsResponse,
  AssistenciaTorneioStatsResponse,
} from './EstatisticaTorneioContext'

interface TorneioProviderProps {
  children: ReactNode
}

export const TorneioProvider: React.FC<TorneioProviderProps> = ({ children }) => {
  const [torneioResponse, setTorneioResponse] = useState<TorneioResponse['torneio'] | null>(null)
  const [finalizacaoStats, setFinalizacaoStats] = useState<PlayerFinalizacaoStatsResponse | null>(null)
  const [desarmeStats, setDesarmeStats] = useState<PlayerDesarmeStatsResponse | null>(null)
  const [dribleStats, setDribleStats] = useState<PlayerDribleStatsResponse | null>(null)
  const [faltaCartaoStats, setFaltaCartaoStats] = useState<PlayerFaltaCartaoStatsResponse | null>(null)
  const [golStats, setGolStats] = useState<PlayerGolStatsResponse | null>(null)
  const [assistenciaStats, setAssistenciaStats] = useState<PlayerAssistenciaStatsResponse | null>(null)
  const [participacaoGolsStats, setParticipacaoGolsStats] = useState<PlayerParticipacaoGolsStatsResponse | null>(null) // 🎯 NOVO
  const [classificacaoStats, setClassificacaoStats] = useState<ClassificacaoTorneioStatsResponse | null>(null)
  const [artilhariaStats, setArtilhariaStats] = useState<ArtilhariaTorneioStatsResponse | null>(null)
  const [assistenciaTorneioStats, setAssistenciaTorneioStats] = useState<AssistenciaTorneioStatsResponse | null>(null)

  const carregarTorneio = async (id: string): Promise<RespostaAPI<TorneioResponse>> => {
    try {
      const response = await api.get<TorneioResponse>(`/estatisticas/torneio/${id}`)
      setTorneioResponse(response.data.torneio)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar torneio:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarFinalizacaoStats = async (jogadorId: string, torneioId: string): Promise<RespostaAPI<PlayerFinalizacaoStatsResponse>> => {
    try {
      const response = await api.get<PlayerFinalizacaoStatsResponse>(`/estatisticas/torneio/finalizacao/${torneioId}/${jogadorId}`)
      setFinalizacaoStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar finalizações:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarDesarmeStats = async (jogadorId: string, torneioId: string): Promise<RespostaAPI<PlayerDesarmeStatsResponse>> => {
    try {
      const response = await api.get<PlayerDesarmeStatsResponse>(`/estatisticas/torneio/desarme/${torneioId}/${jogadorId}`)
      setDesarmeStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar desarmes:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarDribleStats = async (jogadorId: string, torneioId: string): Promise<RespostaAPI<PlayerDribleStatsResponse>> => {
    try {
      const response = await api.get<PlayerDribleStatsResponse>(`/estatisticas/torneio/drible/${torneioId}/${jogadorId}`)
      setDribleStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar dribles:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarFaltaCartaoStats = async (jogadorId: string, torneioId: string): Promise<RespostaAPI<PlayerFaltaCartaoStatsResponse>> => {
    try {
      const response = await api.get<PlayerFaltaCartaoStatsResponse>(`/estatisticas/torneio/falta-cartao/${torneioId}/${jogadorId}`)
      setFaltaCartaoStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar faltas e cartões:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarGolStats = async (jogadorId: string, torneioId: string): Promise<RespostaAPI<PlayerGolStatsResponse>> => {
    try {
      const response = await api.get<PlayerGolStatsResponse>(`/estatisticas/torneio/gol/${torneioId}/${jogadorId}`)
      setGolStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar gols:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarAssistenciaStats = async (jogadorId: string, torneioId: string): Promise<RespostaAPI<PlayerAssistenciaStatsResponse>> => {
    try {
      const response = await api.get<PlayerAssistenciaStatsResponse>(`/estatisticas/torneio/assistencia/${torneioId}/${jogadorId}`)
      setAssistenciaStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar assistências:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarParticipacaoGolsStats = async (jogadorId: string, torneioId: string): Promise<RespostaAPI<PlayerParticipacaoGolsStatsResponse>> => {
    try {
      const response = await api.get<PlayerParticipacaoGolsStatsResponse>(`/estatisticas/torneio/participacao-gol/${torneioId}/${jogadorId}`)
      setParticipacaoGolsStats(response.data)
      return { sucesso: true, data: response.data }
    } catch (error: any) {
      console.error('Erro ao carregar participação em gols:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const carregarClassificacaoStats = async (
    torneioId: string,
  ): Promise<RespostaAPI<ClassificacaoTorneioStatsResponse>> => {
    try {
      const resp = await api.get<ClassificacaoTorneioStatsResponse>(
        `/estatisticas/classificacao/${torneioId}`,
      )
      setClassificacaoStats(resp.data)
      return { sucesso: true, data: resp.data }
    } catch (err: any) {
      return { sucesso: false, erro: err.response?.data || err.message }
    }
  }

  const carregarArtilhariaStats = async (
    torneioId: string,
  ): Promise<RespostaAPI<ArtilhariaTorneioStatsResponse>> => {
    try {
      const resp = await api.get<ArtilhariaTorneioStatsResponse>(
        `/estatisticas/artilharia/${torneioId}`,
      )
      setArtilhariaStats(resp.data)
      return { sucesso: true, data: resp.data }
    } catch (err: any) {
      return { sucesso: false, erro: err.response?.data || err.message }
    }
  }

  const carregarAssistenciaTorneioStats = async (
    torneioId: string,
  ): Promise<RespostaAPI<AssistenciaTorneioStatsResponse>> => {
    try {
      const resp = await api.get<AssistenciaTorneioStatsResponse>(
        `/estatisticas/assistencia/${torneioId}`,
      )
      setAssistenciaTorneioStats(resp.data)
      return { sucesso: true, data: resp.data }
    } catch (err: any) {
      return { sucesso: false, erro: err.response?.data || err.message }
    }
  }

  return (
    <TorneioContext.Provider
      value={{
        torneioResponse,
        carregarTorneio,
        finalizacaoStats,
        carregarFinalizacaoStats,
        desarmeStats,
        carregarDesarmeStats,
        dribleStats,
        carregarDribleStats,
        faltaCartaoStats,
        carregarFaltaCartaoStats,
        golStats,
        carregarGolStats,
        assistenciaStats,
        carregarAssistenciaStats,
        participacaoGolsStats,
        carregarParticipacaoGolsStats,
        classificacaoStats,
        carregarClassificacaoStats,

        artilhariaStats,
        carregarArtilhariaStats,

        assistenciaTorneioStats,
        carregarAssistenciaTorneioStats,
      }}
    >
      {children}
    </TorneioContext.Provider>
  )
}
