import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // C'est ici que la correction s'applique
      // 'err' peut être une chaîne de caractères (si le backend la renvoie directement)
      // ou un objet Error (si c'est une erreur réseau générique).
      // On utilise 'err.message' pour être sûr d'avoir une chaîne de caractères.
      setError(err.message || err || 'Erreur de connexion inconnue');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Cette ligne est maintenant correcte, car 'error' est une chaîne */}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Se connecter</Button>
    </Form>
  );
};

export default LoginForm;