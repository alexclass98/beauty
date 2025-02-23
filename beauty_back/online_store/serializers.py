from .models import *
from rest_framework import serializers
from django_filters import rest_framework as filters
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class BigCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        # Модель, которую мы сериализуем
        model = BigCategories
        # Поля, которые мы сериализуем
        fields = '__all__'

class SmallCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        # Модель, которую мы сериализуем
        model = SmallCategories
        # Поля, которые мы сериализуем
        fields = '__all__'


class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        # Модель, которую мы сериализуем
        model = Items
        # Поля, которые мы сериализуем
        fields = '__all__'


class ChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chart
        fields = '__all__'


class ItemsFilter(filters.FilterSet):
    pass
    max_pr = filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_pr = filters.NumberFilter(field_name='price', lookup_expr='gte')
    search = filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Items
        fields = ['price', 'name', 'category', 'description']


class ChartItemSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Items.objects.all())
    class Meta:
        model = ChartItem
        fields = '__all__'



class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemsSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Items.objects.all())

    class Meta:
        model = OrderItems
        fields = '__all__'


