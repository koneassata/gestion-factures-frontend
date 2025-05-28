import React from 'react';
import styled from 'styled-components';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const CardTitle = styled.h3`
  color: var(--secondary-color);
  margin-bottom: 10px;
`;

const CardValue = styled.p`
  font-size: 2.5em;
  font-weight: bold;
  color: var(--primary-color);
`;

const DashboardOverview = () => {
  // Données fictives pour le dashboard
  const stats = {
    totalInvoices: 125,
    pendingInvoices: 15,
    totalRevenue: '125,450.00 €',
    averageInvoice: '550.00 €',
  };

  return (
    <DashboardGrid>
      <Card>
        <CardTitle>Total des Factures</CardTitle>
        <CardValue>{stats.totalInvoices}</CardValue>
      </Card>
      <Card>
        <CardTitle>Factures en Attente</CardTitle>
        <CardValue>{stats.pendingInvoices}</CardValue>
      </Card>
      <Card>
        <CardTitle>Revenu Total</CardTitle>
        <CardValue>{stats.totalRevenue}</CardValue>
      </Card>
      <Card>
        <CardTitle>Facture Moyenne</CardTitle>
        <CardValue>{stats.averageInvoice}</CardValue>
      </Card>
    </DashboardGrid>
  );
};

export default DashboardOverview;