import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pizza, ShoppingCart, User, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Pizza className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-800">Bella Pizza</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${
                isActive('/') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
              } transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`${
                isActive('/menu') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
              } transition-colors duration-200`}
            >
              Menu
            </Link>
            <Link
              to="/pedidos"
              className={`${
                isActive('/pedidos') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
              } transition-colors duration-200`}
            >
              Pedidos
            </Link>
            
            {user && (
              <Link
                to="/carrinho"
                className={`${
                  isActive('/carrinho') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                } transition-colors duration-200 flex items-center space-x-1 relative`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Carrinho</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-red-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  isActive('/') ? 'text-red-600' : 'text-gray-700'
                } block px-2 py-1`}
              >
                Home
              </Link>
              <Link
                to="/menu"
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  isActive('/menu') ? 'text-red-600' : 'text-gray-700'
                } block px-2 py-1`}
              >
                Menu
              </Link>
              <Link
                to="/pedidos"
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  isActive('/pedidos') ? 'text-red-600' : 'text-gray-700'
                } block px-2 py-1 flex items-center space-x-2`}
              >
                <Package className="h-5 w-5" />
                <span>Pedidos</span>
              </Link>
              
              {user && (
                <Link
                  to="/carrinho"
                  onClick={() => setIsMenuOpen(false)}
                  className={`${
                    isActive('/carrinho') ? 'text-red-600' : 'text-gray-700'
                  } block px-2 py-1 flex items-center space-x-2`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Carrinho ({itemCount})</span>
                </Link>
              )}
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 px-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 mx-2"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 mx-2 text-center"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;