import { GiRoundStar } from "react-icons/gi";
import { MdCabin } from "react-icons/md";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdOutlinePool } from "react-icons/md";

const Categories = () => {
    return (
        <div className='pt-3 cursor-pointer pb-6 flex items-center space-x-12'>
            <div className='pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:opacity-100 hover:border-gray-200'>
                <GiRoundStar className="text-2xl" />
                <span className="text-xs">Icons</span>
            </div>

            <div className='pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:opacity-100 hover:border-gray-200'>
                <MdCabin className="text-2xl" />
                <span className="text-xs">Cabins</span>
            </div>

            <div className='pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:opacity-100 hover:border-gray-200'>
                <FaUmbrellaBeach className="text-2xl" />
                <span className="text-xs">Beachfront</span>
            </div>

            <div className='pb-4 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:opacity-100 hover:border-gray-200'>
                <MdOutlinePool className="text-2xl" />
                <span className="text-xs">Amazing Pools</span>
            </div>
        </div>
    )
}

export default Categories