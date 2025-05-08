import { HeaderContainer, ProfilePicture, Title, UserGreeting } from './styles'
import { BackButton } from './styles'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const Header = () => {
  const navigate = useNavigate()
  return (
    <HeaderContainer>
      <UserGreeting>
        <ProfilePicture />
        <span>Olá, Gilson!</span>
      </UserGreeting>

      <Title>Futsanalitcs 1.0 - Equipes/Jogadores</Title>
    </HeaderContainer>
  )
}

export default Header
