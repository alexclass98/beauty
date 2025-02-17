from rest_framework import viewsets
from .serializers import *
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from rest_framework import permissions


class BigCategoriesViewSet(viewsets.ModelViewSet):
    # Описание класса лекарств, добавляем тут сериалайзер и поля для фильтрации
    queryset = BigCategories.objects.all()
    serializer_class = BigCategoriesSerializer
    # Сериализатор для модели


class SmallCategoriesViewSet(viewsets.ModelViewSet):
    # Описание класса заказов поставщика, добавляем тут сериалайзер
    # queryset всех пользователей для фильтрации по дате последнего изменения
    queryset = SmallCategories.objects.all()
    serializer_class = SmallCategoriesSerializer


class AuthUserViewSet(viewsets.ModelViewSet):
    # Описание класса заказов, добавляем тут сериалайзер
    # queryset всех пользователей для фильтрации по дате последнего изменения
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer


class ItemsViewSet(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer


class ChartViewSet(viewsets.ModelViewSet):
    queryset = Chart.objects.all()
    serializer_class = ChartSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

