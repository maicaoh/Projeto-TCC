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
} from './ModalTransferenciaTreinadorStyles'
import { Tecnico } from '../../context/TreinadoresContext/TreinadorContext'
import { Equipe } from '../../context/EquipeContext/EquipeContext'
import BaseModal from '../../Components/ModalBase/Modalbase'

interface DesligarTecnicoModalProps {
  show: boolean;
  handleClose: () => void;
  tecnico: Tecnico | null;
  equipes: Equipe[];
  handleSave: (equipeId: string | null, treinadorId: string | null) => void;
}

const DesligarTecnicoModal: React.FC<DesligarTecnicoModalProps> = ({
  show,
  handleClose,
  tecnico,
  equipes = [],
  handleSave,
}) => {
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (!show) setSearchTerm('')
  }, [show])

  const equipesRelacionadas = tecnico?.equipeTecnico?.map(e => e.equipe)
  const equipesFiltradas = equipesRelacionadas?.filter(e =>
    e.name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  )

  return (
    <BaseModal
      show={show}
      handleClose={handleClose}
      title="Desligar Técnico"
      onSave={() => handleSave(equipeSelecionada, tecnico?.id)}
      disableSave={!equipeSelecionada}
    >
      <FixedSection>
        <h5>{tecnico?.name}</h5>
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

export default DesligarTecnicoModal
