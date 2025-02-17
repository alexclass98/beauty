from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import TokenProxy


# # Register your models here.
# from .models import OrderOfProvider
#
#
#
# # Описание администратора, добавляем ему таблицы, к которым есть доступ
# admin.site.register(OrderOfProvider)

admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.unregister(TokenProxy)

