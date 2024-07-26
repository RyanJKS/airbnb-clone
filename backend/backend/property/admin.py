from django.contrib import admin

# Register your models here.
from .models import Property

admin.site.register(Property) # Adds the Property section on admin site for django app