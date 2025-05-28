import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import CenteredFormWrapper from '../components/Forms/CenteredFormWrapper';
import styled from 'styled-components';

const ToggleLink = styled.p`
  color: var(--secondary-color);
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <CenteredFormWrapper>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <ToggleLink onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
      </ToggleLink>
    </CenteredFormWrapper>
  );
};

export default AuthPage;