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
import { FinalizacaoSchema } from '../../validations/finalizacaoValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { GolList, useGol } from '../../context/GolContext/GolContext'
import { FinalizacaoList, useFinalizacao } from '../../context/FinalizacaoContext/FinalizacaoContext'
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

export const ModalFinalizacao: React.FC<ModalEditarCompeticaoProps> = ({
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
    resolver: yupResolver(FinalizacaoSchema),
    defaultValues: {
      id: '',
      equipe: '',
      pe: '',
      bloqueio: false,
      gol: false,
      falta: false,
      penalti: false,
      defesa: false,
      seteMetros: false,
      bloqueador: '',
      jogador: '',
      periodo: 1,
      tempo: '',
      posicaoGol: null as { x: number; y: number } | null,
      posicaoCampo: null as { x: number; y: number } | null,
    },
  })

  useEffect(() => {
    if (show) {
      listarFinalizacoes(partida?.id)
    }
  }, [show])

  useEffect(() => {
    if (partida) {
      reset({
        id: '',
        equipe: '',
        pe: '',
        bloqueio: false,
        gol: false,
        falta: false,
        penalti: false,
        defesa: false,
        seteMetros: false,
        bloqueador: '',
        jogador: '',
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

    console.log(data)
    const FinalizacaoDataCorrigido = {
      idJogador: data.jogador,
      idDefensor: data.bloqueador,
      idEquipe: data.equipe,
      idEquipeDefensor: isEquipeCasa
        ? partida?.equipeVisitante?.id
        : partida?.equipeCasa?.id,
      pe: data?.pe,
      bloqueio: data?.bloqueio,
      gol: data?.gol,
      falta: data?.falta,
      penalti: data?.penalti,
      defesa: data?.defesa,
      seteMetros: data?.seteMetros,
      tempo: `00:${data.tempo}`,
      periodo: data.periodo,
      posicaoCampo: data.posicaoCampo,
      posicaoGol: data.posicaoGol,

      partidaId: partida?.id,
    }

    const resultado = editar
      ? await editarFinalizacao(getValues('id'), FinalizacaoDataCorrigido)
      : await criarFinalizacao(partida?.id!, FinalizacaoDataCorrigido)
    await listarFinalizacoes(partida?.id)

    if (FinalizacaoDataCorrigido.gol) {
      await listarGols(partida?.id)
    }

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Finalização registrado com sucesso!', 'success')
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

  function handleEditarFinalizacao(finalizacao:FinalizacaoList) {
    console.log(finalizacao)
    setValue('equipe', finalizacao.equipe.id || null)
    setValue('id', finalizacao.id)
    setValue('pe', finalizacao.pe)
    setValue('bloqueio', finalizacao.bloqueio)

    setValue('gol', finalizacao.gol)
    setValue('falta', finalizacao.falta)
    setValue('penalti', finalizacao.penalti)
    setValue('defesa', finalizacao.defesa)

    setValue('seteMetros', finalizacao.seteMetros)

    setValue('periodo', finalizacao.periodo)
    setValue('tempo', finalizacao.tempo.replace(/^00:/, ''))
    setValue('posicaoCampo', finalizacao.posicaoCampo)
    setValue('posicaoGol', finalizacao.posicaoGol)

    setTimeout(() => {
      //   setValue('equipe', finalizacao.equipe.id || null)
      setValue('bloqueador', finalizacao.jogadorDefensor.id)
      setValue('jogador', finalizacao.jogadorAtacante.id)
    }, 500)
    setEditar(true)
  }

  async function deletarFinalizacao(finalizacao) {
    await removerFinalizacao(finalizacao.id)
    await listarFinalizacoes(partida?.id)
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
        ? 'Editar finalizacao'
        : 'Cadastrar finalizacao'}
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
            <Label>Finalizador:</Label>
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

          <FormGroup hasError={!!errors.bloqueador}>
            <Label>Bloqueador (da equipe adversária):</Label>
            <Select
              hasError={!!errors.bloqueador}
              disabled={!equipeSelecionada}
              {...register('bloqueador', { required: 'Selecione o bloqueador' })}
            >
              <option value="">Selecione</option>
              {jogadoresDaOutraEquipe.map(jogador => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.name}
                </option>
              ))}
            </Select>
            <ErrorMessage visible={!!errors.bloqueador}>{errors?.bloqueador?.message || ' '}</ErrorMessage>
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

          <FormGroup hasError={!!errors.bloqueio}>

            <Input
              type="checkbox"
              hasError={!!errors.bloqueio}
              {...register('bloqueio')}
            />
            <Label>Bloqueado:</Label>
            <ErrorMessage visible={!!errors.bloqueio}>{errors?.bloqueio?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.gol}>

            <Input
              type="checkbox"
              hasError={!!errors.gol}
              {...register('gol')}
            />
            <Label>Gol:</Label>
            <ErrorMessage visible={!!errors.gol}>{errors?.gol?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.falta}>

            <Input
              type="checkbox"
              hasError={!!errors.falta}
              {...register('falta')}
            />
            <Label>Falta:</Label>
            <ErrorMessage visible={!!errors.falta}>{errors?.falta?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.seteMetros}>

            <Input
              type="checkbox"
              hasError={!!errors.seteMetros}
              {...register('seteMetros')}
            />
            <Label>Sete metros:</Label>
            <ErrorMessage visible={!!errors.seteMetros}>{errors?.seteMetros?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.penalti}>

            <Input
              type="checkbox"
              hasError={!!errors.penalti}
              {...register('penalti')}
            />
            <Label>Pênalti:</Label>
            <ErrorMessage visible={!!errors.penalti}>{errors?.penalti?.message || ' '}</ErrorMessage>
          </FormGroup>

          <FormGroup hasError={!!errors.defesa}>

            <Input
              type="checkbox"
              hasError={!!errors.defesa}
              {...register('defesa')}
            />
            <Label>Defesa:</Label>
            <ErrorMessage visible={!!errors.defesa}>{errors?.defesa?.message || ' '}</ErrorMessage>
          </FormGroup>

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

            </ContainerAcoes>
          </Col>
        </Row>

        <Row>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Tempo</Th>
                  <Th>Finalizador</Th>
                  <Th>Pé</Th>
                  <Th>Gol</Th>
                  <Th>Falta</Th>
                  <Th>penalti</Th>
                  <Th>Defesa</Th>

                  <Th>Sete metros</Th>

                  <Th>bloqueado</Th>
                  <Th>Bloqueador</Th>
                  <Th>Time</Th>
                  <Th>Ações</Th>

                </tr>
              </thead>
              <tbody>
                {finalizacoes.map((_, index) => (
                  <tr key={index}>
                    <Td>
                      {`${_?.periodo}º ${_?.tempo?.replace(/^00:/, '')}`}

                    </Td>
                    <Td>{_?.jogadorAtacante?.name}</Td>
                    <Td>{_?.pe}</Td>
                    <Td>
                      <Input
                        checked={!!_?.gol}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>
                      <Input
                        checked={!!_?.falta}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>
                      <Input
                        checked={!!_?.penalti}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>
                      <Input
                        checked={!!_?.defesa}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>
                      <Input
                        checked={!!_?.seteMetros}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>
                      <Input
                        checked={!!_?.bloqueio}
                        disabled
                        type="checkbox"
                      />

                    </Td>

                    <Td>{_?.jogadorDefensor?.name}</Td>
                    <Td>{_?.equipe?.name || '-'}</Td>

                    <Td>
                      <ActionButtons>
                        <ButtonTable
                          title="Deletar"
                          onClick={() => deletarFinalizacao(_)}
                        >
                          <FaTrash />
                        </ButtonTable>
                        <ButtonTable
                          onClick={() => handleEditarFinalizacao(_)}
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
