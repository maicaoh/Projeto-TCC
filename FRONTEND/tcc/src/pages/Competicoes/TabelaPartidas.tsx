import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PartidaCard,
  HeaderData,
  TimesContainer,
  Time,
  Versus,
  InfoContainer,
  Acoes,
  TableContainer,
  Td,
  Th,
  TdEquipe,
  TdInput,
  PlayerImage,
  ButtonAcoes,
  Select,
  Table,
  Input,
  ActionButtons,
  Placar,
  HeaderRodada,
} from './TabelaPartidasStyles'
import InputMask from 'react-input-mask'
import { Competicao, useCompeticao } from '../../context/CompeticaoContext/CompeticaoContext'
import userDefault from '../../assets/Profile-PNG-File.png'
import { Equipe } from '../../context/EquipeContext/EquipeContext'
import { useQuadra } from '../../context/QuadraContext/QuadraContext'
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa'
import { ModalEditarCompeticao } from './ModalEditarCompeticao'
import { Partida } from '../../context/PartidaContext/PartidaContext'
import AcoesPartida from './AcoesPartida'
import { statusPartida } from '../../Enums/enums'

interface Data {
  id: string
}

interface Confronto {
  mandante: Equipe
  visitante: Equipe
  data: string
  status: number
  quadra: string
  rodada: number
  publicoPresente: number
  golsMandante?: number
  golsVisitante?: number
  id: string
}

export function TabelaPartidas(data: Data) {
  const [confrontos, setConfrontos] = useState<Confronto[]>([])
  const [currentPartida, setCurrentPartida] = useState < Partida | null >(null)
  const [torneio, setTorneio] = useState<Competicao>()
  const [openModalEditarPartida, setOpenModalEditarPartida] = useState <boolean>(false)
  const [viewExplorarPartida, setViewExplorarPartida] = useState<string | null>(null)
  const { buscarCompeticaoPorId } = useCompeticao()
  const { quadras } = useQuadra()
  const navigate = useNavigate()
  const { id } = data

  useEffect(() => {
    buscarCompeticaoPorId(id).then((data: Competicao) => {
      if (data) {
        const comp = data?.data
        const confrontosConvertidos = (comp.partidas || []).map((p: any) => ({
          mandante: p.equipeCasa,
          visitante: p.equipeVisitante,
          status: p.status,
          data: p.data || '',
          quadra: p.quadra?.id || '',
          rodada: p.rodada,
          publicoPresente: p.publicoPresente || '--',
          golsCasa: p.golsCasa,
          golsVisitante: p.golsVisitante,
          arbitros: p?.arbitros,
          id: p.id,
        }))
        setTorneio(comp)
        setConfrontos(confrontosConvertidos)
      }
    })
  }, [id, buscarCompeticaoPorId, viewExplorarPartida])

  function formatarDataIsoParaDdMmAaaa(valor: string) {
    if (!valor) return '--'
    const data = new Date(valor)
    if (isNaN(data.getTime())) return '--'
    const dia = String(data.getUTCDate()).padStart(2, '0')
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0')
    const ano = data.getUTCFullYear()
    return `${dia}/${mes}/${ano}`
  }

  function ordinal(n: number) {
    return `${n}ª`
  }

  // Agrupar confrontos por rodada
  const confrontosPorRodada = confrontos.reduce((acc, partida) => {
    const rodada = partida.rodada
    if (!acc[rodada]) acc[rodada] = []
    acc[rodada].push(partida)
    return acc
  }, {} as Record<number, Confronto[]>)

  function closeModalEdicao() {
    setCurrentPartida(null)
    setOpenModalEditarPartida(false)
  }

  function openModalEdicao(partida: Partida) {
    console.log('===========>')
    console.log(partida)
    setCurrentPartida(partida)
    setOpenModalEditarPartida(true)
  }

  return (
    <div>
      {viewExplorarPartida
        ? <AcoesPartida torneio={torneio} id={viewExplorarPartida} setViewExplorarPartida={setViewExplorarPartida} />
        : <>
          <ModalEditarCompeticao partida={currentPartida} show={openModalEditarPartida} handleSave={() => console.log('oi')} key={currentPartida?.id} handleClose={() => closeModalEdicao()} />
          {Object.entries(confrontosPorRodada).map(([rodada, partidas]) => (
            <div key={rodada}>
              <HeaderRodada>
                {ordinal(Number(rodada))} RODADA
              </HeaderRodada>

              {partidas.map((partida, index) => {
                const mandante = partida.mandante
                const visitante = partida.visitante
                const quadra = quadras.find((q) => partida.quadra === q.id)?.name || '---'

                return (
                  <PartidaCard key={index}>
                    <HeaderData status={partida.status}>
                      <div className="status">
                        <span className="dot" />
                        {statusPartida(partida.status)}
                      </div>

                      <div>{partida.data
                        ? formatarDataIsoParaDdMmAaaa(partida.data)
                        : '--'}
                      </div>
                    </HeaderData>

                    <TimesContainer>
                      <Time>
                        <img src={mandante?.logo || userDefault} alt="Mandante" />
                        <span>{mandante?.name || '--'}</span>
                      </Time>

                      <Placar>
                        {partida.status !== 0
                          ? partida.golsCasa
                          : '--'}
                        <span> x </span>
                        {partida.status !== 0
                          ? partida.golsVisitante
                          : '--'}
                      </Placar>

                      <Time>
                        <img src={visitante?.logo || userDefault} alt="Visitante" />
                        <span>{visitante?.name || '--'}</span>
                      </Time>
                    </TimesContainer>

                    <InfoContainer>
                      <div>Quadra: {quadra}</div>
                      <div>Público: {partida.publicoPresente || '--'}</div>
                    </InfoContainer>

                    <Acoes>
                      <ButtonAcoes onClick={() => setViewExplorarPartida(partida.id)} title="Visualizar">
                        <FaEye />
                      </ButtonAcoes>
                      <ButtonAcoes onClick={() => openModalEdicao({ id: partida.id, quadra: quadras.find((q) => partida.quadra === q.id) || null, data: new Date(partida.data) || null, publicoPresente: partida.publicoPresente, arbitros: partida.arbitros } as Partida)} title="Editar">
                        <FaEdit />
                      </ButtonAcoes>
                    </Acoes>
                  </PartidaCard>
                )
              })}
            </div>
          ))}
        </>}
    </div>
  )
}
