import React from 'react'
import {
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalFooter,
  Button,
} from './styles'

interface BaseModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  disableSave?: boolean;
  width?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  show,
  handleClose,
  title,
  children,
  onSave,
  disableSave = false,
  width = '450px',
}) => {
  if (!show) return null

  return (
    <ModalContainer>
      <ModalContent width={width}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        {children}

        <ModalFooter>
          <Button className="cancel" onClick={handleClose}>Cancelar</Button>
          {onSave && (
            <Button
              className="save"
              onClick={onSave}
              disabled={disableSave}
            >
              Salvar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ModalContainer>
  )
}

export default BaseModal
