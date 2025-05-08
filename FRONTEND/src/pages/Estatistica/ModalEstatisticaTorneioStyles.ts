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
  width: 1000px;
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
 // text-align: center;
  flex-grow: 1;
  overflow-y: auto;
  
`

export const Row = styled.div`
  display: flex;
  gap:15px;
  justify-content: center;
  align-items: center;
  
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

export const FormGroup = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;


`
export const FormGroupRadio = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 20px;
  position: relative;
  div {
    gap:4px;
    display:flex;
  }
`

export const FormGroupTime = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;

`

export const InputTime = styled.div`
    display: flex;
    gap: 5px;

`

export const ErrorMessage = styled.span<{ visible?: boolean }>`
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 6px;
  visibility: ${({ visible }) => (visible
? 'visible'
: 'hidden')};
  height: 16px; /* define uma altura fixa mínima */
  display: block;
`

export const Input = styled.input<{ hasError?: boolean }>`
  padding: 10px;
  border: 1px solid ${({ hasError }) => (hasError
? '#ff4d4d'
: '#ccc')};
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${({ hasError }) => (hasError
? '#ff1a1a'
: '#007bff')};
  }
`

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Content = styled.main`
  grid-area: content;
  background: #f3f4f6;
  padding: 20px;
`

export const TableContainer = styled.div`
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
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

export const ButtonTable = styled.button`
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

// == Styled components (mantidos idênticos ao seu original) ==
export const Container = styled.div`
  display: flex;
  gap: 16px;
`
export const InfoPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px;
  padding: 16px;
  border-right: 1px solid #e5e7eb;
`
export const Avatar = styled.img`
  width: 150px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 16px;
`
export const InfoText = styled.div`
  font-size: 18px;
  color: #374151;
  line-height: 1.6;
`
export const ChartsWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 16px;
`
export const ViewSelector = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`
export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  input { margin-right: 4px; }
`
export const TopRow = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
`
export const ScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`
export const ChartBox = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`
export const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #111827;
  text-align: center;
  margin-bottom: 8px;
`
export const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
`
export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
`
export const ColorBox = styled.span<{ color: string }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: ${props => props.color};
  border-radius: 2px;
  margin-right: 8px;
`
export const ContainerAcoes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`
export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`
export const Select = styled.select`
  padding: 10px;
  border: 1px solid ${({ hasError }) => (hasError
? '#ff4d4d'
: '#ccc')};
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;
  width: 300px;
  margin-bottom: 20px;
  &:focus {
    border-color: ${({ hasError }) => (hasError
? '#ff1a1a'
: '#007bff')};
  }
`
export const Spot = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: 16px;
  height: 16px;
  background: rgba(220, 38, 38, 0.8);
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
`
