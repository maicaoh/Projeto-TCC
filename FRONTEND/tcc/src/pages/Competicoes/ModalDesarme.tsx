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
} from './ModalDribleStyles'
import BaseModal from '../../Components/ModalBase/Modalbase'
import { Controller, useForm } from 'react-hook-form'
import { Partida, PartidaFormatada } from '../../context/PartidaContext/PartidaContext'
import { useQuadra } from '../../context/QuadraContext/QuadraContext'
import InputMask from 'react-input-mask'
import { DesarmeList, useDesarme } from '../../context/DesarmeContext/DesarmeContext'

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
import { DesarmeSchema } from '../../validations/desarmeValidation'

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

export const ModalDesarme: React.FC<ModalEditarCompeticaoProps> = ({
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
  const { criarDesarme, desarmes, editarDesarme, listarDesarmes, removerDesarme } = useDesarme()
  const navigate = useNavigate()
  const { criarGol, gols, editarGol, removerGol, listarGols } = useGol() // Pega a função do contexto
  const { criarFinalizacao, finalizacoes, editarFinalizacao, removerFinalizacao, listarFinalizacoes } = useFinalizacao() // Pega a função do contexto
  const { criarDrible, dribles, editarDrible, listarDribles, removerDrible } = useDrible()
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
    resolver: yupResolver(DesarmeSchema),
    defaultValues: {
      id: '',
      equipe: '',
      pe: '',
      sucesso: true,
      jogador: '',
      defensor: '',
      equipeDefensor: '',
      periodo: 1,
      tempo: '',
      posicaoCampo: null as { x: number; y: number } | null,
    },
  })

  useEffect(() => {
    if (show) {
      listarDesarmes(partida?.id)
    }
  }, [show])

  useEffect(() => {
    if (partida) {
      reset({
        id: '',
        equipe: '',
        pe: '',
        sucesso: false,
        jogador: '',
        defensor: '',
        equipeDefensor: '',
        periodo: 1,
        tempo: '',
        posicaoCampo: null,
      })
    }
  }, [partida, reset])

  function handleCloseAux() {
    if (editar) {
      setEditar(false)
      reset({
        id: '',
        equipe: '',
        pe: '',
        sucesso: false,
        jogador: '',
        defensor: '',
        equipeDefensor: '',
        periodo: 1,
        tempo: '',
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

    console.log(data)
    const DesarmeDataCorrigido = {
      idJogador: data.jogador,
      idDefensor: data.defensor,
      idEquipe: isEquipeCasa
        ? partida?.equipeVisitante?.id
        : partida?.equipeCasa?.id,
      idEquipeDefensor: data.equipe,
      pe: data?.pe,
      sucesso: data?.sucesso,
      tempo: `00:${data.tempo}`,
      periodo: data.periodo,
      posicaoCampo: data.posicaoCampo,

      partidaId: partida?.id,
    }

    const resultado = editar
      ? await editarDesarme(getValues('id'), DesarmeDataCorrigido)
      : await criarDesarme(partida?.id!, DesarmeDataCorrigido)
    await listarDesarmes(partida?.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Desarme registrado com sucesso!', 'success')
      reset({
        id: '',
        equipe: '',
        pe: '',
        sucesso: false,
        jogador: '',
        defensor: '',
        equipeDefensor: '',
        periodo: 1,
        tempo: '',
        posicaoCampo: null,
      })
      setEditar(false)
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
  function handleEditarDesarme(desarme: DesarmeList) {
    reset({
      id: desarme.id,
      equipe: desarme?.equipe?.id,
      pe: desarme.pe,
      sucesso: desarme.sucesso,
      periodo: desarme.periodo,
      tempo: desarme.tempo.replace(/^00:/, ''),
      posicaoCampo: desarme?.posicaoCampo,
    })
    setTimeout(() => {
      setValue('defensor', desarme.jogadorDesarme.id)
      setValue('jogador', desarme.jogadorDesarmado.id)
    }, 500)
    setEditar(true)
  }

  async function deletarDesarme(desarme) {
    await removerDesarme(desarme.id)
    await listarDesarmes(partida?.id)
  }

  const equipeSelecionada = watch('equipe')
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
        ? 'Editar desarme'
        : 'Cadastrar desarme'}
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

          <FormGroup hasError={!!errors.defensor}>
            <Label>Autor do desarme:</Label>
            <Select
              hasError={!!errors.defensor}
              disabled={!equipeSelecionada}
              {...register('defensor', { required: 'Selecione o jogador' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.defensor}>{errors?.defensor?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.jogador}>
            <Label>Desarmado (da equipe adversária):</Label>
            <Select
              hasError={!!errors.jogador}
              disabled={!equipeSelecionada}
              {...register('jogador', { required: 'Selecione o defensor' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaOutraEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.jogador}>{errors?.jogador?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.jogador}>
            <Label>Pé:</Label>
            <Select
              hasError={!!errors.pe}
              {...register('pe', { required: 'Selecione o pé' })}
            >
              <option value="">Selecione</option>
              <option value="D">Direito</option>
              <option value="E">Esquerdo</option>

            </Select>
            <ErrorMessage visible={!!errors.pe}>{errors?.pe?.message || ' '}</ErrorMessage>
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

          <FormGroup hasError={!!errors.sucesso}>

            <Input
              type="checkbox"
              hasError={!!errors.sucesso}
              {...register('sucesso')}
            />
            <Label>Sucesso:</Label>
            <ErrorMessage visible={!!errors.sucesso}>{errors?.sucesso?.message || ' '}</ErrorMessage>
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
                  <Th>Desarmador</Th>
                  <Th>Jogador adversário</Th>
                  <Th>Pé</Th>
                  <Th>sucesso</Th>

                  <Th>Ações</Th>

                </tr>
              </thead>
              <tbody>
                {desarmes.map((_, index) => (
                  <tr key={index}>
                    <Td>
                      {`${_?.periodo}º ${_?.tempo?.replace(/^00:/, '')}`}

                    </Td>
                    <Td>{_?.jogadorDesarme?.name}</Td>
                    <Td>{_?.jogadorDesarmado?.name}</Td>

                    <Td>{_?.pe}</Td>

                    <Td>
                      <Input
                        checked={_?.sucesso}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>
                      <ActionButtons>
                        <ButtonTable
                          title="Deletar"
                          onClick={() => deletarDesarme(_)}
                        >
                          <FaTrash />
                        </ButtonTable>
                        <ButtonTable
                          onClick={() => handleEditarDesarme(_)}
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
