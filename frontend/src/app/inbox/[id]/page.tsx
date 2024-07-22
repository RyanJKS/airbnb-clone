import ConversationDetail from "@/app/components/inbox/ConversationDetail";

const InboxConversationPage = () => {
    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">Inbox Conversation</h1>

            <ConversationDetail />
        </main>
    )
}

export default InboxConversationPage;