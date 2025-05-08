import React, { useState } from 'react'
import {
  FaBars, FaTrophy, FaUsers,
  FaChartBar, FaUserTie, FaWhmcs, FaArrowLeft,
  FaRunning,
  FaUser,
} from 'react-icons/fa'
import { MdSupervisorAccount } from 'react-icons/md'

import { GiSoccerField } from 'react-icons/gi'

import {
  BackButton,
  Container, Content,
  Header, Nav, Sidebar, ToggleButton,
} from './styles'
import { Outlet } from 'react-router-dom'
import { StyledNavLink } from './styles'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const DefaultLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [title, setIsTitle] = useState<string>('')

  const location = useLocation()
  const isActiveTecnico = location.pathname === '/tecnicos' ||
   location.pathname === '/cadastrotecnico' ||
   location.pathname.startsWith('/editartecnico/')

  const isActiveJogador = location.pathname === '/jogadores' ||
   location.pathname === '/cadastrojogador' ||
   location.pathname.startsWith('/editarjogador/')

  const isActiveQuadra = location.pathname === '/quadras' ||
   location.pathname === '/cadastroquadra' ||
   location.pathname.startsWith('/editarquadra/')

  const isActiveArbitros = location.pathname === '/arbitros' ||
   location.pathname === '/cadastroarbitro' ||
   location.pathname.startsWith('/editararbitro/')

  const isActiveEquipe = location.pathname === '/equipes' ||
   location.pathname === '/cadastroequipe' ||
   location.pathname.startsWith('/editarequipe/')

  const isActiveCompeticao = location.pathname === '/competicoes' ||
   location.pathname === '/cadastrarcompeticao' ||
   location.pathname.startsWith('/editarcompeticao/')

  const isActiveEstatistica = location.pathname === '/estatisticas'

  const navigate = useNavigate()

  return (
    <Container isCollapsed={isCollapsed}>
      <Sidebar isCollapsed={isCollapsed}>
        <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <FaBars />
        </ToggleButton>
        <Nav isCollapsed={isCollapsed}>

          <StyledNavLink
            className={isActiveCompeticao
              ? 'active'
              : ''} to="/competicoes"
          >
            <FaUserTie /><span>Competições</span>
          </StyledNavLink>

          <StyledNavLink
            className={isActiveEquipe
              ? 'active'
              : ''} to="/equipes"
          >
            <FaUser /><span>Equipes</span>
          </StyledNavLink>

          <StyledNavLink
            className={isActiveEstatistica
              ? 'active'
              : ''} to="/estatisticas"
          >
            <FaChartBar /><span>Estatísticas</span>
          </StyledNavLink>

          <StyledNavLink
            className={isActiveTecnico
              ? 'active'
              : ''} to="/tecnicos"
          >
            <MdSupervisorAccount /><span>Técnicos</span>
          </StyledNavLink>
          <StyledNavLink
            className={isActiveJogador
              ? 'active'
              : ''} to="/jogadores"
          >
            <FaRunning /><span>Jogadores</span>
          </StyledNavLink>

          <StyledNavLink
            className={isActiveQuadra
              ? 'active'
              : ''} to="/quadras"
          >
            <GiSoccerField /><span>Quadras</span>
          </StyledNavLink>

          <StyledNavLink
            className={isActiveArbitros
              ? 'active'
              : ''} to="/arbitros"
          >
            <FaWhmcs /><span>Arbitros</span>
          </StyledNavLink>

        </Nav>
      </Sidebar>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Voltar
        </BackButton>
        <span>FutsAnálise  1.0</span>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Container>
  )
}

export default DefaultLayout
