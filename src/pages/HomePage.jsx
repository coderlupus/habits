import React from 'react';
import { auth } from '../../firebase'; // Ajuste o caminho

function HomePage() {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div>
      <h2>Página Principal</h2>
      <p>Bem-vindo ao seu aplicativo de hábitos!</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default HomePage;
