import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: var(--header-height);
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.8em;
  font-weight: bold;
`;

const Nav = styled.nav`
  a {
    color: white;
    text-decoration: none;
    margin-left: 20px;
    font-size: 1.1em;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Header = () => {
  // TODO: Utilisez AuthContext pour vérifier si l'utilisateur est connecté et afficher les liens appropriés
  const isAuthenticated = false; // Remplacez par le véritable état d'authentification

  return (
    <HeaderContainer>
      <Logo to="/">Gestion Factures</Logo>
      <Nav>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Tableau de Bord</Link>
            <Link to="/invoices/create">Créer Facture</Link>
            <Link to="/invoices">Liste Factures</Link>
            <Link to="/currencies">Devises</Link>
            <Link to="/logout">Déconnexion</Link>
          </>
        ) : (
          <Link to="/auth">Se connecter / S'inscrire</Link>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;