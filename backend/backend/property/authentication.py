from rest_framework_simplejwt.tokens import AccessToken
from .models import User

def get_authenticated_user(request):
    """Authenticate the user using the JWT token from the request."""
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if not auth_header:
        return None

    try:
        token_str = auth_header.split('Bearer ')[1]
        token = AccessToken(token_str)
        user_id = token['user_id']
        return User.objects.get(pk=user_id)
    except (IndexError, User.DoesNotExist, KeyError, Exception):
        return None
