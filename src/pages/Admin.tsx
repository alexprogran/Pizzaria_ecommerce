import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { Order } from '../types';

export function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.is_staff) {
            navigate('/');
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

    const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
        try {
            await api.patch(`/api/pedidos/${orderId}/`, {
                status: newStatus
            });
            
            toast.success('Status do pedido atualizado com sucesso!');
            loadOrders(); // Recarrega a lista de pedidos
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Erro ao atualizar status do pedido.');
        }
    };

    if (!user?.is_staff) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/register-pizza')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Cadastrar Nova Pizza
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Pedidos</h2>

            {isLoading ? (
                <div className="text-center py-8">
                    <p>Carregando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Nenhum pedido encontrado.</p>
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
                                    <p className="text-gray-600">
                                        Cliente: {order.usuario.first_name} {order.usuario.last_name}
                                    </p>
                                    <p className="text-gray-600">
                                        Total: R$ {order.valor_total.toFixed(2)}
                                    </p>
                                </div>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                    className="border rounded-md p-2"
                                >
                                    <option value="PENDENTE">Pendente</option>
                                    <option value="PAGO">Pago</option>
                                    <option value="PREPARANDO">Preparando</option>
                                    <option value="ENTREGUE">Entregue</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Itens do Pedido:</h4>
                                {order.itens?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span>
                                            {item.quantidade}x {item.pizza.nome}
                                        </span>
                                        <span>
                                            R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {order.observacoes && (
                                <div className="mt-4">
                                    <h4 className="font-medium">Observações:</h4>
                                    <p className="text-gray-600 text-sm">
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

export default Admin; 