import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import ScrollReveal from '../components/ScrollReveal';
import OrdersFilter from '../components/OrdersFilter';

const Orders: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        loadOrders();
    }, [user, navigate]);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get('/api/pedidos/');
            const ordersData = Array.isArray(response.data) ? response.data : response.data.results || [];
            setOrders(ordersData);
            setFilteredOrders(ordersData);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            setError('Erro ao carregar pedidos. Tente novamente.');
            setOrders([]);
            setFilteredOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (filters: { status: string; customerName: string }) => {
        let filtered = [...orders];

        if (filters.status) {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        if (filters.customerName) {
            const searchTerm = filters.customerName.toLowerCase();
            filtered = filtered.filter(order => {
                const fullName = `${order.usuario.first_name} ${order.usuario.last_name}`.toLowerCase();
                return fullName.includes(searchTerm);
            });
        }

        setFilteredOrders(filtered);
    };

    const getStatusColor = (status: Order['status']) => {
        const colors = {
            PENDENTE: 'bg-yellow-100 text-yellow-800',
            PAGO: 'bg-blue-100 text-blue-800',
            PREPARANDO: 'bg-purple-100 text-purple-800',
            ENTREGUE: 'bg-green-100 text-green-800',
            CANCELADO: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Estatísticas dos pedidos
    const stats = {
        total: orders.length,
        pendentes: orders.filter(order => order.status === 'PENDENTE').length,
        pagos: orders.filter(order => order.status === 'PAGO').length,
        entregues: orders.filter(order => order.status === 'ENTREGUE').length,
    };

    const totalRevenue = orders
        .filter(order => order.status === 'PAGO' || order.status === 'ENTREGUE')
        .reduce((sum, order) => sum + order.valor_total, 0);

    if (!user) {
        return null;
    }

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
                    <OrdersFilter onFilterChange={handleFilterChange} />
                </ScrollReveal>

                {/* Conteúdo Principal */}
                {isLoading && <LoadingSkeleton />}

                {error && (
                    <ScrollReveal>
                        <ErrorMessage message={error} onRetry={loadOrders} />
                    </ScrollReveal>
                )}

                {!isLoading && !error && (
                    <>
                        {filteredOrders.length === 0 ? (
                            <ScrollReveal>
                                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Nenhum pedido encontrado
                                    </h3>
                                    <p className="text-gray-600">
                                        {orders.length === 0 
                                            ? 'Você ainda não fez nenhum pedido'
                                            : 'Nenhum pedido corresponde aos filtros aplicados.'
                                        }
                                    </p>
                                    {orders.length === 0 && (
                                        <button
                                            onClick={() => navigate('/menu')}
                                            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Ver Cardápio
                                        </button>
                                    )}
                                </div>
                            </ScrollReveal>
                        ) : (
                            <div className="grid gap-4">
                                {filteredOrders.map((order) => (
                                    <ScrollReveal key={order.id}>
                                        <div className="bg-white p-6 rounded-lg shadow-md">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        Pedido #{order.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(order.data_criacao)}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {order.itens?.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex justify-between items-center text-sm"
                                                    >
                                                        <span>
                                                            {item.quantidade}x {item.pizza.nome}
                                                        </span>
                                                        <span>
                                                            R$ {(Number(item.quantidade) * Number(item.preco_unitario)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex justify-between items-center font-medium">
                                                    <span>Total</span>
                                                    <span>R$ {Number(order.valor_total).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {order.observacoes && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <h4 className="font-medium mb-2">
                                                        Observações:
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {order.observacoes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export { Orders };