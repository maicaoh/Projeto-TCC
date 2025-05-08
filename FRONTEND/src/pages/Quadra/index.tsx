import React, { useEffect, useState } from 'react'
import {
  ActionButtons, Button, Content,
  Table, TableContainer, Td, Th,
  ActionsContainer, NewButton, SearchInput,
} from './styles'
import {
  FaTrash, FaEdit,
} from 'react-icons/fa'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'

import { useQuadra, Quadra } from '../../context/QuadraContext/QuadraContext'

export function Quadras() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [quadrasFilter, setQuadrasFilter] = useState<Quadra[]>([])

  const { quadras, removerQuadra } = useQuadra()

  const navigate = useNavigate()

  useEffect(() => {
    setQuadrasFilter(quadras)
  }, [quadras])

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setQuadrasFilter([...quadras
      ?.filter(quadra => quadra?.name?.toLocaleLowerCase()
        ?.includes(searchTerm?.toLocaleLowerCase()))])

    // Aqui pode ser feita uma busca na API ou um filtro local na tabela
  }

  async function excluirQuadra(quadra:Quadra) {
    const resultado = await removerQuadra(quadra.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Quadra excluída com sucesso', 'success')
      navigate('/quadras')
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
        {/* Campo de busca */}
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Quadra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </SearchInput>
        {/* Botão de novo técnico */}
        <NewButton onClick={() => navigate('/cadastroquadra')}>
          <FaPlus />
          Novo
        </NewButton>
      </ActionsContainer>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Endereço</Th>
              <Th>Largura</Th>
              <Th>Comprimento</Th>
              <Th>Piso</Th>
              <Th>Telefone</Th>
              <Th>Responsável</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {quadrasFilter?.map((_, index) => (
              <tr key={index}>
                <Td>{_.name}</Td>
                <Td>{_.endereco}</Td>
                <Td>{_?.largura}</Td>
                <Td>{_?.comprimento}</Td>
                <Td>{_?.piso}</Td>
                <Td>{_?.telefone}</Td>
                <Td>{_?.responsavel}</Td>
                <Td>
                  <ActionButtons>
                    <Button
                      title="Deletar"
                      onClick={() => excluirQuadra(_)}
                    >
                      <FaTrash />
                    </Button>
                    <Button onClick={() => navigate(`/editarquadra/${_.id}`)} title="Editar"><FaEdit /></Button>
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
