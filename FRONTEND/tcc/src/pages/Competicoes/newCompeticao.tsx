import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  FaUpload,
  FaSave,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
} from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import { competicaoSchema } from '../../validations/competicaoValidation'
import { useJogador } from '../../context/JogadorContext/JogadorContext'
import userDefault from '../../assets/Profile-PNG-File.png'
import Swal from 'sweetalert2'

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
  TableContainer,
  Table,
  Th,
  Td,
  TdInput,
  FormGroupCheckbox,
  PlayerImage,
  TdEquipe,
} from './newEquipeStyles'

import { Equipe, useEquipe } from '../../context/EquipeContext/EquipeContext'
import { Competicao, useCompeticao } from '../../context/CompeticaoContext/CompeticaoContext'
import { useQuadra } from '../../context/QuadraContext/QuadraContext'

interface FormData {
  id?: string
  name: string
  status: string
  tipo: string
  foto?: string
  edicao: string
  temReturno: boolean
}

interface Confronto {
  mandante: Equipe
  visitante: Equipe
  data: string
  quadra: string
  rodada: number
}

export function NewCompeticao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [logo, setLogo] = useState<string | null>(null)
  const [nameSearch, setNameSearch] = useState<string>('')
  const [equipesDisponiveis, setEquipesDisponiveis] = useState<Equipe[]>([])
  const [idEquipesSelecionados, setIdEquipesSelecionados] = useState<Equipe[]>([])
  const [step, setStep] = useState<number>(1)
  const [confrontos, setConfrontos] = useState<Confronto[]>([])

  const { buscarJogadorDisponiveis } = useJogador()
  const { equipes } = useEquipe()
  const { adicionarCompeticao, atualizarCompeticao, buscarCompeticaoPorId } = useCompeticao()
  const { quadras } = useQuadra()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(competicaoSchema) as any,
  })

  useEffect(() => {
    if (id && equipes.length > 0) {
      buscarCompeticaoPorId(id).then((data: Competicao) => {
        if (data) {
          const comp = data.data
          setValue('name', comp.nome)
          setValue('edicao', comp.edicao)
          setValue('status', comp.status)
          setValue('tipo', comp.tipo)
          setValue('temReturno', comp.temReturno || false)

          if (comp.foto) {
            setLogo(comp.foto)
            setValue('foto', comp.foto)
          }

          setIdEquipesSelecionados(comp.equipes || [])

          const confrontosConvertidos = (comp.partidas || []).map((p: any, i: number) => ({
            mandante: p.equipeCasa,
            visitante: p.equipeVisitante,
            data: p.data || '',
            quadra: p.quadra?.id || '',
            rodada: p.rodada,
          }))

          setConfrontos(confrontosConvertidos)
          setEquipesDisponiveis(equipes)
        }
      })
    } else {
      setEquipesDisponiveis(equipes)
    }
  }, [id, equipes, buscarCompeticaoPorId, setValue])

  useEffect(() => {
    setValue('foto', logo || undefined)
  }, [logo, setValue])

  useEffect(() => {
    if (!id && step === 2 && watch('tipo') === '0') {
      const partidas: Confronto[] = []

      const equipesSelecionadas = [...idEquipesSelecionados]
      const incluirReturno = watch('temReturno')

      const isImpar = equipesSelecionadas.length % 2 !== 0
      if (isImpar) {
        equipesSelecionadas.push({ id: 'bye', name: 'Folga' } as Equipe)
      }

      const totalRodadasIda = equipesSelecionadas.length - 1
      const jogosPorRodada = equipesSelecionadas.length / 2

      const gerarRodadas = (turno: 'ida' | 'volta') => {
        const lista = [...equipesSelecionadas]
        const metade = lista.slice(0, lista.length / 2)
        const outraMetade = lista.slice(lista.length / 2).reverse()

        for (let rodada = 1; rodada <= totalRodadasIda; rodada++) {
          for (let i = 0; i < jogosPorRodada; i++) {
            const timeA = metade[i]
            const timeB = outraMetade[i]
            if (timeA.id === 'bye' || timeB.id === 'bye') continue

            const mandante = turno === 'ida'
              ? timeA
              : timeB
            const visitante = turno === 'ida'
              ? timeB
              : timeA

            partidas.push({
              mandante,
              visitante,
              data: '',
              quadra: '',
              rodada: turno === 'ida'
                ? rodada
                : rodada + totalRodadasIda,
            })
          }

          const fixo = metade[0]
          const novaMetade = [fixo, outraMetade[0], ...metade.slice(1, -1)]
          const novaOutraMetade = [...outraMetade.slice(1), metade[metade.length - 1]]

          for (let i = 0; i < jogosPorRodada; i++) {
            metade[i] = novaMetade[i]
            outraMetade[i] = novaOutraMetade[i]
          }
        }
      }

      gerarRodadas('ida')
      if (incluirReturno) gerarRodadas('volta')

      setConfrontos(partidas)
    }
  }, [step, idEquipesSelecionados, watch, id])

  const parseData = (dataString: string): string | null => {
    const [dia, mes, ano] = dataString.split('/')
    if (!dia || !mes || !ano) return null

    const dataISO = `${ano}-${mes}-${dia}T00:00:00`
    const date = new Date(dataISO)
    return isNaN(date.getTime())
      ? null
      : date.toISOString()
  }

  const onSubmit = async (data: FormData) => {
    if (step === 1) {
      if (idEquipesSelecionados.length < 2) {
        Swal.fire({
          title: 'Erro!',
          text: 'Selecione ao menos duas equipes para formar a competição.',
          icon: 'error',
        })
        return
      }
      setStep(2)
    } else {
      const confrontosFormatados = confrontos.map((c) => ({
        ...c,
        data: parseData(c.data || ''), // aqui convertemos a data
      }))

      const formDataFinal = {
        ...data,
        equipes: idEquipesSelecionados,
        confrontos: confrontosFormatados,
      } as Competicao

      const resultado = id
        ? await atualizarCompeticao(id, formDataFinal)
        : await adicionarCompeticao(formDataFinal)

      if (resultado.sucesso) {
        Swal.fire('Sucesso!', id
          ? 'Competição atualizada com sucesso!'
          : 'Competição cadastrada com sucesso!', 'success')
        navigate('/competicoes')
      } else {
        Swal.fire({
          title: 'Erro!',
          text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
          icon: 'error',
        })
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogo(result)
        setValue('foto', result)
      }
      reader.readAsDataURL(file)
    }
  }

  function searchEquipes(value: string) {
    setNameSearch(value)
  }

  const toggleEquipeSelecionado = (equipe: Equipe) => {
    if (id) return
    setIdEquipesSelecionados((prev) => {
      const jaSelecionada = prev.find((eq) => eq.id === equipe.id)
      return jaSelecionada
        ? prev.filter((eq) => eq.id !== equipe.id)
        : [...prev, equipe]
    })
  }

  const handleChangeConfronto = (index: number, campo: 'data' | 'quadra', valor: string) => {
    const atualizados = [...confrontos]
    atualizados[index][campo] = valor
    setConfrontos(atualizados)
  }

  const equipesFilter = equipesDisponiveis.filter(equipe => equipe.name.toLowerCase().includes(nameSearch.toLowerCase()))

  return (
    <Content>
      {step === 1
        ? (
          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <FormWrapper>
              <FormSide>
                <FormGroup>
                  <Label>Nome:</Label>
                  <Input {...register('name')} hasError={!!errors.name} />
                  {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>Edição:</Label>
                  <Input {...register('edicao')} hasError={!!errors.edicao} />
                  {errors.edicao && <ErrorMessage>{errors.edicao.message}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>Formato:</Label>
                  <Select {...register('tipo')} hasError={!!errors.tipo} disabled={!!id}>
                    <option value="">Selecione o formato</option>
                    <option value="2">Fase de grupos</option>
                    <option value="0">Liga</option>
                    <option value="1">Mata Mata</option>
                  </Select>
                  {errors.tipo && <ErrorMessage>{errors.tipo.message}</ErrorMessage>}
                </FormGroup>

                <FormGroupCheckbox>
                  <input type="checkbox" {...register('temReturno')} id="temReturno" />
                  <label htmlFor="temReturno">Incluir returno</label>
                </FormGroupCheckbox>

                <FormGroup>
                  <Label>Status:</Label>
                  <Select {...register('status')} hasError={!!errors.status}>
                    <option value="">Selecione o status</option>
                    <option value="1">Em andamento</option>
                    <option value="2">Encerrado</option>
                    <option value="0">Não iniciado</option>
                  </Select>
                  {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
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
                </FormGroup>
              </FormSide>

              <FormSide>
                <PlayerListContainer>
                  <PlayerListHeader>
                    <h3>Equipes</h3>
                    <input
                      type="text"
                      onChange={(e) => searchEquipes(e.target.value)}
                      placeholder="Buscar Equipe..."
                      disabled={!!id}
                    />
                  </PlayerListHeader>
                  <PlayerList>
                    {equipesFilter.map((equipe) => (
                      <PlayerItem key={equipe.id}>
                        <span>{equipe.name}</span>
                        <input
                          type="checkbox"
                          checked={idEquipesSelecionados.some(eq => eq.id === equipe.id)}
                          onChange={() => toggleEquipeSelecionado(equipe)}
                          disabled={!!id}
                        />
                      </PlayerItem>
                    ))}
                  </PlayerList>
                </PlayerListContainer>
              </FormSide>
            </FormWrapper>

            <ButtonContainer>
              <Button type="button" className="cancel" onClick={() => navigate('/competicoes')}>
                <FaTimes /> Cancelar
              </Button>
              <Button type="submit" className="save">
                <FaArrowRight /> {id
                  ? 'Próximo'
                  : 'Cadastrar'}
              </Button>
            </ButtonContainer>
          </FormContainer>
          )
        : (
            step === 2 && (
              <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Rodada</Th>
                        <Th>Mandante</Th>
                        <Th>Visitante</Th>
                        <Th>Data</Th>
                        <Th>Quadra</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {confrontos.map((partida, index) => (
                        <tr key={index}>
                          <Td>{partida.rodada}</Td>
                          <Td>
                            <TdEquipe>
                              <PlayerImage src={partida.mandante.logo || userDefault} alt="Foto do equipe" />
                              {partida.mandante.name}
                            </TdEquipe>
                          </Td>
                          <Td>
                            <TdEquipe>
                              <PlayerImage src={partida.visitante.logo || userDefault} alt="Foto do equipe" />
                              {partida.visitante.name}
                            </TdEquipe>
                          </Td>
                          <TdInput>
                            <InputMask
                              placeholder="dd/mm/aaaa"
                              mask="99/99/9999"
                              value={partida.data || ''}
                              onChange={(e) => handleChangeConfronto(index, 'data', e.target.value)}
                            >
                              {(inputProps: any) => <Input {...inputProps} />}
                            </InputMask>
                          </TdInput>
                          <TdInput>
                            <Select
                              value={partida.quadra}
                              onChange={(e) => handleChangeConfronto(index, 'quadra', e.target.value)}
                            >
                              <option value="">Selecione uma quadra</option>
                              {quadras.map((q) => (
                                <option key={q.id} value={q.id}>{q.name}</option>
                              ))}
                            </Select>
                          </TdInput>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
                <ButtonContainer>
                  <Button type="button" className="cancel" onClick={() => setStep(1)}>
                    <FaArrowLeft /> Voltar
                  </Button>
                  <Button type="submit" className="save">
                    <FaSave /> {id
                      ? 'Atualizar'
                      : 'Cadastrar'}
                  </Button>
                </ButtonContainer>
              </FormContainer>
            )
          )}
    </Content>
  )
}
