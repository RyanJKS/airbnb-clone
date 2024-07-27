import MenuItem from "./MenuItem";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignUpModal from "@/app/hooks/useSignUpModal";
import LogoutButton from "./LogoutButton";
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuItemsProps {
    setIsOpen: (isOpen: boolean) => void;
}

const UserMenuItems: React.FC<UserMenuItemsProps> = ({ setIsOpen }) => {
    const { userId } = useAuth();
    const loginModal = useLoginModal();
    const signUpModal = useSignUpModal();

    return (
        <div className="w-[220px] absolute top-[60px] right-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer">
            {userId ? (
                <>
                    <MenuItem label="Profile" onClick={() => setIsOpen(false)} />
                    <LogoutButton />
                </>
            ) : (
                <>
                    <MenuItem
                        label="Log in"
                        onClick={() => {
                            setIsOpen(false);
                            loginModal.open();
                        }}
                    />
                    <MenuItem
                        label="Sign Up"
                        onClick={() => {
                            setIsOpen(false);
                            signUpModal.open();
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default UserMenuItems;