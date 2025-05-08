import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaUpload, FaSave, FaTimes } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import { jogadorSchema } from '../../validations/jogadorValidation'
import { useJogador, Jogador } from '../../context/JogadorContext/JogadorContext'
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
  Select,
} from './newJogadorStyles'
import Swal from 'sweetalert2'
import { formatCPF } from '../../utils/masks'
interface FormData {
  nome: string;
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

export function NewJogador() {
  const { id } = useParams()
  const [foto, setFoto] = useState<string | null>(null)
  const {
    adicionarJogador,
    atualizarJogador,
    buscarJogadorPorId,
  } = useJogador()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(jogadorSchema) as any,
  },
  )

  useEffect(() => {
    if (id) {
      buscarJogadorPorId(id).then((data: Jogador) => {
        if (data) {
          setValue('nome', data?.data?.name)
          setValue('cpf', formatCPF(data?.data?.cpf) || '')
          setValue('telefone', data?.data?.telefone || '')
          setValue('apelido', data?.data?.apelido || '')
          setValue('altura', parseFloat(data.data.altura) || 0)
          setValue('peDominante', data.data.peDominante)
          setValue('posicao', data.data.posicao)
          setValue('cidadeNatal', data.data.cidadeNatal)
          setValue('dataNasc', new Date(data?.data?.dataNascimento).toLocaleDateString('pt-BR'))
          if (data?.data?.foto) setFoto(data?.data?.foto)
        }
      })
    }
  }, [id, setValue, buscarJogadorPorId])

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const onSubmit = async (data: FormData) => {
    console.log(data)
    const formData: Jogador = {
      name: data.nome,
      apelido: data.apelido,
      cpf: data?.cpf?.replace(/\D/g, ''),
      dataNascimento: parseDate(data.dataNasc),
      foto,
      peDominante: Number(data.peDominante),
      posicao: Number(data.posicao),
      altura: data.altura,
      cidadeNatal: data.cidadeNatal,
      telefone: data.telefone,
    }

    const resultado = id
      ? await atualizarJogador(id, formData)
      : await adicionarJogador(formData)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', id
        ? 'Jogador atualizado com sucesso!'
        : 'Jogador adicionado com sucesso!', 'success')
      navigate('/jogadores')
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
          <Label>CPF:</Label>
          <InputMask
            mask="999.999.999-99"
            value={watch('cpf') || ''}
            onChange={(e) => setValue('cpf', e.target.value)}
          >
            {(inputProps) => <Input {...inputProps} hasError={!!errors.cpf} />}
          </InputMask>
          {errors.cpf && <ErrorMessage>{errors.cpf.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Posição:</Label>
          <Select {...register('posicao')} hasError={!!errors.posicao}>
            <option value="">Selecione a posição</option>
            <option value="2">Ala</option>
            <option value="1">Fixo</option>
            <option value="0">Goleito</option>
            <option value="3">Pivo</option>
            <option value="4">Universal</option>
          </Select>
          {errors.posicao && <ErrorMessage>{errors.posicao.message}</ErrorMessage>}
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
          <Label>Altura (metros):</Label>
          <InputMask
            mask="9.99"
            maskChar={null}
            value={watch('altura') || ''}
            onChange={(e) => {
              const rawValue = e.target.value.replace(',', '.')
              const numericValue = rawValue
                ? parseFloat(rawValue)
                : undefined
              setValue('altura', numericValue as number, { shouldValidate: true })
            }}
          >
            {(inputProps) => <Input {...inputProps} hasError={!!errors.altura} />}
          </InputMask>
          {errors.altura && <ErrorMessage>{errors.altura.message}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label>Data Nasc:</Label>
          <InputMask mask="99/99/9999" {...register('dataNasc')}>
            {(inputProps) => <Input {...inputProps} hasError={!!errors.dataNasc} />}
          </InputMask>
          {errors.dataNasc && <ErrorMessage>{errors.dataNasc.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Cidade natal:</Label>
          <Input {...register('cidadeNatal')} hasError={!!errors.cidadeNatal} />
          {errors.cidadeNatal && <ErrorMessage>{errors.cidadeNatal.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Pé dominante:</Label>
          <Select {...register('peDominante')} hasError={!!errors.peDominante}>
            <option value="">Selecione o pé dominante</option>
            <option value="1">D</option>
            <option value="0">E</option>
          </Select>
          {errors.peDominante && <ErrorMessage>{errors.peDominante.message}</ErrorMessage>}
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
        </FormGroup>
        <ButtonContainer>
          <Button type="button" className="cancel" onClick={() => navigate('/jogadores')}>
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
