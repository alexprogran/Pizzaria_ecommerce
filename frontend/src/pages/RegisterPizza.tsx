import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiError } from '../types';
import { Pizza } from 'lucide-react';

interface PizzaFormData {
    nome: string;
    descricao: string;
    preco: string;
    imagem: string;
    categoria: string;
}

export function RegisterPizza() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<PizzaFormData>({
        nome: '',
        descricao: '',
        preco: '',
        imagem: '',
        categoria: 'Tradicional'
    });
    const [isLoading, setIsLoading] = useState(false);

    const categorias = [
        'Tradicional',
        'Especial',
        'Vegetariana',
        'Picante',
        'Doce'
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.is_staff) {
            toast.error('Você não tem permissão para cadastrar pizzas.');
            navigate('/');
            return;
        }

        // Validações

        if (!formData.nome || !formData.descricao || !formData.preco || !formData.imagem) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        try {
            setIsLoading(true);

            // Converter preço para número
            const preco = parseFloat(formData.preco.replace(',', '.'));
            if (isNaN(preco) || preco <= 0) {
                toast.error('Preço inválido.');
                return;
            }

            // Obter token do localStorage
            const token = localStorage.getItem('token');
	  


            // Enviar dados para a API usando axios diretamente
            const response = await axios.post('/api/pizzas/', {
                ...formData,
                preco
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                toast.success('Pizza cadastrada com sucesso!');
                navigate('/admin');
            }
        } catch (error) {
            console.error('Erro ao cadastrar pizza:', error);
            const apiError = error as ApiError;
            
            if (apiError.data?.email) {
                toast.error('Este e-mail já está em uso.');
            } else {
                toast.error('Erro ao cadastrar pizza. Por favor, tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!user?.is_staff) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
                <div className="flex flex-col items-center">
                    <Link to="/" className="flex items-center space-x-2 mb-6">
                        <Pizza className="h-8 w-8 text-red-600" />
                        <span className="text-xl font-bold text-gray-800">Bella Pizza</span>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Cadastrar Nova Pizza
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="nome"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nome
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="descricao"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Descrição
                            </label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                rows={3}
                                value={formData.descricao}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="preco"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Preço (R$)
                            </label>
                            <input
                                type="text"
                                id="preco"
                                name="preco"
                                value={formData.preco}
                                onChange={handleChange}
                                placeholder="0,00"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="imagem"
                                className="block text-sm font-medium text-gray-700"
                            >
                                URL da Imagem
                            </label>
                            <input
                                type="url"
                                id="imagem"
                                name="imagem"
                                value={formData.imagem}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="categoria"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Categoria
                            </label>
                            <select
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                disabled={isLoading}
                            >
                                {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isLoading ? 'Cadastrando...' : 'Cadastrar Pizza'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 
