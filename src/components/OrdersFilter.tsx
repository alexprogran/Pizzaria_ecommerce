import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setStatusFilter, setCustomerNameFilter, clearFilters } from '../store/slices/ordersSlice';

const OrdersFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(state => state.orders);

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'PREPARANDO', label: 'Preparando' },
    { value: 'ENTREGUE', label: 'Entregue' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ];

  const handleStatusChange = (status: string) => {
    dispatch(setStatusFilter(status));
  };

  const handleCustomerNameChange = (name: string) => {
    dispatch(setCustomerNameFilter(name));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.status || filters.customerName;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
          >
            <X className="h-4 w-4" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por Nome do Cliente */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por Cliente
          </label>
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              id="customerName"
              value={filters.customerName}
              onChange={(e) => handleCustomerNameChange(e.target.value)}
              placeholder="Digite o nome do cliente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Filtro por Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilter;