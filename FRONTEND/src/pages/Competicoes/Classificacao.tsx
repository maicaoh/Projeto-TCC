// src/pages/Estatistica/Classificacao.tsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaSearch, FaEye } from 'react-icons/fa'
import userDefault from '../../assets/Profile-PNG-File.png'
import {
  ActionButtons,
  Button,
  Table,
  TableContainer,
  Td,
  Th,
  ActionsContainer,
  SearchInput,
  PlayerImage,
} from './ClassificacaoStryles'
import { useTorneioEstatistica } from '../../context/EstatisticaTorneioContext/EstatisticaTorneioContext'
import { JogadorStats } from '../../context/EstatisticaTorneioContext/EstatisticaTorneioContext'
import { ModalEstatisticaTorneio } from './ModalEstatisticaTorneio'

// Nova interface para cada linha de classificação
interface ClassificacaoRow {
  posicao: number
  equipeId: string
  equipeNome: string
  jogos: number
  pontos: number
  vitorias: number
  empates: number
  derrotas: number
  golsFeitos: number
  golsSofridos: number
  saldoGols: number
}

interface Props {
  id: string
}

export interface JogadorRow extends JogadorStats {
  equipeNome: string
  equipeLogo: string
  idEquipe: string
}

const Container = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 1400px;
  margin: 20px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

export default function Classificacao({ id }: Props) {
  // Estado local para classificação
  const [classificacao, setClassificacao] = useState<ClassificacaoRow[]>([])

  const {

    carregarClassificacaoStats,
    classificacaoStats,
    artilhariaStats,
    carregarArtilhariaStats,
    assistenciaTorneioStats,
    carregarAssistenciaTorneioStats,
  } = useTorneioEstatistica()

  // 2) carrega a classificação
  useEffect(() => {
    carregarClassificacaoStats(id)
    carregarAssistenciaTorneioStats(id)
    carregarArtilhariaStats(id)
  }, [id])

  // 3) quando o contexto traz classificacaoStats, atualiza local
  useEffect(() => {
    if (classificacaoStats?.classificacao) {
      setClassificacao(classificacaoStats.classificacao)
    }
  }, [classificacaoStats])

  useEffect(() => {
    console.log(classificacao)
  }, [classificacao])

  useEffect(() => {
    console.log(artilhariaStats)
  }, [artilhariaStats])
  useEffect(() => {
    console.log(assistenciaTorneioStats)
  }, [assistenciaTorneioStats])

  return (
    <Container>

      {/* Tabela de Classificação */}
      <h2>Classificação</h2>
      <TableContainer style={{ marginBottom: 24 }}>
        <Table>
          <thead>
            <tr>
              <Th>Posição</Th>
              <Th>Equipe</Th>
              <Th>J</Th>
              <Th>P</Th>
              <Th>V</Th>
              <Th>E</Th>
              <Th>D</Th>
              <Th>GP</Th>
              <Th>GC</Th>
              <Th>SG</Th>
            </tr>
          </thead>
          <tbody>
            {classificacao.map(row => (
              <tr key={row.equipeId}>
                <Td>{row.posicao}</Td>
                <Td>{row.equipeNome}</Td>
                <Td>{row.jogos}</Td>
                <Td>{row.pontos}</Td>
                <Td>{row.vitorias}</Td>
                <Td>{row.empates}</Td>
                <Td>{row.derrotas}</Td>
                <Td>{row.golsFeitos}</Td>
                <Td>{row.golsSofridos}</Td>
                <Td>{row.saldoGols}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

    </Container>
  )
}
