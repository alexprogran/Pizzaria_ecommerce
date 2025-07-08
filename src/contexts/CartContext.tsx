import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Pizza } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (pizza: Pizza) => void;
  removeItem: (pizzaId: number) => void;
  updateQuantity: (pizzaId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (pizza: Pizza) => {
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

  const removeItem = (pizzaId: number) => {
    setItems(prev => prev.filter(item => item.pizza.id !== pizzaId));
  };

  const updateQuantity = (pizzaId: number, quantity: number) => {
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

  const total = items.reduce((sum, item) => {
    const price = typeof item.pizza.preco === 'string' 
      ? parseFloat(item.pizza.preco) 
      : item.pizza.preco;
    return sum + (price * item.quantity);
  }, 0);

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