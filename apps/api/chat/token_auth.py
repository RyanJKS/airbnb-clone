from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware

from rest_framework_simplejwt.tokens import AccessToken # Get access token from headers

from useraccount.models import User

@database_sync_to_async
def get_user(token_key):
    try:
        # Decode the token using AccessToken
        token = AccessToken(token_key)
        # Extract the user ID from the token payload
        user_id = token.payload['user_id']
        # Retrieve and return the User object from the database
        return User.objects.get(pk=user_id)
    except Exception as e:
        # If any error occurs (e.g., invalid token, user not found), return an AnonymousUser
        return AnonymousUser

# Custom middleware for token-based authentication in Django Channels
class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        # Initialize the middleware with the inner application
        self.inner = inner
    
    async def __call__(self, scope, receive, send):
        # Parse the query string from the connection scope
        query = dict((x.split('=') for x in scope['query_string'].decode().split('&')))
        # Get the token from the query parameters
        token_key = query.get('token')
        # Retrieve the user associated with the token asynchronously and add it to the scope
        scope['user'] = await get_user(token_key)
        # Call the inner application with the updated scope
        return await super().__call__(scope, receive, send)