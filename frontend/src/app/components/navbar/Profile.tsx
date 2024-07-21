import { FaUser } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

const Profile = () => {
    return (
        <div className="p-2 relative inline-block border rounded-full">
            <button className="flex items-center">
                <CiMenuBurger />
                <FaUser />
            </button>
        </div>
    )
}

export default Profile