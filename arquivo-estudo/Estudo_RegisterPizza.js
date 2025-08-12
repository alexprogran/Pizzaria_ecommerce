import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';
import { Pizza, FileText, DollarSign, ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIAS = [
  'Tradicional',
  'Especial',
  'Vegetariana',
  'Picante',
  'Doce',
];

const RegisterPizza = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.is_staff) {
      navigate('/');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    imagem: '',
    categoria: 'Tradicional',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const precoNumerico = parseFloat(formData.preco.replace(',', '.'));

      if (isNaN(precoNumerico)) {
        setError('Preço inválido');
        setIsLoading(false);
        return;
      }

      const pizzaData = {
        ...formData,
        preco: precoNumerico,
      };

      await axios.post('http://localhost:8000/api/pizzas/', pizzaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      navigate('/admin');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erro ao cadastrar pizza');
      } else {
        setError('Erro ao cadastrar pizza');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cadastrar Nova Pizza
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Adicione uma nova pizza ao cardápio
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome da Pizza
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Ex: Margherita"
                />
                <Pizza className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <div className="mt-1 relative">
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Descreva os ingredientes da pizza"
                />
                <FileText className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
                Preço (R$)
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                  placeholder="0,00"
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
                <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                URL da Imagem
              </label>
              <div className="mt-1 relative">
                <input
                  type="url"
                  id="imagem"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <ImageIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <div className="mt-1">
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  {CATEGORIAS.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Pizza'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/admin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Voltar para Administração
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPizza;
