// 'use client';
// import { useEffect, useState } from "react";
// import Conversations from "../components/inbox/Conversations";
// import { useAuth } from "../contexts/AuthContext";
// import apiService from "../api/apiService";

// export type UserType = {
//     id: string;
//     name: string;
//     profile_img_url: string;
// }

// export type ConversationType = {
//     id: string;
//     users: UserType[];
// }


// const InboxPage = () => {
//     const { userId } = useAuth();
//     const [conversations, setConversations] = useState<ConversationType>()

//     if (!userId) {
//         return (
//             <main className="max-w-[1500px] max-auto px-6 py-12">
//                 <p>You need to be authenticated...</p>
//             </main>
//         )
//     }

//     useEffect(() => {
//         const fetchConversations = async () => {
//             const response = await apiService.get(`/chat/`)
//             setConversations(response)
//         }

//         if (userId) {
//             fetchConversations()
//         }
//     }, [userId])

//     return (
//         <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-4">
//             <h1 className="my-6 text-2xl">Inbox</h1>
//             {conversations.map((conversation: ConversationType) => {
//                 <Conversations />
//             })}
//         </main>
//     )
// }

// export default InboxPage;
'use client';
import { useEffect, useState, useCallback } from "react";
import Conversation from "../components/inbox/Conversation";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../api/apiService";

export type UserType = {
    id: string;
    name: string;
    profile_img_url: string;
}

export type ConversationType = {
    id: string;
    users: UserType[];
}

const InboxPage: React.FC = () => {
    const { userId } = useAuth();
    const [conversations, setConversations] = useState<ConversationType[]>([]);

    const fetchConversations = useCallback(async () => {
        try {
            const response = await apiService.get(`/api/chat/`);
            setConversations(response);
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchConversations();
        }
    }, [userId]);

    if (!userId) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-4">
            <h1 className="my-6 text-2xl">Inbox</h1>
            {conversations.length > 0 ? (
                conversations.map((conversation: ConversationType) => (
                    <Conversation key={conversation.id} userId={userId} conversation={conversation} />
                ))
            ) : (
                <p>No conversations found.</p>
            )}
        </main>
    );
}

export default InboxPage;
