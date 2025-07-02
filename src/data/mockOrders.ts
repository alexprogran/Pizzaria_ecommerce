import { Order } from '../types';

export const mockOrders: Order[] = [
  {
    id: '1',
    usuario: 'João da Silva',
    itens: [
      { id: '1', pizza: 'Calabresa', quantidade: 2, preco_unitario: 35.00 },
      { id: '2', pizza: 'Margherita', quantidade: 1, preco_unitario: 32.00 }
    ],
    valor_total: 102.00,
    status: 'PAGO',
    data: '2025-01-15T14:22:00'
  },
  {
    id: '2',
    usuario: 'Maria Santos',
    itens: [
      { id: '3', pizza: 'Pepperoni', quantidade: 1, preco_unitario: 39.90 },
      { id: '4', pizza: 'Quattro Stagioni', quantidade: 1, preco_unitario: 45.90 }
    ],
    valor_total: 85.80,
    status: 'PREPARANDO',
    data: '2025-01-15T15:45:00'
  },
  {
    id: '3',
    usuario: 'Carlos Oliveira',
    itens: [
      { id: '5', pizza: 'Vegetariana', quantidade: 3, preco_unitario: 38.90 }
    ],
    valor_total: 116.70,
    status: 'PENDENTE',
    data: '2025-01-15T16:10:00'
  },
  {
    id: '4',
    usuario: 'Ana Costa',
    itens: [
      { id: '6', pizza: 'Quatro Queijos', quantidade: 1, preco_unitario: 44.90 },
      { id: '7', pizza: 'Carbonara', quantidade: 1, preco_unitario: 42.90 }
    ],
    valor_total: 87.80,
    status: 'ENTREGUE',
    data: '2025-01-15T12:30:00'
  },
  {
    id: '5',
    usuario: 'Pedro Ferreira',
    itens: [
      { id: '8', pizza: 'Diavola', quantidade: 2, preco_unitario: 43.90 }
    ],
    valor_total: 87.80,
    status: 'CANCELADO',
    data: '2025-01-15T11:15:00'
  },
  {
    id: '6',
    usuario: 'Lucia Mendes',
    itens: [
      { id: '9', pizza: 'Margherita', quantidade: 1, preco_unitario: 32.90 },
      { id: '10', pizza: 'Capricciosa', quantidade: 1, preco_unitario: 41.90 },
      { id: '11', pizza: 'Pepperoni', quantidade: 1, preco_unitario: 39.90 }
    ],
    valor_total: 114.70,
    status: 'PAGO',
    data: '2025-01-15T13:20:00'
  },
  {
    id: '7',
    usuario: 'Roberto Lima',
    itens: [
      { id: '12', pizza: 'Calabresa', quantidade: 1, preco_unitario: 35.00 }
    ],
    valor_total: 35.00,
    status: 'PREPARANDO',
    data: '2025-01-15T17:05:00'
  },
  {
    id: '8',
    usuario: 'Fernanda Rocha',
    itens: [
      { id: '13', pizza: 'Quattro Stagioni', quantidade: 2, preco_unitario: 45.90 },
      { id: '14', pizza: 'Vegetariana', quantidade: 1, preco_unitario: 38.90 }
    ],
    valor_total: 130.70,
    status: 'PENDENTE',
    data: '2025-01-15T18:30:00'
  }
];