@@ .. @@
 import React from 'react';
-import { Calendar, User, Package, DollarSign } from 'lucide-react';
+import { Calendar, User, Package, DollarSign, Edit } from 'lucide-react';
 import { Order } from '../types';
+import { useAuth } from '../contexts/AuthContext';

 interface OrderCardProps { 
   order: Order;
+  onEditStatus?: (orderId: number, currentStatus: string) => void;
 }

-const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
+const OrderCard: React.FC<OrderCardProps> = ({ order, onEditStatus }) => {
+  const { user } = useAuth();
+
   const getStatusColor = (status: string) => {
     switch (status) {
       case 'PAGO':
@@ .. @@
       {/* Header do Card */}
       <div className="flex justify-between items-start mb-4">
         <div className="flex items-center space-x-2">
           <User className="h-5 w-5 text-gray-600" />
           <div>
             <h3 className="text-lg font-semibold text-gray-800">
               {order.usuario.username}
             </h3>
             <p className="text-sm text-gray-600">{order.usuario.email}</p>
           </div>
         </div>
-        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
-          {order.status}
-        </span>
+        <div className="flex items-center space-x-2">
+          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
+            {order.status}
+          </span>
+          {user?.is_staff && onEditStatus && (
+            <button
+              onClick={() => onEditStatus(order.id, order.status)}
+              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
+              title="Editar status"
+            >
+              <Edit className="h-4 w-4" />
+            </button>
+          )}
+        </div>
       }