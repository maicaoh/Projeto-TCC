import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import BaseModal from '../../Components/ModalBase/Modalbase'
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

interface TransferirTecnicoModalProps {
  show: boolean;
  handleClose: () => void;
  tecnico: Tecnico | null;
  equipes: Equipe[];
  handleSave: (equipeId: string | null, treinadorId: string | null) => void;
}

const TransferirTecnicoModal: React.FC<TransferirTecnicoModalProps> = ({
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

  const equipesRelacionadas = tecnico?.equipeTecnico?.map(e => e.equipeId)
  const equipesFiltradas = equipes.filter(e =>
    e.name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  )

  return (
    <BaseModal
      show={show}
      handleClose={handleClose}
      title="Transferir Técnico"
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
            {equipesFiltradas.filter(equipe => !equipesRelacionadas?.includes(equipe.id)).length > 0
              ? (
                  equipesFiltradas.map(equipe =>
                    !equipesRelacionadas?.includes(equipe.id) && (
                      <EquipeItem key={equipe.id}>
                        <span>{equipe.name}</span>
                        <input
                          type="radio"
                          name="equipe"
                          onChange={() => setEquipeSelecionada(equipe.id)}
                        />
                      </EquipeItem>
                    ),
                  )
                )
              : (
                <p>Nenhuma equipe disponível para seleção.</p>
                )}
          </RadioGroup>
        </FormGroup>
      </ModalBody>
    </BaseModal>
  )
}

export default TransferirTecnicoModal
