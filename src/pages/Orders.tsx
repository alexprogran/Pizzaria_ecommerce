import React, { useEffect } from 'react';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchOrders, clearError } from '../store/slices/ordersSlice';
import OrderCard from '../components/OrderCard';
import OrdersFilter from '../components/OrdersFilter';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import ScrollReveal from '../components/ScrollReveal';

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, filteredData, data } = useAppSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchOrders());
  };

  // Estatísticas dos pedidos
  const stats = {
    total: data.length,
    pendentes: data.filter(order => order.status === 'PENDENTE').length,
    pagos: data.filter(order => order.status === 'PAGO').length,
    entregues: data.filter(order => order.status === 'ENTREGUE').length,
  };

  const totalRevenue = data
    .filter(order => order.status === 'PAGO' || order.status === 'ENTREGUE')
    .reduce((sum, order) => sum + order.valor_total, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gerenciamento de Pedidos
            </h1>
            <p className="text-gray-600">
              Visualize e gerencie todos os pedidos da pizzaria
            </p>
          </div>
        </ScrollReveal>

        {/* Estatísticas */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.pagos + stats.entregues}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Filtros */}
        <ScrollReveal>
          <OrdersFilter />
        </ScrollReveal>

        {/* Conteúdo Principal */}
        {loading && <LoadingSkeleton />}

        {error && (
          <ScrollReveal>
            <ErrorMessage message={error} onRetry={handleRetry} />
          </ScrollReveal>
        )}

        {!loading && !error && (
          <>
            {filteredData.length === 0 ? (
              <ScrollReveal>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-gray-600">
                    {data.length === 0 
                      ? 'Ainda não há pedidos cadastrados no sistema.'
                      : 'Nenhum pedido corresponde aos filtros aplicados.'
                    }
                  </p>
                </div>
              </ScrollReveal>
            ) : (
              <>
                <ScrollReveal>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Pedidos ({filteredData.length})
                    </h2>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((order, index) => (
                    <ScrollReveal key={order.id}>
                      <OrderCard order={order} />
                    </ScrollReveal>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;