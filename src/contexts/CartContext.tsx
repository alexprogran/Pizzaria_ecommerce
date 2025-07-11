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
    console.log('Adicionando pizza:', pizza);
    console.log('ID da pizza:', pizza.id, 'Tipo:', typeof pizza.id);
    console.log('Carrinho atual:', items);
    
    setItems(prev => {
      console.log('Estado anterior do carrinho:', prev);
      // Converte os IDs para número para garantir a comparação correta
      const pizzaId = Number(pizza.id);
      console.log('ID convertido:', pizzaId, 'Tipo:', typeof pizzaId);
      
      const existingItem = prev.find(item => {
        const itemId = Number(item.pizza.id);
        console.log('Comparando com item:', itemId, 'Tipo:', typeof itemId);
        return itemId === pizzaId;
      });
      
      console.log('Item existente encontrado:', existingItem);

      if (existingItem) {
        console.log('Atualizando quantidade do item existente');
        const newItems = prev.map(item =>
          Number(item.pizza.id) === pizzaId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('Novo estado do carrinho:', newItems);
        return newItems;
      }
      
      console.log('Adicionando novo item ao carrinho');
      const newItems = [...prev, { pizza, quantity: 1 }];
      console.log('Novo estado do carrinho:', newItems);
      return newItems;
    });
  };

  const removeItem = (pizzaId: number) => {
    setItems(prev => prev.filter(item => Number(item.pizza.id) !== pizzaId));
  };

  const updateQuantity = (pizzaId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(pizzaId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        Number(item.pizza.id) === pizzaId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('Limpando o carrinho...');
    console.log('Estado atual do carrinho:', items);
    setItems([]);
    // Verificação assíncrona para garantir que o estado foi atualizado
    setTimeout(() => {
      console.log('Estado do carrinho após limpeza:', items);
    }, 0);
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