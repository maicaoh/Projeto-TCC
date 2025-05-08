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
} from './EstatisticasStryles'
import { useTorneioEstatistica } from '../../context/EstatisticaTorneioContext/EstatisticaTorneioContext'
import { ModalEstatisticaGeral, ModalEstatisticaTorneio } from './ModalEstatisticaTorneio'
import { useEstatisticaGeralEstatistica } from '../../context/EstatisticaGeralContext/EstatisticaGeralContext'

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

export default function Estatisticas() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openModalEstatistica, setOpenModalEstatistica] = useState(false)
  const [currentJogadorEstatistica, setCurrentJogadorEstatistica] = useState<JogadorRow | null>(null)

  const { geralStats, carregarGeralStats } = useEstatisticaGeralEstatistica()

  // 1) carrega estatísticas gerais
  useEffect(() => {
    carregarGeralStats()
  }, [])

  // 2) flatten: monta array de jogadores com dados de equipe
  const allPlayers: JogadorRow[] =
    geralStats?.equipes
      .flatMap(equipe =>
        equipe.jogadores.map(jogador => ({
          ...jogador,
          equipeNome: equipe.name,
          equipeLogo: equipe.logo,
          idEquipe: equipe.id,
        })),
      ) ?? []

  // 3) filtra pelo nome
  const filtered = allPlayers.filter(j =>
    j.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleModalEstatistica(jogador: JogadorRow) {
    setCurrentJogadorEstatistica(jogador)
    setOpenModalEstatistica(true)
  }

  return (
    <Container>
      <ModalEstatisticaGeral
        key="modalEstatistica"
        jogador={currentJogadorEstatistica}
        show={openModalEstatistica}
        handleClose={() => setOpenModalEstatistica(false)}
      />

      <ActionsContainer>
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Jogador..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch />
          </button>
        </SearchInput>
      </ActionsContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Foto</Th>
              <Th>Jogador</Th>
              <Th>Equipe</Th>
              <Th>Jogos</Th>
              <Th>Gols</Th>
              <Th>Assistencia</Th>
              <Th>Cartão Amarelo</Th>
              <Th>Cartão Vermelho</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id}>
                <Td>
                  <PlayerImage
                    src={j.foto || j.equipeLogo || userDefault}
                    alt={`Foto de ${j.name}`}
                  />
                </Td>
                <Td>{j.name}</Td>
                <Td>{j.equipeNome}</Td>
                <Td>{j.jogosCount ?? '–'}</Td>
                <Td>{j.golsCount}</Td>
                <Td>{j.assistenciasCount}</Td>
                <Td>{j.cartoesAmarelos}</Td>
                <Td>{j.cartoesVermelhos}</Td>
                <Td>
                  <ActionButtons>
                    <Button title="Explorar" onClick={() => handleModalEstatistica(j)}>
                      <FaEye />
                    </Button>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  )
}
