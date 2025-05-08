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
  Textarea,
  FormGroupTextArea,
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
import { tipoCartao, tipoFalta } from '../../Enums/enums'
import { CartaoSchema } from '../../validations/CartaoValidation'
import { CartaoList, useCartao } from '../../context/CartaoContext/CartaoContext'
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

export const ModalCartao: React.FC<ModalEditarCompeticaoProps> = ({
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
  const { cartoes, criarCartao, editarCartao, listarCartoes, removerCartao } = useCartao()

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
    resolver: yupResolver(CartaoSchema),
    defaultValues: {
      id: '',
      equipe: '',
      jogador: '',
      periodo: 1,
      tempo: '',
      descricao: '',
      tipo: null,
      arbitro: '',
    },
  })

  useEffect(() => {
    console.log(partida)

    if (show) {
      listarCartoes(partida?.id)
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
        jogador: '',
        periodo: 1,
        tempo: '',
        descricao: '',
        tipo: null,
        arbitro: '',
      })
    }
  }, [partida, reset])

  function handleCloseAux() {
    if (editar) {
      setEditar(false)
      reset({
        id: '',
        equipe: '',
        jogador: '',
        periodo: 1,
        tempo: '',
        tipo: null,
        descricao: '',
        arbitro: '',
      })
    } else {
      handleClose()
    }
  }

  const onSubmit = async (data: any) => {
    console.log(data)
    const CartaoDataCorrigido = {
      jogadorId: data.jogador,
      equipeJogadorId: data.equipe,
      tempo: `00:${data.tempo}`,
      periodo: data.periodo,
      tipo: data?.tipo,
      idArbitro: data?.arbitro,
      partidaId: partida?.id,
      descricao: data?.descricao,
    }

    const resultado = editar
      ? await editarCartao(getValues('id'), CartaoDataCorrigido)
      : await criarCartao(partida?.id!, CartaoDataCorrigido)
    await listarCartoes(partida?.id)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Cartão registrada com sucesso!', 'success')
      setEditar(false)
      reset({
        id: '',
        equipe: '',
        jogador: '',
        periodo: 1,
        tempo: '',
        tipo: null,
        descricao: '',
        arbitro: '',
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
  function handleEditarCartao(cartao: CartaoList) {
    console.log(cartao)
    reset({
      id: cartao.id,
      equipe: cartao?.equipe?.id,
      periodo: cartao.periodo,
      tempo: cartao.tempo.replace(/^00:/, ''),
      tipo: cartao.tipo,
      descricao: cartao.descricao,
      arbitro: cartao.arbitro?.id,
    })
    setTimeout(() => {
      setValue('jogador', cartao.jogador.id)
    }, 500)
    setEditar(true)
  }

  async function deletarCartao(cartao) {
    await removerCartao(cartao.id)
    await listarCartoes(partida?.id)
  }

  const equipeSelecionada = watch('equipe')
  const isEquipeCasa = equipeSelecionada === partida?.equipeCasa?.id

  const jogadoresDaEquipe = isEquipeCasa
    ? partida?.equipeCasa?.jogadores || []
    : partida?.equipeVisitante?.jogadores || []

  const sucessoValue = watch('sucesso')  // já virá como boolean
  console.log(sucessoValue)
  return (
    <BaseModal
      width="68%"
      show={show}
      handleClose={handleCloseAux}
      title={editar
        ? 'Editar cartao'
        : 'Cadastrar cartao'}
      onSave={handleSubmit(onSubmit)}
    >
      <ModalBody>
        <Row>
          <FormGroup hasError={!!errors.equipe}>
            <Label>Equipe Jogador:</Label>
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

          <FormGroup hasError={!!errors.tipo}>
            <Label>Tipo:</Label>
            <Select
              hasError={!!errors.tipo}
              {...register('tipo', { required: 'Selecione o tipo' })}
            >
              <option value="">Selecione</option>
              <option value="0">Amarelo</option>
              <option value="1">Vermelho</option>

            </Select>
            <ErrorMessage visible={!!errors.tipo}>{errors?.tipo?.message || ' '}</ErrorMessage>
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

        </Row>
        <Row>
          <FormGroupTextArea>
            <Label>Motivo:</Label>
            <Textarea {...register('descricao')} hasError={!!errors.descricao} />
            {errors.descricao && <ErrorMessage>{errors.descricao.message}</ErrorMessage>}
          </FormGroupTextArea>

        </Row>
        <Row>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Tempo</Th>
                  <Th>Jogador</Th>
                  <Th>Motivo</Th>
                  <Th>Tipo</Th>
                  <Th>Árbitro</Th>

                  <Th>Ações</Th>

                </tr>
              </thead>
              <tbody>
                {cartoes.map((_, index) => (
                  <tr key={index}>
                    <Td>
                      {`${_?.periodo}º ${_?.tempo?.replace(/^00:/, '')}`}

                    </Td>
                    <Td>{_?.jogador?.name}</Td>
                    <Td>{_?.descricao}</Td>

                    <Td>{tipoCartao(_?.tipo)}</Td>

                    <Td>
                      {_?.arbitro?.name}
                    </Td>

                    <Td>
                      <ActionButtons>
                        <ButtonTable
                          title="Deletar"
                          onClick={() => deletarCartao(_)}
                        >
                          <FaTrash />
                        </ButtonTable>
                        <ButtonTable
                          onClick={() => handleEditarCartao(_)}
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
