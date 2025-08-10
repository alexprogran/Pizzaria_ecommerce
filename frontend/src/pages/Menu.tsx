import React, { useState, useEffect } from 'react';
import { PizzaCard } from '../components/PizzaCard';
import ScrollReveal from '../components/ScrollReveal';
import { Pizza } from '../types';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pizza[]; 
}

export function Menu() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/pizzas/')
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao buscar pizzas');
        return response.json();
      })
      .then((data: PaginatedResponse) => {
        // Extrai o array de pizzas da resposta paginada
        console.log('Dados recebidos do backend:', data.results);
        // Garante que os IDs são números
        const pizzasComIdNumerico = data.results.map(pizza => ({
          ...pizza,
          id: Number(pizza.id)
        }));
        console.log('Pizzas com IDs convertidos:', pizzasComIdNumerico);
        setPizzas(pizzasComIdNumerico || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Erro completo:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories: string[] = ['Todas', ...Array.from(new Set(pizzas.map(pizza => pizza.categoria)))];

  const filteredPizzas: Pizza[] =
    selectedCategory === 'Todas'
      ? pizzas
      : pizzas.filter(pizza => pizza.categoria === selectedCategory);

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Erro: {error}</div>;
  }

  if (pizzas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <svg
              className="mx-auto h-16 w-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nenhuma Pizza Cadastrada
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              No momento não há pizzas cadastradas no cardápio.
            </p>
            <p className="text-gray-600 mb-2">
              Para começar a montar o menu, siga os passos:
            </p>
            <p className="text-gray-700 font-medium">
              1. Acesse Admin → Cadastrar Pizza<br />
              2. Realize o cadastro das pizzas para montagem do menu
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Nosso Cardápio
            </h1>
            <p className="text-xl text-gray-600">
              Escolha entre nossas deliciosas pizzas artesanais
            </p>
          </div>
        </ScrollReveal>

        {/* Filtro de Categoria */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grade de Pizzas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPizzas.map((pizza) => (
            <ScrollReveal key={pizza.id}>
              <PizzaCard pizza={pizza} />
            </ScrollReveal>
          ))}
        </div>

        {filteredPizzas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhuma pizza encontrada nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 