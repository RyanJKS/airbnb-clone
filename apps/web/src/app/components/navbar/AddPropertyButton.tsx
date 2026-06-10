'use client';
import { useAuth } from "@/app/contexts/AuthContext";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

const AddPropertyButton = () => {

    const router = useRouter();
    const loginModal = useLoginModal();
    const { userId } = useAuth();

    const airbnbYourHome = () => {
        if (userId) {
            router.push('/airbnb-your-home');
        } else {
            loginModal.open();
        }
    }

    return (
        <div onClick={airbnbYourHome}
            className="p-2 text-sm font-semibold rounded-full hover:bg-gray-200 cursor-pointer">
            AirBnB your home
        </div>
    )
}

export default AddPropertyButton