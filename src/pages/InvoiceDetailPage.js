// client/src/pages/InvoiceDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importez useParams et useNavigate
import styled from 'styled-components';
import invoiceService from '../services/invoiceService'; // Importez votre service de facture

const PageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: var(--text-color);
`;

const DetailItem = styled.div`
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border-color);
  &:last-child {
    border-bottom: none;
  }
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const Item = styled.li`
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const InvoiceDetailPage = () => {
  const { id } = useParams(); // Récupère l'ID de la facture depuis l'URL
  const navigate = useNavigate(); // Pour la redirection
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await invoiceService.getInvoiceById(id);
        setInvoice(data);
      } catch (err) {
        console.error("Erreur lors du chargement de la facture:", err);
        setError("Impossible de charger la facture. Assurez-vous d'être connecté.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]); // Déclenche le chargement quand l'ID change

  if (loading) {
    return <PageContainer>Chargement de la facture...</PageContainer>;
  }

  if (error) {
    return <PageContainer style={{ color: 'red' }}>{error}</PageContainer>;
  }

  if (!invoice) {
    return <PageContainer>Facture non trouvée.</PageContainer>;
  }

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <PageContainer>
      <h2>Détails de la Facture # {invoice._id}</h2>
      <DetailItem><strong>Client:</strong> {invoice.clientName}</DetailItem>
      <DetailItem><strong>Adresse:</strong> {invoice.clientAddress}</DetailItem>
      <DetailItem><strong>Date de la facture:</strong> {formatDate(invoice.invoiceDate)}</DetailItem>
      <DetailItem><strong>Date d'échéance:</strong> {formatDate(invoice.dueDate)}</DetailItem>
      <DetailItem><strong>Statut:</strong> {invoice.status}</DetailItem>
      
      <h3>Articles:</h3>
      <ItemList>
        {invoice.items.map((item, index) => (
          <Item key={index}>
            <span>{item.description}</span>
            <span>{item.quantity} x {item.unitPrice.toFixed(2)} € = {(item.quantity * item.unitPrice).toFixed(2)} €</span>
          </Item>
        ))}
      </ItemList>
      
      <DetailItem><strong>Montant Total:</strong> {invoice.totalAmount.toFixed(2)} €</DetailItem>

      <Button onClick={() => navigate('/invoices')}>Retour à la liste</Button>
    </PageContainer>
  );
};

export default InvoiceDetailPage;