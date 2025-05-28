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

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      // Correction ici aussi !
      setError(err.message || err || 'Erreur d\'inscription inconnue');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* C'est OK ici si 'error' est une chaîne */}
      <Input
        type="text"
        placeholder="Nom d'utilisateur"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <Button type="submit">S'inscrire</Button>
    </Form>
  );
};

export default RegisterForm;