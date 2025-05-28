import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 15px 20px;
  margin-top: 40px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  height: var(--footer-height);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; {new Date().getFullYear()} Gestion Factures. Tous droits réservés.</p>
    </FooterContainer>
  );
};

export default Footer;