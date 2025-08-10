import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: string) => void;
  currentStatus: string;
  orderId: number;
  isLoading?: boolean;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentStatus,
  orderId,
  isLoading = false
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente', description: 'Pedido aguardando confirmação' },
    { value: 'PAGO', label: 'Pago', description: 'Pagamento confirmado' },
    { value: 'PREPARANDO', label: 'Preparando', description: 'Pizza sendo preparada' },
    { value: 'ENTREGUE', label: 'Entregue', description: 'Pedido entregue ao cliente' },
    { value: 'CANCELADO', label: 'Cancelado', description: 'Pedido cancelado' }
  ];

  const handleSave = () => {
    if (selectedStatus !== currentStatus) {
      onSave(selectedStatus);
    } else {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO':
        return 'border-green-200 bg-green-50';
      case 'PREPARANDO':
        return 'border-blue-200 bg-blue-50';
      case 'PENDENTE':
        return 'border-yellow-200 bg-yellow-50';
      case 'ENTREGUE':
        return 'border-purple-200 bg-purple-50';
      case 'CANCELADO':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Editar Status - Pedido #{orderId}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecione o novo status:
            </label>
            <div className="space-y-3">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedStatus === option.value
                      ? `${getStatusColor(option.value)} border-2`
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-1 text-red-600 focus:ring-red-500"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedStatus !== currentStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Status atual:</strong> {currentStatus} → <strong>Novo status:</strong> {selectedStatus}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || selectedStatus === currentStatus}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStatusModal;