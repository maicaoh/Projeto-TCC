import styled from 'styled-components'

export const Content = styled.div`
  background: #f3f4f6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
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
? '25px'
: '0')};
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
  position: absolute;
  bottom: -18px;
  left: 0;
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
