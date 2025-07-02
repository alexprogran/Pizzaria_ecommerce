import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-red-200 p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-red-100 rounded-full p-3">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Erro ao carregar pedidos
          </h3>
          <p className="text-gray-600 mb-4">{message}</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Tentar Novamente</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;