import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { Order } from '../types';

export function Orders() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            const response = await api.get('/api/pedidos/');
            // Garantir que orders seja sempre um array
            const ordersData = Array.isArray(response.data) ? response.data : response.data.results || [];
            setOrders(ordersData);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            toast.error('Erro ao carregar pedidos. Tente novamente.');
            setOrders([]); // Garantir que orders seja um array vazio em caso de erro
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: Order['status']) => {
        const colors = {
            PENDENTE: 'bg-yellow-100 text-yellow-800',
            PAGO: 'bg-blue-100 text-blue-800',
            PREPARANDO: 'bg-purple-100 text-purple-800',
            ENTREGUE: 'bg-green-100 text-green-800',
            CANCELADO: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800'; // Fallback para status desconhecido
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

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

            {isLoading ? (
                <div className="text-center py-8">
                    <p>Carregando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                        Você ainda não fez nenhum pedido
                    </p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Ver Cardápio
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
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
                    ))}
                </div>
            )}
        </div>
    );
}