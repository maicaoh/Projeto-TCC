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

export const ModalDrible: React.FC<ModalEditarCompeticaoProps> = ({
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
    resolver: yupResolver(DribleSchema),
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
      listarDribles(partida?.id)
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
        equipe: '',
        pe: '',
        sucesso: true,
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
        sucesso: true,
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
    const DribleDataCorrigido = {
      idJogador: data.jogador,
      idDefensor: data.defensor,
      idEquipe: data.equipe,
      idEquipeDefensor: isEquipeCasa
        ? partida?.equipeVisitante?.id
        : partida?.equipeCasa?.id,
      pe: data?.pe,
      sucesso: data?.sucesso,
      tempo: `00:${data.tempo}`,
      periodo: data.periodo,
      posicaoCampo: data.posicaoCampo,

      partidaId: partida?.id,
    }

    const resultado = editar
      ? await editarDrible(getValues('id'), DribleDataCorrigido)
      : await criarDrible(partida?.id!, DribleDataCorrigido)
    await listarDribles(partida?.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Drible registrado com sucesso!', 'success')
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
  function handleEditarDrible(drible: DribleList) {
    alert('aaaaaaaaaaaa')
    reset({
      id: drible.id,
      equipe: drible.equipe.id,
      pe: drible.pe,
      sucesso: drible.sucesso,
      periodo: drible.periodo,
      tempo: drible.tempo.replace(/^00:/, ''),
      posicaoCampo: drible.posicaoCampo,
    })
    setTimeout(() => {
      setValue('defensor', drible.jogadorDefensor.id)
      setValue('jogador', drible.jogadorAtacante.id)
    }, 500)
    setEditar(true)
  }

  async function deletarDrible(drible) {
    await removerDrible(drible.id)
    await listarDribles(partida?.id)
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
        ? 'Editar drible'
        : 'Cadastrar drible'}
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
            <Label>Autor do drible:</Label>
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

          <FormGroup hasError={!!errors.defensor}>
            <Label>Desfensor (da equipe adversária):</Label>
            <Select
              hasError={!!errors.defensor}
              disabled={!equipeSelecionada}
              {...register('defensor', { required: 'Selecione o defensor' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaOutraEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.defensor}>{errors?.defensor?.message || ' '}</ErrorMessage>
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

          <Controller
            name="sucesso"
            control={control}    // ← passe o control aqui
            defaultValue
            rules={{ required: 'Selecione Sucesso ou Desarme' }}
            render={({ field }) => (
              <FormGroupRadio hasError={!!errors.sucesso}>
                <div>
                  <Input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                  />
                  <Label>Sucesso</Label>
                </div>
                <div>
                  <Input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                  />
                  <Label>Desarme</Label>
                </div>
                <ErrorMessage visible={!!errors.sucesso}>
                  {errors.sucesso?.message}
                </ErrorMessage>
              </FormGroupRadio>
            )}
          />
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
                  <Th>Autor do drible</Th>
                  <Th>Jogador adversário</Th>
                  <Th>Pé</Th>
                  <Th>sucesso</Th>
                  <Th>Desarme</Th>

                  <Th>Ações</Th>

                </tr>
              </thead>
              <tbody>
                {dribles.map((_, index) => (
                  <tr key={index}>
                    <Td>
                      {`${_?.periodo}º ${_?.tempo?.replace(/^00:/, '')}`}

                    </Td>
                    <Td>{_?.jogadorAtacante?.name}</Td>
                    <Td>{_?.jogadorDefensor?.name}</Td>

                    <Td>{_?.pe}</Td>

                    <Td>
                      <Input
                        checked={_?.sucesso}
                        disabled
                        type="checkbox"
                      />

                    </Td>
                    <Td>
                      <Input
                        checked={!_?.sucesso}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>
                      <ActionButtons>
                        <ButtonTable
                          title="Deletar"
                          onClick={() => deletarDrible(_)}
                        >
                          <FaTrash />
                        </ButtonTable>
                        <ButtonTable
                          onClick={() => handleEditarDrible(_)}
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
