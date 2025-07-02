export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface OrderItem {
  id: string;
  pizza: string;
  quantidade: number;
  preco_unitario: number;
}

export interface Order {
  id: string;
  usuario: string;
  itens: OrderItem[];
  valor_total: number;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'PREPARANDO' | 'ENTREGUE';
  data: string;
  created_at?: Date;
}

export interface OrdersState {
  loading: boolean;
  error: string | null;
  data: Order[];
  filteredData: Order[];
  filters: {
    status: string;
    customerName: string;
  };
}