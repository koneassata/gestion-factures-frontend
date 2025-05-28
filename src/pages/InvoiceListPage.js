import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import ConfirmationModal from '../components/Common/ConfirmationModal'; // Importez votre nouveau modal

const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 30px;
`;

const InvoiceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: var(--secondary-color);
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;

  &.view {
    background-color: #007bff;
    color: white;
    &:hover { background-color: #0056b3; }
  }
  &.edit {
    background-color: #ffc107;
    color: #333;
    &:hover { background-color: #e0a800; }
  }
  &.delete {
    background-color: #dc3545;
    color: white;
    &:hover { background-color: #c82333; }
  }
`;

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // État pour contrôler l'affichage du modal
  const [invoiceToDelete, setInvoiceToDelete] = useState(null); // Pour stocker l'ID de la facture à supprimer

  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDeleteClick = (invoiceId) => {
    setInvoiceToDelete(invoiceId); // Stocke l'ID
    setShowModal(true); // Ouvre le modal
  };

  const confirmDelete = async () => {
    setShowModal(false); // Ferme le modal
    if (invoiceToDelete) {
      try {
        await invoiceService.deleteInvoice(invoiceToDelete);
        setInvoices(invoices.filter(invoice => invoice._id !== invoiceToDelete));
        setInvoiceToDelete(null); // Réinitialise
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression de la facture');
      }
    }
  };

  const cancelDelete = () => {
    setShowModal(false); // Ferme le modal
    setInvoiceToDelete(null); // Réinitialise
  };

  if (loading) {
    return <PageContainer>Chargement des factures...</PageContainer>;
  }

  if (error) {
    return <PageContainer style={{ color: 'red' }}>Erreur: {error}</PageContainer>;
  }

  return (
    <PageContainer>
      <Title>Mes Factures</Title>
      {invoices.length === 0 ? (
        <p>Aucune facture trouvée. Commencez par en créer une !</p>
      ) : (
        <InvoiceTable>
          <thead>
            <TableRow>
              <TableHeader>Client</TableHeader>
              <TableHeader>Date Facture</TableHeader>
              <TableHeader>Date Échéance</TableHeader>
              <TableHeader>Montant Total</TableHeader>
              <TableHeader>Statut</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  <Actions>
                    {/* Vous pouvez ajouter une page de détail ou d'édition ici */}
                    <ActionButton className="view" onClick={() => navigate(`/invoices/${invoice._id}`)}>Voir</ActionButton>
                    <ActionButton className="edit" onClick={() => navigate(`/invoices/edit/${invoice._id}`)}>Modifier</ActionButton>
                    <ActionButton className="delete" onClick={() => handleDeleteClick(invoice._id)}>Supprimer</ActionButton>
                  </Actions>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </InvoiceTable>
      )}

      {/* Le composant de modal de confirmation */}
      <ConfirmationModal
        isOpen={showModal}
        message="Êtes-vous sûr de vouloir supprimer cette facture ?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </PageContainer>
  );
};

export default InvoiceListPage;