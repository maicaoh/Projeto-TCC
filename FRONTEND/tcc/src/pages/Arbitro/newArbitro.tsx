import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import { arbitroSchema } from '../../validations/arbitroValidation'
import {
  Button,
  ButtonContainer,
  Content,
  FormContainer,
  FormGroup,
  Input,
  Label,
  ErrorMessage,
  ImageUploadContainer,
  ImageUpload,
  PreviewImage,
} from './newArbitroStyles'
import Swal from 'sweetalert2'
import {
  Arbitro,
  useArbitro,
} from '../../context/ArbitroContext/ArbitroContext'
import { formatCPF } from '../../utils/masks'

interface FormData {
  id?: string,
  name: string,
  apelido?: string,
  cpf?: string,
  dataNascimento: Date,
  foto?: string,
  email?: string,
  telefone?: string
}

export function NewArbitro() {
  const [foto, setFoto] = useState<string | null>(null)

  const { id } = useParams()
  const {
    adicionarArbitro,
    atualizarArbitro,
    buscarArbitroPorId,
  } = useArbitro()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(arbitroSchema) as any,
  },
  )

  useEffect(() => {
    if (id) {
      buscarArbitroPorId(id).then((data: Arbitro) => {
        if (data) {
          setValue('name', data?.data?.name)
          setValue('apelido', data?.data?.apelido)
          setValue('cpf', formatCPF(data.data.cpf) || '')
          setValue('dataNascimento', new Date(data?.data?.dataNascimento).toLocaleDateString('pt-BR'))
          setValue('email', data?.data?.email)
          setValue('telefone', data?.data?.telefone)
          if (data?.data?.foto) setFoto(data?.data?.foto)
        }
      })
    }
  }, [id, setValue, buscarArbitroPorId])

  const onSubmit = async (data: Arbitro) => {
    console.log(data)
    const formData: Arbitro = {
      name: data?.name,
      telefone: data?.telefone,
      dataNascimento: parseDate(data.dataNascimento),
      apelido: data?.apelido,
      cpf: data?.cpf?.replace(/\D/g, ''),
      email: data?.email,
      foto,
    }

    const resultado = id
      ? await atualizarArbitro(id, formData)
      : await adicionarArbitro(formData)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', id
        ? 'Arbitro atualizado com sucesso!'
        : 'Arbitro adicionado com sucesso!', 'success')
      navigate('/arbitros')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFoto(reader.result as string)
      }
      reader.readAsDataURL(file)
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
          <Label>CPF:</Label>
          <InputMask
            mask="999.999.999-99"
            value={watch('cpf') || ''}
            onChange={(e) => {
              const formattedCPF = formatCPF(e.target.value)
              setValue('cpf', formattedCPF, { shouldValidate: true }) // Atualiza e dispara validação

              if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formattedCPF)) {
                clearErrors('cpf') // Remove erro quando o CPF estiver correto
              } else {
                trigger('cpf') // Força a revalidação caso ainda esteja incorreto
              }
            }}
          >
            {(inputProps) => <Input {...inputProps} hasError={!!errors.cpf} />}
          </InputMask>
          {errors.cpf && <ErrorMessage>{errors.cpf.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Apelido:</Label>
          <Input {...register('apelido')} hasError={!!errors.apelido} />
          {errors.apelido && <ErrorMessage>{errors.apelido.message}</ErrorMessage>}
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
          <Label>Email:</Label>
          <Input type="email" {...register('email')} hasError={!!errors.email} />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Data Nasc:</Label>
          <InputMask mask="99/99/9999" {...register('dataNascimento')}>
            {(inputProps) => <Input {...inputProps} hasError={!!errors.dataNascimento} />}
          </InputMask>
          {errors.dataNascimento && <ErrorMessage>{errors.dataNascimento.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Foto:</Label>
          <ImageUploadContainer>
            <ImageUpload>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <FaUpload />
            </ImageUpload>
            {foto && <PreviewImage src={foto} alt="Prévia da foto" />}
          </ImageUploadContainer>
          {errors.foto && <ErrorMessage>{errors.foto.message}</ErrorMessage>}

        </FormGroup>

        <ButtonContainer>
          <Button type="button" className="cancel" onClick={() => navigate('/arbitros')}>
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
