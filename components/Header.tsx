import React from 'react';
import { Link } from 'react-router-dom';
import { BookIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-slate-900 dark:text-white transition-transform duration-300 transform hover:scale-105">
            <BookIcon />
            <span>Topper Guide</span>
          </Link>
          <nav>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 rounded-md transition-all duration-300 transform hover:scale-110">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;