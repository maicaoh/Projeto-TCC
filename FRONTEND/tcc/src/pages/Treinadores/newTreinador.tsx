import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaUpload, FaSave, FaTimes } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import { treinadorSchema } from '../../validations/treinadorValidation'
import { useTreinador } from '../../context/TreinadoresContext/TreinadorContext'
import {
  Button,
  ButtonContainer,
  Content,
  FormContainer,
  FormGroup,
  ImageUpload,
  Input,
  Label,
  ErrorMessage,
  ImageUploadContainer,
  PreviewImage,
} from './newTreinadorStyles'
import { Tecnico } from '../../context/TreinadoresContext/TreinadorContext'
import Swal from 'sweetalert2'
import { formatCPF } from '../../utils/masks'
interface FormData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  apelido: string;
  dataNasc: string;
  foto?: string;
}

export function NewTreinador() {
  const { id } = useParams()
  const [foto, setFoto] = useState<string | null>(null)
  const { adicionarTreinador, atualizarTreinador, buscarTreinadorPorId } = useTreinador()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(treinadorSchema) as any,
  })

  useEffect(() => {
    if (id) {
      buscarTreinadorPorId(id).then((data: Tecnico) => {
        if (data) {
          setValue('nome', data?.data?.name)
          setValue('email', data?.data?.email || '')
          setValue('cpf', formatCPF(data?.data?.cpf) || '')
          setValue('telefone', data?.data?.telefone || '')
          setValue('apelido', data?.data?.apelido || '')
          setValue('dataNasc', new Date(data?.data?.dataNascimento).toLocaleDateString('pt-BR'))
          if (data?.data?.foto) setFoto(data?.data?.foto)
        }
      })
    }
  }, [id, setValue, buscarTreinadorPorId])

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const onSubmit = async (data: FormData) => {
    const formData: Tecnico = {
      createAt: id
        ? undefined
        : new Date(),
      updateAt: new Date(),
      name: data.nome,
      apelido: data.apelido,
      cpf: data.cpf.replace(/\D/g, ''),
      dataNascimento: parseDate(data.dataNasc),
      foto: foto || null,
      email: data.email,
      telefone: data.telefone,
    }

    const resultado = id
      ? await atualizarTreinador(id, formData)
      : await adicionarTreinador(formData)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', id
        ? 'Treinador atualizado com sucesso!'
        : 'Treinador adicionado com sucesso!', 'success')
      navigate('/tecnicos')
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
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
          <Input {...register('nome')} hasError={!!errors.nome} />
          {errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Email:</Label>
          <Input type="email" {...register('email')} hasError={!!errors.email} />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>CPF:</Label>
          <InputMask
            mask="999.999.999-99"
            value={watch('cpf') || ''}
            onChange={(e) => setValue('cpf', formatCPF(e.target.value))}
          >
            {(inputProps) => <Input {...inputProps} hasError={!!errors.cpf} />}
          </InputMask>
          {errors.cpf && <ErrorMessage>{errors.cpf.message}</ErrorMessage>}
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
          <Label>Apelido:</Label>
          <Input {...register('apelido')} hasError={!!errors.apelido} />
          {errors.apelido && <ErrorMessage>{errors.apelido.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Data Nasc:</Label>
          <InputMask mask="99/99/9999" {...register('dataNasc')}>
            {(inputProps) => <Input {...inputProps} hasError={!!errors.dataNasc} />}
          </InputMask>
          {errors.dataNasc && <ErrorMessage>{errors.dataNasc.message}</ErrorMessage>}
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
          <Button type="button" className="cancel" onClick={() => navigate('/tecnicos')}>
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
