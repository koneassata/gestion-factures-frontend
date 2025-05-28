// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Importation des composants communs (Header, Footer, Sidebar)
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Sidebar from './components/Common/Sidebar';

// Importation des pages de l'application
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoiceListPage from './pages/InvoiceListPage';
import CurrencyListPage from './pages/CurrencyListPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import EditInvoicePage from './pages/EditInvoicePage';
import PrintInvoicePage from './pages/PrintInvoicePage'; // <-- NOUVEL IMPORT ICI

// Importation du contexte d'authentification
import { AuthProvider, useAuth } from './context/AuthContext';

// Style du conteneur principal pour la mise en page avec Sidebar
const MainContentWrapper = styled.div`
  display: flex;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  width: 100%;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px; /* Ajout d'un padding par défaut pour le contenu */
  box-sizing: border-box; /* Inclut le padding dans la largeur */
`;

// Composant de route privée
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Composant principal qui gère le rendu de l'application
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/auth';

  return (
    <>
      <Header />
      <MainContentWrapper>
        {isAuthenticated && !isAuthPage && <Sidebar />}
        <MainContent>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Routes protégées */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/invoices/create" element={<PrivateRoute><CreateInvoicePage /></PrivateRoute>} />
            <Route path="/invoices" element={<PrivateRoute><InvoiceListPage /></PrivateRoute>} />
            <Route path="/currencies" element={<PrivateRoute><CurrencyListPage /></PrivateRoute>} />

            {/* Routes pour la vue, l'édition et l'impression de factures */}
            <Route
              path="/invoices/:id"
              element={
                <PrivateRoute>
                  <InvoiceDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoices/edit/:id"
              element={
                <PrivateRoute>
                  <EditInvoicePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoices/:id/print" // <-- NOUVELLE ROUTE CLÉ ICI
              element={
                <PrivateRoute>
                  <PrintInvoicePage /> {/* Utilise le composant PrintInvoicePage */}
                </PrivateRoute>
              }
            />

            {/* Route de fallback pour les chemins non trouvés */}
            <Route path="*" element={<p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5em', color: 'red' }}>404 - Page non trouvée</p>} />
          </Routes>
        </MainContent>
      </MainContentWrapper>
      <Footer />
    </>
  );
};

// Composant racine de l'application
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;