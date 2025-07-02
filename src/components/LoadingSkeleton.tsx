import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="w-32 h-5 bg-gray-300 rounded"></div>
            </div>
            <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
          </div>

          {/* Info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-36 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="w-12 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="w-20 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;