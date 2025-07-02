import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart and show success
    clearCart();
    setIsProcessing(false);
    
    // In a real app, redirect to order confirmation
    alert('Pedido realizado com sucesso! Você receberá sua pizza em até 30 minutos.');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Faça login para acessar seu carrinho
            </h2>
            <p className="text-gray-600 mb-8">
              Você precisa estar logado para adicionar pizzas ao carrinho e finalizar pedidos.
            </p>
            <Link
              to="/login"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Adicione algumas pizzas deliciosas do nosso cardápio!
            </p>
            <Link
              to="/menu"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Ver Cardápio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Seu Carrinho</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {items.map((item) => (
            <div key={item.pizza.id} className="p-6 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center space-x-4">
                <img
                  src={item.pizza.image}
                  alt={item.pizza.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.pizza.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {item.pizza.description}
                  </p>
                  <p className="text-red-600 font-bold mt-2">
                    R$ {item.pizza.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.pizza.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-red-600">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;