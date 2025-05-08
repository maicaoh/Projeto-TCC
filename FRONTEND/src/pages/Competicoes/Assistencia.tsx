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

export default function Assistencia({ id }: Props) {
  // Estado local para classificação
  const [classificacao, setClassificacao] = useState<ClassificacaoRow[]>([])

  const {
    carregarClassificacaoStats,
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
    if (assistenciaTorneioStats?.assistentes) {
      setClassificacao(assistenciaTorneioStats.assistentes)
    }
  }, [assistenciaTorneioStats])

  return (
    <Container>

      {/* Tabela de Classificação */}
      <TableContainer style={{ marginBottom: 24 }}>
        <Table>
          <thead>
            <tr>
              <Th>Posição</Th>
              <Th>Jogador</Th>
              <Th>Equipe</Th>
              <Th>Assistências</Th>
            </tr>
          </thead>
          <tbody>
            {classificacao.map(row => (
              <tr key={row.equipeId}>
                <Td>{row.posicao}</Td>
                <Td>{row.jogadorNome}</Td>
                <Td>{row.equipeNome}</Td>
                <Td>{row.assistencias}</Td>

              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

    </Container>
  )
}
