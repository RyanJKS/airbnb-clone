from django.urls import path
from . import api

urlpatterns = [
    path("", api.properties_list, name="api_properties_list"),
    path("create/", api.create_property, name="api_create_property"),
    path("<uuid:pk>/", api.property_detail, name='api_properties_detail'), # whatever 'uuid' is added after path in url, will be treated as 'pk' in backend
    path("<uuid:pk>/book/", api.create_reservation, name="api_create_reservation"),
    path("<uuid:pk>/reservations/", api.property_reservations, name="api_property_reservations"),
    path("<uuid:pk>/toggle-favourite/", api.toggle_favourite, name="api_toggle_favourite"),
]