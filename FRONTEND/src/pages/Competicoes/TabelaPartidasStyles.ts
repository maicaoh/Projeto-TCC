import styled from 'styled-components'

export const Content = styled.div`
  background: #f3f4f6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 1250px;
  margin: auto;
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

export const FormGroup = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: ${({ hasError }) => (hasError
? '30px'
: '15px')};
`

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
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

export const ErrorMessage = styled.span`
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
  position: relative; /* <-- troque de absolute para relative */
  margin-bottom: 6px;  /* <-- adiciona espaçamento entre o erro e o próximo input */
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  color: white;
  transition: background 0.3s;

  &.cancel {
    background: #d32f2f;
    &:hover {
      background: #b71c1c;
    }
  }
  &.save {
    background: #2563eb;
    &:hover {
      background: #1e4bb8;
    }
  }
  svg {
    margin-right: 5px;
  }
`

export const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

export const ImageUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 24px;
  color: #777;
  transition: color 0.3s;
  &:hover {
    color: #333;
  }
  input {
    display: none;
  }
`

export const PreviewImage = styled.img`
  max-width: 120px;
  max-height: 120px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 5px;
  border: 1px solid #ccc;
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

  &:focus {
    border-color: ${({ hasError }) => (hasError
? '#ff1a1a'
: '#007bff')};
  }
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
// Novo container fixo para a pesquisa
export const SearchContainer = styled.div`
  background: white;
  padding: 10px;
  position: sticky;
  top: 105px; /* Agora fica abaixo do nome do técnico */
  z-index: 9;
  display: flex;
`

export const FormWrapper = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
`

export const FormSide = styled.div`
  flex: 1;
  background: #f3f4f6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

export const PlayerListContainer = styled.div`
  background-color: #f8f9fa; /* Cor igual à do formulário */
  border-radius: 8px;
  padding: 15px;
`

export const PlayerListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    font-size: 18px;
    color: #333;
  }

  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #2563eb;
    }
  }
`

export const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const PlayerItem = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 5px;
  transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid #ddd;

  &:hover {
    background: #eef2ff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  span {
    font-size: 14px;
    color: #333;
  }

  input {
    transform: scale(1.2);
    cursor: pointer;
  }
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

export const FormGroupCheckbox = styled.div<{ hasError?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 2px;
  margin-bottom: ${({ hasError }) => (hasError
? '30px'
: '15px')};

  input[type="checkbox"] {
    transform: scale(1.2);
    cursor: pointer;
  }

  label {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    user-select: none;
  }
`

export const PlayerImage = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-right: 8px;
`
export const TdEquipe = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  gap: 8px;
`
export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

export const PartidaCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  max-width: 724px;
  margin-left: auto;
  margin-right: auto;
`

interface HeaderDataProps {
  status: number;
}

export const HeaderData = styled.div<HeaderDataProps>`
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

export const TimesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
`

export const Time = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    margin-bottom: 4px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
`

export const Versus = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #555;
`

export const InfoContainer = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  justify-content: space-between;
`

export const Acoes = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
`

export const ButtonAcoes = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  font-size: 18px;

  &:hover {
    color: #0056b3;
  }
`
export const Placar = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #222;
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    color: #555;
  }
`

export const HeaderRodada = styled.h3`
  margin-top: 2rem;
  max-width: 724px;
  margin: 2rem auto 0px auto;
  text-align: center;
  padding: 24px;
  background-color: #374151de;
  color: ${(props) => props.theme['white']}
`
