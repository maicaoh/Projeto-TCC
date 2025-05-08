import styled from 'styled-components'

export const Content = styled.div`
  background: #f3f4f6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
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
