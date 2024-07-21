import { VscAccount } from "react-icons/vsc";
import { CiMenuBurger } from "react-icons/ci";

const Profile = () => {
    return (
        <div className="p-2 relative inline-block border rounded-full">
            <button className="flex items-center">
                <CiMenuBurger className="text-2xl" />
                <VscAccount className="text-2xl" />
            </button>
        </div>
    )
}

export default Profile