import React, { createContext, useContext, useState } from 'react';
import { CartItem, Pizza } from '../types'; // Presume-se que esses tipos são apenas usados como referência de estrutura

// Criação do contexto do carrinho
const CartContext = createContext(undefined);

// Hook personalizado para acessar o contexto do carrinho
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Componente provedor do carrinho
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // Lista de { pizza, quantity }

  const addItem = (pizza) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.pizza.id === pizza.id);
      if (existingItem) {
        return prev.map(item =>
          item.pizza.id === pizza.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { pizza, quantity: 1 }];
    });
  };

  const removeItem = (pizzaId) => {
    setItems(prev => prev.filter(item => item.pizza.id !== pizzaId));
  };

  const updateQuantity = (pizzaId, quantity) => {
    if (quantity <= 0) {
      removeItem(pizzaId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.pizza.id === pizzaId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.pizza.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
