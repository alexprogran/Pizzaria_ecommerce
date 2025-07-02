import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrdersState } from '../../types';
import { mockOrders } from '../../data/mockOrders';

// Async thunk para simular chamada à API
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simula possível erro (5% de chance)
      if (Math.random() < 0.05) {
        throw new Error('Erro ao carregar pedidos');
      }
      
      // Retorna dados mockados
      // No futuro, substituir por: const response = await fetch('/api/pedidos/');
      return mockOrders;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  }
);

const initialState: OrdersState = {
  loading: false,
  error: null,
  data: [],
  filteredData: [],
  filters: {
    status: '',
    customerName: '',
  },
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      applyFilters(state);
    },
    setCustomerNameFilter: (state, action: PayloadAction<string>) => {
      state.filters.customerName = action.payload;
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = { status: '', customerName: '' };
      state.filteredData = state.data;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        applyFilters(state);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = [];
        state.filteredData = [];
      });
  },
});

// Função auxiliar para aplicar filtros
const applyFilters = (state: OrdersState) => {
  let filtered = state.data;

  if (state.filters.status) {
    filtered = filtered.filter(order => order.status === state.filters.status);
  }

  if (state.filters.customerName) {
    filtered = filtered.filter(order =>
      order.usuario.toLowerCase().includes(state.filters.customerName.toLowerCase())
    );
  }

  state.filteredData = filtered;
};

export const { setStatusFilter, setCustomerNameFilter, clearFilters, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;