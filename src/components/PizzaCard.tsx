import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Pizza } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface PizzaCardProps {
  pizza: Pizza;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const { user } = useAuth();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (user) {
      addItem(pizza);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{pizza.name}</h3>
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
            {pizza.category}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {pizza.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-red-600">
            R$ {pizza.price.toFixed(2)}
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
};

export default PizzaCard;