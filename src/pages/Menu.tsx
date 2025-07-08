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
        setPizzas(data.results || []);
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
