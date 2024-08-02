'use client';
import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import { Range } from 'react-date-range';
import { differenceInDays, format } from 'date-fns';
import apiService from "@/app/api/apiService";
import Calendar from "../Calendar";

const initialDateRange: Range = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
};

export type Property = {
    id: string;
    guests: number;
    price_per_night: number;
};

interface ReservationSidebarProps {
    property: Property;
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({ property }) => {
    const { userId } = useAuth();
    const router = useRouter();
    const loginModal = useLoginModal();

    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const [guests, setGuests] = useState<string>('1');

    const handleDateRangeChange = useCallback((selection: any) => {
        const newStartDate = new Date(selection.startDate);
        const newEndDate = new Date(selection.endDate);

        if (newEndDate <= newStartDate) {
            newEndDate.setDate(newStartDate.getDate() + 1);
        }

        setDateRange({
            ...dateRange,
            startDate: newStartDate,
            endDate: newEndDate
        });
    }, [dateRange]);

    const calculateFeeAndTotalPrice = useCallback(() => {
        const startDate = dateRange.startDate || new Date();
        const endDate = dateRange.endDate || new Date();
        const dayCount = differenceInDays(endDate, startDate);
        const nights = dayCount || 1;
        const fee = parseFloat((((nights * property.price_per_night) / 100) * 5).toFixed(2)); // 5% fee from total price
        const totalPrice = (nights * property.price_per_night) + fee;

        return { nights, fee, totalPrice };
    }, [dateRange]);

    const { fee, nights, totalPrice } = useMemo(calculateFeeAndTotalPrice, [calculateFeeAndTotalPrice]);

    const bookReservation = async () => {
        if (userId) {
            try {
                const startDate = dateRange.startDate || new Date();
                const endDate = dateRange.endDate || new Date();

                const formData = new FormData();
                formData.append('guests', guests);
                formData.append('start_date', format(startDate, 'yyyy-MM-dd'));
                formData.append('end_date', format(endDate, 'yyyy-MM-dd'));
                formData.append('number_of_nights', nights.toString());
                formData.append('total_price', totalPrice.toString());

                const response = await apiService.post(`/api/properties/${property.id}/book/`, formData);

                if (response.success) {
                    console.log('Booking successful');
                    router.push('/reservations');
                } else {
                    console.error('Booking failed:', response.error);
                }
            } catch (error) {
                console.error('Failed to make a reservation:', error);
            }
        } else {
            loginModal.open();
        }
    };

    return (
        <aside className="mt-6 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
            <h2 className="mb-5 text-2xl">£{property.price_per_night} per night</h2>
            <Calendar value={dateRange} onChange={(value) => handleDateRangeChange(value.selection)} bookedDates={[]} />
            <div className="mb-6 p-3 border border-gray-400 rounded-xl">
                <label className="mb-2 block font-bold text-xs">Guest</label>
                <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full -ml-1 text-xm">
                    {Array.from({ length: property.guests }, (_, index) => index + 1).map((number) => (
                        <option key={number} value={number}>{number}</option>
                    ))}
                </select>
            </div>
            <div onClick={bookReservation} className="w-full mb-6 py-6 text-center text-white bg-airbnb rounded-xl hover:bg-airbnb-dark cursor-pointer">
                Book
            </div>
            <div className="mb-4 flex justify-between align-center">
                <p>£{property.price_per_night} * {nights} nights</p>
                <p>£{property.price_per_night * nights}</p>
            </div>
            <div className="mb-4 flex justify-between align-center">
                <p>Airbnb Fees</p>
                <p>£{fee}</p>
            </div>
            <hr />
            <div className="mt-4 flex justify-between align-center font-bold">
                <p>Total</p>
                <p>£{totalPrice}</p>
            </div>
        </aside>
    );
};

export default ReservationSidebar;
