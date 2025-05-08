import React, { useEffect, useState } from 'react'
import {
  ActionButtons, Button, Content,
  Table, TableContainer, Td, Th,
  ActionsContainer, NewButton, SearchInput, PlayerImage,
} from './styles'
import {
  FaTrash, FaEdit,
  FaExchangeAlt, FaUserSlash,
  FaPlus, FaSearch,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import {
  useJogador,
} from '../../context/JogadorContext/JogadorContext'
import {
  Equipe,
  useEquipe,
} from '../../context/EquipeContext/EquipeContext'

import userDefault from '../../assets/Profile-PNG-File.png'
import GerenciarEquipeModal from './ModalGerenciaEquipe'
import { gerenciarEquipeType } from '../../context/EquipeContext/EquipeProvider'

export function Equipes() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [equipesFilter, setEquipesFilter] = useState<Equipe[]>([])
  const [capitao, setCapitao] = useState<string | null>(null)
  const [currentEquipe, setCurrentEquipe] = useState<Equipe | null>(null)

  const [openModalGerenciar, setOpenModalGerenciar] = useState<boolean>(false)

  const { equipes, removerEquipe, tranferirJogadores, gerenciarEquipe } = useEquipe()
  const { desligarJogador } = useJogador()

  const navigate = useNavigate()

  useEffect(() => {
    setEquipesFilter(equipes)
  }, [equipes])

  useEffect(() => {
    console.log(currentEquipe)
    const capitaoAux = currentEquipe?.equipeJogador
      ?.filter(ej => !ej.data_desligamento)
      .find(ej => ej.capitao)?.id || null
    console.log(capitaoAux)
    setCapitao(capitaoAux)
  }, [currentEquipe])

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const termo = searchTerm.toLowerCase()
    const filtradas = equipes.filter(equipe =>
      equipe?.name?.toLowerCase().includes(termo),
    )
    setEquipesFilter(filtradas)
  }

  function abrirGerenciarEquipe(equipe: Equipe) {
    setCurrentEquipe(equipe)
    setOpenModalGerenciar(true)
  }

  function closeModal() {
    setCurrentEquipe(null)
    setOpenModalGerenciar(false)
  }

  async function excluirEquipe(equipe: Equipe) {
    const resultado = await removerEquipe(equipe.id)
    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Equipe excluída com sucesso!', 'success')
      navigate('/equipes')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  async function gerenciarEquipeSave(data: gerenciarEquipeType) {
    const resultado = await gerenciarEquipe(data)
    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Equipe alterada com sucesso!', 'success')
      navigate('/equipes')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  return (
    <Content>
      <GerenciarEquipeModal
        show={openModalGerenciar}
        handleSalvar={(payload) => {
          gerenciarEquipeSave(payload as gerenciarEquipeType)
          console.log('Salvar alterações:', payload)
          closeModal()
        }}
        setCapitao={(id:string) => setCapitao(id)}
        equipeNome={currentEquipe?.name || ''}
        handleClose={closeModal}
        key={currentEquipe?.id}
        jogadores={currentEquipe?.equipeJogador
          ?.filter(ej => !ej.data_desligamento)
          .map(ej => ({
            id: ej.id,
            name: ej.jogador.name,
            dorsal: ej.dorsal || null, // dorsal atual
          })) || []}
        capitaoId={capitao}
      />

      <ActionsContainer>
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Equipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </SearchInput>

        <NewButton onClick={() => navigate('/cadastroequipe')}>
          <FaPlus />
          Novo
        </NewButton>
      </ActionsContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Logo</Th>
              <Th>Equipe</Th>
              <Th>Responsável</Th>
              <Th>Telefone</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {equipesFilter.map(equipe => (
              <tr key={equipe.id}>
                <Td>
                  <PlayerImage
                    src={equipe.logo || userDefault}
                    alt="Foto do equipe"
                  />
                </Td>
                <Td>{equipe.name}</Td>
                <Td>Responsável</Td>
                <Td>{equipe.telefone}</Td>
                <Td>
                  <ActionButtons>
                    <Button
                      title="Gerenciar"
                      onClick={() => abrirGerenciarEquipe(equipe)}
                    >
                      <FaExchangeAlt />
                    </Button>
                    <Button
                      title="Deletar"
                      onClick={() => excluirEquipe(equipe)}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      onClick={() => navigate(`/editarequipe/${equipe.id}`)}
                      title="Editar"
                    >
                      <FaEdit />
                    </Button>
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
