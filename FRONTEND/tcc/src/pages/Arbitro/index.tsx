import React, { useEffect, useState } from 'react'
import {
  ActionButtons, Button, Content,
  Table, TableContainer, Td, Th,
  ActionsContainer, NewButton, SearchInput,
  PlayerImage,
} from './styles'
import {
  FaTrash, FaEdit,
} from 'react-icons/fa'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'
import { useArbitro, Arbitro } from '../../context/ArbitroContext/ArbitroContext'
import userDefault from '../../assets/Profile-PNG-File.png'

export function Arbitros() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [arbitrosFilter, setArbitrosFilter] = useState<Arbitro[]>([])

  const { arbitros, removerArbitro } = useArbitro()

  const navigate = useNavigate()

  useEffect(() => {
    setArbitrosFilter(arbitros)
  }, [arbitros])

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setArbitrosFilter([...arbitro
      ?.filter(arbitro => arbitro?.name?.toLocaleLowerCase()
        ?.includes(searchTerm?.toLocaleLowerCase()))])

    // Aqui pode ser feita uma busca na API ou um filtro local na tabela
  }

  async function excluirArbitro(arbitro:Arbitro) {
    const resultado = await removerArbitro(arbitro.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Arbitro excluído com sucesso', 'success')
      navigate('/arbitros')
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

  return (
    <Content>

      <ActionsContainer>
        {/* Campo de busca */}
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Arbitro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </SearchInput>
        {/* Botão de novo técnico */}
        <NewButton onClick={() => navigate('/cadastroarbitro')}>
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
              <Th>CPF</Th>
              <Th>Data de Nascimento</Th>
              <Th>Email</Th>
              <Th>Telefone</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {arbitrosFilter?.map((_, index) => (
              <tr key={index}>
                <Td>
                  <PlayerImage
                    src={_.foto || userDefault}
                    alt="Foto do arbitro"
                  />
                </Td>
                <Td>{_.name}</Td>
                <Td>{_.apelido}</Td>
                <Td>{_?.cpf}</Td>
                <Td>{formatDate(_.dataNascimento.toString())}</Td>
                <Td>{_?.email}</Td>
                <Td>{_?.telefone}</Td>
                <Td>
                  <ActionButtons>
                    <Button
                      title="Deletar"
                      onClick={() => excluirArbitro(_)}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      onClick={() => navigate(`/editararbitro/${_.id}`)}
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
