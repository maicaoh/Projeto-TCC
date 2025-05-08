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
  FaEye,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import { useCompeticao, Competicao } from '../../context/CompeticaoContext/CompeticaoContext'

import userDefault from '../../assets/Profile-PNG-File.png'
import GerenciarEquipeModal from './ModalGerenciaEquipe'
import { gerenciarEquipeType } from '../../context/EquipeContext/EquipeProvider'
import { statusCompeticao, tipoCompeticao } from '../../Enums/enums'

export function Competicoes() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [competicoesFilter, setCompeticoesFilter] = useState<Competicao[]>([])
  const [currentECompeticao, setCurrentCompeticao] = useState<Competicao | null>(null)

  const [openModalGerenciar, setOpenModalGerenciar] = useState<boolean>(false)

  const { adicionarCompeticao, atualizarCompeticao, buscarCompeticaoPorId, competicoes, removerCompeticao } = useCompeticao()

  const navigate = useNavigate()

  useEffect(() => {
    setCompeticoesFilter(competicoes)
  }, [competicoes])

  useEffect(() => {
    console.log(currentECompeticao)
  }, [currentECompeticao])

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const termo = searchTerm.toLowerCase()
    const filtradas = competicoes.filter(competicao =>
      competicao?.name?.toLowerCase().includes(termo?.toLocaleLowerCase()),
    )
    setCompeticoesFilter(filtradas)
  }

  function abrirGerenciarEquipe(competicao: Competicao) {
    setCurrentCompeticao(competicao)
    setOpenModalGerenciar(true)
  }

  function closeModal() {
    setCurrentCompeticao(null)
    setOpenModalGerenciar(false)
  }

  async function excluirCompeticao(competicao: Competicao) {
    const resultado = await removerCompeticao(competicao.id)
    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Competicao excluída com sucesso!', 'success')
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
    // const resultado = await gerenciarEquipe(data)
    if (true) {
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

      <ActionsContainer>
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Competicao..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </SearchInput>

        <NewButton onClick={() => navigate('/cadastrarcompeticao')}>
          <FaPlus />
          Novo
        </NewButton>
      </ActionsContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Logo</Th>
              <Th>Nome</Th>
              <Th>Formato</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {competicoesFilter.map(competicao => (
              <tr key={competicao.id}>
                <Td>
                  <PlayerImage
                    src={competicao.foto || userDefault}
                    alt="Logo da competicao"
                  />
                </Td>
                <Td>{competicao.name}</Td>
                <Td>{tipoCompeticao(Number(competicao.tipo))}</Td>
                <Td>{statusCompeticao(Number(competicao.status))}</Td>
                <Td>
                  <ActionButtons>
                    <Button
                      title="Explorar"
                      onClick={() => navigate(`/explorarcampeonato/${competicao.id}`)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      title="Deletar"
                      onClick={() => excluirCompeticao(competicao)}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      onClick={() => navigate(`/editarcompeticao/${competicao.id}`)}
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
