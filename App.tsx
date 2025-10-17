
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContentPage from './pages/ContentPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main key={location.pathname} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 page-fade-in">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/:board/:classNum/:subject/:chapter" element={<ContentPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;