from rest_framework import serializers

from .models import Conversation, ConversationMessage
from useraccount.serializers import UserDetailSerializer

class ConversationListSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(read_only=True, many=True )

    class Meta:
        model = Conversation
        fields = ('id', 'users', 'modified_at',)


class ConversationDetailSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(read_only=True, many=True)

    class Meta:
        model = Conversation
        fields = ('id', 'users', 'modified_at',)


class ConversationMessageSerializer(serializers.ModelSerializer):
    sent_to = UserDetailSerializer(read_only=True, many=False)
    created_by = UserDetailSerializer(read_only=True, many=False)

    class Meta:
        model = ConversationMessage
        fields = ('id', 'body', 'sent_to', 'created_by',)