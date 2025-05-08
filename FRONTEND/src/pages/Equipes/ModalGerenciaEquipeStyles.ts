import styled from 'styled-components'

export const ModalContainer = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #374151;
  color: white;
  padding: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: sticky;
  top: 0;
  z-index: 10;
`

export const ModalTitle = styled.h4`
  margin: 0;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`

// Novo container fixo para a pesquisa
export const SearchContainer = styled.div`
  background: white;
  padding: 10px;
  position: sticky;
  top: 105px; /* Agora fica abaixo do nome do técnico */
  z-index: 9;
  display: flex;
  justify-content: center;
`
// 🔥 **Adicionando a exportação do SearchInput**
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

export const ModalBody = styled.div`
  padding: 20px;
  text-align: center;
  flex-grow: 1;
  overflow-y: auto;
`

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const EquipeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #d1d5db;
  &:first-child {
    border-top: 1px solid #d1d5db;

  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-top: 1px solid #e5e7eb;
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 10;
`

export const Button = styled.button<{ disabled?: boolean }>`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled
? 'not-allowed'
: 'pointer')};
  font-size: 14px;
  color: white;
  transition: background 0.3s;

  &.cancel {
    background: #b91c1c;
    &:hover {
      background: ${({ disabled }) => (disabled
? '#b91c1c'
: '#991b1b')};
    }
  }

  &.save {
    background: #2563eb;
    &:hover {
      background: ${({ disabled }) => (disabled
? '#2563eb'
: '#1e4bb8')};
    }
  }
`

export const FixedSection = styled.div`
  background: white;
  padding: 10px 20px;
  position: sticky;
  top: 55px; /* Agora fica abaixo da barra de pesquisa */
  z-index: 8;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;

  h5 {
    margin: 5px 0;
    font-size: 16px;
    font-weight: bold;
  }

  label {
    font-weight: bold;
    font-size: 14px;
    display: block;
  }
`

export const Select = styled.select`
  padding: 10px;
  border: '#ccc';
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: '#007bff';
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: '15px';
`

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`

export const Input = styled.input`
  padding: 10px;
  border: 1px solid '#ccc';
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: '#007bff';
  }
`

export const InputButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  text-align: left;
`

export const TdInput = styled(Td)`
  width: 120px;

  ${FormGroup} {
    margin-bottom: 0;
  }

  ${Input} {
    width: 100%;
  }
`

export const TdButton = styled(Td)`
  width: 120px;

  button {
    width: 100%;
  }
`

export const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 500;
  
  &.cancel {
  background: #e5e7eb; /* cinza claro */
  color: #374151; /* cinza escuro para contraste */

  &:hover {
    background: #d1d5db;
  }
}

  svg {
    font-size: 16px;
  }
`
