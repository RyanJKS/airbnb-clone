import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import ConversationMessage

# Main class for conversation using websocket
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract the room name from the URL route
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # Construct the group name for the chat room
        self.room_group_name = f'chat_{self.room_name}'

        # Join the room group with channel layer defined in settings.py. Location where to store data
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        # Parse the incoming JSON message
        data = json.loads(text_data)

        conversation_id = data['data']['conversation_id']
        sent_to_id = data['data']['send_to_id']
        name = data['data']['name']
        body = data['data']['body']

        # Send message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'body': body,
                'name': name
            }
        )

        # Save the message to the database
        await self.save_message(conversation_id, body, sent_to_id)

    # Handle the event for sending messages
    async def chat_message(self, event):
        body = event['body']
        name = event['name']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'body': body,
            'name': name
        }))

    @sync_to_async
    def save_message(self, conversation_id, body, sent_to_id):
        user = self.scope['user']

        # Save the message to the ConversationMessage model
        ConversationMessage.objects.create(
            conversation_id=conversation_id,
            body=body,
            sent_to_id=sent_to_id,
            created_by=user
        )
