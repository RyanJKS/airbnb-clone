import { FaSearch } from "react-icons/fa";

const SearchFilters = () => {

    return (
        <div className="h-[48px] lg:h-[64] flex flex-row items-center justify-between border rounded-full">
            <div className="hidden lg:block">
                <div className="flex flex-row items-center justify-between">
                    <div className="w-[250px] h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer">
                        <p className="text-xs font-semibold">Where</p>
                        <p className="text-sm">Search destinations</p>
                    </div>

                    <div className="h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer">
                        <p className="text-xs font-semibold">Check in</p>
                        <p className="text-sm">Add dates</p>
                    </div>

                    <div className="h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer">
                        <p className="text-xs font-semibold">Check Out</p>
                        <p className="text-sm">Add dates</p>
                    </div>

                    <div className="h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer">
                        <p className="text-xs font-semibold">Who</p>
                        <p className="text-sm">Add guests</p>
                    </div>
                </div>
            </div>

            <div className="p-2">
                <div className="p-2 lg:p-4 bg-airbnb rounded-full text-white hover:bg-airbnb-dark transition cursor-pointer">
                    <FaSearch />
                </div>
            </div>
        </div>
    )
}

export default SearchFilters;