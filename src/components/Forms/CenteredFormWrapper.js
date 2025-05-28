import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center; /* Centrage horizontal */
  align-items: center;     /* Centrage vertical (si le conteneur le permet) */
  /* Utilise calc pour s'adapter à la hauteur du header et du footer */
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  padding: 20px;
  box-sizing: border-box; /* Inclure le padding dans le calcul de la hauteur */
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; /* Limiter la largeur du formulaire */
  text-align: center; /* Centrer le texte dans le conteneur du formulaire si nécessaire */
`;

const CenteredFormWrapper = ({ children }) => {
  return (
    <Wrapper>
      <FormContainer>
        {children}
      </FormContainer>
    </Wrapper>
  );
};

export default CenteredFormWrapper;