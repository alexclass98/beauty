from django.contrib import admin
from django.urls import path, include
from online_store import views as all_views
from django.urls import include, path, re_path
from rest_framework import routers
from django.conf.urls import include


router = routers.DefaultRouter()
router.register(r'big_cat', all_views.BigCategoriesViewSet)
router.register(r'small_cat', all_views.SmallCategoriesViewSet)
router.register(r'users', all_views.AuthUserViewSet)
router.register(r'items', all_views.ItemsViewSet)
router.register(r'chart', all_views.ChartViewSet)
router.register(r'orders', all_views.OrderViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]


