// client/src/pages/PrintInvoicePage.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import invoiceService from '../services/invoiceService'; // Assurez-vous que le chemin est correct

// --- Styles pour la facture imprimable ---
const PrintableInvoiceContainer = styled.div`
  padding: 20px;
  background-color: white;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 20px auto;

  position: absolute;
  left: -9999px;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  @media print {
    position: static;
    left: auto;
    top: auto;
    margin: 0;
    padding: 0;
    box-shadow: none;
    body > *:not(.print-content-wrapper) {
      display: none !important;
    }
    html, body {
      height: auto;
      margin: 0;
      padding: 0;
      overflow: visible;
    }
  }
`;

const PrintButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  &:hover {
    background-color: #218838;
  }
`;

const BackButton = styled.button`
  background-color: #6c757d;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  &:hover {
    background-color: #5a6268;
  }
`;

// --- Composant PrintInvoicePage ---
const PrintInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printAttempted, setPrintAttempted] = useState(false);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => {
      if (!printRef.current) {
        console.error("Erreur: printRef.current est null. L'élément à imprimer n'est pas prêt.");
        return null;
      }
      return printRef.current;
    },
    documentTitle: invoice ? `Facture_${invoice.clientName || 'SansNom'}_${invoice.invoiceDate}` : 'Facture',
    onAfterPrint: () => {
      console.log('Impression terminée. Redirection vers la liste des factures.');
      navigate('/invoices');
    },
    onBeforeGetContent: () => {
      console.log('Début de l\'impression...');
    },
    onPrintError: (error) => {
      console.error('Erreur lors de l\'impression:', error);
      alert('Erreur lors de l\'impression. Veuillez réessayer.');
    },
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      body {
        -webkit-print-color-adjust: exact;
      }
    `,
  });

  const attemptPrint = useCallback(() => {
    if (invoice && printRef.current) {
      console.log('Tentative d\'impression...');
      setPrintAttempted(true);
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  }, [invoice, handlePrint]);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError("ID de facture manquant dans l'URL.");
        setLoading(false);
        return;
      }

      try {
        const fetchedInvoice = await invoiceService.getInvoiceById(id);

        if (fetchedInvoice) {
          setInvoice(fetchedInvoice);
          setLoading(false);
          // Attendre un peu plus longtemps pour s'assurer que le DOM est prêt
          setTimeout(() => {
            attemptPrint();
          }, 1000);
        } else {
          setError("Facture introuvable pour l'ID: " + id);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la facture:", err);
        setError("Impossible de charger la facture. Erreur: " + (err.message || String(err)));
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, attemptPrint]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p style={{ marginTop: '10px', color: '#4a5568' }}>Chargement de la facture pour l'impression...</p>
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Erreur : {error}</div>;
  }

  if (!invoice) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#4a5568' }}>Aucune facture à afficher pour l'impression.</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2d3748' }}>
        Facture #{invoice._id || invoice.id} - {invoice.clientName}
      </h2>
      
      {!printAttempted ? (
        <p style={{ color: '#4a5568', marginTop: '10px' }}>
          Préparation de l'impression...
        </p>
      ) : (
        <div>
          <p style={{ color: '#4a5568', marginTop: '10px' }}>
            Le dialogue d'impression devrait apparaître sous peu.
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <PrintButton onClick={() => window.print()}>
          Imprimer la Facture
        </PrintButton>
        <PrintButton onClick={() => window.open(`/invoices/${invoice._id || invoice.id}/print-view`, '_blank')}>
          Aperçu avant impression
        </PrintButton>
        <BackButton onClick={() => navigate('/invoices')}>
          Retour à la liste des factures
        </BackButton>
      </div>

      <PrintableInvoiceContainer ref={printRef} className="print-content-wrapper">
        <h2>Détails de la Facture</h2>
        <p><strong>Client:</strong> {invoice.clientName}</p>
        <p><strong>Adresse:</strong> {invoice.clientAddress}</p>
        <p><strong>Date Facture:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
        <p><strong>Date d'échéance:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
        
        <h3>Articles:</h3>
        {invoice.items && invoice.items.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Qté</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Prix Unitaire</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.description}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{Number(item.unitPrice).toFixed(2)} €</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Montant Total:</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{Number(invoice.totalAmount).toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>Aucun article n'est listé pour cette facture.</p>
        )}
        
        <p style={{ marginTop: '20px' }}><strong>Statut:</strong> {invoice.status}</p>
        {invoice.description && <p><strong>Notes:</strong> {invoice.description}</p>}
        {invoice.currency && <p><strong>Devise:</strong> {invoice.currency}</p>}

      </PrintableInvoiceContainer>
    </div>
  );
};

// --- Composant PrintInvoiceViewPage ---
export const PrintInvoiceViewPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError("ID de facture manquant dans l'URL.");
        setLoading(false);
        return;
      }
      try {
        const fetchedInvoice = await invoiceService.getInvoiceById(id);
        if (fetchedInvoice) {
          setInvoice(fetchedInvoice);
          setLoading(false);
        } else {
          setError("Facture introuvable pour l'ID: " + id);
          setLoading(false);
        }
      } catch (err) {
        setError("Impossible de charger la facture. Erreur: " + (err.message || String(err)));
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  useEffect(() => {
    if (invoice && !loading && !error) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [invoice, loading, error]);

  if (loading) {
    return null;
  }
  if (error || !invoice) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '40px' }}>{error || "Erreur d'impression."}</div>;
  }

  return (
    <div ref={printRef} className="print-content-wrapper" style={{ maxWidth: 800, margin: '40px auto', background: 'white', padding: 30, borderRadius: 8, boxShadow: '0 0 10px #ccc' }}>
      <h2 style={{ textAlign: 'center' }}>Détails de la Facture</h2>
      <p><strong>Client:</strong> {invoice.clientName}</p>
      <p><strong>Adresse:</strong> {invoice.clientAddress}</p>
      <p><strong>Date Facture:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
      <p><strong>Date d'échéance:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
      <h3>Articles:</h3>
      {invoice.items && invoice.items.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Qté</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Prix Unitaire</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{Number(item.unitPrice).toFixed(2)} €</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Montant Total:</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{Number(invoice.totalAmount).toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p>Aucun article n'est listé pour cette facture.</p>
      )}
      <p style={{ marginTop: '20px' }}><strong>Statut:</strong> {invoice.status}</p>
      {invoice.description && <p><strong>Notes:</strong> {invoice.description}</p>}
      {invoice.currency && <p><strong>Devise:</strong> {invoice.currency}</p>}
    </div>
  );
};

export default PrintInvoicePage;