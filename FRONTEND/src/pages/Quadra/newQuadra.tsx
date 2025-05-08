import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaSave, FaTimes } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import { quadraSchema } from '../../validations/quadraValidation'
import {
  Button,
  ButtonContainer,
  Content,
  FormContainer,
  FormGroup,
  Input,
  Label,
  ErrorMessage,
  Select,
} from './newQuadraStyles'
import Swal from 'sweetalert2'
import { Quadra, useQuadra } from '../../context/QuadraContext/QuadraContext'
interface FormData {
  name: string;
  cpf: string;
  telefone: string;
  apelido: string;
  peDominante: number,
  altura: number;
  dataNasc: string;
  foto: string;
  posicao: number;
  cidadeNatal: string;
}

export function NewQuadra() {
  const { id } = useParams()
  const {
    adicionarQuadra,
    atualizarQuadra,
    buscarQuadraPorId,
  } = useQuadra()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(quadraSchema) as any,
  },
  )

  useEffect(() => {
    if (id) {
      buscarQuadraPorId(id).then((data: Quadra) => {
        if (data) {
          setValue('name', data?.data?.name)
          setValue('comprimento', parseFloat(data?.data?.comprimento))
          setValue('largura', parseFloat(data.data.largura))
          setValue('endereco', data?.data?.endereco)
          setValue('telefone', data?.data?.telefone)
          setValue('piso', data?.data?.piso)
          setValue('responsavel', data?.data?.responsavel)
        }
      })
    }
  }, [id, setValue, buscarQuadraPorId])

  const onSubmit = async (data: Quadra) => {
    console.log(data)
    const formData: Quadra = {
      name: data.name,
      comprimento: data.comprimento,
      largura: data?.largura,
      endereco: data?.endereco,
      telefone: data?.telefone,
      piso: data?.piso,
      responsavel: data?.responsavel,
    }

    const resultado = id
      ? await atualizarQuadra(id, formData)
      : await adicionarQuadra(formData)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', id
        ? 'Quadra atualizado com sucesso!'
        : 'Quadra adicionado com sucesso!', 'success')
      navigate('/quadras')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  return (
    <Content>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Nome:</Label>
          <Input {...register('name')} hasError={!!errors.name} />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Endereco:</Label>
          <Input {...register('endereco')} hasError={!!errors.endereco} />
          {errors.endereco && <ErrorMessage>{errors.endereco.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Telefone:</Label>
          <InputMask
            mask="(99) 99999-9999"
            value={watch('telefone') || ''}
            onChange={(e) => setValue('telefone', e.target.value)}
          >
            {(inputProps) => <Input {...inputProps} hasError={!!errors.telefone} />}
          </InputMask>
          {errors.telefone && <ErrorMessage>{errors.telefone.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Responsavel:</Label>
          <Input {...register('responsavel')} hasError={!!errors.responsavel} />
          {errors.responsavel && <ErrorMessage>{errors.responsavel.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Comprimento (metros):</Label>
          <InputMask
            mask="99.99"
            maskChar={null}
            value={watch('comprimento') || ''}
            onChange={(e) => {
              const rawValue = e.target.value.replace(',', '.')
              setValue('comprimento', rawValue, { shouldValidate: true })
            }}
          >
            {(inputProps) => <Input {...inputProps} hasError={!!errors.comprimento} />}
          </InputMask>
          {errors.comprimento && <ErrorMessage>{errors.comprimento.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Largura (metros):</Label>
          <InputMask
            mask="99.99"
            maskChar={null}
            value={watch('largura') || ''}
            onChange={(e) => {
              const rawValue = e.target.value.replace(',', '.')
              setValue('largura', rawValue, { shouldValidate: true })
            }}
          >
            {(inputProps) => <Input {...inputProps} hasError={!!errors.largura} />}
          </InputMask>
          {errors.largura && <ErrorMessage>{errors.largura.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Tipo de Piso:</Label>
          <Select {...register('piso')} hasError={!!errors.piso}>
            <option value="">Selecione o piso</option>
            <option value="2">Borracha</option>
            <option value="1">Cimento</option>
            <option value="0">Cimento</option>
          </Select>
          {errors.piso && <ErrorMessage>{errors.piso.message}</ErrorMessage>}
        </FormGroup>

        <ButtonContainer>
          <Button type="button" className="cancel" onClick={() => navigate('/quadras')}>
            <FaTimes /> Cancelar
          </Button>
          <Button type="submit" className="save">
            <FaSave /> {id
              ? 'Atualizar'
              : 'Cadastrar'}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </Content>
  )
}
