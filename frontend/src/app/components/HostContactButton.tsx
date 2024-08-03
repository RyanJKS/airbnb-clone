'use client';

import { useRouter } from "next/navigation";
import useLoginModal from "../hooks/useLoginModal";
import apiService from "../api/apiService";

interface HostContactButtonProps {
    userId: string | null;
    hostId: string;
}

const HostContactButton: React.FC<HostContactButtonProps> = ({ userId, hostId }) => {

    const router = useRouter();
    const loginModal = useLoginModal();

    console.log(userId)

    const startConversation = async () => {
        if (!userId) {
            loginModal.open()
        }

        const conversation = await apiService.get(`/api/chat/start/${hostId}/`)

        if (conversation.conversation_id) {
            router.push(`/inbox/${conversation.conversation_id}`)
        }
    }

    return (
        <div
            onClick={startConversation}
            className="mt-4 py-4 px-6 bg-airbnb text-white rounded-xl cursor-pointer hover:bg-airbnb-dark transition">
            Contact
        </div>
    )
}

export default HostContactButton