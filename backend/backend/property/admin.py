from django.contrib import admin

# Register your models here.
from .models import Property, PropertyImage

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]

admin.site.register(Property, PropertyAdmin) # Adds the Property section on admin site for django app
admin.site.register(PropertyImage)