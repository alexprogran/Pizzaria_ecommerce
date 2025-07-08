import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, Star, Phone, MapPin, Mail } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1200")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <ScrollReveal>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Bella Pizza
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                Autênticas pizzas italianas feitas com ingredientes frescos e muito amor
              </p>
              <Link
                to="/menu"
                className="bg-red-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-red-700 transition-colors duration-200 inline-block"
              >
                Ver Cardápio
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Nossa História
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Desde 1985, a Bella Pizza tem sido sinônimo de qualidade e tradição italiana. 
                Nossas receitas foram passadas de geração em geração, mantendo o sabor autêntico 
                que conquistou o coração dos brasileiros.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Receitas Tradicionais</h3>
                <p className="text-gray-600">
                  Cada pizza é preparada seguindo receitas familiares italianas autênticas
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
                <p className="text-gray-600">
                  Garantimos que sua pizza chegue quentinha em até 30 minutos
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualidade Premium</h3>
                <p className="text-gray-600">
                  Utilizamos apenas ingredientes frescos e selecionados diariamente
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Nossas Especialidades
              </h2>
              <p className="text-xl text-gray-600">
                Conheça algumas das pizzas mais pedidas pelos nossos clientes
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal>
              <div className="text-center">
                <img
                  src="https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Pizza Margherita"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Margherita</h3>
                <p className="text-gray-600 mb-4">
                  A clássica pizza italiana com molho de tomate, mussarela e manjericão
                </p>
                <span className="text-2xl font-bold text-red-600">R$ 32,90</span>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <img
                  src="https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Pizza Pepperoni"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Pepperoni</h3>
                <p className="text-gray-600 mb-4">
                  Deliciosa combinação de molho especial, mussarela e pepperoni italiano
                </p>
                <span className="text-2xl font-bold text-red-600">R$ 39,90</span>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <img
                  src="https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Pizza Quattro Stagioni"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Quattro Stagioni</h3>
                <p className="text-gray-600 mb-4">
                  Uma pizza, quatro sabores: presunto, cogumelos, alcachofra e azeitonas
                </p>
                <span className="text-2xl font-bold text-red-600">R$ 45,90</span>
              </div>
            </ScrollReveal>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="bg-red-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-red-700 transition-colors duration-200 inline-block"
            >
              Ver Cardápio Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Fale Conosco</h2>
              <p className="text-xl text-gray-300">
                Estamos sempre prontos para atender você
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Telefone</h3>
                <p className="text-gray-300">(11) 3456-7890</p>
                <p className="text-gray-300">(11) 98765-4321</p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Endereço</h3>
                <p className="text-gray-300">Rua das Pizzas, 123</p>
                <p className="text-gray-300">Centro, São Paulo - SP</p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-300">contato@bellapizza.com.br</p>
                <p className="text-gray-300">pedidos@bellapizza.com.br</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}