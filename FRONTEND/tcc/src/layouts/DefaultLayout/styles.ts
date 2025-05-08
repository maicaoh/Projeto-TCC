import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

interface ContainerProps {
  isCollapsed: boolean;
}

export const Container = styled.div<ContainerProps>`
    display: grid;
    grid-template-columns: ${({ isCollapsed }) => (isCollapsed
  ? '80px'
  : '250px')} 1fr;
    grid-template-rows: 80px auto;
    grid-template-areas:
      "sidebar header"
      "sidebar content";
    height: 100vh;
    transition: grid-template-columns 0.3s ease;
  `

export const Sidebar = styled.aside<ContainerProps>`
    grid-area: sidebar;
    background: #1f2937;
    color: white;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: ${({ isCollapsed }) => (isCollapsed
  ? 'center'
  : 'flex-start')};
    transition: width 0.3s ease;
    overflow: hidden;
  `

export const ToggleButton = styled.button`
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  `

interface NavProps {
  isCollapsed: boolean;
}

export const Nav = styled.nav<NavProps>`
    width: ${({ isCollapsed }) => (!isCollapsed
  ? '100%'
  : 'auto')};
    ul {
      list-style: none;
      padding: 0;
      width: 100%;
    }
  
    li {
      display: flex;
      align-items: center;
      padding: 12px;
      cursor: pointer;
      background: #374151;
      margin: 5px 0;
      border-radius: 5px;
      text-align: left;
      transition: background 0.3s;
    }
  
    li:hover {
      background: #4b5563;
    }
  
    span {
      margin-left: 10px;
      display: ${({ isCollapsed }) => (isCollapsed
  ? 'none'
  : 'inline')};
      transition: display 0.3s;
    }
  `

export const Header = styled.header`
  grid-area: header;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center; /* Mantém o título no centro */
  position: relative;
  font-size: 1.5rem;
  height: 80px;
`

export const Content = styled.main`
  grid-area: content;
  background: #f3f4f6;
  padding: 20px;
  overflow: auto; /* Permite rolagem caso o conteúdo exceda a altura disponível */
  max-height: calc(100vh - 80px); /* Garante que a altura não ultrapasse o limite da tela */
`

export const StyledNavLink = styled(NavLink)`
display: flex;
align-items: center;
padding: 12px;
cursor: pointer;
background: #374151;
margin: 5px 0;
border-radius: 5px;
text-align: left;
text-decoration: none;
color: white;
transition: background 0.3s;

&:hover {
  background: #4b5563;
}

&.active {
  background: #2563eb;
}

span {
  margin-left: 10px;
}
`

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: absolute;
  left: 1rem; /* Mantém o botão fixo na esquerda */
  
  &:hover {
    color: #2563eb;
  }

  svg {
    margin-right: 5px;
  }
`
