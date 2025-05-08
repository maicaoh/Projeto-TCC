import styled from 'styled-components'

export const HeaderContainer = styled.div`
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  position: relative;
`

export const UserGreeting = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  left: 15px;
`

export const ProfilePicture = styled.div`
  width: 60px;
  height: 60px;
  background-color: white;
  border-radius: 50%;
`

export const Title = styled.h1`
 margin: 0;
 font-size: 1.5rem;
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
  left: 5rem;

  &:hover {
    color: #2563eb;
  }

  svg {
    margin-right: 5px;
  }
`
