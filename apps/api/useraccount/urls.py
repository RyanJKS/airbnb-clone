from django.urls import path

from dj_rest_auth.jwt_auth import get_refresh_view
from .views import CustomRegisterView
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView
from rest_framework_simplejwt.views import TokenVerifyView
from .api import host_detail, reservations_list


urlpatterns = [
    path("register/", CustomRegisterView.as_view(), name="rest_register"),
    path("login/", LoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path("<uuid:pk>/", host_detail, name="api_host_detail"),
    path("myreservations/", reservations_list, name="api_reservations_list"),
] 
