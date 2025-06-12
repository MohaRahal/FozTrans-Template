import React from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Header from './components/Header';
import Hero from './components/Hero';
import PatioSection from './components/PatioSection';
import SearchSection from './components/SearchSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Hero setActiveSection={setActiveSection} />;
      case 'patio':
        return <PatioSection />;
      case 'search':
        return <SearchSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <Hero setActiveSection={setActiveSection} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        {showRegister ? (
          <>
            <RegisterPage onRegister={handleRegister} />
            <div className="text-center mt-4 text-white">
              <p>
                Já tem uma conta?{' '}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-blue-200 underline hover:text-white"
                >
                  Faça login
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <LoginPage onLogin={handleLogin}/>
            <div className="text-center mt-4 text-white">
              <p>
                Ainda não tem uma conta?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-blue-200 underline hover:text-white"
                >
                  Registre-se
                </button>
              </p>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;
