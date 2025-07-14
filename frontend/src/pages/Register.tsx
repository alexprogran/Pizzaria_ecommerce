import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Pizza, User } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
}

export function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<RegisterFormData>();

    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }

        try {
            setIsLoading(true);

            const response = await api.post('/auth/users/', {
                email: data.email,
                password: data.password,
                username: data.username || data.email
            });

            if (response.status === 201) {
                toast.success('Cadastro realizado com sucesso!');
                navigate('/login');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { email?: string[] } } };
            console.error('Erro no cadastro:', err);
            
            if (err.response?.data?.email) {
                toast.error('Este e-mail já está em uso.');
            } else {
                toast.error('Erro ao criar conta. Por favor, tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
                <div className="flex flex-col items-center">
                    <Link to="/" className="flex items-center space-x-2 mb-6">
                        <Pizza className="h-8 w-8 text-red-600" />
                        <span className="text-xl font-bold text-gray-800">Bella Pizza</span>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Criar uma nova conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                            Faça login
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    {...register('email', {
                                        required: 'Email é obrigatório',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    })}
                                    type="email"
                                    className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                    placeholder="seu@email.com"
                                />
                                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Nome de usuário (opcional)
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    {...register('username')}
                                    type="text"
                                    className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                    placeholder="Seu nome de usuário"
                                />
                                <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    {...register('password', {
                                        required: 'Senha é obrigatória',
                                        minLength: {
                                            value: 6,
                                            message: 'Senha deve ter pelo menos 6 caracteres'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className="block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                    placeholder="Sua senha"
                                />
                                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Senha
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Confirmação de senha é obrigatória',
                                        validate: value => value === password || 'As senhas não coincidem'
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                    placeholder="Confirme sua senha"
                                />
                                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? 'Criando conta...' : 'Criar conta'}
                        </button>

                        <Link
                            to="/"
                            className="mt-4 block text-center text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
                        >
                            Voltar para o início
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 