import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  FaFutbol, FaRunning, FaIdCard, FaShieldAlt,
  FaHandPaper, FaBullseye, FaArrowLeft, FaCheck,
} from 'react-icons/fa'
import { Partida, PartidaFormatada } from '../../context/PartidaContext/PartidaContext'
import { usePartida } from '../../context/PartidaContext/PartidaContext'
import { Competicao } from '../../context/CompeticaoContext/CompeticaoContext'
import { ModalGol } from './ModalGol'
import Swal from 'sweetalert2'
import { statusPartida } from '../../Enums/enums'
import { ModalFinalizacao } from './ModalFinalizacao'
import { ModalDrible } from './ModalDrible'
import { ModalDesarme } from './ModalDesarme'
import { ModalFalta } from './ModalFalta'
import { ModalCartao } from './ModalCartao'
const Container = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 900px;
  margin: 20px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const Title = styled.h2`
  font-weight: 600;
  margin-bottom: 12px;
`

const ScoreBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
`

const TeamContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TeamLogo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 4px;
`

const TeamName = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`

const Score = styled.div`
  font-size: 40px;
  font-weight: bold;
  border: 1px solid #ccc;
  padding: 8px 20px;
  border-radius: 6px;
  background: #f9f9f9;
  margin-right: 15px;
  margin-left: 15px;
`

export const InfoContainer = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`

const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 24px;
`

const ActionButton = styled.button`
  background: #f1f1f1;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`

const ContentGol = styled.div`
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    margin-top: 2rem ;
`

const ActionButtonGol = styled.button`
  background: #f1f1f1;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
`

interface HeaderDataProps {
  status: number;
}

const HeaderData = styled.div<HeaderDataProps>`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #444;
    height: 24px;
  
    .status {
      position: absolute;
      left: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${props =>
        props.status === 1
          ? 'green'
          : props.status === 2
          ? 'red'
          : 'transparent'
      };
      ${props => props.status === 1 && `
        animation: pulse 1s infinite;
      `}
      ${props => props.status !== 1 && props.status !== 2 && `
        display: none;
      `}
    }
  
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.6; }
      100% { transform: scale(1); opacity: 1; }
    }
  `

const IconTextButton = styled.button<{ primary?: boolean }>`
  background: ${({ primary }) => (primary
? '#1e88e5'
: '#f1f1f1')};
  color: ${({ primary }) => (primary
? '#fff'
: '#000')};
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: ${({ primary }) => (primary
? '#1565c0'
: '#e0e0e0')};
  }
`

interface Data {
  id: string | null
  setViewExplorarPartida: React.Dispatch<React.SetStateAction<Partida | null>>;
  torneio: Competicao
}

export default function AcoesPartida(data: Data) {
  const [partidaFormatada, setPartidaFormatada] = useState<PartidaFormatada>(null)
  const [modalGolOpen, setModalOpen] = useState<boolean>(false)
  const [modalOpenFinalizacao, setModalOpenFinalizacao] = useState<boolean>(false)
  const [modalOpenDrible, setModalOpenModalDible] = useState<boolean>(false)
  const [modalOpenDesarme, setModaOpenDesarme] = useState<boolean>(false)
  const [modalOpenFalta, setModaOpenFalta] = useState<boolean>(false)
  const [modalOpenCartao, setModalOpenCartao] = useState<boolean>(false)

  const { id, setViewExplorarPartida, torneio } = data
  const { buscarPartidaPorId, atualizarPartida } = usePartida()

  console.log(torneio)
  useEffect(() => {
    getPartidaAtt()
  }, [id, buscarPartidaPorId, modalGolOpen, modalOpenFinalizacao])

  function getPartidaAtt() {
    if (id) {
      buscarPartidaPorId(id).then((data) => {
        setPartidaFormatada(data.data)
      })
    }
  }

  function handleClose() {
    setModalOpen(false)
  }

  function handleCloseFinalizacao() {
    setModalOpenFinalizacao(false)
  }
  function handleCloseDrible() {
    setModalOpenModalDible(false)
  }

  function handleCloseDesarme() {
    setModaOpenDesarme(false)
  }

  function handleCloseFalta() {
    setModaOpenFalta(false)
  }

  function handleCloseCartao() {
    setModalOpenCartao(false)
  }

  function formatarDataIsoParaDdMmAaaa(valor: Date) {
    if (!valor) return '--'
    const data = new Date(valor)
    if (isNaN(data.getTime())) return '--'
    const dia = String(data.getUTCDate()).padStart(2, '0')
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0')
    const ano = data.getUTCFullYear()
  }

  async function changePartida(status:number) {
    const resultado = await atualizarPartida(partidaFormatada?.id, { status })

    if (resultado.sucesso) {
      Swal.fire('Sucesso!', 'Partida atualizado com sucesso!', 'success')
      getPartidaAtt()
    } else {
      Swal.fire({
        title: 'Erro!',
        text: `Código: ${resultado.erro?.status || 'Desconhecido'} - ${resultado.erro?.message || 'Erro inesperado'}`,
        icon: 'error',
      })
    }
  }

  return (
    <Container>
      <ModalGol show={modalGolOpen} handleClose={() => handleClose()} partida={partidaFormatada} />
      <ModalFinalizacao show={modalOpenFinalizacao} handleClose={() => handleCloseFinalizacao()} partida={partidaFormatada} />
      <ModalDrible show={modalOpenDrible} handleClose={() => handleCloseDrible()} partida={partidaFormatada} />
      <ModalDesarme show={modalOpenDesarme} handleClose={() => handleCloseDesarme()} partida={partidaFormatada} />
      <ModalFalta show={modalOpenFalta} handleClose={() => handleCloseFalta()} partida={partidaFormatada} />
      <ModalCartao show={modalOpenCartao} handleClose={() => handleCloseCartao()} partida={partidaFormatada} />

      <Header>

        <HeaderData status={partidaFormatada?.status}>
          <div className="status">
            <span className="dot" />
            {statusPartida(partidaFormatada?.status)}
          </div>

          <div>{partidaFormatada?.data
            ? formatarDataIsoParaDdMmAaaa(partidaFormatada?.data)
            : '--'}
          </div>
        </HeaderData>

        <Title>{torneio.nome}</Title>
        <ScoreBox>
          <TeamContainer>
            <div>
              <TeamLogo src={partidaFormatada?.equipeCasa?.logo} alt="Equipe mandante" />
              <TeamName>{partidaFormatada?.equipeCasa?.name}</TeamName>
            </div>

            <Score>{partidaFormatada?.status === 0
              ? '--'
              : partidaFormatada?.equipeCasa?.golsMarcados}
            </Score>
          </TeamContainer>
          <span style={{ fontSize: 24, fontWeight: 'bold' }}>x</span>
          <TeamContainer>

            <Score>{partidaFormatada?.status === 0
              ? '--'
              : partidaFormatada?.equipeVisitante?.golsMarcados}
            </Score>
            <div>
              <TeamLogo src={partidaFormatada?.equipeVisitante?.logo} alt="Equipe visitante" />
              <TeamName>{partidaFormatada?.equipeVisitante?.name}</TeamName>
            </div>
          </TeamContainer>

        </ScoreBox>

        <InfoContainer>
          <div>Data: {partidaFormatada?.data
            ? formatarDataIsoParaDdMmAaaa(partidaFormatada?.data)
            : '--'}
          </div>

          <div>Quadra: {partidaFormatada?.quadra?.name || '--'}</div>
          <div>Público: {partidaFormatada?.publicoPresente || '--'}</div>
        </InfoContainer>

        {partidaFormatada?.status === 1 && <ContentGol>
          <ActionButtonGol onClick={() => setModalOpen(true)}>
            <FaFutbol /> Gol
          </ActionButtonGol>
        </ContentGol>}

      </Header>

      {partidaFormatada?.status === 1 && <ActionsContainer>
        <ActionButton onClick={() => setModalOpenModalDible(true)}><FaRunning /> Adicionar Drible</ActionButton>
        <ActionButton onClick={() => setModalOpenCartao(true)}><FaIdCard /> Adicionar Cartão</ActionButton>
        <ActionButton onClick={() => setModaOpenDesarme(true)}><FaShieldAlt /> Adicionar Desarme</ActionButton>
        <ActionButton onClick={() => setModaOpenFalta(true)}><FaHandPaper /> Adicionar Falta</ActionButton>
        <ActionButton onClick={() => setModalOpenFinalizacao(true)}><FaBullseye /> Adicionar Finalização</ActionButton>
      </ActionsContainer>}

      <div />

      <Footer>
        <IconTextButton onClick={() => setViewExplorarPartida(null)}><FaArrowLeft /> Voltar</IconTextButton>
        {partidaFormatada?.status === 0 && <IconTextButton onClick={() => changePartida(1)} primary><FaCheck /> Iniciar partida</IconTextButton>}

        {partidaFormatada?.status === 1 && <IconTextButton onClick={() => changePartida(2)} primary><FaCheck /> Finalizar partida</IconTextButton>}

      </Footer>
    </Container>
  )
}
