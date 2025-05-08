import React, { useState, useEffect } from 'react'
import {
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Button,
  FixedSection,
  Select,
  Input,
  TableContainer,
  Table,
  Th,
  Td,
  TdInput,
  TdButton,
  ActionButton,
} from './ModalGerenciaEquipeStyles'
import { FiUserMinus, FiRotateCcw } from 'react-icons/fi'
import { gerenciarEquipeType } from '../../context/EquipeContext/EquipeProvider'

interface Jogador {
  id: string
  name: string
  dorsal: number
}

interface GerenciarEquipeModalProps {
  show: boolean
  handleClose: () => void
  equipeNome: string
  jogadores: Jogador[]
  capitaoId: string
  setCapitao: (id: string) => void
  handleSalvar: (payload: gerenciarEquipeType) => void
}

const GerenciarEquipeModal: React.FC<GerenciarEquipeModalProps> = ({
  show,
  handleClose,
  equipeNome,
  jogadores,
  capitaoId,
  setCapitao,
  handleSalvar,
}) => {
  const [desligados, setDesligados] = useState<Set<string>>(new Set())
  const [dorsaisEditadas, setDorsaisEditadas] = useState<Map<string, number>>(new Map())

  // Carregar dorsais iniciais quando o modal abre
  useEffect(() => {
    console.log(jogadores)
    const mapaInicial = new Map()
    jogadores.forEach(j => {
      if (j.dorsal && j.dorsal > 0) {
        mapaInicial.set(j.id, j.dorsal)
      }
    })
    setDorsaisEditadas(mapaInicial)
    setDesligados(new Set())
  }, [jogadores, show])

  if (!show) return null

  const toggleDesligar = (id: string) => {
    const updated = new Set(desligados)
    updated.has(id)
      ? updated.delete(id)
      : updated.add(id)
    setDesligados(updated)
  }

  const handleChangeDorsal = (id: string, value: string) => {
    const dorsal = parseInt(value, 10)
    if (!isNaN(dorsal) && dorsal >= 1 && dorsal <= 100) {
      const updated = new Map(dorsaisEditadas)
      updated.set(id, dorsal)
      setDorsaisEditadas(updated)
    }
  }

  const onSalvar = () => {
    const payload = {
      desligados: Array.from(desligados),
      dorsaisEditadas: Array.from(dorsaisEditadas.entries()).map(([id, dorsal]) => ({ id, dorsal })),
      capitaoId,
    }
    handleSalvar(payload)
  }

  return (
    <ModalContainer>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Gerenciar Equipe</ModalTitle>
          <CloseButton onClick={handleClose}>✖</CloseButton>
        </ModalHeader>

        <FixedSection>
          <h5>{equipeNome}</h5>
          <Label>Capitão:</Label>
          <Select value={capitaoId || ''} onChange={(e) => setCapitao(e.target.value)}>
            <option value="">Selecione o capitão</option>
            {jogadores.map((jogador) => (
              <option key={jogador.id} value={jogador.id}>
                {jogador.name}
              </option>
            ))}
          </Select>
        </FixedSection>

        <ModalBody>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>Dorsal</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {jogadores.map((jogador) => (
                  <tr key={jogador.id}>
                    <Td>{jogador.name}</Td>

                    <TdInput>
                      <FormGroup>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={dorsaisEditadas.get(jogador.id) ?? ''}
                          onChange={(e) => handleChangeDorsal(jogador.id, e.target.value)}
                          disabled={desligados.has(jogador.id)}
                        />
                      </FormGroup>
                    </TdInput>

                    <TdButton>
                      <ActionButton className="cancel" onClick={() => toggleDesligar(jogador.id)}>
                        {desligados.has(jogador.id)
                          ? (
                            <>
                              <FiRotateCcw />
                              Desfazer
                            </>
                            )
                          : (
                            <>
                              <FiUserMinus />
                              Desligar
                            </>
                            )}
                      </ActionButton>
                    </TdButton>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter>
          <Button className="cancel" onClick={handleClose}>
            Cancelar
          </Button>
          <Button className="save" onClick={onSalvar}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalContainer>
  )
}

export default GerenciarEquipeModal
