import React, { useEffect, useState } from 'react'
import {
  FormGroup,
  Label,
  ErrorMessage,
  Input,
  ModalBody,
  Select,
  Row,
  FormGroupTime,
  InputTime,
  Col,
  FormGroupRadio,
  ButtonTable, Th, TableContainer, Table, Td, ActionButtons,
  ContainerAcoes,
} from './ModalFaltaStyles'
import BaseModal from '../../Components/ModalBase/Modalbase'
import { Controller, useForm } from 'react-hook-form'
import { Partida, PartidaFormatada } from '../../context/PartidaContext/PartidaContext'
import { useQuadra } from '../../context/QuadraContext/QuadraContext'
import InputMask from 'react-input-mask'
import { usePartida } from '../../context/PartidaContext/PartidaContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import quadraIMG from './../../assets/quadra.png'
import golIMG from './../../assets/gol.png'
import { FaTrash } from 'react-icons/fa'
import { FaEdit } from 'react-icons/fa'
import { FinalizacaoSchema } from '../../validations/finalizacaoValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { GolList, useGol } from '../../context/GolContext/GolContext'
import { FinalizacaoList, useFinalizacao } from '../../context/FinalizacaoContext/FinalizacaoContext'
import { DribleList, useDrible } from '../../context/DribleContext/DribleContext'
import { DribleSchema } from '../../validations/dribleValidation'
import { FaltaList, useFalta } from '../../context/FaltaContext/FaltaContext'
import { FaltaSchema } from '../../validations/faltaValidation'
import { tipoFalta } from '../../Enums/enums'
interface ModalEditarCompeticaoProps {
  show: boolean;
  handleClose: () => void;
  partida: PartidaFormatada | null;
  handleSave: (partida: Partida | null) => void;
  quadras: { id: string; name: string }[];
}

function formatarInputParaDate(data: string) {
  const [dia, mes, ano] = data.split('/')
  return new Date(`${ano}-${mes}-${dia}T00:00:00`)
}

export const ModalFalta: React.FC<ModalEditarCompeticaoProps> = ({
  show,
  handleClose,
  handleSave,
  partida,
}) => {
  const [posicaoGol, setPosicaoGol] = useState<{ x: number; y: number } | null>(null)
  const [posicaoCampo, setPosicaoCampo] = useState<{ x: number; y: number } | null>(null)
  const [data, setData] = useState<[]>([])
  const [editar, setEditar] = useState<boolean>(false)

  const { quadras } = useQuadra()

  const { atualizarPartida } = usePartida()
  const navigate = useNavigate()
  const { criarGol, gols, editarGol, removerGol, listarGols } = useGol() // Pega a função do contexto
  const { criarFinalizacao, finalizacoes, editarFinalizacao, removerFinalizacao, listarFinalizacoes } = useFinalizacao() // Pega a função do contexto
  const { criarDrible, dribles, editarDrible, listarDribles, removerDrible } = useDrible()
  const { criarFalta, editarFalta, faltas, listarFaltas, removerFalta } = useFalta()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FaltaSchema),
    defaultValues: {
      id: '',
      equipeAutor: '',
      jogadorAutor: '',
      jogadorSofreu: '',
      equipeSofreu: '',
      periodo: 1,
      tempo: '',
      tipo: null,
      arbitro: '',
      posicaoCampo: null as { x: number; y: number } | null,
    },
  })

  useEffect(() => {
    console.log(partida)

    if (show) {
      listarFaltas(partida?.id)
    }
    if (show && !editar) {
      reset()
      clearErrors()
    }
  }, [show, editar, reset, clearErrors])

  useEffect(() => {
    if (partida) {
      reset({
        id: '',
        equipeAutor: '',
        jogadorAutor: '',
        jogadorSofreu: '',
        equipeSofreu: '',
        periodo: 1,
        tempo: '',
        tipo: null,
        arbitro: '',
        posicaoCampo: null,
      })
    }
  }, [partida, reset])

  function handleCloseAux() {
    if (editar) {
      setEditar(false)
      reset({
        id: '',
        equipeAutor: '',
        jogadorAutor: '',
        jogadorSofreu: '',
        equipeSofreu: '',
        periodo: 1,
        tempo: '',
        tipo: null,
        arbitro: '',
        posicaoCampo: null,
      })
    } else {
      handleClose()
    }
  }

  const onSubmit = async (data: any) => {
    if (!data.posicaoCampo) {
      setError('posicaoCampo', {
        type: 'manual',
        message: 'Clique no campo para marcar a posição',
      })
      return
    }
    alert('oiii')
    console.log(data)
    const FaltaDataCorrigido = {
      jogadorAutorId: data.jogadorAutor,
      jogadorSofreuId: data.jogadorSofreu,
      equipeAutorId: data.equipeAutor,
      equipeSofreuId: isEquipeCasa
        ? partida?.equipeVisitante?.id
        : partida?.equipeCasa?.id,
      tempo: `00:${data.tempo}`,
      periodo: data.periodo,
      posicaoCampo: data.posicaoCampo,
      tipo: data?.tipo,
      idArbitro: data?.arbitro,
      partidaId: partida?.id,
    }

    const resultado = editar
      ? await editarFalta(getValues('id'), FaltaDataCorrigido)
      : await criarFalta(partida?.id!, FaltaDataCorrigido)
    await listarFaltas(partida?.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Falta registrada com sucesso!', 'success')
      setEditar(false)
      reset({
        id: '',
        equipeAutor: '',
        jogadorAutor: '',
        jogadorSofreu: '',
        equipeSofreu: '',
        periodo: 1,
        tempo: '',
        tipo: null,
        arbitro: '',
        posicaoCampo: null,
      })
      setTimeout(() => {
        handleClose()
      }, 500)
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || resultado.erro || 'Erro inesperado'}`,
        icon: 'error',
      })
      handleClose()
    }
  }
  function handleEditarFalta(falta: FaltaList) {
    console.log(falta)
    reset({
      id: falta.id,
      equipeAutor: falta?.equipe?.id,
      periodo: falta.periodo,
      tempo: falta.tempo.replace(/^00:/, ''),
      tipo: falta.tipo,
      arbitro: falta.arbitro?.id,
      posicaoCampo: falta.posicaoCampo,
    })
    setTimeout(() => {
      setValue('jogadorSofreu', falta.jogadorSofreu.id)
      setValue('jogadorAutor', falta.jogadorAutor.id)
    }, 500)
    setEditar(true)
  }

  async function deletarFalta(falta) {
    await removerFalta(falta.id)
    await listarFaltas(partida?.id)
  }

  const equipeSelecionada = watch('equipeAutor')
  const isEquipeCasa = equipeSelecionada === partida?.equipeCasa?.id

  const jogadoresDaEquipe = isEquipeCasa
    ? partida?.equipeCasa?.jogadores || []
    : partida?.equipeVisitante?.jogadores || []

  const jogadoresDaOutraEquipe = !isEquipeCasa
    ? partida?.equipeCasa?.jogadores || []
    : partida?.equipeVisitante?.jogadores || []
  const sucessoValue = watch('sucesso')  // já virá como boolean
  console.log(sucessoValue)
  return (
    <BaseModal
      width="87%"
      show={show}
      handleClose={handleCloseAux}
      title={editar
        ? 'Editar falta'
        : 'Cadastrar falta'}
      onSave={handleSubmit(onSubmit)}
    >
      <ModalBody>
        <Row>
          <FormGroup hasError={!!errors.equipeAutor}>
            <Label>Equipe Autor:</Label>
            <Select
              hasError={!!errors.equipeAutor}
              {...register('equipeAutor', { required: 'Selecione a equipe' })}
            >
              <option value="">Selecione</option>
              <option key={partida?.equipeCasa?.id} value={partida?.equipeCasa?.id}>
                {partida?.equipeCasa?.name}
              </option>
              <option key={partida?.equipeVisitante?.id} value={partida?.equipeVisitante?.id}>
                {partida?.equipeVisitante?.name}
              </option>
            </Select>
            <ErrorMessage visible={!!errors.equipeAutor}>{errors?.equipeAutor?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.jogadorAutor}>
            <Label>Autor da falta:</Label>
            <Select
              hasError={!!errors.jogadorAutor}
              disabled={!equipeSelecionada}
              {...register('jogadorAutor', { required: 'Selecione o jogador' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.jogadorAutor}>{errors?.jogadorAutor?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.jogadorSofreu}>
            <Label>Sofreu falta (da equipe adversária):</Label>
            <Select
              hasError={!!errors.jogadorSofreu}
              disabled={!equipeSelecionada}
              {...register('jogadorSofreu', { required: 'Selecione o jogador' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaOutraEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.jogadorSofreu}>{errors?.jogadorSofreu?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.arbitro}>
            <Label>Árbitro:</Label>
            <Select
              hasError={!!errors.arbitro}
              {...register('arbitro', { required: 'Selecione o árbitro' })}
            >
              <option value="">Selecione</option>
              {partida?.arbitros.map((elemento) => {
                return (
                  <option value={elemento.id}>{elemento.name}</option>

                )
              })}
            </Select>
            <ErrorMessage visible={!!errors.arbitro}>{errors?.arbitro?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroupTime hasError={!!errors.tempo}>
            <Label>Tempo:</Label>
            <InputTime>
              <Select
                hasError={!!errors.tempo}
                {...register('periodo', { required: 'Selecione o período' })}
              >
                <option value="">Período</option>
                <option value={1}>1°</option>
                <option value={2}>2°</option>
              </Select>

              <InputMask
                mask="99:99"
                value={watch('tempo')}
                onChange={e => setValue('tempo', e.target.value, { shouldValidate: true })}
              >
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    hasError={!!errors.tempo}
                    placeholder="mm:ss"
                  />
                )}
              </InputMask>

            </InputTime>
            <ErrorMessage visible={!!errors.tempo}>{errors?.tempo?.message || ' '}</ErrorMessage>
          </FormGroupTime>

          <FormGroup hasError={!!errors.tipo}>
            <Label>Tipo:</Label>
            <Select
              hasError={!!errors.tipo}
              {...register('tipo', { required: 'Selecione o tipo' })}
            >
              <option value="">Selecione</option>
              <option value="0">Falta</option>
              <option value="1">Penalti</option>
              <option value="2">Tiro livre indireto</option>

            </Select>
            <ErrorMessage visible={!!errors.tipo}>{errors?.tipo?.message || ' '}</ErrorMessage>
          </FormGroup>

        </Row>

        <Row>
          <Col>
            <ContainerAcoes style={{ width: '100%' }}>
              <Label>Localização do Gol no Campo:</Label>
              <div
                style={{
                  width: '35%',
                  height: '362px',
                  backgroundImage: `url(${quadraIMG})`, // você pode usar qualquer imagem de campo
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid #ccc',
                  position: 'relative',
                  cursor: 'crosshair',
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  const pos = { x, y }

                  setValue('posicaoCampo', pos)
                  clearErrors('posicaoCampo') // <- limpa o erro manualmente
                }}
              >
                {watch('posicaoCampo') && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${getValues('posicaoCampo')?.x}%`,
                      top: `${getValues('posicaoCampo')?.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'red',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </div>
              <ErrorMessage visible={!!errors.posicaoCampo}>{errors?.posicaoCampo?.message || ' '}</ErrorMessage>

            </ContainerAcoes>
          </Col>

        </Row>

        <Row>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Tempo</Th>
                  <Th>Autor da falta</Th>
                  <Th>Sofreu falta</Th>
                  <Th>Árbitro</Th>
                  <Th>Tipo</Th>

                  <Th>Ações</Th>

                </tr>
              </thead>
              <tbody>
                {faltas.map((_, index) => (
                  <tr key={index}>
                    <Td>
                      {`${_?.periodo}º ${_?.tempo?.replace(/^00:/, '')}`}

                    </Td>
                    <Td>{_?.jogadorAutor?.name}</Td>
                    <Td>{_?.jogadorSofreu?.name}</Td>

                    <Td>{_?.arbitro?.name}</Td>

                    <Td>
                      {tipoFalta(_?.tipo)}
                    </Td>

                    <Td>
                      <ActionButtons>
                        <ButtonTable
                          title="Deletar"
                          onClick={() => deletarFalta(_)}
                        >
                          <FaTrash />
                        </ButtonTable>
                        <ButtonTable
                          onClick={() => handleEditarFalta(_)}
                          title="Editar"
                        >
                          <FaEdit />
                        </ButtonTable>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Row>

      </ModalBody>
    </BaseModal>
  )
}
