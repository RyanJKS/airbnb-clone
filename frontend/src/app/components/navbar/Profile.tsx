"use client";
import { VscAccount } from "react-icons/vsc";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import ProfileMenuLink from "./ProfileMenuLink";
import useLoginModal from "@/app/hooks/useLoginModal";

const Profile = () => {

    const [isOpen, setIsOpen] = useState(true);
    const loginModal = useLoginModal();

    return (
        <div className="p-2 relative inline-block border rounded-full">
            <button className="flex items-center" onClick={() => setIsOpen(prev => !prev)}>
                <CiMenuBurger className="text-2xl" />
                <VscAccount className="text-2xl" />
            </button>

            {isOpen && (
                <div className="w-[220px] absolute top-[60px] right-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer">
                    <ProfileMenuLink
                        label="Log in"
                        onClick={() => {
                            console.log("Login button clicked")
                            setIsOpen(false)
                            loginModal.open()
                        }} />

                    <ProfileMenuLink label="Sign Up" onClick={() => console.log("Sign Up button clicked")} />
                </div>
            )}
        </div>
    )
}

export default Profile