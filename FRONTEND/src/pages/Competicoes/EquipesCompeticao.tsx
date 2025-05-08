import React, { useEffect, useState } from 'react'
import {
  ActionButtons, Button, Content,
  Table, TableContainer, Td, Th,
  ActionsContainer, NewButton, SearchInput, PlayerImage,
} from './EquipesCompeticaoStyles'
import {
  FaTrash, FaEdit,
  FaExchangeAlt, FaUserSlash,
  FaPlus, FaSearch,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Competicao, useCompeticao } from '../../context/CompeticaoContext/CompeticaoContext'
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

interface Data {
  id: string
}

export function EquipesCompeticao(data:Data) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [equipesFilter, setEquipesFilter] = useState<Equipe[]>([])
  const [currentEquipe, setCurrentEquipe] = useState<Equipe | null>(null)
  const [equipes, setEquipes] = useState<Equipe[]>([])

  const navigate = useNavigate()
  const { buscarCompeticaoPorId } = useCompeticao()
  const { id } = data

  useEffect(() => {
    buscarCompeticaoPorId(id).then((data: Competicao) => {
      if (data) {
        const comp = data?.data
        setEquipes(comp.equipes || [])
      }
    })
  }, [id, buscarCompeticaoPorId])

  useEffect(() => {
    setEquipesFilter(equipes)
  }, [equipes])

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const termo = searchTerm.toLowerCase()
    const filtradas = equipes.filter(equipe =>
      equipe?.name?.toLowerCase().includes(termo),
    )
    setEquipesFilter(filtradas)
  }

  const handleDesqualificarClick = () => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você realmente deseja desqualificar esta equipe?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, desqualificar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Aqui você chama sua função de exclusão
        Swal.fire('Sucesso!', 'Equipe desqualificada com sucesso.', 'success')
      }
    })
  }

  return (
    <Content>

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
                      title="Desqualificar"
                      onClick={() => handleDesqualificarClick()}
                    >
                      <FaExclamationTriangle />
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
