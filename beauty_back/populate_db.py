import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beauty.settings')
django.setup()

from online_store.models import BigCategories, SmallCategories, Items
import random

def create_test_data():
    # Создаем большие категории
    big_cats = ['Косметика', 'Уход за кожей', 'Парфюмерия']
    for name in big_cats:
        BigCategories.objects.create(BigCategory_ID=random.randint(100, 999), name=name)

    # Создаем маленькие категории
    small_cats = [
        {'name': 'Тональные средства', 'parent': BigCategories.objects.get(name='Косметика')},
        {'name': 'Туалетная вода', 'parent': BigCategories.objects.get(name='Парфюмерия')},
        {'name': 'Кремы', 'parent': BigCategories.objects.get(name='Уход за кожей')},
    ]
    for cat in small_cats:
        SmallCategories.objects.create(SmallCategory_ID=random.randint(1000, 9999), **cat)

    # Создаем товары
    items = [
        {'name': 'Тональный крем', 'description': 'Легкий тон', 'price': 1500, 'category': SmallCategories.objects.get(name='Тональные средства')},
        {'name': 'Туалетная вода Chanel', 'description': 'Аромат цветов', 'price': 5000, 'category': SmallCategories.objects.get(name='Туалетная вода')},
        {'name': 'Увлажняющий крем', 'description': 'Для сухой кожи', 'price': 2000, 'category': SmallCategories.objects.get(name='Кремы')},
    ]
    for i in range(20):  # Создаем 20 товаров
        item = items[i % len(items)]
        Items.objects.create(
            Item_ID=random.randint(10000, 99999),
            name=f"{item['name']} {i + 1}",
            description=item['description'],
            price=item['price'],
            amount=random.randint(1, 100),
            category=item['category'],
            color=random.choice(['Белый', 'Черный', 'Красный', 'Синий']),
            img=f"https://via.placeholder.com/150?text=Item+{i + 1}",
        )

if __name__ == '__main__':
    create_test_data()
    print("Тестовые данные созданы!")