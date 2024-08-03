'use client';
import { useEffect, useState, useRef } from "react";
import CustomButton from "../forms/CustomButton";
import { ConversationType, UserType } from "@/app/inbox/page";
import useWebSocket from "react-use-websocket";
import { MessageType } from "@/app/inbox/[id]/page";

interface ConversationDetailProps {
    userId: string;
    token: string;
    conversation: ConversationType;
    oldMessages: MessageType[];
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ userId, token, conversation, oldMessages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to the end of the messages container
    const messagesDiv = useRef<HTMLDivElement>(null); // Ref to the messages container
    const [newMessage, setNewMessage] = useState<string>(''); // State for the new message input
    const [realtimeMessages, setRealtimeMessages] = useState<MessageType[]>([]); // State for real-time messages

    const myUser = conversation.users?.find((user) => user.id === userId); // Find the current user in the conversation
    const otherUser = conversation.users?.find((user) => user.id !== userId); // Find the other user in the conversation

    // Set up the WebSocket connection
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://127.0.0.1:8000/ws/${conversation.id}/?token=${token}`, {
        share: false,
        shouldReconnect: () => true
    });

    useEffect(() => {
        // Log the WebSocket connection state changes
        console.log("Connection state changed", readyState);
    }, [readyState]);

    useEffect(() => {
        // Update the real-time messages when a new message is received via WebSocket
        if (lastJsonMessage && typeof lastJsonMessage === 'object' && 'name' in lastJsonMessage && 'body' in lastJsonMessage) {
            const message: MessageType = {
                id: '',
                name: lastJsonMessage.name as string,
                body: lastJsonMessage.body as string,
                sent_to: otherUser as UserType,
                created_by: myUser as UserType,
                conversationId: conversation.id
            };

            setRealtimeMessages((prevMessages) => [...prevMessages, message]);
        }
    }, [lastJsonMessage, myUser, otherUser, conversation.id]);

    useEffect(() => {
        // Scroll to the bottom whenever oldMessages or realtimeMessages change
        scrollToBottom();
    }, [oldMessages, realtimeMessages]);

    useEffect(() => {
        // Scroll to the bottom when the component mounts
        scrollToBottom();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Function to scroll to the bottom of the messages container
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Function to send a new message
    const sendMessage = () => {
        if (!newMessage.trim()) return; // Do nothing if the message is empty

        // Send the new message via WebSocket
        sendJsonMessage({
            event: 'chat_message',
            data: {
                body: newMessage,
                name: myUser?.name,
                send_to_id: otherUser?.id,
                conversation_id: conversation.id
            }
        });

        setNewMessage(''); // Clear the input field
        scrollToBottom(); // Scroll to the bottom after sending the message
    };

    return (
        <div className="flex flex-col h-full">
            <div ref={messagesDiv} className="flex-1 overflow-auto flex flex-col space-y-4 px-6 pb-20">
                {/* Render old messages */}
                {oldMessages?.map((message, index) => (
                    <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl ${message.created_by.name === myUser?.name ? 'ml-[20%] bg-blue-200' : 'bg-gray-200'}`}
                    >
                        <p className="font-bold text-gray-500">{message.created_by.name}</p>
                        <p>{message.body}</p>
                    </div>
                ))}

                {/* Render real-time messages */}
                {realtimeMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl ${message.name === myUser?.name ? 'ml-[20%] bg-blue-200' : 'bg-gray-200'}`}
                    >
                        <p className="font-bold text-gray-500">{message.name}</p>
                        <p>{message.body}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Ref to the bottom of the messages container */}
            </div>
            <div className="fixed bottom-0 w-full py-4 px-6 flex border-t border-gray-300 space-x-4 bg-white">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 bg-gray-200 rounded-xl"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} // Update the new message state on input change
                />
                <CustomButton
                    label="Send"
                    onClick={sendMessage} // Send the message on button click
                    className="w-[100px]"
                />
            </div>
        </div>
    );
};

export default ConversationDetail;
