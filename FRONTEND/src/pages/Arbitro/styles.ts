import styled from 'styled-components'
export const Content = styled.main`
  grid-area: content;
  background: #f3f4f6;
  padding: 20px;
`

export const TableContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const Th = styled.th`
  background: #374151;
  color: white;
  padding: 10px;
  text-align: left;
`

export const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`

export const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`

// Novo container para a busca e o botão de novo
export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const NewButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: #1e4bb8;
  }

  svg {
    margin-right: 5px;
  }
`

export const SearchInput = styled.div`
display: flex;
align-items: center;
background: white;
border: 1px solid #ccc;
border-radius: 5px;
overflow: hidden;
width: 350px;

input {
  border: none;
  outline: none;
  width: 100%;
  padding: 10px;
  font-size: 14px;
}

button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  height: 100%;

  &:hover {
    background: #1e4bb8;
  }

  svg {
    font-size: 16px;
  }
}
`

export const PlayerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`
