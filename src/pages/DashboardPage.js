import React from 'react';
import styled from 'styled-components';
import DashboardOverview from '../components/Dashboard/DashboardOverview';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 20px auto;
`;

const Title = styled.h1`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 30px;
`;

const DashboardPage = () => {
  return (
    <DashboardContainer>
      <Title>Bienvenue sur votre Tableau de Bord</Title>
      <DashboardOverview />
      {/* Vous pouvez ajouter d'autres sections ici, comme des graphiques, des alertes, etc. */}
    </DashboardContainer>
  );
};

export default DashboardPage;