from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from rest_framework import permissions

class AuthUserViewSet(viewsets.ModelViewSet):
    # Описание класса заказов, добавляем тут сериалайзер
    # queryset всех пользователей для фильтрации по дате последнего изменения
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer


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


class ItemsViewSet(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_fields = {
        'name': ['exact', 'icontains'],
        'price': ['exact', 'lt', 'gt'],
        'amount': ['exact', 'lt', 'gt'],
        'color': ['exact', 'icontains'],
    }
    search_fields = ['name', 'description', 'color']

class ChartViewSet(viewsets.ModelViewSet):
    queryset = Chart.objects.all()
    serializer_class = ChartSerializer

class ChartItemViewSet(viewsets.ModelViewSet):
    queryset = ChartItem.objects.all()
    serializer_class = ChartItemSerializer


@api_view(['POST'])
def add_to_cart(request):
    user_id = request.data.get('user')
    item_id = request.data.get('item')

    user = AuthUser.objects.get(id=user_id)
    item = Items.objects.get(Item_ID=item_id)

    try:
        chart = Chart.objects.get(user=user)
        chart_item = ChartItem.objects.get(chart=chart, item=item)
        chart_item.count += 1
        chart_item.save()
    except ChartItem.DoesNotExist:
        chart, created = Chart.objects.get_or_create(user=user)
        chart_item = ChartItem(chart=chart, item=item)
        chart_item.save()

    return Response({'status': 'Item added to chart successfully!'})

@api_view(['POST'])
def remove_from_chart(request):
    user_id = request.data.get('user')
    item_id = request.data.get('item')

    user = AuthUser.objects.get(id=user_id)
    item = Items.objects.get(Item_ID=item_id)

    try:
        chart = Chart.objects.get(user=user)
        chart_item = ChartItem.objects.get(chart=chart, item=item)

        if chart_item.count == 1:
            chart_item.delete()
        else:
            chart_item.count -= 1
            chart_item.save()

        return Response({'status': 'Item removed or quantity decreased in chart successfully!'})
    except ChartItem.DoesNotExist:
        return Response({'status': 'Item not found in the chart.'})

@api_view(['GET'])
def chart_summary(request):
    chart_items = ChartItem.objects.all()  # Получаем все записи в корзине

    chart_summary = {}  # Словарь для хранения сводки товаров по корзинам

    for item in chart_items:
        chart_id = item.chart_id  # Обратитесь к полю chart_id
        item_name = item.item.name
        item_count = item.count

        if chart_id not in chart_summary:
            chart_summary[chart_id] = []

        chart_summary[chart_id].append({'item_name': item_name, 'item_count': item_count})

    return Response(chart_summary)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

