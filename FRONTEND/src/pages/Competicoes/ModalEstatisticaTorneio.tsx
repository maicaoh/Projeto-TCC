import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BaseModal from '../../Components/ModalBase/Modalbase'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { JogadorRow } from './Estatisticas'
import quadraIMG from '../../assets/quadra.png'
import golIMG from '../../assets/gol.png'
import {
  PartidaDribleStats,
  PlayerDribleStatsResponse,
  useTorneioEstatistica,
  PlayerFaltaCartaoStatsResponse,
  PartidaFaltaCartaoStats,
  PlayerFinalizacaoStatsResponse,
  PartidaFinalizacaoStats,
  PlayerDesarmeStatsResponse,
  PartidaDesarmeStats,
  PlayerGolStatsResponse,
  PartidaGolStat,
} from '../../context/EstatisticaTorneioContext/EstatisticaTorneioContext'
import { PlayerAssistenciaStatsResponse, PartidaAssistenciaStats } from '../../context/EstatisticaTorneioContext/EstatisticaTorneioContext'
import { PlayerParticipacaoGolsStatsResponse, PartidaParticipacaoGolsStats } from '../../context/EstatisticaTorneioContext/EstatisticaTorneioContext'

import {
  Avatar,
  ChartBox,
  ChartsWrapper,
  ChartTitle,
  ColorBox,
  Container,
  InfoPanel,
  InfoText,
  Label,
  LegendContainer,
  LegendItem,
  RadioLabel,
  ScrollContainer,
  Select,
  Spot,
  TopRow,
  ViewSelector,
} from './ModalEstatisticaTorneioStyles'
import { ContainerAcoes } from './ModalFinalizacaoStyles'
import { posicaoJogador } from '../../Enums/enums'

function dataNascimento(d: string) {
  const hoje = new Date()
  const nasc = new Date(d)
  const idade = hoje.getFullYear() - nasc.getFullYear()
  const m = hoje.getMonth() - nasc.getMonth()
  return idade - (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())
    ? 1
    : 0)
}

function aggregate(points: { x: number; y: number }[]) {
  const map: Record<string, number> = {}
  points.forEach(({ x, y }) => {
    const key = `${Math.round(x)}-${Math.round(y)}`
    map[key] = (map[key] || 0) + 1
  })
  return Object.entries(map).map(([k, count]) => {
    const [x, y] = k.split('-').map(Number)
    return { x, y, count }
  })
}

interface ModalEstatisticasTorneioProps {
  show: boolean
  handleClose: () => void
  jogador?: JogadorRow & { posicaoCampos?: { x: number; y: number }[] }
  torneioId: string
}

export const ModalEstatisticaTorneio: React.FC<ModalEstatisticasTorneioProps> = ({
  show,
  handleClose,
  jogador,
  torneioId,
}) => {
  const {
    carregarFinalizacaoStats,
    finalizacaoStats,
    carregarDesarmeStats,
    desarmeStats,
    carregarDribleStats,
    dribleStats,
    carregarFaltaCartaoStats,
    faltaCartaoStats,
    torneioResponse,
    carregarGolStats,
    golStats,
    carregarAssistenciaStats,
    assistenciaStats,
    carregarParticipacaoGolsStats,
    participacaoGolsStats,
  } = useTorneioEstatistica()

  const [tipo, setTipo] = useState<string>('')
  const [statView, setStatView] = useState<'Por Partidas' | 'Geral' | 'Mapa de Calor'>('Por Partidas')
  const [loading, setLoading] = useState(false)
  const [statsF, setStatsF] = useState<PlayerFinalizacaoStatsResponse | null>(null)
  const [statsD, setStatsD] = useState<PlayerDesarmeStatsResponse | null>(null)
  const [statsDrible, setStatsDribles] = useState<PlayerDribleStatsResponse | null>(null)
  const [statsFaltaCartao, setStatsFaltaCartao] = useState<PlayerFaltaCartaoStatsResponse | null>(null)
  const [statsGol, setStatsGol] = useState<PlayerGolStatsResponse | null>(null)
  const [statsAssistencia, setStatsAssistencia] = useState<PlayerAssistenciaStatsResponse | null>(null)
  const [statsParticipacaoGols, setStatsParticipacaoGols] = useState<PlayerParticipacaoGolsStatsResponse | null>(null)

  useEffect(() => {
    if (!show || !jogador?.id || !tipo) return
    setLoading(true)

    if (tipo === 'finalizacao') {
      carregarFinalizacaoStats(jogador.id, torneioId)
        .then(res => res.sucesso && res.data && setStatsF(res.data))
        .finally(() => setLoading(false))
    } else if (tipo === 'drible') {
      carregarDribleStats(jogador.id, torneioId)
        .then(res => res.sucesso && res.data && setStatsDribles(res.data))
        .finally(() => setLoading(false))
    } else if (tipo === 'desarme') {
      carregarDesarmeStats(jogador.id, torneioId)
        .then(res => res.sucesso && res.data && setStatsD(res.data))
        .finally(() => setLoading(false))
    } else if (tipo === 'falta-cartao' || tipo === 'cartao') {
      carregarFaltaCartaoStats(jogador.id, torneioId)
        .then(res => res.sucesso && res.data && setStatsFaltaCartao(res.data))
        .finally(() => setLoading(false))
    } else if (tipo === 'gol') {
      carregarGolStats(jogador.id, torneioId)
        .then(res => res.sucesso && res.data && setStatsGol(res.data))
        .finally(() => setLoading(false))
    } else if (tipo === 'assistencia') {
      carregarAssistenciaStats(jogador.id, torneioId)
        .then(res => res.sucesso && res.data && setStatsAssistencia(res.data))
        .finally(() => setLoading(false))
    } else if (tipo === 'participacao-gols') {
      carregarParticipacaoGolsStats(jogador.id, torneioId)
        .then(res => res.sucesso && res.data && setStatsParticipacaoGols(res.data))
        .finally(() => setLoading(false))
    }
  }, [show, tipo, jogador?.id, torneioId])

  useEffect(() => {
    if (show) {
      setTipo('finalizacao')
    }
  }, [show])

  const partF: PartidaFinalizacaoStats[] = statsF?.partidas ?? []
  const byF = partF.map(p => ({ name: `Rodada ${p.rodada}`, total: p.finalizacoesCount, other: p.finalizacoesCertasCount }))
  const gerF = statsF
    ? [{ name: torneioResponse?.name ?? '', total: statsF.totalFinalizacoes, other: statsF.totalFinalizacoesCertas }]
    : []
  const spotsCampoF = aggregate(partF.flatMap(p => p.finalizacoes.map(f => f.posicaoCampo).filter((x): x is any => !!x)))
  const spotsGolF = aggregate(partF.flatMap(p => p.finalizacoes.map(f => f.posicaoGol).filter((x): x is any => !!x)))

  const partD: PartidaDesarmeStats[] = statsD?.partidas ?? []
  const byD = partD.map(p => ({ name: `Rodada ${p.rodada}`, total: p.desarmesCount, other: p.desarmesSucessoCount }))
  const gerD = statsD
    ? [{ name: torneioResponse?.name ?? '', total: statsD.totalDesarmes, other: statsD.totalDesarmesSucesso }]
    : []
  const spotsCampoD = aggregate(partD.flatMap(p => p.desarmes.map(d => d.posicaoCampo).filter((x): x is any => !!x)))

  const partDrible: PartidaDribleStats[] = statsDrible?.partidas ?? []
  const byDrible = partDrible.map(p => ({ name: `Rodada ${p.rodada}`, total: p.driblesCount, other: p.driblesSucessoCount }))
  const gerDrible = statsDrible
    ? [{ name: torneioResponse?.name ?? '', total: statsDrible.totalDrible, other: statsDrible.totalDribleSucesso }]
    : []
  const spotsCampoDrible = aggregate(partDrible.flatMap(p => p.dribles.map(d => d.posicaoCampo).filter((x): x is any => !!x)))

  const partFaltaCartao: PartidaFaltaCartaoStats[] = statsFaltaCartao?.partidas ?? []
  const byFaltaCartao = partFaltaCartao.map(p => ({
    name: `Rodada ${p.rodada}`,
    totalFaltas: p.totalFaltasPartida,
    cartoesAmarelos: p.totalCartaoAmareloPartida,
    cartoesVermelhos: p.totalCartaoVermelhoPartida,
  }))
  const gerFaltaCartao = statsFaltaCartao
    ? [{
        name: torneioResponse?.name ?? '',
        totalFaltas: statsFaltaCartao.totalFaltas,
        cartoesAmarelos: statsFaltaCartao.totalCartaoAmarelo,
        cartoesVermelhos: statsFaltaCartao.totalCartaoVermelho,
      }]
    : []
  const spotsCampoFaltaCartao = aggregate(
    partFaltaCartao.flatMap(p => p.faltas.map(f => f.posicaoCampo).filter((x): x is any => !!x)),
  )

  const partGol: PartidaGolStats[] = statsGol?.partidas ?? []
  const byGol = partGol.map(p => ({
    name: `Rodada ${p.rodada}`,
    total: p.totalGolsPartida,
  }))
  const gerGol = statsGol
    ? [{ name: torneioResponse?.name ?? '', total: statsGol.totalGols }]
    : []
  const spotsCampoGol = aggregate(
    partGol.flatMap(p => p.gols.map(g => g.posicaoCampo).filter((x): x is any => !!x)),
  )
  const spotsGolGol = aggregate(
    partGol.flatMap(p => p.gols.map(g => g.posicaoGol).filter((x): x is any => !!x)),
  )

  const byCartao = partFaltaCartao.map(p => ({
    name: `Rodada ${p.rodada}`,
    cartoesAmarelos: p.totalCartaoAmareloPartida,
    cartoesVermelhos: p.totalCartaoVermelhoPartida,
  }))

  const gerCartao = statsFaltaCartao
    ? [{
        name: torneioResponse?.name ?? '',
        cartoesAmarelos: statsFaltaCartao.totalCartaoAmarelo,
        cartoesVermelhos: statsFaltaCartao.totalCartaoVermelho,
      }]
    : []

  const partAssistencia: PartidaAssistenciaStats[] = statsAssistencia?.partidas ?? []
  const byAssistencia = partAssistencia.map(p => ({
    name: `Rodada ${p.rodada}`,
    total: p.totalAssistenciasPartida,
  }))
  const gerAssistencia = statsAssistencia
    ? [{ name: torneioResponse?.name ?? '', total: statsAssistencia.totalAssistencias }]
    : []

  const partParticipacaoGols: PartidaParticipacaoGolsStats[] = statsParticipacaoGols?.partidas ?? []

  const byParticipacaoGols = partParticipacaoGols.map(p => ({
    name: `Rodada ${p.rodada}`,
    total: p.totalParticipacaoPartida,
  }))

  const gerParticipacaoGols = statsParticipacaoGols
    ? [{ name: torneioResponse?.name ?? '', total: statsParticipacaoGols.totalParticipacao }]
    : []

  let dataBy, dataGer, dataCampo, dataGol

  switch (tipo) {
    case 'finalizacao':
      dataBy = byF
      dataGer = gerF
      dataCampo = spotsCampoF
      dataGol = spotsGolF
      break
    case 'desarme':
      dataBy = byD
      dataGer = gerD
      dataCampo = spotsCampoD
      dataGol = []
      break
    case 'drible':
      dataBy = byDrible
      dataGer = gerDrible
      dataCampo = spotsCampoDrible
      dataGol = []
      break
    case 'gol':
      dataBy = byGol
      dataGer = gerGol
      dataCampo = spotsCampoGol
      dataGol = spotsGolGol
      break
    case 'assistencia':
      dataBy = byAssistencia
      dataGer = gerAssistencia
      dataCampo = [] // 🎯 Sem mapa de calor
      dataGol = []
      break
    case 'falta-cartao':
      dataBy = byFaltaCartao
      dataGer = gerFaltaCartao
      dataCampo = spotsCampoFaltaCartao
      dataGol = []
      break
    case 'cartao':
      dataBy = byCartao
      dataGer = gerCartao
      dataCampo = [] // 🎯 sem mapa de calor
      dataGol = []
      break
    case 'participacao-gols':
      dataBy = byParticipacaoGols
      dataGer = gerParticipacaoGols
      dataCampo = [] // não tem mapa de calor
      dataGol = []
      break

    default:
      dataBy = []
      dataGer = []
      dataCampo = []
      dataGol = []
      break
  }

  const chartHeight = 240
  const barWidth = 40
  const chartPadding = 20
  const dynamicWidth = dataBy.length * (barWidth + chartPadding)

  return (
    <BaseModal width="80%" show={show} handleClose={handleClose} title="Estatísticas Gerais">
      <Container>
        <InfoPanel>
          <Avatar src={jogador?.foto} alt="Avatar" />
          <InfoText>
            <div><strong>Nome:</strong> {jogador?.name}</div>
            <div><strong>Posição:</strong> {posicaoJogador(jogador?.posicao)}</div>
            <div><strong>Idade:</strong> {jogador?.dataNascimento
              ? `${dataNascimento(jogador.dataNascimento)} anos`
              : '--'}
            </div>
            <div><strong>Equipe:</strong> {jogador?.equipeNome}</div>
          </InfoText>
        </InfoPanel>

        <ChartsWrapper>
          <Select onChange={e => setTipo(e.target.value)}>
            <option value="finalizacao">Finalização</option>
            <option value="desarme">Desarme</option>
            <option value="drible">Drible</option>
            <option value="gol">Gol</option>
            <option value="falta-cartao">Faltas / Cartões</option>
            <option value="cartao">Cartões</option> {/* 🎯 Novo */}
            <option value="assistencia">Assistência</option>
            <option value="participacao-gols">Participação em Gols</option>

            {/* <option value="">Participação em gols</option>
            <option value="falta-cartao">Desarme/Falta</option> */}

          </Select>

          {tipo && (
            loading
              ? <div>Carregando dados...</div>
              : (
                <>
                  <ViewSelector>
                    <RadioLabel>
                      <input
                        type="radio"
                        checked={statView === 'Por Partidas'}
                        onChange={() => setStatView('Por Partidas')}
                      /> Por Partidas
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        checked={statView === 'Geral'}
                        onChange={() => setStatView('Geral')}
                      /> Geral
                    </RadioLabel>
                    {tipo !== 'cartao' && tipo !== 'assistencia' && tipo !== 'participacao-gols' && (
                      <RadioLabel>
                        <input
                          type="radio"
                          checked={statView === 'Mapa de Calor'}
                          onChange={() => setStatView('Mapa de Calor')}
                        /> Mapa de Calor
                      </RadioLabel>
                    )}

                  </ViewSelector>

                  <TopRow>
                    {statView === 'Por Partidas' && (
                      <ScrollContainer>
                        <ChartBox style={{ minWidth: dynamicWidth }}>
                          <ChartTitle>Por Partidas</ChartTitle>
                          <ResponsiveContainer width="100%" height={chartHeight}>
                            <BarChart data={dataBy} barCategoryGap={chartPadding}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              {tipo === 'falta-cartao' || tipo === 'cartao'
                                ? (
                                  <>
                                    {tipo !== 'cartao' && <Bar dataKey="totalFaltas" name="Faltas" fill="#2563eb" barSize={barWidth} />}
                                    <Bar dataKey="cartoesAmarelos" name="Cartões Amarelos" fill="#fbbf24" barSize={barWidth} />
                                    <Bar dataKey="cartoesVermelhos" name="Cartões Vermelhos" fill="#dc2626" barSize={barWidth} />
                                  </>
                                  )
                                : (
                                  <>
                                    <Bar dataKey="total" name="Total" fill="#2563eb" barSize={barWidth} />
                                    {tipo !== 'gol' && tipo !== 'participacao-gols' && tipo !== 'assistencia' && <Bar
                                      dataKey="other" name={tipo === 'finalizacao'
                                        ? 'Certas'
                                        : 'Sucesso'} fill="#ef4444" barSize={barWidth}
                                                                                                                 />}
                                  </>
                                  )}
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartBox>
                      </ScrollContainer>
                    )}

                    {statView === 'Geral' && (
                      <ChartBox>
                        <ChartTitle>Geral</ChartTitle>
                        <ResponsiveContainer width="100%" height={chartHeight}>
                          <BarChart data={dataGer} barCategoryGap={chartPadding}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            {tipo === 'falta-cartao' || tipo === 'cartao'
                              ? (
                                <>
                                  {tipo !== 'cartao' && <Bar dataKey="totalFaltas" name="Faltas" fill="#2563eb" barSize={barWidth} />}
                                  <Bar dataKey="cartoesAmarelos" name="Cartões Amarelos" fill="#fbbf24" barSize={barWidth} />
                                  <Bar dataKey="cartoesVermelhos" name="Cartões Vermelhos" fill="#dc2626" barSize={barWidth} />
                                </>
                                )
                              : (
                                <>
                                  <Bar dataKey="total" name="Total" fill="#2563eb" barSize={barWidth} />
                                  {tipo !== 'gol' && tipo !== 'participacao-gols' && tipo !== 'assistencia' && <Bar
                                    dataKey="other" name={tipo === 'finalizacao'
                                      ? 'Certas'
                                      : 'Sucesso'} fill="#ef4444" barSize={barWidth}
                                                                                                               />}
                                </>
                                )}
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartBox>
                    )}

                    {statView === 'Mapa de Calor' && (
                      <>
                        <ContainerAcoes style={{
                          margin: (tipo !== 'finalizacao' && tipo !== 'finalizacao')
                            ? '0px auto 0px auto'
                            : '',
                          width: (tipo === 'finalizacao' && tipo === 'finalizacao')
                            ? '50%'
                            : '50%',
                        }}
                        >
                          <Label>Posição no Campo</Label>
                          <div
                            style={{
                              width: '100%',
                              height: '394px',
                              backgroundImage: `url(${quadraIMG})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative',
                            }}
                          >
                            {dataCampo.map((s, i) => (
                              <Spot key={i} x={s.x} y={s.y}>
                                {s.count > 1
                                  ? s.count
                                  : null}
                              </Spot>
                            ))}
                          </div>
                        </ContainerAcoes>

                        {(tipo === 'finalizacao' || tipo === 'gol') && (
                          <ContainerAcoes style={{ width: '50%' }}>
                            <Label>Posição do Gol</Label>
                            <div
                              style={{
                                width: '100%',
                                height: '394px',
                                backgroundImage: `url(${golIMG})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                              }}
                            >
                              {dataGol.map((s, i) => (
                                <Spot key={`g${i}`} x={s.x} y={s.y}>
                                  {s.count > 1
                                    ? s.count
                                    : null}
                                </Spot>
                              ))}
                            </div>
                          </ContainerAcoes>
                        )}
                      </>
                    )}
                  </TopRow>

                  <LegendContainer>
                    {tipo !== 'cartao' && <LegendItem><ColorBox color="#2563eb" /> Total</LegendItem>}
                    {tipo !== 'cartao' && tipo !== 'falta-cartao' && tipo !== 'gol' && tipo !== 'participacao-gols' && tipo !== 'assistencia' && (
                      <LegendItem><ColorBox color="#ef4444" /> {tipo === 'finalizacao'
                        ? 'Certas'
                        : 'Sucesso'}
                      </LegendItem>
                    )}
                    {(tipo === 'falta-cartao' || tipo === 'cartao') && (
                      <>
                        <LegendItem><ColorBox color="#fbbf24" /> Cartões Amarelos</LegendItem>
                        <LegendItem><ColorBox color="#dc2626" /> Cartões Vermelhos</LegendItem>
                      </>
                    )}
                  </LegendContainer>
                </>
                )
          )}
        </ChartsWrapper>
      </Container>
    </BaseModal>
  )
}
