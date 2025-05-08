import React, { useEffect, useState } from 'react'
import {
  ActionButtons, Button, Content,
  Table, TableContainer, Td, Th,
  ActionsContainer, NewButton, SearchInput, PlayerImage,
} from './styles'
import {
  FaTrash, FaEdit,
  FaExchangeAlt, FaUserSlash,
} from 'react-icons/fa'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import TransferirJogadorModal from './ModalTranferenciaJogador'
import {
  Jogador,
  useJogador,
} from '../../context/JogadorContext/JogadorContext'
import {
  useEquipe,
} from '../../context/EquipeContext/EquipeContext'
import DesligarTecnicoModal from './ModalDesligarJogador'
import Swal from 'sweetalert2'
import { peDominande, posicaoJogador } from '../../Enums/enums'

import userDefault from '../../assets/Profile-PNG-File.png'

export function Jogadores() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [jogadoresFilter, setJogadoresFilter] = useState<Jogador[]>([])

  const [currentJogador, setCurrentJogador] = useState<Jogador | null>(null)

  const [openMofalTranferir, setOpenModalTranferir] = useState<boolean>(false)
  const [openMofalDesligar, setOpenModalDesligar] = useState<boolean>(false)

  const { jogadores, tranferirJogador, desligarJogador, removerJogador } = useJogador()
  const { equipes } = useEquipe()

  const navigate = useNavigate()

  useEffect(() => {
    setJogadoresFilter(jogadores)
  }, [jogadores])

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setJogadoresFilter([...jogadores?.filter(jogador => jogador?.name?.toLocaleLowerCase()?.includes(searchTerm?.toLocaleLowerCase()))])

    // Aqui pode ser feita uma busca na API ou um filtro local na tabela
  }

  function tranferirJogadorModal(jogador:Jogador) {
    setOpenModalTranferir(true)
    setCurrentJogador(jogador)
  }

  function desligarJogadorModal(tecnico:Tecnico) {
    setOpenModalDesligar(true)
    setCurrentJogador(tecnico)
  }

  function closeModal() {
    setCurrentJogador(null)
    setOpenModalTranferir(false)
  }

  function closeModalDesligar() {
    setCurrentJogador(null)
    setOpenModalDesligar(false)
  }

  async function handleTranferirJogador(idEquipe:string, idJogador:string) {
    const resultado = await tranferirJogador(idEquipe, idJogador)
    console.log(resultado)
    if (resultado.sucesso) {
      Swal.fire('Sucesso!',
        'Jogador transferido para equipe com sucesso!',
        'success')
      setOpenModalDesligar(false)

      navigate('/jogadores')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }

    setOpenModalTranferir(false)
  }

  async function handleDesligarJogador(idEquipe:string, idJogador:string) {
    const resultado = await desligarJogador(idEquipe, idJogador)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!',
        'Jogador desligado da equipe com sucesso!',
        'success')
      setOpenModalDesligar(false)

      navigate('/jogadores')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  async function excluirJogador(jogador:Jogador) {
    const resultado = await removerJogador(jogador.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', id
        ? 'Jogador atualizado com sucesso!'
        : 'Jogador adicionado com sucesso!', 'success')
      navigate('/jogadores')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate)
    const day = date.getUTCDate().toString().padStart(2, '0')
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  console.log(jogadores)

  return (
    <Content>
      <TransferirJogadorModal
        show={openMofalTranferir}
        jogador={currentJogador}
        handleSave={(idEquipe, idJogador) => handleTranferirJogador(idEquipe, idJogador)}
        handleClose={closeModal}
        equipes={equipes}
      />
      <DesligarTecnicoModal
        show={openMofalDesligar}
        jogador={currentJogador}
        handleSave={(idEquipe, idJogador) => handleDesligarJogador(idEquipe, idJogador)}
        handleClose={closeModalDesligar}
        equipes={equipes}
      />
      <ActionsContainer>
        {/* Campo de busca */}
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Jogador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </SearchInput>
        {/* Botão de novo técnico */}
        <NewButton onClick={() => navigate('/cadastrojogador')}>
          <FaPlus />
          Novo
        </NewButton>
      </ActionsContainer>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Foto</Th>
              <Th>Nome</Th>
              <Th>Apelido</Th>
              <Th>Equipe</Th>
              <Th>Posição</Th>
              <Th>Pé</Th>
              <Th>Telefone</Th>

              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {jogadoresFilter?.map((_, index) => (
              <tr key={index}>
                <Td><PlayerImage src={_.foto || userDefault} alt="Foto do jogador" />
                </Td>

                <Td>{_.name}</Td>
                <Td>{_.apelido}</Td>
                <Td>{_?.equipeJogador
                  ?.map(ele => ele?.equipe?.name + '\n').toString()}
                </Td>
                <Td>{posicaoJogador(Number(_.posicao))}</Td>
                <Td>{peDominande(_.peDominante)}</Td>
                <Td>{_.telefone}</Td>

                <Td>
                  <ActionButtons>
                    <Button
                      title="Desligar"
                      onClick={() => desligarJogadorModal(_)}
                    >
                      <FaUserSlash />
                    </Button>
                    <Button
                      title="Tranferir"
                      onClick={() => tranferirJogadorModal(_)}
                    >
                      <FaExchangeAlt />
                    </Button>
                    <Button
                      title="Deletar"
                      onClick={() => excluirJogador(_)}
                    >
                      <FaTrash />
                    </Button>
                    <Button onClick={() => navigate(`/editarjogador/${_.id}`)} title="Editar"><FaEdit /></Button>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Content>
  )
}
