import React, { useEffect } from 'react'
import {
  FormGroup,
  Label,
  ErrorMessage,
  Input,
  ModalBody,
  Select,
} from './ModalEditarCampeonatoStyles'
import BaseModal from '../../Components/ModalBase/Modalbase'
import { useForm } from 'react-hook-form'
import { Partida } from '../../context/PartidaContext/PartidaContext'
import { useQuadra } from '../../context/QuadraContext/QuadraContext'
import InputMask from 'react-input-mask'
import { usePartida } from '../../context/PartidaContext/PartidaContext'
import { useArbitro } from '../../context/ArbitroContext/ArbitroContext'
import Swal from 'sweetalert2'

interface ModalEditarCompeticaoProps {
  show: boolean
  handleClose: () => void
  partida: Partida | null
  handleSave: (partida: Partida | null) => void
}

function formatarDataParaInput(dataISO: string) {
  const data = new Date(dataISO)
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}

function formatarInputParaDate(data: string) {
  const [dia, mes, ano] = data.split('/')
  return new Date(`${ano}-${mes}-${dia}T00:00:00`)
}

export const ModalEditarCompeticao: React.FC<ModalEditarCompeticaoProps> = ({
  show,
  handleClose,
  partida,
}) => {
  const { quadras } = useQuadra()
  const { arbitros } = useArbitro()
  const { atualizarPartida } = usePartida()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{
    quadraId: string
    arbitroIds: string[]
    publicoPresente: number | ''
    data: string
  }>({
    defaultValues: {
      quadraId: partida?.quadra?.id || '',
      arbitroIds: partida?.arbitros?.map(a => a.id) || [],
      publicoPresente:
        partida?.publicoPresente && partida.publicoPresente !== '--'
          ? Number(partida.publicoPresente)
          : '',
      data: partida?.data
        ? formatarDataParaInput(partida.data)
        : '',
    },
  })

  useEffect(() => {
    if (partida) {
      reset({
        quadraId: partida.quadra?.id || '',
        arbitroIds: partida.arbitros?.map(a => a.id) || [],
        publicoPresente:
          partida.publicoPresente && partida.publicoPresente !== '--'
            ? Number(partida.publicoPresente)
            : '',
        data: partida.data
          ? formatarDataParaInput(partida.data)
          : '',
      })
    }
  }, [partida, reset])

  const onSubmit = async (data) => {
    const novaData = formatarInputParaDate(data.data)

    const objPartida = {
      id: partida?.id,
      idQuadra: data.quadraId,
      arbitroIds: data.arbitroIds,
      publicoPresente: Number(data.publicoPresente),
      data: novaData,
    } as any // ou ajuste ao tipo correto

    const resultado = await atualizarPartida(partida?.id, objPartida)
    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Partida atualizada com sucesso!', 'success')
      handleClose()
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${
          resultado.erro?.message || 'Erro inesperado'
        }`,
        icon: 'error',
      })
      handleClose()
    }
  }

  return (
    <BaseModal
      show={show}
      handleClose={handleClose}
      title="Editar Partida"
      onSave={handleSubmit(onSubmit)}
    >
      <ModalBody>
        <FormGroup>
          <Label>Quadra:</Label>
          <Select {...register('quadraId', { required: 'Selecione a quadra' })}>
            <option value="">Selecione</option>
            {quadras.map(q => (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ))}
          </Select>
          {errors.quadraId && <ErrorMessage>{errors.quadraId.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Árbitros:</Label>
          <Select
            multiple
            {...register('arbitroIds')}
            hasError={!!errors.arbitroIds}
          >
            {arbitros.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}{a.apelido
                  ? ` (${a.apelido})`
                  : ''}
              </option>
            ))}
          </Select>
          {errors.arbitroIds && (
            <ErrorMessage>Erro ao selecionar árbitros</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Público Presente:</Label>
          <Input
            min={0}
            type="number"
            {...register('publicoPresente', {
              required: 'Informe o público presente',
              min: { value: 0, message: 'Valor inválido' },
            })}
            hasError={!!errors.publicoPresente}
          />
          {errors.publicoPresente && (
            <ErrorMessage>{errors.publicoPresente.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Data:</Label>
          <InputMask
            mask="99/99/9999"
            {...register('data', { required: 'Informe a data' })}
            value={watch('data')}
            onChange={e => setValue('data', e.target.value)}
          >
            {inputProps => (
              <Input
                {...inputProps}
                hasError={!!errors.data}
                placeholder="dd/mm/aaaa"
              />
            )}
          </InputMask>
          {errors.data && <ErrorMessage>{errors.data.message}</ErrorMessage>}
        </FormGroup>
      </ModalBody>
    </BaseModal>
  )
}
