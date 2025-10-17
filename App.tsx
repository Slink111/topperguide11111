import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ContentPage = lazy(() => import('./pages/ContentPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));


const PageLoader: React.FC = () => (
    <div className="flex justify-center items-center flex-grow py-20">
        <svg className="animate-spin h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main key={location.pathname} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 page-fade-in flex flex-col">
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/:board/:classNum/:subject/:chapter" element={<ContentPage />} />
            </Routes>
        </Suspense>
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