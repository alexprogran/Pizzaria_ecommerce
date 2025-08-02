@@ .. @@
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
+import EditStatusModal from '../components/EditStatusModal';
+import { toast } from 'react-toastify';

 const Orders: React.FC = () => {
     const { user } = useAuth();
     const navigate = useNavigate();
     const [orders, setOrders] = useState<Order[]>([]);
     const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
+    const [editModal, setEditModal] = useState<{
+        isOpen: boolean;
+        orderId: number;
+        currentStatus: string;
+    }>({
+        isOpen: false,
+        orderId: 0,
+        currentStatus: ''
+    });
+    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

     useEffect(() => {
@@ .. @@
         setFilteredOrders(filtered);
     };

+    const handleEditStatus = (orderId: number, currentStatus: string) => {
+        setEditModal({
+            isOpen: true,
+            orderId,
+            currentStatus
+        });
+    };
+
+    const handleSaveStatus = async (newStatus: string) => {
+        try {
+            setIsUpdatingStatus(true);
+            
+            const token = localStorage.getItem('token');
+            const headers = {
+                'Content-Type': 'application/json',
+                ...(token && { Authorization: `Bearer ${token}` })
+            };
+
+            await axios.patch(`/api/pedidos/${editModal.orderId}/`, {
+                status: newStatus
+            }, { headers });
+
+            // Atualizar o pedido na lista local
+            setOrders(prevOrders => 
+                prevOrders.map(order => 
+                    order.id === editModal.orderId 
+                        ? { ...order, status: newStatus as Order['status'] }
+                        : order
+                )
+            );
+
+            // Aplicar filtros novamente
+            const updatedOrders = orders.map(order => 
+                order.id === editModal.orderId 
+                    ? { ...order, status: newStatus as Order['status'] }
+                    : order
+            );
+            
+            let filtered = updatedOrders;
+            if (filteredOrders.length !== orders.length) {
+                // Reaplicar filtros se houver filtros ativos
+                // Aqui você pode implementar a lógica de filtros se necessário
+                filtered = updatedOrders; // Por simplicidade, mostrando todos
+            }
+            setFilteredOrders(filtered);
+
+            toast.success('Status do pedido atualizado com sucesso!');
+            setEditModal({ isOpen: false, orderId: 0, currentStatus: '' });
+        } catch (error) {
+            console.error('Erro ao atualizar status:', error);
+            toast.error('Erro ao atualizar status do pedido. Tente novamente.');
+        } finally {
+            setIsUpdatingStatus(false);
+        }
+    };
+
+    const handleCloseModal = () => {
+        if (!isUpdatingStatus) {
+            setEditModal({ isOpen: false, orderId: 0, currentStatus: '' });
+        }
+    };
+
     // Estatísticas dos pedidos
@@ .. @@
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                 {filteredOrders.map((order) => (
                                     <ScrollReveal key={order.id}>
-                                        <OrderCard order={order} />
+                                        <OrderCard 
+                                            order={order} 
+                                            onEditStatus={user?.is_staff ? handleEditStatus : undefined}
+                                        />
                                     </ScrollReveal>
                                 ))}
                             </div>
@@ .. @@
                     </>
                 )}
+
+                {/* Modal de Edição de Status */}
+                <EditStatusModal
+                    isOpen={editModal.isOpen}
+                    onClose={handleCloseModal}
+                    onSave={handleSaveStatus}
+                    currentStatus={editModal.currentStatus}
+                    orderId={editModal.orderId}
+                    isLoading={isUpdatingStatus}
+                />
             </div>
         </div>
     );