import React, { useEffect, useState } from 'react'
import BaseModal from '../../Components/ModalBase/Modalbase'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import quadraIMG from '../../assets/quadra.png'
import golIMG from '../../assets/gol.png'
import {
  useEstatisticaGeralEstatistica,
  FinalizacaoTorneioStats,
  DribleTorneioStats,
  DesarmeTorneioStats,
  FaltaCartaoTorneioStats,
  GolTorneioStats,
  AssistenciaTorneioStats,
  ParticipacaoTorneioStats,
  PlayerFinalizacaoGlobalStatsResponse,
  PlayerDribleGlobalStatsResponse,
  PlayerDesarmeGlobalStatsResponse,
  PlayerFaltaCartaoGlobalStatsResponse,
  PlayerGolGlobalStatsResponse,
  PlayerAssistenciaGlobalStatsResponse,
  PlayerParticipacaoGlobalStatsResponse,
} from '../../context/EstatisticaGeralContext/EstatisticaGeralContext'
import { JogadorRow } from './Estatisticas'
import {
  Avatar, ChartBox, ChartsWrapper, ChartTitle, ColorBox,
  Container, InfoPanel, InfoText, Label, LegendContainer,
  LegendItem, RadioLabel, ScrollContainer, Select, Spot,
  TopRow, ViewSelector, ContainerAcoes,
} from './ModalEstatisticaTorneioStyles'
import { posicaoJogador } from '../../Enums/enums'

interface ModalEstatisticasGeralProps {
  show: boolean
  handleClose: () => void
  jogador: JogadorRow | null
}

// heatmap aggregator
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

export const ModalEstatisticaGeral: React.FC<ModalEstatisticasGeralProps> = ({
  show,
  handleClose,
  jogador,
}) => {
  const {
    finalizacaoGlobalStats,
    carregarFinalizacaoGlobalStats,
    dribleGlobalStats,
    carregarDribleGlobalStats,
    desarmeGlobalStats,
    carregarDesarmeGlobalStats,
    faltaCartaoGlobalStats,
    carregarFaltaCartaoGlobalStats,
    golGlobalStats,
    carregarGolGlobalStats,
    assistenciaGlobalStats,
    carregarAssistenciaGlobalStats,
    participacaoGolsGlobalStats,
    carregarParticipacaoGolsGlobalStats,
  } = useEstatisticaGeralEstatistica()

  const [tipo, setTipo] = useState<
    | 'finalizacao'
    | 'drible'
    | 'desarme'
    | 'falta-cartao'
    | 'cartao'
    | 'gol'
    | 'assistencia'
    | 'participacao-gols'
  >('finalizacao')
  const [statView, setStatView] = useState<
    'Por Torneio' | 'Geral' | 'Mapa de Calor'
  >('Por Torneio')
  const [loading, setLoading] = useState(false)

  // fetch whenever modal opens or tipo changes
  useEffect(() => {
    if (!show || !jogador?.id) return
    setLoading(true)
    const id = jogador.id
    switch (tipo) {
      case 'finalizacao':
        carregarFinalizacaoGlobalStats(id).finally(() => setLoading(false))
        break
      case 'drible':
        carregarDribleGlobalStats(id).finally(() => setLoading(false))
        break
      case 'desarme':
        carregarDesarmeGlobalStats(id).finally(() => setLoading(false))
        break
      case 'falta-cartao':
      case 'cartao':
        carregarFaltaCartaoGlobalStats(id).finally(() => setLoading(false))
        break
      case 'gol':
        carregarGolGlobalStats(id).finally(() => setLoading(false))
        break
      case 'assistencia':
        carregarAssistenciaGlobalStats(id).finally(() => setLoading(false))
        break
      case 'participacao-gols':
        carregarParticipacaoGolsGlobalStats(id).finally(() => setLoading(false))
        break
    }
  }, [show, jogador?.id, tipo])

  const busy =
    loading ||
    (tipo === 'finalizacao' && !finalizacaoGlobalStats) ||
    (tipo === 'drible' && !dribleGlobalStats) ||
    (tipo === 'desarme' && !desarmeGlobalStats) ||
    ((tipo === 'falta-cartao' || tipo === 'cartao') && !faltaCartaoGlobalStats) ||
    (tipo === 'gol' && !golGlobalStats) ||
    (tipo === 'assistencia' && !assistenciaGlobalStats) ||
    (tipo === 'participacao-gols' && !participacaoGolsGlobalStats)

  // preparation containers
  let dataPorT: any[] = []
  let dataGer: any[] = []
  let spotsCampo: { x: number; y: number; count: number }[] = []
  let spotsGol: { x: number; y: number; count: number }[] = []

  // Finalização
  if (tipo === 'finalizacao' && finalizacaoGlobalStats) {
    const T = finalizacaoGlobalStats.torneios as FinalizacaoTorneioStats[]
    dataPorT = T.map(t => ({
      name: t.torneioNome,
      total: t.finalizacoesCount,
      other: t.finalizacoesCertasCount,
    }))
    dataGer = [
      {
        name: 'Total Geral',
        total: finalizacaoGlobalStats.totalFinalizacoes,
        other: finalizacaoGlobalStats.totalFinalizacoesCertas,
      },
    ]
    spotsCampo = aggregate(
      T.flatMap(t =>
        t.finalizacoes
          .map(f => f.posicaoCampo)
          .filter((p): p is any => !!p),
      ),
    )
    spotsGol = aggregate(
      T.flatMap(t =>
        t.finalizacoes
          .map(f => f.posicaoGol)
          .filter((p): p is any => !!p),
      ),
    )
  }

  // Drible
  if (tipo === 'drible' && dribleGlobalStats) {
    const T = dribleGlobalStats.torneios as DribleTorneioStats[]
    dataPorT = T.map(t => ({
      name: t.nomeTorneio,
      total: t.driblesCount,
      other: t.driblesSucessoCount,
    }))
    dataGer = [
      {
        name: 'Total Geral',
        total: dribleGlobalStats.totalDrible,
        other: dribleGlobalStats.totalDribleSucesso,
      },
    ]
    spotsCampo = aggregate(
      T.flatMap(t =>
        t.dribles
          .map(d => d.posicaoCampo)
          .filter((p): p is any => !!p),
      ),
    )
    spotsGol = []
  }

  // Desarme
  if (tipo === 'desarme' && desarmeGlobalStats) {
    const T = desarmeGlobalStats.torneios as DesarmeTorneioStats[]
    dataPorT = T.map(t => ({
      name: t.nomeTorneio,
      total: t.desarmesCount,
      other: t.desarmesSucessoCount,
    }))
    dataGer = [
      {
        name: 'Total Geral',
        total: desarmeGlobalStats.totalDesarmes,
        other: desarmeGlobalStats.totalDesarmesSucesso,
      },
    ]
    spotsCampo = aggregate(
      T.flatMap(t =>
        t.desarmes
          .map(d => d.posicaoCampo)
          .filter((p): p is any => !!p),
      ),
    )
    spotsGol = []
  }

  // Faltas / Cartões ou apenas Cartões
  if ((tipo === 'falta-cartao' || tipo === 'cartao') && faltaCartaoGlobalStats) {
    const T = faltaCartaoGlobalStats.torneios as FaltaCartaoTorneioStats[]
    if (tipo === 'falta-cartao') {
      dataPorT = T.map(t => ({
        name: t.nomeTorneio,
        totalFaltas: t.totalFaltas,
        cartoesAmarelos: t.totalCartaoAmarelo,
        cartoesVermelhos: t.totalCartaoVermelho,
      }))
      dataGer = [
        {
          name: 'Total Geral',
          totalFaltas: faltaCartaoGlobalStats.totalFaltas,
          cartoesAmarelos: faltaCartaoGlobalStats.totalCartaoAmarelo,
          cartoesVermelhos: faltaCartaoGlobalStats.totalCartaoVermelho,
        },
      ]
      spotsCampo = aggregate(
        T.flatMap(t =>
          t.faltas
            .map(f => f.posicaoCampo)
            .filter((p): p is any => !!p),
        ),
      )
    } else {
      // cartao apenas
      dataPorT = T.map(t => ({
        name: t.nomeTorneio,
        cartoesAmarelos: t.totalCartaoAmarelo,
        cartoesVermelhos: t.totalCartaoVermelho,
      }))
      dataGer = [
        {
          name: 'Total Geral',
          cartoesAmarelos: faltaCartaoGlobalStats.totalCartaoAmarelo,
          cartoesVermelhos: faltaCartaoGlobalStats.totalCartaoVermelho,
        },
      ]
      spotsCampo = []
    }
    spotsGol = []
  }

  // Gols
  if (tipo === 'gol' && golGlobalStats) {
    const T = golGlobalStats.torneios as GolTorneioStats[]
    dataPorT = T.map(t => ({
      name: t.nomeTorneio,
      total: t.totalGols,
    }))
    dataGer = [
      {
        name: 'Total Geral',
        total: golGlobalStats.totalGols,
      },
    ]
    spotsCampo = aggregate(
      T.flatMap(t =>
        t.gols
          .map(g => g.posicaoCampo)
          .filter((p): p is any => !!p),
      ),
    )
    spotsGol = aggregate(
      T.flatMap(t =>
        t.gols
          .map(g => g.posicaoGol)
          .filter((p): p is any => !!p),
      ),
    )
  }

  // Assistência
  if (tipo === 'assistencia' && assistenciaGlobalStats) {
    const T = assistenciaGlobalStats.torneios as AssistenciaTorneioStats[]
    dataPorT = T.map(t => ({
      name: t.nomeTorneio,
      total: t.totalAssistencias,
    }))
    dataGer = [
      {
        name: 'Total Geral',
        total: assistenciaGlobalStats.totalAssistencias,
      },
    ]
    spotsCampo = []
    spotsGol = []
  }

  // Participação em Gols
  if (tipo === 'participacao-gols' && participacaoGolsGlobalStats) {
    const T = participacaoGolsGlobalStats.torneios as ParticipacaoTorneioStats[]
    dataPorT = T.map(t => ({
      name: t.nomeTorneio,
      total: t.totalParticipacao,
    }))
    dataGer = [
      {
        name: 'Total Geral',
        total: participacaoGolsGlobalStats.totalParticipacao,
      },
    ]
    spotsCampo = []
    spotsGol = []
  }

  const chartHeight = 240
  const barWidth = 40
  const chartPadding = 20
  const dynamicWidth = dataPorT.length * (barWidth + chartPadding)

  return (
    <BaseModal
      width="80%"
      show={show}
      handleClose={handleClose}
      title="Estatísticas Gerais"
    >
      <Container>
        <InfoPanel>
          <Avatar src={jogador?.foto} alt="Avatar" />
          <InfoText>
            <div><strong>Nome:</strong> {jogador?.name}</div>
            <div><strong>Posição:</strong> {posicaoJogador(jogador?.posicao)}</div>
            <div><strong>Idade:</strong>{' '}
              {jogador?.dataNascimento
                ? `${
                  new Date().getFullYear() -
                  new Date(jogador.dataNascimento).getFullYear()
                } anos`
                : '--'}
            </div>
            <div><strong>Equipe:</strong> {jogador?.equipeNome}</div>
          </InfoText>
        </InfoPanel>

        <ChartsWrapper>
          <Select
            value={tipo}
            onChange={e => setTipo(e.target.value as any)}
          >
            <option value="finalizacao">Finalização</option>
            <option value="drible">Drible</option>
            <option value="desarme">Desarme</option>
            <option value="falta-cartao">Faltas / Cartões</option>
            <option value="cartao">Cartões</option>
            <option value="gol">Gols</option>
            <option value="assistencia">Assistência</option>
            <option value="participacao-gols">Participação em Gols</option>
          </Select>

          <ViewSelector>
            <RadioLabel>
              <input
                type="radio"
                checked={statView === 'Por Torneio'}
                onChange={() => setStatView('Por Torneio')}
              />{' '}
              Por Torneio
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                checked={statView === 'Geral'}
                onChange={() => setStatView('Geral')}
              />{' '}
              Geral
            </RadioLabel>
            {/* esconde Mapa de Calor para cartao, assistencia e participacao */}
            {['cartao', 'assistencia', 'participacao-gols']
              .every(t => t !== tipo) && (
                <RadioLabel>
                  <input
                    type="radio"
                    checked={statView === 'Mapa de Calor'}
                    onChange={() => setStatView('Mapa de Calor')}
                  />{' '}
                  Mapa de Calor
                </RadioLabel>
            )}
          </ViewSelector>

          <TopRow>
            {busy
              ? (
                <div>Carregando dados...</div>
                )
              : statView === 'Por Torneio'
                ? (
                  <ScrollContainer>
                    <ChartBox style={{ minWidth: dynamicWidth }}>
                      <ChartTitle>Por Torneio</ChartTitle>
                      <ResponsiveContainer width="100%" height={chartHeight}>
                        <BarChart
                          data={dataPorT}
                          barCategoryGap={chartPadding}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          {['falta-cartao', 'cartao'].includes(tipo)
                            ? (
                              <>
                                {tipo !== 'cartao' && (
                                  <Bar
                                    dataKey="totalFaltas"
                                    name="Faltas"
                                    fill="#2563eb"
                                    barSize={barWidth}
                                  />
                                )}
                                <Bar
                                  dataKey="cartoesAmarelos"
                                  name="Cartões Amarelos"
                                  fill="#fbbf24"
                                  barSize={barWidth}
                                />
                                <Bar
                                  dataKey="cartoesVermelhos"
                                  name="Cartões Vermelhos"
                                  fill="#dc2626"
                                  barSize={barWidth}
                                />
                              </>
                              )
                            : ['assistencia', 'participacao-gols'].includes(tipo)
                                ? (
                                  <Bar
                                    dataKey="total"
                                    name={
                            tipo === 'assistencia'
                              ? 'Assistências'
                              : 'Participações'
                          }
                                    fill="#2563eb"
                                    barSize={barWidth}
                                  />
                                  )
                                : (
                                  <>
                                    <Bar
                                      dataKey="total"
                                      name="Total"
                                      fill="#2563eb"
                                      barSize={barWidth}
                                    />
                                    {tipo !== 'gol' && (
                                      <Bar
                                        dataKey="other"
                                        name={
                                tipo === 'finalizacao'
                                  ? 'Certas'
                                  : 'Sucesso'
                              }
                                        fill="#ef4444"
                                        barSize={barWidth}
                                      />
                                    )}
                                  </>
                                  )}
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartBox>
                  </ScrollContainer>
                  )
                : statView === 'Geral'
                  ? (
                    <ChartBox>
                      <ChartTitle>Geral</ChartTitle>
                      <ResponsiveContainer width="100%" height={chartHeight}>
                        <BarChart
                          data={dataGer}
                          barCategoryGap={chartPadding}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          {['falta-cartao', 'cartao'].includes(tipo)
                            ? (
                              <>
                                {tipo !== 'cartao' && (
                                  <Bar
                                    dataKey="totalFaltas"
                                    name="Faltas"
                                    fill="#2563eb"
                                    barSize={barWidth}
                                  />
                                )}
                                <Bar
                                  dataKey="cartoesAmarelos"
                                  name="Cartões Amarelos"
                                  fill="#fbbf24"
                                  barSize={barWidth}
                                />
                                <Bar
                                  dataKey="cartoesVermelhos"
                                  name="Cartões Vermelhos"
                                  fill="#dc2626"
                                  barSize={barWidth}
                                />
                              </>
                              )
                            : ['assistencia', 'participacao-gols'].includes(tipo)
                                ? (
                                  <Bar
                                    dataKey="total"
                                    name={
                          tipo === 'assistencia'
                            ? 'Assistências'
                            : 'Participações'
                        }
                                    fill="#2563eb"
                                    barSize={barWidth}
                                  />
                                  )
                                : (
                                  <>
                                    <Bar
                                      dataKey="total"
                                      name="Total"
                                      fill="#2563eb"
                                      barSize={barWidth}
                                    />
                                    {tipo !== 'gol' && (
                                      <Bar
                                        dataKey="other"
                                        name={
                              tipo === 'finalizacao'
                                ? 'Certas'
                                : 'Sucesso'
                            }
                                        fill="#ef4444"
                                        barSize={barWidth}
                                      />
                                    )}
                                  </>
                                  )}
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartBox>
                    )
                  : (
                    <>
                      <ContainerAcoes style={{ margin: '0 auto', width: '50%' }}>
                        <Label>Posição no Campo</Label>
                        <div
                          style={{
                            width: '100%',
                            height: '390px',
                            backgroundImage: `url(${quadraIMG})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                          }}
                        >
                          {spotsCampo.map((s, i) => (
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
                              height: '390px',
                              backgroundImage: `url(${golIMG})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative',
                            }}
                          >
                            {spotsGol.map((s, i) => (
                              <Spot key={i} x={s.x} y={s.y}>
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
            {/* Total para todos exceto falta-cartao/cartao */}
            {!['falta-cartao', 'cartao'].includes(tipo) && (
              <LegendItem>
                <ColorBox color="#2563eb" /> Total
              </LegendItem>
            )}
            {/* Sucesso/Certas para finalizacao,drible,desarme,gol */}
            {!['falta-cartao', 'cartao', 'assistencia', 'participacao-gols'].includes(tipo) && (
              <LegendItem>
                <ColorBox color="#ef4444" />{' '}
                {tipo === 'finalizacao'
                  ? 'Certas'
                  : 'Sucesso'}
              </LegendItem>
            )}
            {/* Faltas apenas para falta-cartao */}
            {tipo === 'falta-cartao' && (
              <LegendItem>
                <ColorBox color="#2563eb" /> Faltas
              </LegendItem>
            )}
            {/* Cartões para ambos */}
            {['falta-cartao', 'cartao'].includes(tipo) && (
              <>
                <LegendItem>
                  <ColorBox color="#fbbf24" /> Cartões Amarelos
                </LegendItem>
                <LegendItem>
                  <ColorBox color="#dc2626" /> Cartões Vermelhos
                </LegendItem>
              </>
            )}
          </LegendContainer>
        </ChartsWrapper>
      </Container>
    </BaseModal>
  )
}
