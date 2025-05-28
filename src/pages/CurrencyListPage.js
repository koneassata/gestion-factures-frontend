import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid var(--border-color);
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: var(--primary-color);
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : '#dc3545'};
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: ${props => props.primary ? 'var(--secondary-color)' : '#c82333'};
  }
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
`;

const CurrencyListPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [newCurrency, setNewCurrency] = useState({ name: '', symbol: '', rate: '' });
  const [editingCurrency, setEditingCurrency] = useState(null); // Pour l'édition

  useEffect(() => {
    // TODO: Fetch currencies from API (currencyService.getAllCurrencies())
    // Simulation
    setCurrencies([
      { _id: '1', name: 'Euro', symbol: '€', rate: 1.00 },
      { _id: '2', name: 'Dollar Américain', symbol: '$', rate: 1.08 },
      { _id: '3', name: 'Livre Sterling', symbol: '£', rate: 0.85 },
    ]);
  }, []);

  const handleAddCurrency = (e) => {
    e.preventDefault();
    if (editingCurrency) {
      // TODO: Appeler currencyService.updateCurrency(editingCurrency._id, newCurrency)
      setCurrencies(currencies.map(c => c._id === editingCurrency._id ? { ...newCurrency, _id: c._id } : c));
      setEditingCurrency(null);
      alert('Devise modifiée (simulé)');
    } else {
      // TODO: Appeler currencyService.createCurrency(newCurrency)
      setCurrencies([...currencies, { ...newCurrency, _id: Date.now().toString() }]);
      alert('Devise ajoutée (simulé)');
    }
    setNewCurrency({ name: '', symbol: '', rate: '' });
  };

  const handleEdit = (currency) => {
    setEditingCurrency(currency);
    setNewCurrency({ name: currency.name, symbol: currency.symbol, rate: currency.rate });
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette devise ?")) {
      // TODO: Appeler currencyService.deleteCurrency(id)
      setCurrencies(currencies.filter(c => c._id !== id));
      alert('Devise supprimée (simulé)');
    }
  };

  return (
    <PageContainer>
      <Title>Gestion des Devises</Title>

      <Form onSubmit={handleAddCurrency}>
        <Input
          type="text"
          placeholder="Nom de la devise (ex: Euro)"
          value={newCurrency.name}
          onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Symbole (ex: €)"
          value={newCurrency.symbol}
          onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Taux (ex: 1.08)"
          value={newCurrency.rate}
          onChange={(e) => setNewCurrency({ ...newCurrency, rate: parseFloat(e.target.value) })}
          step="0.01"
          required
        />
        <ActionButton type="submit" primary>{editingCurrency ? 'Modifier la devise' : 'Ajouter la devise'}</ActionButton>
        {editingCurrency && (
          <ActionButton type="button" onClick={() => {setEditingCurrency(null); setNewCurrency({ name: '', symbol: '', rate: ''});}}>Annuler</ActionButton>
        )}
      </Form>

      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Symbole</th>
            <th>Taux (vs. devise de base)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((currency) => (
            <tr key={currency._id}>
              <td>{currency.name}</td>
              <td>{currency.symbol}</td>
              <td>{currency.rate.toFixed(2)}</td>
              <td>
                <ActionButton primary onClick={() => handleEdit(currency)}>Modifier</ActionButton>
                <ActionButton onClick={() => handleDelete(currency._id)}>Supprimer</ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default CurrencyListPage;