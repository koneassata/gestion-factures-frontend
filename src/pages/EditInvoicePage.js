// client/src/pages/EditInvoicePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import invoiceService from '../services/invoiceService'; // Importez votre service de facture

const InvoiceForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: var(--text-color);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--text-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
  min-height: 80px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const PrimaryButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const SecondaryButton = styled.button`
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #5a6268;
  }
`;

const EditInvoicePage = () => {
  const { id } = useParams(); // Récupère l'ID de la facture depuis l'URL
  const navigate = useNavigate(); // Pour la redirection
  const [invoiceData, setInvoiceData] = useState({
    clientName: '',
    clientAddress: '',
    invoiceDate: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    totalAmount: 0,
    status: 'pending',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données de la facture quand le composant monte ou que l'ID change
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await invoiceService.getInvoiceById(id);
        // Formate les dates pour les inputs type="date"
        data.invoiceDate = data.invoiceDate ? new Date(data.invoiceDate).toISOString().split('T')[0] : '';
        data.dueDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '';
        setInvoiceData(data);
      } catch (err) {
        console.error("Erreur lors du chargement de la facture:", err);
        setError("Impossible de charger la facture. Assurez-vous d'être connecté et que l'ID est valide.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setInvoiceData({ ...invoiceData, items: newItems });
    calculateTotal(newItems);
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
    calculateTotal(newItems);
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.unitPrice || 0)), 0);
    setInvoiceData(prevData => ({ ...prevData, totalAmount: total }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appelle le service de mise à jour de facture
      await invoiceService.updateInvoice(id, invoiceData);
      alert('Facture mise à jour avec succès !');
      navigate('/invoices'); // Redirige vers la liste des factures
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la facture:', err.response?.data?.message || err.message);
      alert('Erreur lors de la mise à jour de la facture: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <InvoiceForm>Chargement de la facture pour modification...</InvoiceForm>;
  }

  if (error) {
    return <InvoiceForm style={{ color: 'red' }}>{error}</InvoiceForm>;
  }

  if (!invoiceData || Object.keys(invoiceData).length === 0) {
    return <InvoiceForm>Facture non trouvée ou erreur de données.</InvoiceForm>;
  }

  return (
    <InvoiceForm onSubmit={handleSubmit}>
      <h2>Modifier la Facture</h2>
      <FormGroup>
        <Label htmlFor="clientName">Nom du client</Label>
        <Input type="text" id="clientName" name="clientName" value={invoiceData.clientName || ''} onChange={handleInputChange} required />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="clientAddress">Adresse du client</Label>
        <TextArea id="clientAddress" name="clientAddress" value={invoiceData.clientAddress || ''} onChange={handleInputChange} required />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="invoiceDate">Date de la facture</Label>
        <Input type="date" id="invoiceDate" name="invoiceDate" value={invoiceData.invoiceDate || ''} onChange={handleInputChange} required />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="dueDate">Date d'échéance</Label>
        <Input type="date" id="dueDate" name="dueDate" value={invoiceData.dueDate || ''} onChange={handleInputChange} required />
      </FormGroup>

      <h3>Articles</h3>
      {invoiceData.items.map((item, index) => (
        <div key={index} style={{ border: '1px dashed var(--border-color)', padding: '10px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <FormGroup>
            <Label htmlFor={`description-${index}`}>Description</Label>
            <Input type="text" id={`description-${index}`} name="description" value={item.description || ''} onChange={(e) => handleItemChange(index, e)} required />
          </FormGroup>
          <div style={{ display: 'flex', gap: '10px' }}>
              <FormGroup style={{ flex: 1 }}>
                  <Label htmlFor={`quantity-${index}`}>Quantité</Label>
                  <Input type="number" id={`quantity-${index}`} name="quantity" value={item.quantity || 0} onChange={(e) => handleItemChange(index, e)} required min="1" />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                  <Label htmlFor={`unitPrice-${index}`}>Prix Unitaire</Label>
                  <Input type="number" id={`unitPrice-${index}`} name="unitPrice" value={item.unitPrice || 0} onChange={(e) => handleItemChange(index, e)} required min="0" step="0.01" />
              </FormGroup>
          </div>
          {invoiceData.items.length > 1 && (
            <SecondaryButton type="button" onClick={() => removeItem(index)}>Supprimer l'article</SecondaryButton>
          )}
        </div>
      ))}
      <PrimaryButton type="button" onClick={addItem}>Ajouter un article</PrimaryButton>

      <FormGroup>
        <Label htmlFor="totalAmount">Montant Total</Label>
        <Input type="text" id="totalAmount" name="totalAmount" value={`${invoiceData.totalAmount.toFixed(2)} €`} readOnly />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="status">Statut</Label>
        <select id="status" name="status" value={invoiceData.status || 'pending'} onChange={handleInputChange}>
          <option value="pending">En attente</option>
          <option value="paid">Payée</option>
          <option value="overdue">En retard</option>
        </select>
      </FormGroup>

      <ButtonGroup>
        <PrimaryButton type="submit">Mettre à Jour la Facture</PrimaryButton>
        <SecondaryButton type="button" onClick={() => navigate('/invoices')}>Annuler</SecondaryButton>
      </ButtonGroup>
    </InvoiceForm>
  );
};

export default EditInvoicePage;