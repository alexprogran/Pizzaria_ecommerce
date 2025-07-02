from django.core.management.base import BaseCommand
from api.models import Pizza

class Command(BaseCommand):
    help = 'Popula o banco de dados com pizzas de exemplo'

    def handle(self, *args, **options):
        pizzas_data = [
            {
                'nome': 'Margherita',
                'descricao': 'Molho de tomate, mussarela, manjericão fresco e azeite extra virgem',
                'preco': 32.90,
                'imagem': 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Tradicional'
            },
            {
                'nome': 'Pepperoni',
                'descricao': 'Molho de tomate, mussarela, pepperoni italiano e orégano',
                'preco': 39.90,
                'imagem': 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Tradicional'
            },
            {
                'nome': 'Quattro Stagioni',
                'descricao': 'Molho de tomate, mussarela, presunto, cogumelos, alcachofra e azeitonas',
                'preco': 45.90,
                'imagem': 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Especial'
            },
            {
                'nome': 'Carbonara',
                'descricao': 'Molho branco, mussarela, bacon, ovos, parmesão e pimenta do reino',
                'preco': 42.90,
                'imagem': 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Especial'
            },
            {
                'nome': 'Vegetariana',
                'descricao': 'Molho de tomate, mussarela, abobrinha, berinjela, pimentão e tomate seco',
                'preco': 38.90,
                'imagem': 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Vegetariana'
            },
            {
                'nome': 'Quatro Queijos',
                'descricao': 'Molho branco, mussarela, gorgonzola, parmesão e provolone',
                'preco': 44.90,
                'imagem': 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Especial'
            },
            {
                'nome': 'Capricciosa',
                'descricao': 'Molho de tomate, mussarela, presunto, cogumelos e alcachofra',
                'preco': 41.90,
                'imagem': 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Tradicional'
            },
            {
                'nome': 'Diavola',
                'descricao': 'Molho de tomate, mussarela, salame picante e pimenta calabresa',
                'preco': 43.90,
                'imagem': 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
                'categoria': 'Picante'
            }
        ]

        for pizza_data in pizzas_data:
            pizza, created = Pizza.objects.get_or_create(
                nome=pizza_data['nome'],
                defaults=pizza_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Pizza "{pizza.nome}" criada com sucesso!')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Pizza "{pizza.nome}" já existe.')
                )

        self.stdout.write(
            self.style.SUCCESS('Comando executado com sucesso!')
        )