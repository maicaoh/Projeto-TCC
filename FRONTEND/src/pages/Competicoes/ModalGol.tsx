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
  ButtonTable, Th, TableContainer, Table, Td, ActionButtons,
  ContainerAcoes,
} from './ModalGolStyles'
import BaseModal from '../../Components/ModalBase/Modalbase'
import { useForm } from 'react-hook-form'
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
import { GolSchema } from '../../validations/golValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { GolList, useGol } from '../../context/GolContext/GolContext'
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

export const ModalGol: React.FC<ModalEditarCompeticaoProps> = ({
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
  console.log(gols)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(GolSchema),
    defaultValues: {
      id: '',
      equipe: '',
      goleiro: '',
      jogador: '',
      assistente: '',
      periodo: 1,
      tempo: '',
      posicaoGol: null as { x: number; y: number } | null,
      posicaoCampo: null as { x: number; y: number } | null,
    },
  })

  useEffect(() => {
    if (show) {
      listarGols(partida?.id)
    }
  }, [show])

  useEffect(() => {
    if (partida) {
      reset({
        id: '',
        equipe: '',
        goleiro: '',
        jogador: '',
        assistente: '',
        tempo: '',
        periodo: 1,
        posicaoCampo: null,
        posicaoGol: null,
      })
    }
  }, [partida, reset])

  function handleCloseAux() {
    if (editar) {
      setEditar(false)
      reset()
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

    if (!data.posicaoGol) {
      setError('posicaoGol', {
        type: 'manual',
        message: 'Clique no gol para marcar a posição',
      })
      return
    }

    console.log(data)
    const golDataCorrigido = {
      idJogador: data.jogador,
      idDefensor: data.goleiro,
      idEquipe: data.equipe,
      idEquipeDefensor: isEquipeCasa
        ? partida?.equipeVisitante?.id
        : partida?.equipeCasa?.id,
      tempoGol: `00:${data.tempo}`,
      golContra: false,
      periodo: data.periodo,
      posicaoCampo: data.posicaoCampo,
      posicaoGol: data.posicaoGol,
      assistente: data.assistente
        ? { id: data.assistente }
        : undefined,
      partidaId: partida?.id,
    }

    const resultado = editar
      ? await editarGol(getValues('id'), golDataCorrigido)
      : await criarGol(partida?.id!, golDataCorrigido)
    await listarGols(partida?.id)
    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Gol registrado com sucesso!', 'success')
      reset()
      handleClose()
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || resultado.erro || 'Erro inesperado'}`,
        icon: 'error',
      })
      handleClose()
    }
  }

  function handleEditarGol(gol:GolList) {
    console.log(gol)
    setValue('equipe', gol.equipe.id || null)
    setValue('id', gol.id)

    setValue('periodo', gol.periodo)
    setValue('tempo', gol.tempoGol.replace(/^00:/, ''))
    setValue('posicaoCampo', gol.posicaoCampo)
    setValue('posicaoGol', gol.posicaoGol)

    setTimeout(() => {
      setValue('assistente', gol.assistente.id)
      setValue('equipe', gol.equipe.id || null)
      setValue('goleiro', gol.jogadorDefensor.id)
      setValue('jogador', gol.jogador.id)
    }, 500)
    setEditar(true)
  }

  async function deletarGol(gol) {
    await removerGol(gol.id)
    await listarGols(partida?.id)
  }

  const equipeSelecionada = watch('equipe')
  const isEquipeCasa = equipeSelecionada === partida?.equipeCasa?.id

  const jogadoresDaEquipe = isEquipeCasa
    ? partida?.equipeCasa?.jogadores || []
    : partida?.equipeVisitante?.jogadores || []

  const jogadoresDaOutraEquipe = !isEquipeCasa
    ? partida?.equipeCasa?.jogadores || []
    : partida?.equipeVisitante?.jogadores || []

  return (
    <BaseModal
      width="87%"
      show={show}
      handleClose={handleCloseAux}
      title={editar
        ? 'Editar gol'
        : 'Cadastrar gol'}
      onSave={handleSubmit(onSubmit)}
    >
      <ModalBody>
        <Row>
          <FormGroup hasError={!!errors.equipe}>
            <Label>Equipe:</Label>
            <Select
              hasError={!!errors.equipe}
              {...register('equipe', { required: 'Selecione a equipe' })}
            >
              <option value="">Selecione</option>
              <option key={partida?.equipeCasa?.id} value={partida?.equipeCasa?.id}>
                {partida?.equipeCasa?.name}
              </option>
              <option key={partida?.equipeVisitante?.id} value={partida?.equipeVisitante?.id}>
                {partida?.equipeVisitante?.name}
              </option>
            </Select>
            <ErrorMessage visible={!!errors.equipe}>{errors?.equipe?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.jogador}>
            <Label>Jogador:</Label>
            <Select
              hasError={!!errors.jogador}
              disabled={!equipeSelecionada}
              {...register('jogador', { required: 'Selecione o jogador' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.jogador}>{errors?.jogador?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.assistente}>
            <Label>Assistente:</Label>
            <Select
              hasError={!!errors.assistente}
              disabled={!equipeSelecionada}
              {...register('assistente', { required: 'Selecione o jogador' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.assistente}>{errors?.assistente?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.goleiro}>
            <Label>Goleiro (da equipe adversária):</Label>
            <Select
              hasError={!!errors.goleiro}
              disabled={!equipeSelecionada}
              {...register('goleiro', { required: 'Selecione o goleiro' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaOutraEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.goleiro}>{errors?.goleiro?.message || ' '}</ErrorMessage>
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

        </Row>
        <Row>
          <Col>
            <ContainerAcoes style={{ width: '100%' }}>
              <Label>Localização do Gol no Campo:</Label>
              <div
                style={{
                  width: '70%',
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
          <Col>
            <ContainerAcoes style={{ width: '100%' }}>
              <Label>Localização do Gol no Campo:</Label>
              <div
                style={{
                  width: '70%',
                  height: '362px',
                  backgroundImage: `url(${golIMG})`, // você pode usar qualquer imagem de campo
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

                  setValue('posicaoGol', pos)
                  clearErrors('posicaoGol') // <- limpa o erro manualmente
                }}
              >
                {watch('posicaoGol') && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${watch('posicaoGol')?.x}%`,
                      top: `${watch('posicaoGol')?.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'red',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </div>
              <ErrorMessage visible={!!errors.posicaoGol}>{errors?.posicaoGol?.message || ' '}</ErrorMessage>

            </ContainerAcoes>
          </Col>
        </Row>

        <Row>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Tempo</Th>
                  <Th>Jogador</Th>
                  <Th>Assistente</Th>
                  <Th>Goleiro</Th>
                  <Th>Time</Th>
                  <Th>Ações</Th>

                </tr>
              </thead>
              <tbody>
                {gols.map((_, index) => (
                  <tr key={index}>
                    <Td>
                      {`${_.periodo}º ${_.tempoGol?.replace(/^00:/, '')}`}

                    </Td>
                    <Td>{_.jogador.name}</Td>
                    <Td>{_?.assistente?.name}</Td>
                    <Td>{_.jogadorDefensor.name}</Td>
                    <Td>{_?.equipe?.name || '-'}</Td>

                    <Td>
                      <ActionButtons>
                        <ButtonTable
                          title="Deletar"
                          onClick={() => deletarGol(_)}
                        >
                          <FaTrash />
                        </ButtonTable>
                        <ButtonTable
                          onClick={() => handleEditarGol(_)}
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
