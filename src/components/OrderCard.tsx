import React from 'react';
import { Calendar, User, Package, DollarSign } from 'lucide-react';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PREPARANDO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ENTREGUE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header do Card */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">{order.usuario}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Informações do Pedido */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Package className="h-4 w-4" />
          <span className="text-sm">Pedido #{order.id}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formatDate(order.data)}</span>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Itens do Pedido:</h4>
        <div className="space-y-2">
          {order.itens.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {item.quantidade}x {item.pizza}
              </span>
              <span className="font-medium text-gray-800">
                R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Valor Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Total:</span>
          </div>
          <span className="text-xl font-bold text-green-600">
            R$ {order.valor_total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;