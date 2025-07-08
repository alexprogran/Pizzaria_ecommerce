import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    first_name: string;
    last_name: string;
    username: string;
}

export function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        username: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            setIsLoading(true);

            // Enviar dados para a API
            const response = await api.post('/api/users/', {
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username || formData.email
            });

            if (response.status === 201) {
                toast.success('Cadastro realizado com sucesso!');
                navigate('/login');
            }
        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            
            if (error.response?.data?.email) {
                toast.error('Este e-mail já está em uso.');
            } else {
                toast.error('Erro ao criar conta. Por favor, tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Criar uma nova conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary hover:text-primary-dark"
                        >
                            faça login na sua conta existente
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="E-mail"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="first_name" className="sr-only">
                                Nome
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Nome"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="sr-only">
                                Sobrenome
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Sobrenome"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Senha"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirmar Senha
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Confirmar Senha"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Criando conta...' : 'Criar conta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 