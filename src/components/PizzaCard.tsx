import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Pizza } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface PizzaCardProps {
  pizza: Pizza;
}

export function PizzaCard({ pizza }: PizzaCardProps) {
  const { user } = useAuth();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (user) {
      addItem(pizza);
    }
  };

  // Converte o preço para número e garante 2 casas decimais
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={pizza.imagem}
          alt={pizza.nome}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{pizza.nome}</h3>
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
            {pizza.categoria}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {pizza.descricao}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-red-600">
            R$ {formatPrice(pizza.preco)}
          </span>
          
          {user ? (
            <button
              onClick={handleAddToCart}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Adicionar</span>
            </button>
          ) : (
            <div className="text-gray-500 text-sm">
              Faça login para comprar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}