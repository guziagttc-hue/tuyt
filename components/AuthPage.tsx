import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import { User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'signup' | 'login'>('signup');

  if (view === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={onLoginSuccess} 
        onSwitchToSignup={() => setView('signup')} 
      />
    );
  }

  return (
    <SignupPage 
      onSignupSuccess={() => setView('login')} 
      onSwitchToLogin={() => setView('login')} 
    />
  );
};

export default AuthPage;
