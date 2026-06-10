'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import { useAuth } from "@/app/contexts/AuthContext";
import apiService from "@/app/api/apiService";
import { UserType } from "../page";
import { getAccessToken } from '@/app/lib/actions';

export type MessageType = {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: UserType;
    created_by: UserType;
}

export type ConversationType = {
    id: string;
    users: UserType[];
}


const InboxConversationPage = ({ params }: { params: { id: string } }) => {
    const { userId } = useAuth();
    const [conversation, setConversation] = useState<ConversationType | null>(null);
    const [token, setToken] = useState<string>('');
    const [oldMessages, setOldMessages] = useState<MessageType[]>([])

    const fetchConversation = useCallback(async () => {
        if (userId) {
            try {
                const response = await apiService.get(`/api/chat/${params.id}/`);
                setConversation(response.conversation);
                setOldMessages(response.messages)
            } catch (err) {
                console.error('Error fetching conversation:', err);
            }
        }
    }, [params.id, userId]);

    const getToken = useCallback(async () => {
        const userToken = await getAccessToken();
        setToken(userToken || ''); // Ensure token is always a string
    }, []);

    useEffect(() => {
        getToken();
    }, [getToken]);

    useEffect(() => {
        fetchConversation();
    }, [fetchConversation]);

    if (!userId || !token) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">Inbox Conversation</h1>
            {conversation ? (
                <ConversationDetail userId={userId} token={token} conversation={conversation} oldMessages={oldMessages} />
            ) : (
                <p>No conversation found.</p>
            )}
        </main>
    );
}

export default InboxConversationPage;
