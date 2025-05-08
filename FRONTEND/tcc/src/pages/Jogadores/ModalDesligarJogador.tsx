import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import {
  FormGroup,
  Label,
  RadioGroup,
  EquipeItem,
  SearchInput,
  SearchContainer,
  FixedSection,
  ModalBody,
} from './ModalTransferenciaJogadorStyles'
import { Jogador } from '../../context/JogadorContext/JogadorContext'
import { Equipe } from '../../context/EquipeContext/EquipeContext'
import BaseModal from '../../Components/ModalBase/Modalbase'

interface DesligarJogadorModalProps {
  show: boolean;
  handleClose: () => void;
  jogador: Jogador | null;
  equipes: Equipe[];
  handleSave: (equipeId: string | null, jogadorId: string | null) => void;
}

const DesligarJogadorModal: React.FC<DesligarJogadorModalProps> = ({
  show,
  handleClose,
  jogador,
  equipes = [],
  handleSave,
}) => {
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (!show) setSearchTerm('')
  }, [show])

  const equipesRelacionadas = jogador?.equipeJogador?.map(e => e.equipe)

  const equipesFiltradas = equipesRelacionadas?.filter(e =>
    e.name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  )

  return (
    <BaseModal
      show={show}
      handleClose={handleClose}
      title="Desligar Jogador"
      onSave={() => handleSave(equipeSelecionada, jogador?.id)}
      disableSave={!equipeSelecionada}
    >
      <FixedSection>
        <h5>{jogador?.name}</h5>
        <Label>Selecione a Equipe de Destino</Label>
      </FixedSection>

      <SearchContainer>
        <SearchInput>
          <input
            type="text"
            placeholder="Pesquisar Equipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button disabled>
            <FaSearch />
          </button>
        </SearchInput>
      </SearchContainer>

      <ModalBody>
        <FormGroup>
          <RadioGroup>
            {equipesFiltradas?.map(equipe => (

              <EquipeItem key={equipe.id}>
                <span>{equipe.name}</span>
                <input
                  type="radio"
                  name="equipe"
                  onChange={() => setEquipeSelecionada(equipe.id)}
                />
              </EquipeItem>

            ))}
          </RadioGroup>
        </FormGroup>
      </ModalBody>
    </BaseModal>
  )
}

export default DesligarJogadorModal
