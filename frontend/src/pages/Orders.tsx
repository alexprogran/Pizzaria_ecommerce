import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Order } from '../types';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import ScrollReveal from '../components/ScrollReveal';
import OrdersFilter from '../components/OrdersFilter';
import OrderCard from '../components/OrderCard';

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
            
            // Obter token do localStorage
            const token = localStorage.getItem('token');
            
            // Configurar headers com token de autenticação
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            };
            
            // Se o usuário for admin, busca todos os pedidos, caso contrário, busca apenas os pedidos do usuário
            const endpoint = user?.is_staff ? '/api/pedidos/todos/' : '/api/pedidos/';
            const response = await axios.get(endpoint, { headers });
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

        if (filters.customerName && user?.is_staff) {
            const searchTerm = filters.customerName.toLowerCase();
            filtered = filtered.filter(order => {
                const username = order.usuario.username.toLowerCase();
                const email = order.usuario.email.toLowerCase();
                return username.includes(searchTerm) || email.includes(searchTerm);
            });
        }

        setFilteredOrders(filtered);
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
                            {user?.is_staff ? 'Gerenciamento de Todos os Pedidos' : 'Meus Pedidos'}
                        </h1>
                        <p className="text-gray-600">
                            {user?.is_staff 
                                ? 'Visualize e gerencie todos os pedidos da pizzaria'
                                : 'Acompanhe seus pedidos'}
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
                    <OrdersFilter onFilterChange={handleFilterChange} showCustomerFilter={user?.is_staff} />
                </ScrollReveal>

                {/* Lista de Pedidos */}
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
                                            ? (user?.is_staff 
                                                ? 'Não há pedidos registrados no sistema'
                                                : 'Você ainda não fez nenhum pedido')
                                            : 'Nenhum pedido corresponde aos filtros aplicados.'
                                        }
                                    </p>
                                    {!user?.is_staff && orders.length === 0 && (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                {filteredOrders.map((order) => (
                                    <ScrollReveal key={order.id}>
                                        <OrderCard order={order} />
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
export default Orders;
