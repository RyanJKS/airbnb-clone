from django.http import JsonResponse

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status

from .serializers import UserDetailSerializer
from .models import User

# Get details about host
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def host_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserDetailSerializer(user, many=False)
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)