import React, { useEffect, useState } from 'react'
import {
  ActionButtons, Button, Content,
  Table, TableContainer, Td, Th, ActionsContainer, NewButton, SearchInput,
} from './styles'
import {
  FaTrash, FaEdit,
  FaExchangeAlt, FaUserSlash,
} from 'react-icons/fa'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import TransferirTecnicoModal from './ModalTranferenciaTreinador'
import {
  Tecnico,
  useTreinador,
} from '../../context/TreinadoresContext/TreinadorContext'
import {
  Equipe,
  useEquipe,
} from '../../context/EquipeContext/EquipeContext'
import DesligarTecnicoModal from './ModalDesligarTreinador'
import Swal from 'sweetalert2'

export function Treinadores() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [treinadoresFilter, setTreinadoresFilter] = useState<Tecnico[]>([])

  const [currentTecnico, setCurrentTecnico] = useState<Tecnico | null>(null)

  const [openMofalTranferir, setOpenModalTranferir] = useState<boolean>(false)
  const [openMofalDesligar, setOpenModalDesligar] = useState<boolean>(false)

  const { treinadores, tranferirTreinador, desligarTreinador, removerTreinador } = useTreinador()
  const { equipes } = useEquipe()

  const navigate = useNavigate()

  useEffect(() => {
    setTreinadoresFilter(treinadores)
  }, [treinadores])

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setTreinadoresFilter([...treinadores?.filter(tecnico => tecnico?.name?.toLocaleLowerCase()?.includes(searchTerm?.toLocaleLowerCase()))])

    // Aqui pode ser feita uma busca na API ou um filtro local na tabela
  }

  function tranferirTreinadorModal(tecnico:Tecnico) {
    setOpenModalTranferir(true)
    setCurrentTecnico(tecnico)
  }

  function desligarTreinadorModal(tecnico:Tecnico) {
    setOpenModalDesligar(true)
    setCurrentTecnico(tecnico)
  }

  function closeModal() {
    setCurrentTecnico(null)
    setOpenModalTranferir(false)
  }

  function closeModalDesligar() {
    setCurrentTecnico(null)
    setOpenModalDesligar(false)
  }

  async function handleTranferirTreinador(idEquipe:string, idTreinador:string) {
    const resultado = await tranferirTreinador(idEquipe, idTreinador)
    console.log(resultado)
    if (resultado.sucesso) {
      Swal.fire('Sucesso!',
        'Técnico transferido para equipe com sucesso!',
        'success')
      setOpenModalDesligar(false)

      navigate('/tecnicos')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }

    setOpenModalTranferir(false)
  }

  async function handleDesligarTreinador(idEquipe:string, idTreinador:string) {
    const resultado = await desligarTreinador(idEquipe, idTreinador)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!',
        'Técnico desligado da equipe com sucesso!',
        'success')
      setOpenModalDesligar(false)

      navigate('/tecnicos')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  async function exclirTecnico(tecnico:Tecnico) {
    const resultado = await removerTreinador(tecnico.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', id
        ? 'Treinador atualizado com sucesso!'
        : 'Treinador adicionado com sucesso!', 'success')
      navigate('/tecnicos')
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

  console.log(treinadores)

  return (
    <Content>
      <TransferirTecnicoModal
        show={openMofalTranferir}
        tecnico={currentTecnico}
        handleSave={(idEquipe, idTreinador) => handleTranferirTreinador(idEquipe, idTreinador)}
        handleClose={closeModal}
        equipes={equipes}
      />
      <DesligarTecnicoModal
        show={openMofalDesligar}
        tecnico={currentTecnico}
        handleSave={(idEquipe, idTreinador) => handleDesligarTreinador(idEquipe, idTreinador)}
        handleClose={closeModalDesligar}
        equipes={equipes}
      />
      <ActionsContainer>
        {/* Campo de busca */}
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </SearchInput>
        {/* Botão de novo técnico */}
        <NewButton onClick={() => navigate('/cadastrotecnico')}>
          <FaPlus />
          Novo
        </NewButton>
      </ActionsContainer>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Apelido</Th>
              <Th>Data de Nascimento</Th>
              <Th>Equipe</Th>
              <Th>Telefone</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {treinadoresFilter?.map((_, index) => (
              <tr key={index}>
                <Td>{_.name}</Td>
                <Td>{_.apelido}</Td>
                <Td>{formatDate(_.dataNascimento.toString())}</Td>
                <Td>{_?.equipeTecnico
                  ?.map(ele => ele?.equipe?.name + '\n').toString()}
                </Td>
                <Td>{_.telefone}</Td>
                <Td>
                  <ActionButtons>
                    <Button
                      title="Desligar"
                      onClick={() => desligarTreinadorModal(_)}
                    >
                      <FaUserSlash />
                    </Button>
                    <Button
                      title="Tranferir"
                      onClick={() => tranferirTreinadorModal(_)}
                    >
                      <FaExchangeAlt />
                    </Button>
                    <Button
                      title="Deletar"
                      onClick={() => exclirTecnico(_)}
                    >
                      <FaTrash />
                    </Button>
                    <Button onClick={() => navigate(`/editartecnico/${_.id}`)} title="Editar"><FaEdit /></Button>
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
