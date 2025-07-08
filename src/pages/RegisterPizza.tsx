import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { ApiError } from '../types';

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

            // Enviar dados para a API
            const response = await api.post('/api/pizzas/', {
                ...formData,
                preco
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Cadastrar Nova Pizza</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="space-y-6">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            disabled={isLoading}
                        >
                            {categorias.map((categoria) => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar Pizza'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
} 