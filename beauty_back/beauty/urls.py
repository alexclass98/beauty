from django.contrib import admin
from django.urls import path, include
from online_store import views as all_views

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'big_cat', all_views.BigCategoriesViewSet)
router.register(r'small_cat', all_views.SmallCategoriesViewSet)
router.register(r'users', all_views.AuthUserViewSet)
router.register(r'items', all_views.ItemsViewSet)
router.register(r'chart', all_views.ChartViewSet)
router.register(r'chart_items', all_views.ChartItemViewSet)
router.register(r'orders', all_views.OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('add_to_cart/', all_views.add_to_cart, name='add_to_cart'),  # Добавление URL для добавления товара в корзину
    path('remove_from_chart/', all_views.remove_from_chart, name='remove_from_chart'),
    path('chart_summary/', all_views.chart_summary, name='chart_summary'),
]
