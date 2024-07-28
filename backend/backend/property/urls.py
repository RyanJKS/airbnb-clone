from django.urls import path
from . import api

urlpatterns = [
    path("", api.properties_list, name="api_properties_list"),
    path("create/", api.add_property, name="api_add_property"),
]