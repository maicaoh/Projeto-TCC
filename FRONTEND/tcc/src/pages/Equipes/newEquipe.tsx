import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaUpload, FaSave, FaTimes } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import { equipeSchema } from '../../validations/equipeValidation'
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
  FormWrapper,
  PlayerListContainer,
  PlayerListHeader,
  FormSide,
  PlayerList,
  PlayerItem,
} from './newEquipeStyles'
import Swal from 'sweetalert2'
import { formatCPF } from '../../utils/masks'
import { Equipe, useEquipe } from '../../context/EquipeContext/EquipeContext'
interface FormData {
  id?: string;
  name: string
  responsavel: string,
  telefone?: string
  endereco?: string
  logo: string;
}

export function NewEquipe() {
  const { id } = useParams()
  const [logo, setLogo] = useState<string | null>(null)
  const [nameSearch, setNameSearch] = useState<string>('')
  const [jogadoresDisponiveis, setJogadoresDisponiveis] = useState<Jogador[]>([])
  const [idJogadoresSelecionados, setIdJogadoresSelecionados] = useState<string[]>([])
  const [prevSelecionados, setPrevSelecionados] = useState<string[]>([])

  const {
    adicionarEquipe,
    atualizarEquipe,
    buscarEquipePorId,
  } = useEquipe()

  const { jogadores, buscarJogadorDisponiveis } = useJogador()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(equipeSchema) as any,
  },
  )

  useEffect(() => {
    buscarJogadorDisponiveis().then((data:Jogador[]) => {
      // console.log(data)
      //    setJogadoresDisponiveis([...jogadoresDisponiveis, ...data?.data])
      return data?.data
    }).then((jogadores) => {
      if (id) {
        buscarEquipePorId(id).then((data: Equipe) => {
          if (data) {
            setValue('name', data?.data?.name)
            setValue('responsavel', data?.data?.responsavel)
            setValue('telefone', data?.data?.telefone)
            setValue('endereco', data?.data?.endereco)
            console.log(jogadoresDisponiveis)
            if (data?.data?.equipeJogador?.length > 0) {
              setJogadoresDisponiveis([...jogadores, ...data?.data?.equipeJogador?.map(elemento => elemento?.jogador)])
              //   setIdJogadoresSelecionados(data?.data?.equipeJogador?.map(elemento => elemento?.jogadorId))
              setPrevSelecionados(data?.data?.equipeJogador?.map(elemento => elemento?.jogadorId))
            }
            if (data?.data?.logo) {
              setLogo(data.data.logo)
              setValue('logo', data.data.logo)
            }
          }
        })
      } else {
        setJogadoresDisponiveis(jogadores)
      }
    })
  }, [id, setValue, buscarEquipePorId])

  useEffect(() => {
    setValue('logo', logo || undefined)
  }, [logo, setValue])

  const onSubmit = async (data: FormData) => {
    console.log(data)
    const formData: Equipe = {
      name: data.name,
      responsavel: data.responsavel,
      telefone: data?.telefone,
      endereco: data?.endereco,
      logo,
    }

    const resultado = id
      ? await atualizarEquipe(id, formData, idJogadoresSelecionados)
      : await adicionarEquipe(formData, idJogadoresSelecionados)

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', id
        ? 'Equipe atualizada com sucesso!'
        : 'Equipe adicionado com sucesso!', 'success')
      navigate('/equipes')
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
        setLogo(reader.result as string)
        setValue('logo', result)
      }
      reader.readAsDataURL(file)
    }
  }

  function searchPlayers(value:string) {
    setNameSearch(value)
  }

  const toggleJogadorSelecionado = (id: string) => {
    setIdJogadoresSelecionados((prevSelecionados) => {
      if (idJogadoresSelecionados.includes(id)) {
        // se já estava marcado, remove
        return prevSelecionados.filter((jogadorId) => jogadorId !== id)
      } else {
        // se não estava, adiciona
        return [...prevSelecionados, id]
      }
    })
  }

  console.log(jogadoresDisponiveis)

  const jogadorFilter = jogadoresDisponiveis.filter(elemento => elemento.name.toLocaleLowerCase().includes(nameSearch?.toLocaleLowerCase()))

  return (
    <Content>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper>
          <FormSide>
            {/* Campos do formulário vão aqui */}
            <FormGroup>
              <Label>Nome:</Label>
              <Input {...register('name')} hasError={!!errors.name} />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Endereço:</Label>
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
              <Label>Responsável:</Label>
              <Input {...register('responsavel')} hasError={!!errors.responsavel} />
              {errors.responsavel && <ErrorMessage>{errors.responsavel.message}</ErrorMessage>}

            </FormGroup>

            <FormGroup>
              <Label>Logo:</Label>
              <ImageUploadContainer>
                <ImageUpload>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <FaUpload />
                </ImageUpload>
                {logo && <PreviewImage src={logo} alt="Prévia da logo" />}
              </ImageUploadContainer>
              {errors.logo && <ErrorMessage>{errors.logo.message}</ErrorMessage>}

            </FormGroup>
            {/* ...outros campos... */}
          </FormSide>

          <FormSide>
            {/* Lista de jogadores (se houver), ou outro conteúdo lateral */}
            <PlayerListContainer>
              <PlayerListHeader>
                <h3>Jogadores</h3>
                <input type="text" onChange={(e) => searchPlayers(e.target.value)} placeholder="Buscar jogador..." />
              </PlayerListHeader>
              <PlayerList>
                {jogadorFilter?.map((elemento) => (
                  <PlayerItem key={elemento.id}>
                    <span>{elemento.name}</span>
                    <input
                      type="checkbox"
                      disabled={prevSelecionados.includes(elemento.id)}
                      checked={idJogadoresSelecionados.includes(elemento?.id) || prevSelecionados.includes(elemento.id)}
                      onChange={() => toggleJogadorSelecionado(elemento?.id)}
                    />
                  </PlayerItem>
                ))}
              </PlayerList>

            </PlayerListContainer>
          </FormSide>
        </FormWrapper>

        <ButtonContainer>
          <Button
            type="button"
            className="cancel"
            onClick={() => navigate('/equipes')}
          >
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
