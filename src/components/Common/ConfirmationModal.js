import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Fond semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Assure que le modal est au-dessus de tout */
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 90%;
  max-width: 400px;
  color: var(--text-color);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: var(--primary-color);
  font-size: 1.5em;
`;

const ModalMessage = styled.p`
  margin-bottom: 25px;
  font-size: 1.1em;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 15px;
`;

const ConfirmButton = styled.button`
  background-color: #dc3545; /* Rouge pour confirmer la suppression */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d; /* Gris pour annuler */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null; // Ne rend rien si le modal n'est pas ouvert
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>Confirmation</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ButtonGroup>
          <ConfirmButton onClick={onConfirm}>Confirmer</ConfirmButton>
          <CancelButton onClick={onCancel}>Annuler</CancelButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;