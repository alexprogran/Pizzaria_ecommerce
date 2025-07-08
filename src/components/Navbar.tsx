import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <nav className="bg-red-600 text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Pizzaria
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/menu" className="hover:text-gray-200">
              Cardápio
            </Link>
            
            <Link to="/cart" className="hover:text-gray-200 relative">
              Carrinho
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="hover:text-gray-200">
                  Pedidos
                </Link>
                
                {user?.is_staff && (
                  <Link to="/admin" className="hover:text-gray-200">
                    Admin
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="hover:text-gray-200"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-200">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}