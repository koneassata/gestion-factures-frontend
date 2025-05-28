import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Pour la déconnexion

const SidebarContainer = styled.aside`
  width: 250px; /* Largeur fixe de la sidebar */
  background-color: #f0f0f0; /* Couleur de fond de la sidebar */
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--header-height) - var(--footer-height)); /* Prend la hauteur restante */
  background-color: var(--secondary-color); /* Couleur de la sidebar */
  color: white;
`;

const SidebarNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    display: block;
    padding: 10px 15px;
    background-color: #66BB6A; /* Vert un peu plus clair pour les liens */
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--primary-color);
      color: #333; /* Texte plus sombre au survol */
    }
  }
`;

const LogoutButton = styled.button`
  background-color: #dc3545; /* Rouge pour le bouton de déconnexion */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: auto; /* Pousse le bouton en bas de la sidebar */
  width: 100%;
  font-size: 1em;

  &:hover {
    background-color: #c82333;
  }
`;

const Sidebar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth'); // Rediriger vers la page d'authentification après la déconnexion
  };

  // La sidebar ne s'affiche que si l'utilisateur est authentifié
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarContainer>
      <SidebarNav>
        <ul>
          <li><Link to="/dashboard">Tableau de Bord</Link></li>
          <li><Link to="/invoices/create">Créer une Facture</Link></li>
          <li><Link to="/invoices">Liste des Factures</Link></li>
          <li><Link to="/currencies">Devises</Link></li>
          {/* Ajoutez d'autres liens ici si nécessaire */}
        </ul>
      </SidebarNav>
      <LogoutButton onClick={handleLogout}>Déconnexion</LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;