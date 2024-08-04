'use client';
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Calendar from "../Calendar";
import GuestSelector from "../GuestSelector";
import { Range, RangeKeyDict } from 'react-date-range';
import { useFilters } from "@/app/contexts/FiltersContext";
import CitySelector from "../CitySelector";
import { format } from 'date-fns';

interface ModalState {
    where: boolean;
    checkIn: boolean;
    checkOut: boolean;
    who: boolean;
}

const getDefaultFormattedDate = (date: Date) => format(date, 'yyyy-MM-dd');

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Debounce function
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchFilters: React.FC = () => {
    const { setFilters } = useFilters();

    const [showModal, setShowModal] = useState<ModalState>({ where: false, checkIn: false, checkOut: false, who: false });
    const [selectedCity, setSelectedCity] = useState<{ name: string; country: string } | null>(null);
    const [cityInput, setCityInput] = useState<string>('');
    const [checkInDates, setCheckInDates] = useState<Range>({
        startDate: new Date(getDefaultFormattedDate(new Date())),
        endDate: new Date(getDefaultFormattedDate(new Date())),
        key: 'checkIn'
    });
    const [checkOutDates, setCheckOutDates] = useState<Range>({
        startDate: new Date(getDefaultFormattedDate(addDays(new Date(), 1))),
        endDate: new Date(getDefaultFormattedDate(addDays(new Date(), 1))),
        key: 'checkOut'
    });
    const [guests, setGuests] = useState<number>(1);

    const debouncedCityInput = useDebounce(cityInput, 500);

    const toggleModal = (section: keyof ModalState) => {
        setShowModal((prev) => {
            const newState = { where: false, checkIn: false, checkOut: false, who: false };
            newState[section] = !prev[section];
            return newState;
        });
    };

    const handleCheckInChange = (ranges: RangeKeyDict) => {
        const { checkIn } = ranges;
        setCheckInDates(checkIn);
    };

    const handleCheckOutChange = (ranges: RangeKeyDict) => {
        const { checkOut } = ranges;
        setCheckOutDates(checkOut);
    };

    const handleSubmit = () => {
        const data = {
            destination: selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : '',
            checkIn: checkInDates.startDate ? format(checkInDates.startDate, 'yyyy-MM-dd') : '',
            checkOut: checkOutDates.endDate ? format(checkOutDates.endDate, 'yyyy-MM-dd') : '',
            guests,
        };
        console.log(data);

        setFilters(data);
    };

    return (
        <div className="h-[48px] lg:h-[64px] flex flex-row items-center justify-between border rounded-full relative">
            <div className="hidden lg:block">
                <div className="flex flex-row items-center justify-between relative">
                    <div
                        className="w-[250px] h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer relative"
                        onClick={() => toggleModal("where")}
                    >
                        <p className="text-xs font-semibold">Where</p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search destinations"
                                onClick={(e) => e.stopPropagation()}
                                onFocus={() => setShowModal(prev => ({ ...prev, where: true }))}
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                className="w-full rounded-full border-none focus:outline-none focus:ring-0"
                            />
                            {showModal.where && debouncedCityInput && (
                                <CitySelector
                                    selectedCity={debouncedCityInput}
                                    onSelectCity={(city) => {
                                        setSelectedCity(city);
                                        setCityInput(`${city.name}, ${city.country}`);
                                        setShowModal({ ...showModal, where: false });
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div
                        className="h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer relative"
                        onClick={() => toggleModal("checkIn")}
                    >
                        <p className="text-xs font-semibold">Check in</p>
                        <p className="text-sm">{checkInDates.startDate ? checkInDates.startDate.toLocaleDateString() : "Add dates"}</p>
                        {showModal.checkIn && (
                            <div className="w-[420px] absolute top-[100%] left-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer z-10">
                                <Calendar
                                    value={checkInDates}
                                    onChange={handleCheckInChange}
                                />
                            </div>
                        )}
                    </div>

                    <div
                        className="h-[46px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer relative"
                        onClick={() => toggleModal("checkOut")}
                    >
                        <p className="text-xs font-semibold">Check Out</p>
                        <p className="text-sm">{checkOutDates.endDate ? checkOutDates.endDate.toLocaleDateString() : "Add dates"}</p>
                        {showModal.checkOut && (
                            <div className="w-[420px] absolute top-[100%] left-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer z-10">
                                <Calendar
                                    value={checkOutDates}
                                    onChange={handleCheckOutChange}
                                />
                            </div>
                        )}
                    </div>

                    <div
                        className="h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer relative"
                        onClick={() => toggleModal("who")}
                    >
                        <p className="text-xs font-semibold">Who</p>
                        <p className="text-sm">{guests > 1 ? `${guests} guests` : `${guests} guest`}</p>
                        {showModal.who && (
                            <div className="w-[220px] absolute top-[100%] left-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer z-10">
                                <GuestSelector
                                    onGuestsChange={(count) => {
                                        setGuests(count);
                                        setShowModal({ ...showModal, who: false });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-2">
                <div
                    className="p-2 lg:p-4 bg-airbnb rounded-full text-white hover:bg-airbnb-dark transition cursor-pointer"
                    onClick={handleSubmit}
                >
                    <FaSearch />
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
