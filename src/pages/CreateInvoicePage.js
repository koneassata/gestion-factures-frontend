import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import CenteredFormWrapper from '../components/Forms/CenteredFormWrapper';
import { useReactToPrint } from 'react-to-print';
import invoiceService from '../services/invoiceService';
import { useNavigate } from 'react-router-dom';

// Styles des composants (aucun changement ici, juste pour la complétude)
const InvoiceForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
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

const PrintableInvoice = styled.div`
  padding: 20px;
  background-color: white;
  border: 1px solid #eee;
  margin: 20px;

  @media print {
    margin: 0;
    padding: 0;
    box-shadow: none;
    /* Vous pouvez ajouter d'autres styles spécifiques à l'impression ici */
    /* Par exemple, ajuster la taille de la police, cacher des éléments non pertinents, etc. */
  }
`;

const CreateInvoicePage = () => {
  const [invoiceData, setInvoiceData] = useState({
    clientName: '',
    clientAddress: '',
    invoiceDate: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    totalAmount: 0,
    status: 'pending',
  });

  const printRef = useRef();
  const navigate = useNavigate();

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
    // Assurez-vous que quantity et unitPrice sont traités comme des nombres
    const total = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    setInvoiceData(prevData => ({ ...prevData, totalAmount: total }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Facture à enregistrer:', invoiceData);
    try {
      const createdInvoice = await invoiceService.createInvoice(invoiceData);
      console.log('Facture créée avec succès:', createdInvoice);
      alert('Facture créée avec succès !');
      navigate('/invoices');
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error.response?.data?.message || error.message);
      alert('Erreur lors de la création de la facture: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePrint = useReactToPrint({
    content: () => {
      console.log("Tentative d'impression de l'élément:", printRef.current); // Ajout pour le débogage
      return printRef.current;
    },
    documentTitle: `Facture_${invoiceData.clientName || 'NouvelleFacture'}_${invoiceData.invoiceDate}`,
    // Vous pouvez ajouter d'autres options ici si nécessaire, ex: pageStyle
    // pageStyle: `
    //   @page { size: A4 portrait; margin: 20mm; }
    //   body { -webkit-print-color-adjust: exact; }
    // `
  });

  return (
    <CenteredFormWrapper>
      <h2>Créer une Nouvelle Facture</h2>
      <InvoiceForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="clientName">Nom du client</Label>
          <Input type="text" id="clientName" name="clientName" value={invoiceData.clientName} onChange={handleInputChange} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="clientAddress">Adresse du client</Label>
          <TextArea id="clientAddress" name="clientAddress" value={invoiceData.clientAddress} onChange={handleInputChange} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="invoiceDate">Date de la facture</Label>
          <Input type="date" id="invoiceDate" name="invoiceDate" value={invoiceData.invoiceDate} onChange={handleInputChange} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="dueDate">Date d'échéance</Label>
          <Input type="date" id="dueDate" name="dueDate" value={invoiceData.dueDate} onChange={handleInputChange} required />
        </FormGroup>

        <h3>Articles</h3>
        {invoiceData.items.map((item, index) => (
          <div key={index} style={{ border: '1px dashed var(--border-color)', padding: '10px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <FormGroup>
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Input type="text" id={`description-${index}`} name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} required />
            </FormGroup>
            <div style={{ display: 'flex', gap: '10px' }}>
              <FormGroup style={{ flex: 1 }}>
                <Label htmlFor={`quantity-${index}`}>Quantité</Label>
                <Input type="number" id={`quantity-${index}`} name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required min="1" />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label htmlFor={`unitPrice-${index}`}>Prix Unitaire</Label>
                <Input type="number" id={`unitPrice-${index}`} name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} required min="0" step="0.01" />
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
          {/* Assurez-vous que totalAmount est un nombre avant toFixed */}
          <Input type="text" id="totalAmount" name="totalAmount" value={`${Number(invoiceData.totalAmount).toFixed(2)} €`} readOnly />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="status">Statut</Label>
          <select id="status" name="status" value={invoiceData.status} onChange={handleInputChange}>
            <option value="pending">En attente</option>
            <option value="paid">Payée</option>
            <option value="overdue">En retard</option>
          </select>
        </FormGroup>

        <ButtonGroup>
          <PrimaryButton type="submit">Enregistrer la Facture</PrimaryButton>
          <SecondaryButton type="button" onClick={handlePrint}>Imprimer la Facture</SecondaryButton>
        </ButtonGroup>
      </InvoiceForm>

      {/* CHANGEMENT CLÉ ICI : Utilisation de position: absolute pour cacher l'élément sans le retirer du DOM */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <PrintableInvoice ref={printRef}>
          <h2>Facture</h2>
          <p><strong>Client:</strong> {invoiceData.clientName}</p>
          <p><strong>Adresse:</strong> {invoiceData.clientAddress}</p>
          <p><strong>Date Facture:</strong> {invoiceData.invoiceDate}</p>
          <p><strong>Date Échéance:</strong> {invoiceData.dueDate}</p>
          <h3>Détails des articles:</h3>
          <ul>
            {invoiceData.items.map((item, index) => (
              <li key={index}>
                {item.description} - {item.quantity} x {item.unitPrice} € = {(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)} €
              </li>
            ))}
          </ul>
          <h3>Total: {Number(invoiceData.totalAmount).toFixed(2)} €</h3>
        </PrintableInvoice>
      </div>
    </CenteredFormWrapper>
  );
};

export default CreateInvoicePage;