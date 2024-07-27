"use client";

import { VscAccount } from "react-icons/vsc";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import UserMenuItems from "./UserMenuItems";


const UserMenu = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="p-2 relative inline-block border rounded-full">
            <button className="flex items-center" onClick={() => setIsOpen(prev => !prev)}>
                <CiMenuBurger className="text-2xl" />
                <VscAccount className="text-2xl" />
            </button>

            {isOpen && <UserMenuItems setIsOpen={setIsOpen} />}
        </div>
    );
};

export default UserMenu;
