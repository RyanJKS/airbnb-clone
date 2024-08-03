from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework import status

from .models import Conversation
from .serializers import ConversationListSerializer, ConversationDetailSerializer


@api_view(['GET'])
def conversations_list(request):
    serializer = ConversationListSerializer(request.user.conversations.all(), many=True)

    return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
def conversation_detail(request, pk):
    conversation = request.user.conversations.get(pk=pk)
    
    conversation_serializer = ConversationDetailSerializer(conversation, many=False)
    
    return JsonResponse({'conversation': conversation_serializer.data}, safe=False, status=status.HTTP_200_OK)