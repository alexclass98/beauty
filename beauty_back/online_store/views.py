from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ObjectDoesNotExist
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
    # Описание класса лекарств, добавляем тут сериалайзер и поля для фильтрации
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ItemsFilter
    search_fields = ['^name', '^category']


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

class OrderItemsViewSet(viewsets.ModelViewSet):
    queryset = OrderItems.objects.all()
    serializer_class = OrderItemsSerializer
@api_view(['POST'])
def make_order(request):
    order_data = request.data

    try:
        order = Order.objects.get(number_of_order=order_data['order'])
        items = order_data['items']
        user_id = order_data['user']

        for item in items:
            try:
                item_object = Items.objects.get(name=item['item_name'])
                new_order_item = OrderItems(order=order, item=item_object, count=item['item_count'])
                new_order_item.save()
            except ObjectDoesNotExist:
                return Response({'error': f"Item with name '{item['item_name']}' not found"}, status=404)

        response_data = {'message': 'Order items created successfully'}
        return Response(response_data, status=200)

    except ObjectDoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    except Exception as e:
        error_message = {'error': str(e)}
        return Response(error_message, status=400)


@api_view(['GET'])
def order_summary(request):
    order_items = OrderItems.objects.all()

    order_summary = {}

    for item in order_items:
        order_id = item.order_id
        item_name = item.item.name
        item_count = item.count

        if order_id not in order_summary:
            order_summary[order_id] = []

        order_summary[order_id].append({'item_name': item_name, 'item_count': item_count})

    return Response(order_summary)
