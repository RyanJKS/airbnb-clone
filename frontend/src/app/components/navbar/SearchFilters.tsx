'use client';

import { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import Calendar from "../Calendar";
import GuestSelector from "../GuestSelector";
import { Range, RangeKeyDict } from 'react-date-range';
import { useFilters } from "@/app/contexts/FiltersContext";
import CitySelector from "../CitySelector";
import { format } from 'date-fns';
import FilterInput from './FilterInput';
import FilterModalContainer from './FilterModalContainer';
import { useRouter } from "next/navigation";

interface ModalState {
    where: boolean;
    checkIn: boolean;
    checkOut: boolean;
    who: boolean;
}

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
    const router = useRouter();

    const initialModalState: ModalState = { where: false, checkIn: false, checkOut: false, who: false };

    const [showModal, setShowModal] = useState<ModalState>(initialModalState);
    const [selectedCity, setSelectedCity] = useState<{ name: string; country: string } | null>(null);
    const [cityInput, setCityInput] = useState<string>('');
    const [checkInDates, setCheckInDates] = useState<Range>({
        startDate: undefined,
        endDate: undefined,
        key: 'checkIn'
    });
    const [checkOutDates, setCheckOutDates] = useState<Range>({
        startDate: undefined,
        endDate: undefined,
        key: 'checkOut'
    });
    const [guests, setGuests] = useState<number>(1);

    const debouncedCityInput = useDebounce(cityInput, 300);

    const toggleModal = useCallback((section: keyof ModalState) => {
        setShowModal((prev) => ({
            ...initialModalState,
            [section]: !prev[section]
        }));
    }, []);

    const handleCheckInChange = (ranges: RangeKeyDict) => {
        const { checkIn } = ranges;
        setCheckInDates(checkIn);
    };

    const handleCheckOutChange = (ranges: RangeKeyDict) => {
        const { checkOut } = ranges;
        setCheckOutDates(checkOut);
    };

    const resetFilters = () => {
        setSelectedCity(null);
        setCityInput('');
        setCheckInDates({ startDate: undefined, endDate: undefined, key: 'checkIn' });
        setCheckOutDates({ startDate: undefined, endDate: undefined, key: 'checkOut' });
        setGuests(1);
    };

    const handleSubmit = () => {
        const data = {
            destination: selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : '',
            checkIn: checkInDates.startDate ? format(checkInDates.startDate, 'yyyy-MM-dd') : '',
            checkOut: checkOutDates.endDate ? format(checkOutDates.endDate, 'yyyy-MM-dd') : '',
            guests
        };

        const params = new URLSearchParams(
            Object.entries(data)
                .filter(([_, value]) => value)
                .map(([key, value]) => [key, String(value)])
        );

        router.push(`/?search&${params.toString()}`);

        setFilters(data);
        setShowModal(initialModalState);
        resetFilters();
    };

    return (
        <div className="h-[48px] lg:h-[64px] flex flex-row items-center justify-between border rounded-full relative">
            <div className="hidden lg:block">
                <div className="flex flex-row items-center justify-between relative">
                    <FilterInput
                        label="Where"
                        value={cityInput}
                        placeholder="Search destinations"
                        onClick={() => toggleModal("where")}
                        showModal={showModal.where}
                        onInputChange={setCityInput}
                        debouncedInput={debouncedCityInput}
                        renderModal={() => (
                            <FilterModalContainer>
                                <CitySelector
                                    selectedCity={debouncedCityInput}
                                    onSelectCity={(city) => {
                                        setSelectedCity(city);
                                        setCityInput(`${city.name}, ${city.country}`);
                                        setShowModal(initialModalState);  // Close all modals
                                    }}
                                />
                            </FilterModalContainer>
                        )}
                    />
                    <FilterInput
                        label="Check in"
                        value={checkInDates.startDate ? checkInDates.startDate.toLocaleDateString() : "Add dates"}
                        onClick={() => toggleModal("checkIn")}
                        showModal={showModal.checkIn}
                        renderModal={() => (
                            <FilterModalContainer>
                                <Calendar
                                    value={checkInDates}
                                    onChange={handleCheckInChange}
                                />
                            </FilterModalContainer>
                        )}
                    />
                    <FilterInput
                        label="Check out"
                        value={checkOutDates.endDate ? checkOutDates.endDate.toLocaleDateString() : "Add dates"}
                        onClick={() => toggleModal("checkOut")}
                        showModal={showModal.checkOut}
                        renderModal={() => (
                            <FilterModalContainer>
                                <Calendar
                                    value={checkOutDates}
                                    onChange={handleCheckOutChange}
                                />
                            </FilterModalContainer>
                        )}
                    />
                    <FilterInput
                        label="Who"
                        value={guests > 1 ? `${guests} guests` : `${guests} guest`}
                        onClick={() => toggleModal("who")}
                        showModal={showModal.who}
                        renderModal={() => (
                            <FilterModalContainer>
                                <GuestSelector
                                    onGuestsChange={(count) => {
                                        setGuests(count);
                                        setShowModal(initialModalState);  // Close all modals
                                    }}
                                />
                            </FilterModalContainer>
                        )}
                    />
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
