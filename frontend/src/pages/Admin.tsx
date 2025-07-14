import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redireciona usuários não-admin para a home
    if (!user?.is_staff) {
        navigate('/');
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-12">Administrativo</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Card para Cadastro de Pizza */}
                <div 
                    onClick={() => navigate('/register-pizza')}
                    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center min-h-[200px]"
                >
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">Cadastrar Pizza</h2>
                    <p className="text-gray-600 text-center">
                        Adicione novas pizzas ao cardápio
                    </p>
                </div>

                {/* Card para Gerenciar Pedidos */}
                <div 
                    onClick={() => navigate('/orders')}
                    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center min-h-[200px]"
                >
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">Gerenciar Pedidos</h2>
                    <p className="text-gray-600 text-center">
                        Visualize e atualize o status dos pedidos
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Admin; 