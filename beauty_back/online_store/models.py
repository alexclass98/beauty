from django.db import models

#Описание всех таблиц


class BigCategories(models.Model):
    BigCategory_ID = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    class Meta:
        managed = True
        db_table = 'big_cats'


class SmallCategories(models.Model):
    SmallCategory_ID = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(BigCategories, models.DO_NOTHING, db_column='parent')
    class Meta:
        managed = True
        db_table = 'small_cats'


class Items(models.Model):
    Item_ID = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    price = models.IntegerField()
    amount = models.IntegerField(blank=True, null=True)
    category = models.ForeignKey(SmallCategories, models.DO_NOTHING, db_column='category')
    color = models.CharField(max_length=45, blank=True, null=True)
    img = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'items'


class AuthUser(models.Model):
    id = models.IntegerField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'

class Chart(models.Model):
    Chart_ID = models.AutoField(primary_key=True)
    # product = models.ForeignKey(Items, models.DO_NOTHING, db_column='product')
    user = models.OneToOneField(AuthUser, on_delete=models.CASCADE)
    # quantity = models.IntegerField()
    # price = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'chart'

class ChartItem(models.Model):
    ChartItem_ID = models.AutoField(primary_key=True)
    chart = models.ForeignKey(Chart, on_delete=models.CASCADE)
    item = models.ForeignKey(Items, on_delete=models.CASCADE, related_name='items')
    count = models.PositiveIntegerField(default=1)
    class Meta:
        managed = True
        db_table = 'chart_item'

class Order(models.Model):
    Order_ID = models.AutoField(primary_key=True)
    chart_id = models.ForeignKey(Chart, models.DO_NOTHING, db_column='chart_id')
    auth_user = models.ForeignKey(AuthUser, models.DO_NOTHING, db_column='auth_user', to_field='id')
    address = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    number_of_order = models.CharField(max_length=45)
    date_of_delivery = models.DateField()
    date_made = models.DateField()
    delivery_mode = models.CharField(max_length=45)

    class Meta:
        managed = True
        db_table = 'order'
