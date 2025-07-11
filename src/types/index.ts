export interface User {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
}

export interface Pizza {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  ativo: boolean;
}

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}

export interface OrderItem {
  id: number;
  quantidade: number;
  preco_unitario: number;
  pizza: Pizza;
}

export interface Order {
  id: number;
  valor_total: number;
  status: 'PENDENTE' | 'PAGO' | 'PREPARANDO' | 'ENTREGUE' | 'CANCELADO';
  data_criacao: string;
  observacoes?: string;
  itens: OrderItem[];
  usuario: User; 
}

export interface ApiError {
  message: string;
  status: number;
  data?: Record<string, unknown>;
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